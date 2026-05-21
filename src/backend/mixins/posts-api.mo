import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import PostTypes "../types/posts";
import PostLib "../lib/posts";
import SocialLib "../lib/social";
import ProfileLib "../lib/profiles";

mixin (
  accessControlState : AccessControl.AccessControlState,
  postState : PostLib.State,
  socialState : SocialLib.State,
  profileState : ProfileLib.State,
) {
  public shared ({ caller }) func createPost(
    input : PostTypes.CreatePostInput
  ) : async PostTypes.PostView {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let view = PostLib.createPost(postState, caller, input);
    ProfileLib.incrementPostCount(profileState, caller);
    view;
  };

  public shared ({ caller }) func deletePost(postId : Common.PostId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    PostLib.deletePost(postState, caller, postId);
    ProfileLib.decrementPostCount(profileState, caller);
  };

  public query ({ caller }) func getPost(postId : Common.PostId) : async ?PostTypes.PostView {
    PostLib.getPost(postState, caller, postId);
  };

  // Profile page: posts by a specific user
  public query ({ caller }) func listPostsByUser(
    userId : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : async Common.Page<PostTypes.PostView> {
    PostLib.listPostsByUser(postState, caller, userId, offset, limit);
  };

  // Explore page: all posts, paginated
  public query ({ caller }) func listAllPosts(
    offset : Nat,
    limit : Nat,
  ) : async Common.Page<PostTypes.PostView> {
    PostLib.listAllPosts(postState, caller, offset, limit);
  };

  // Home feed: posts from followed users + own posts
  public query ({ caller }) func getFeed(
    offset : Nat,
    limit : Nat,
  ) : async Common.Page<PostTypes.PostView> {
    let followingIds = SocialLib.getFollowingIds(socialState, caller);
    PostLib.listFeedPosts(postState, caller, followingIds, offset, limit);
  };

  // Toggle like; returns (likeCount, likedByMe)
  public shared ({ caller }) func toggleLike(postId : Common.PostId) : async (Nat, Bool) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    PostLib.toggleLike(postState, caller, postId);
  };

  // Search posts by keyword
  public query ({ caller }) func searchPosts(keyword : Text) : async [PostTypes.PostView] {
    PostLib.searchPosts(postState, caller, keyword);
  };
};
