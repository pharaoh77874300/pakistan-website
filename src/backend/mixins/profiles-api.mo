import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import ProfileTypes "../types/profiles";
import ProfileLib "../lib/profiles";

mixin (
  accessControlState : AccessControl.AccessControlState,
  profileState : ProfileLib.State,
) {
  // Create or update the caller's profile
  public shared ({ caller }) func createProfile(
    input : ProfileTypes.CreateProfileInput
  ) : async ProfileTypes.ProfileView {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ProfileLib.createProfile(profileState, caller, input);
  };

  public shared ({ caller }) func updateProfile(
    input : ProfileTypes.UpdateProfileInput
  ) : async ProfileTypes.ProfileView {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ProfileLib.updateProfile(profileState, caller, input);
  };

  // Get profile by principal
  public query func getProfile(userId : Common.UserId) : async ?ProfileTypes.ProfileView {
    ProfileLib.getProfileById(profileState, userId);
  };

  // Get profile by username
  public query func getProfileByUsername(username : Text) : async ?ProfileTypes.ProfileView {
    ProfileLib.getProfileByUsername(profileState, username);
  };

  // Get the caller's own profile
  public query ({ caller }) func getMyProfile() : async ?ProfileTypes.ProfileView {
    ProfileLib.getProfileById(profileState, caller);
  };

  // List all profiles (discovery)
  public query func listProfiles(offset : Nat, limit : Nat) : async Common.Page<ProfileTypes.ProfileView> {
    ProfileLib.listProfiles(profileState, offset, limit);
  };

  // Required by authorization extension
  public query ({ caller }) func getCallerUserProfile() : async ?ProfileTypes.ProfileView {
    ProfileLib.getProfileById(profileState, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(input : ProfileTypes.CreateProfileInput) : async () {
    switch (ProfileLib.getProfileById(profileState, caller)) {
      case null { ignore ProfileLib.createProfile(profileState, caller, input) };
      case (?_) {
        ignore ProfileLib.updateProfile(profileState, caller, {
          username = ?input.username;
          bio = ?input.bio;
          avatarBlob = input.avatarBlob;
          coverBlob = input.coverBlob;
          avatarType = input.avatarType;
          avatar3dConfig = input.avatar3dConfig;
        });
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Common.UserId) : async ?ProfileTypes.ProfileView {
    ProfileLib.getProfileById(profileState, user);
  };

  public query func searchUsers(keyword : Text) : async [ProfileTypes.ProfileView] {
    ProfileLib.searchByUsername(profileState, keyword);
  };

  // Admin-only: set or unset verified badge on a user
  public shared ({ caller }) func adminSetVerified(
    userId : Common.UserId,
    verified : Bool,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    ProfileLib.setVerified(profileState, userId, verified);
  };
};
