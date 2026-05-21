import Map "mo:core/Map";
import List "mo:core/List";
import Common "../types/common";
import EngagementTypes "../types/engagement";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

module {
  public type State = {
    comments : Map.Map<Common.CommentId, EngagementTypes.Comment>;
    // postId -> List<CommentId>
    postCommentIndex : Map.Map<Common.PostId, List.List<Common.CommentId>>;
    counters : { var nextCommentId : Nat };
  };

  public func initState() : State {
    {
      comments = Map.empty<Common.CommentId, EngagementTypes.Comment>();
      postCommentIndex = Map.empty<Common.PostId, List.List<Common.CommentId>>();
      counters = { var nextCommentId = 0 };
    };
  };

  public func addComment(
    state : State,
    caller : Common.UserId,
    postId : Common.PostId,
    content : Text,
  ) : EngagementTypes.Comment {
    let id = state.counters.nextCommentId;
    state.counters.nextCommentId := id + 1;
    let comment : EngagementTypes.Comment = {
      id;
      postId;
      authorId = caller;
      content;
      createdAt = Time.now();
    };
    state.comments.add(id, comment);
    switch (state.postCommentIndex.get(postId)) {
      case (?idx) { idx.add(id) };
      case null {
        let idx = List.empty<Common.CommentId>();
        idx.add(id);
        state.postCommentIndex.add(postId, idx);
      };
    };
    comment;
  };

  public func deleteComment(
    state : State,
    caller : Common.UserId,
    commentId : Common.CommentId,
  ) {
    switch (state.comments.get(commentId)) {
      case (?comment) {
        if (not Principal.equal(comment.authorId, caller)) {
          Runtime.trap("Not authorized to delete this comment");
        };
        let postId = comment.postId;
        state.comments.remove(commentId);
        switch (state.postCommentIndex.get(postId)) {
          case (?idx) {
            let newIdx = idx.filter(func(id : Common.CommentId) : Bool { id != commentId });
            state.postCommentIndex.add(postId, newIdx);
          };
          case null {};
        };
      };
      case null { Runtime.trap("Comment not found") };
    };
  };

  public func listComments(
    state : State,
    postId : Common.PostId,
  ) : [EngagementTypes.Comment] {
    switch (state.postCommentIndex.get(postId)) {
      case (?idx) {
        // Sort oldest first by id
        let ids = idx.toArray();
        let sorted = ids.sort(func(a : Common.CommentId, b : Common.CommentId) : Order.Order {
          Nat.compare(a, b);
        });
        sorted.filterMap(func(id : Common.CommentId) : ?EngagementTypes.Comment {
          state.comments.get(id);
        });
      };
      case null [];
    };
  };
};
