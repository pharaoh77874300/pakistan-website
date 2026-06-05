import Map "mo:core/Map";
import List "mo:core/List";
import Common "../types/common";
import MentionTypes "../types/mentions";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

module {
  public type State = {
    // mentionedUserId -> List of Mention records
    mentions : Map.Map<Common.UserId, List.List<MentionTypes.Mention>>;
  };

  public func initState() : State {
    {
      mentions = Map.empty<Common.UserId, List.List<MentionTypes.Mention>>();
    };
  };

  // Parses @username tokens from content and creates mention records
  public func extractAndStoreMentions(
    state : State,
    postId : Common.PostId,
    authorId : Common.UserId,
    content : Text,
    resolveUsername : Text -> ?Common.UserId,
  ) : [Common.UserId] {
    // Split on whitespace and extract @username tokens
    let mentioned = List.empty<Common.UserId>();
    let now = Time.now();
    // Iterate characters to collect word tokens
    let chars = content.chars();
    var current = "";
    func processWord(word : Text) {
      if (word.size() > 1 and word.startsWith(#text "@")) {
        let username = word.trimStart(#text "@");
        if (username.size() > 0) {
          switch (resolveUsername(username)) {
            case (?userId) {
              if (mentioned.find(func(id : Common.UserId) : Bool { id == userId }) == null) {
                mentioned.add(userId);
                let mention : MentionTypes.Mention = {
                  postId;
                  mentionedUserId = userId;
                  authorId;
                  createdAt = now;
                };
                switch (state.mentions.get(userId)) {
                  case (?list) { list.add(mention) };
                  case null {
                    let list = List.empty<MentionTypes.Mention>();
                    list.add(mention);
                    state.mentions.add(userId, list);
                  };
                };
              };
            };
            case null {};
          };
        };
      };
    };
    for (ch in chars) {
      if (ch == ' ' or ch == '\n' or ch == '\t' or ch == '\r') {
        if (current.size() > 0) {
          processWord(current);
          current := "";
        };
      } else {
        current := current # Text.fromChar(ch);
      };
    };
    if (current.size() > 0) { processWord(current) };
    mentioned.toArray();
  };

  public func getMentionsForUser(
    state : State,
    userId : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<MentionTypes.Mention> {
    let list = switch (state.mentions.get(userId)) {
      case (?l) l;
      case null { return { items = []; total = 0; nextOffset = null } };
    };
    let total = list.size();
    var i = 0;
    let result = List.empty<MentionTypes.Mention>();
    for (m in list.values()) {
      if (i >= offset and i < offset + limit) {
        result.add(m);
      };
      i += 1;
    };
    let next = if (offset + limit < total) ?(offset + limit) else null;
    { items = result.toArray(); total; nextOffset = next };
  };
};
