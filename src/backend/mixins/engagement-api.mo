import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import EngagementTypes "../types/engagement";
import EngagementLib "../lib/engagement";
import PostLib "../lib/posts";

mixin (
  accessControlState : AccessControl.AccessControlState,
  engagementState : EngagementLib.State,
  postState : PostLib.State,
) {
  public shared ({ caller }) func addComment(
    postId : Common.PostId,
    content : Text,
  ) : async EngagementTypes.Comment {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    // Verify post exists
    switch (PostLib.getPost(postState, caller, postId)) {
      case null { Runtime.trap("Post not found") };
      case (?_) {};
    };
    let comment = EngagementLib.addComment(engagementState, caller, postId, content);
    // Increment post commentCount
    switch (postState.posts.get(postId)) {
      case (?post) { post.commentCount := post.commentCount + 1 };
      case null {};
    };
    comment;
  };

  public shared ({ caller }) func deleteComment(
    commentId : Common.CommentId
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    // Get the comment before deleting to find its postId
    switch (engagementState.comments.get(commentId)) {
      case (?comment) {
        EngagementLib.deleteComment(engagementState, caller, commentId);
        // Decrement post commentCount
        switch (postState.posts.get(comment.postId)) {
          case (?post) { if (post.commentCount > 0) { post.commentCount := post.commentCount - 1 } };
          case null {};
        };
      };
      case null { Runtime.trap("Comment not found") };
    };
  };

  public query func listComments(
    postId : Common.PostId
  ) : async [EngagementTypes.Comment] {
    EngagementLib.listComments(engagementState, postId);
  };
};
