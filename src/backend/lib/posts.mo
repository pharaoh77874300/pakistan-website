import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Common "../types/common";
import PostTypes "../types/posts";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

module {
  public type State = {
    posts : Map.Map<Common.PostId, PostTypes.Post>;
    // postId -> Set of likerPrincipal
    likes : Map.Map<Common.PostId, Set.Set<Common.UserId>>;
    // userId -> List of postIds (for profile page)
    userPostIndex : Map.Map<Common.UserId, List.List<Common.PostId>>;
    counters : { var nextPostId : Nat };
  };

  public func initState() : State {
    {
      posts = Map.empty<Common.PostId, PostTypes.Post>();
      likes = Map.empty<Common.PostId, Set.Set<Common.UserId>>();
      userPostIndex = Map.empty<Common.UserId, List.List<Common.PostId>>();
      counters = { var nextPostId = 0 };
    };
  };

  public func toView(
    post : PostTypes.Post,
    likes : Map.Map<Common.PostId, Set.Set<Common.UserId>>,
    caller : Common.UserId,
  ) : PostTypes.PostView {
    let likedByMe = switch (likes.get(post.id)) {
      case (?likers) likers.contains(caller);
      case null false;
    };
    {
      id = post.id;
      authorId = post.authorId;
      content = post.content;
      imageBlob = post.imageBlob;
      likeCount = post.likeCount;
      commentCount = post.commentCount;
      createdAt = post.createdAt;
      likedByMe;
    };
  };

  public func createPost(
    state : State,
    caller : Common.UserId,
    input : PostTypes.CreatePostInput,
  ) : PostTypes.PostView {
    let id = state.counters.nextPostId;
    state.counters.nextPostId := id + 1;
    let post : PostTypes.Post = {
      id;
      authorId = caller;
      content = input.content;
      var imageBlob = input.imageBlob;
      var likeCount = 0;
      var commentCount = 0;
      createdAt = Time.now();
    };
    state.posts.add(id, post);
    // Update userPostIndex
    switch (state.userPostIndex.get(caller)) {
      case (?idx) { idx.add(id) };
      case null {
        let idx = List.empty<Common.PostId>();
        idx.add(id);
        state.userPostIndex.add(caller, idx);
      };
    };
    toView(post, state.likes, caller);
  };

  public func deletePost(
    state : State,
    caller : Common.UserId,
    postId : Common.PostId,
  ) {
    switch (state.posts.get(postId)) {
      case (?post) {
        if (not Principal.equal(post.authorId, caller)) {
          Runtime.trap("Not authorized to delete this post");
        };
        state.posts.remove(postId);
        state.likes.remove(postId);
        // Remove from user index
        switch (state.userPostIndex.get(caller)) {
          case (?idx) {
            let newIdx = idx.filter(func(id : Common.PostId) : Bool { id != postId });
            state.userPostIndex.add(caller, newIdx);
          };
          case null {};
        };
      };
      case null { Runtime.trap("Post not found") };
    };
  };

  public func getPost(
    state : State,
    caller : Common.UserId,
    postId : Common.PostId,
  ) : ?PostTypes.PostView {
    switch (state.posts.get(postId)) {
      case (?post) ?toView(post, state.likes, caller);
      case null null;
    };
  };

  public func listPostsByUser(
    state : State,
    caller : Common.UserId,
    userId : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<PostTypes.PostView> {
    let ids : [Common.PostId] = switch (state.userPostIndex.get(userId)) {
      case (?idx) idx.toArray();
      case null [];
    };
    // Sort newest first
    let sorted = ids.sort(func(a : Common.PostId, b : Common.PostId) : Order.Order {
      Nat.compare(b, a);
    });
    let total = sorted.size();
    let start = if (offset > total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    let items = sorted.sliceToArray(start, end_)
      |> _.filterMap(func(id : Common.PostId) : ?PostTypes.PostView {
           switch (state.posts.get(id)) {
             case (?p) ?toView(p, state.likes, caller);
             case null null;
           };
         });
    let nextOffset = if (end_ < total) ?(end_) else null;
    { items; total; nextOffset };
  };

  public func listAllPosts(
    state : State,
    caller : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<PostTypes.PostView> {
    // Collect all posts sorted by id descending (newest first)
    let all = state.posts.entries()
      |> _.toArray();
    let sorted = all.sort(func(a : (Common.PostId, PostTypes.Post), b : (Common.PostId, PostTypes.Post)) : Order.Order {
      Nat.compare(b.0, a.0);
    });
    let total = sorted.size();
    let start = if (offset > total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    let items = sorted.sliceToArray(start, end_)
      |> _.map(func(entry : (Common.PostId, PostTypes.Post)) : PostTypes.PostView {
           toView(entry.1, state.likes, caller);
         });
    let nextOffset = if (end_ < total) ?(end_) else null;
    { items; total; nextOffset };
  };

  public func listFeedPosts(
    state : State,
    caller : Common.UserId,
    followingIds : [Common.UserId],
    offset : Nat,
    limit : Nat,
  ) : Common.Page<PostTypes.PostView> {
    // Include own posts + following posts
    let feedSet = Set.fromArray(followingIds);
    feedSet.add(caller);
    let all = state.posts.entries()
      |> _.filter(func(entry : (Common.PostId, PostTypes.Post)) : Bool {
           feedSet.contains(entry.1.authorId);
         })
      |> _.toArray();
    let sorted = all.sort(func(a : (Common.PostId, PostTypes.Post), b : (Common.PostId, PostTypes.Post)) : Order.Order {
      Nat.compare(b.0, a.0);
    });
    let total = sorted.size();
    let start = if (offset > total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    let items = sorted.sliceToArray(start, end_)
      |> _.map(func(entry : (Common.PostId, PostTypes.Post)) : PostTypes.PostView {
           toView(entry.1, state.likes, caller);
         });
    let nextOffset = if (end_ < total) ?(end_) else null;
    { items; total; nextOffset };
  };

  // Returns (likeCount, likedByMe)
  public func toggleLike(
    state : State,
    caller : Common.UserId,
    postId : Common.PostId,
  ) : (Nat, Bool) {
    let post = switch (state.posts.get(postId)) {
      case (?p) p;
      case null { Runtime.trap("Post not found") };
    };
    let likers = switch (state.likes.get(postId)) {
      case (?s) s;
      case null {
        let s = Set.empty<Common.UserId>();
        state.likes.add(postId, s);
        s;
      };
    };
    let likedByMe = likers.contains(caller);
    if (likedByMe) {
      likers.remove(caller);
      if (post.likeCount > 0) { post.likeCount := post.likeCount - 1 };
    } else {
      likers.add(caller);
      post.likeCount := post.likeCount + 1;
    };
    (post.likeCount, not likedByMe);
  };

  public func searchPosts(
    state : State,
    caller : Common.UserId,
    keyword : Text,
  ) : [PostTypes.PostView] {
    let lower = keyword.toLower();
    state.posts.values()
      |> _.filter(func(p : PostTypes.Post) : Bool {
           p.content.toLower().contains(#text lower);
         })
      |> _.map(func(p : PostTypes.Post) : PostTypes.PostView {
           toView(p, state.likes, caller);
         })
      |> _.toArray();
  };
};
