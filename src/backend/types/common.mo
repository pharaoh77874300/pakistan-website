module {
  public type UserId = Principal;
  public type PostId = Nat;
  public type CommentId = Nat;
  public type Timestamp = Int;
  public type NotifId = Nat;

  public type Page<T> = {
    items : [T];
    total : Nat;
    nextOffset : ?Nat;
  };
};
