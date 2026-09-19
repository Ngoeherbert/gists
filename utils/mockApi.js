// utils/mockApi.js
// Local stand-in for the backend so the app is fully navigable before a real
// API client exists. Each helper matches the provider signature its store
// expects, and the stores fall back to these when no provider is supplied.
//
// Swap in a real client at any time:
//   useFeedStore.getState().setProviders({ feed: api.getFeed })
// or per call: fetchFeed({ fetchPage: api.getFeed })

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Public-domain sample clips so the reel pager plays real video through
// expo-video. Direct, playable MP4s only (HEAD-verified: 200 + video/mp4,
// 1-8 MB each) so the first frame lands fast on mobile data — the old
// 86 MB 4-K source never pre-rolled, leaving only the poster visible.
// Pexels download endpoints 302 to their CDN, which both players follow
// natively. Swap for CDN URLs when the backend lands — the player only
// needs a URI.
const REEL_SOURCES = [
  // ~1 MB / 10s test clips first, so the opening reels load fastest.
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  "https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4",
  "https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4",
  // Short Pexels clips (5-8 MB) for variety. The deterministic gradient
  // posters in utils/reelVisuals.js stay painted underneath until each
  // video's first frame renders, and remain the fallback for reel-less rows.
  "https://www.pexels.com/download/video/1093662/",
  "https://www.pexels.com/download/video/853889/",
];

const AVATARS = {
  ada: "https://i.pravatar.cc/200?img=32",
  grace: "https://i.pravatar.cc/200?img=45",
  alan: "https://i.pravatar.cc/200?img=12",
  katherine: "https://i.pravatar.cc/200?img=23",
  linus: "https://i.pravatar.cc/200?img=54",
};

export const PEOPLE = {
  ada: {
    id: "u_ada",
    name: "Ada Lovelace",
    username: "ada",
    avatarUrl: AVATARS.ada,
    isOnline: true,
  },
  grace: {
    id: "u_grace",
    name: "Grace Hopper",
    username: "grace",
    avatarUrl: AVATARS.grace,
    isOnline: false,
  },
  alan: {
    id: "u_alan",
    name: "Alan Turing",
    username: "alan",
    avatarUrl: AVATARS.alan,
    isOnline: true,
  },
  katherine: {
    id: "u_katherine",
    name: "Katherine Johnson",
    username: "katherine",
    avatarUrl: AVATARS.katherine,
    isOnline: false,
  },
  linus: {
    id: "u_linus",
    name: "Linus Torvalds",
    username: "linus",
    avatarUrl: AVATARS.linus,
    isOnline: true,
  },
};

// Pre-populated verified users for demo purposes
export const VERIFIED_USERS = {
  [PEOPLE.ada.id]: { tier: "blue", color: "#34B7F1" },
  [PEOPLE.grace.id]: { tier: "gold", color: "#FFD700" },
  [PEOPLE.linus.id]: { tier: "custom", color: "#722ED1" },
};

const LOREM = [
  "Shipped a small thing today. It feels good to make progress.",
  "Hot take: the best interface is the one you never have to think about.",
  "Spent the morning debugging. It was a missing comma. It's always a missing comma.",
  "Weekend plans: mountains, no signal, no standups.",
  "Reading about distributed systems again. Still humbling.",
  "Coffee count today: too many. Regret level: zero.",
  "New camera, same mediocre photos. But I'm having fun.",
  "The trick is to start before you feel ready.",
  "Finally fixed that bug that only happened on Tuesdays. It was timezone-related.",
  "Long walk, good podcast, reset brain.",
];

function hoursAgo(h) {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}

const AUTHORS = Object.values(PEOPLE);

export function makePosts(count = 20, offset = 0) {
  const authors = Object.values(PEOPLE);
  return Array.from({ length: count }, (_, i) => {
    const n = offset + i;
    const author = authors[n % authors.length];
    return {
      id: `p_${n + 1}`,
      author,
      text: LOREM[n % LOREM.length],
      mediaUrl: n % 4 === 0 ? `https://picsum.photos/seed/g${n}/800/800` : null,
      likesCount: 12 + ((n * 7) % 480),
      commentsCount: (n * 3) % 45,
      repostsCount: (n * 2) % 30,
      sharesCount: n % 12,
      isLiked: n % 5 === 0,
      isReposted: false,
      isSaved: n % 7 === 0,
      createdAt: hoursAgo(n * 3 + 1),
    };
  });
}

export function makeReels(count = 12, offset = 0) {
  const authors = Object.values(PEOPLE);
  return Array.from({ length: count }, (_, i) => {
    const n = offset + i;
    return {
      id: `r_${n + 1}`,
      author: authors[n % authors.length],
      caption: LOREM[(n + 3) % LOREM.length],
      videoUri: REEL_SOURCES[n % REEL_SOURCES.length],
      audioName: `Original audio · ${authors[n % authors.length].username}`,
      likesCount: 40 + ((n * 13) % 900),
      commentsCount: (n * 5) % 80,
      repostsCount: (n * 7) % 25,
      sharesCount: n % 20,
      viewsCount: 300 + n * 47,
      isLiked: false,
      isReposted: false,
      isSaved: false,
      createdAt: hoursAgo(n * 5 + 2),
    };
  });
}

export function makeStories() {
  const authors = Object.values(PEOPLE);
  return authors.map((author, i) => ({
    id: `sg_${author.id}`,
    author,
    hasUnseen: i % 2 === 0,
    lastUpdatedAt: hoursAgo(i + 1),
    stories: Array.from({ length: 3 }, (_, j) => ({
      id: `s_${author.id}_${j}`,
      mediaUri: `https://picsum.photos/seed/story${i}${j}/600/800`,
      caption: j === 0 ? `${author.name} shared a story` : "",
      isLiked: false,
      likesCount: (i + j) * 3,
      seen: false,
      createdAt: hoursAgo(i + j + 1),
    })),
  }));
}

export function makeConversations() {
  const authors = Object.values(PEOPLE);
  const now = Date.now();

  const conversations = authors.map((person, i) => ({
    id: `c_${person.id}`,
    type: "direct",
    participants: [person],
    unreadCount: i === 0 ? 2 : i === 2 ? 1 : 0,
    isMuted: i === 4,
    isPinned: i === 0,
    updatedAt: now - (i + 1) * 900 * 1000,
    lastMessage: {
      id: `cm_${i}`,
      text:
        i === 0
          ? "Are we still on for tomorrow?"
          : LOREM[(i + 5) % LOREM.length],
      isMine: i % 3 === 0,
      createdAt: new Date(now - (i + 1) * 900 * 1000).toISOString(),
    },
  }));

  // Add a group conversation
  conversations.unshift({
    id: "c_gist_dev",
    type: "group",
    name: "Gist Dev Team",
    avatarUrl: "https://picsum.photos/seed/gistdev/200/200",
    participants: [
      authors[0],
      authors[1],
      authors[2],
      { id: "u_you", name: "You", username: "you", avatarUrl: null, isOnline: true },
    ],
    unreadCount: 3,
    isMuted: false,
    isPinned: false,
    updatedAt: now - 5 * 60 * 1000,
    lastMessage: {
      id: "cm_group_1",
      text: "Ready to ship the new chat feature 🚀",
      isMine: false,
      senderId: authors[0].id,
      createdAt: new Date(now - 5 * 60 * 1000).toISOString(),
    },
  });

  // Add another group
  conversations.splice(2, 0, {
    id: "c_design_review",
    type: "group",
    name: "Design Review",
    avatarUrl: "https://picsum.photos/seed/designreview/200/200",
    participants: [
      authors[3],
      authors[4],
      { id: "u_you", name: "You", username: "you", avatarUrl: null, isOnline: true },
    ],
    unreadCount: 1,
    isMuted: false,
    isPinned: true,
    updatedAt: now - 2 * 3600 * 1000,
    lastMessage: {
      id: "cm_group_2",
      text: "Loving the new color scheme for dark mode",
      isMine: true,
      senderId: "u_you",
      createdAt: new Date(now - 2 * 3600 * 1000).toISOString(),
    },
  });

  return conversations;
}

// ── Seeded view-once dummy messages ──────────────────────────────────
// One view-once payload per type (text / photo / video / voice) plus an extra
// received video, appended to every direct conversation so the one-tap,
// one-view flow is demoable:
//   • text + photo + video_in + voice -> received (bubble: "Tap to open (one
//     view)" — reveals in the in-chat preview modal)
//   • video (vo_video)                -> sent (bubble: "Sent — view once";
//     flips to "Opened" when the receiver views it)
// They render as locked bubbles (icon + type + timestamp) in the thread and
// only reveal their content inside the secure ViewOnce viewer.
export function makeViewOnceMessages(conversationId) {
  const peer = Object.values(PEOPLE).find((p) => `c_${p.id}` === conversationId);
  const minutesAgo = (m) => new Date(Date.now() - m * 60 * 1000).toISOString();

  const base = (key, mine, minutes) => ({
    id: `m_${conversationId}_${key}`,
    conversationId,
    senderId: mine ? "u_me" : (peer?.id ?? conversationId),
    senderName: mine ? "You" : (peer?.name ?? "Unknown"),
    senderAvatar: mine ? null : (peer?.avatarUrl ?? null),
    isMine: mine,
    viewOnce: true,
    status: mine ? "sent" : undefined,
    createdAt: minutesAgo(minutes),
  });

  return [
    // Received — text view-once (tap once to read, then gone)
    {
      ...base("vo_text", false, 55),
      text: "This message self-destructs after one read 👀",
    },

    // Received — photo view-once
    {
      ...base("vo_photo", false, 40),
      mediaType: "image",
      mediaUrl: `https://picsum.photos/seed/viewonce${conversationId}/800/1000`,
      text: "",
    },

    // Sent — video view-once (sender side: locked, can never be re-opened)
    {
      ...base("vo_video", true, 30),
      mediaType: "video",
      mediaUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      text: "",
      duration: 21,
    },

    // Received — video view-once (tap once to reveal)
    {
      ...base("vo_video_in", false, 18),
      mediaType: "video",
      mediaUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      text: "",
      duration: 32,
    },

    // Received — voice note view-once
    {
      ...base("vo_voice", false, 12),
      mediaType: "voice",
      duration: 14,
      waveform: Array.from({ length: 24 }, (_, i) => 0.25 + 0.5 * Math.abs(Math.sin(i * 1.7))),
    },
  ];
}

// Seeded PDF file message — tapping it downloads to cache and hands the file
// to the phone's PDF viewer (system share sheet -> "Open with …").
export function makeFileMessage(conversationId) {
  const peer = Object.values(PEOPLE).find((p) => `c_${p.id}` === conversationId);
  const minutesAgo = (m) => new Date(Date.now() - m * 60 * 1000).toISOString();
  return {
    id: `m_${conversationId}_file`,
    conversationId,
    senderId: peer?.id ?? conversationId,
    senderName: peer?.name ?? "Unknown",
    senderAvatar: peer?.avatarUrl ?? null,
    isMine: false,
    mediaType: "file",
    fileName: "gists-spec-sheet.pdf",
    fileSize: 69234,
    mediaUrl: "https://pdfobject.com/pdf/sample.pdf",
    createdAt: minutesAgo(6),
  };
}

export function makeMessages(conversationId, count = 15, offset = 0) {
  const authors = Object.values(PEOPLE);
  const isGroup = conversationId.startsWith("c_gist") || conversationId.startsWith("c_design");
  const groupParticipants = isGroup ? authors.slice(0, 3) : [];

  return Array.from({ length: count }, (_, i) => {
    const n = offset + i;
    const mine = n % 3 === 0;

    // For group chats, alternate between participants
    let senderId = mine ? "u_me" : conversationId;
    let senderName = mine ? "You" : "Unknown";
    let senderAvatar = null;

    if (isGroup && !mine) {
      const participant = groupParticipants[n % groupParticipants.length];
      senderId = participant.id;
      senderName = participant.name;
      senderAvatar = participant.avatarUrl;
    } else if (!mine && !isGroup) {
      const participant = authors.find((p) => `c_${p.id}` === conversationId);
      if (participant) {
        senderId = participant.id;
        senderName = participant.name;
        senderAvatar = participant.avatarUrl;
      }
    }

    const messageTypes = ["text", "image", "video", "voice"];
    const type = messageTypes[n % messageTypes.length];

    const base = {
      id: `m_${conversationId}_${n}`,
      senderId,
      senderName,
      senderAvatar,
      isMine: mine,
      status: mine ? (n % 2 === 0 ? "read" : "sent") : undefined,
      createdAt: hoursAgo(24 - n),
    };

    if (type === "text") {
      return {
        ...base,
        text: LOREM[n % LOREM.length],
      };
    }

    if (type === "image") {
      return {
        ...base,
        mediaType: "image",
        mediaUrl: `https://picsum.photos/seed/chat${conversationId}${n}/800/600`,
        text: n % 5 === 0 ? "Check this out!" : "",
      };
    }

    if (type === "video") {
      return {
        ...base,
        mediaType: "video",
        mediaUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        text: "📹 Video",
        duration: 15 + (n % 45),
      };
    }

    // voice
    return {
      ...base,
      mediaType: "voice",
      duration: 10 + (n % 60),
      waveform: Array.from({ length: 20 }, () => Math.random()),
    };
  }).concat(
    isGroup
      ? []
      : [...makeViewOnceMessages(conversationId), makeFileMessage(conversationId)],
  );
}

export function makeNotifications(count = 18, offset = 0) {
  const authors = Object.values(PEOPLE);
  const TYPES = ["like", "comment", "follow", "mention", "repost", "message"];
  return Array.from({ length: count }, (_, i) => {
    const n = offset + i;
    return {
      id: `n_${n + 1}`,
      type: TYPES[n % TYPES.length],
      actor: authors[n % authors.length],
      preview: n % 3 === 0 ? LOREM[n % LOREM.length].slice(0, 48) : null,
      postId: n % 2 === 0 ? `p_${(n % 20) + 1}` : null,
      isRead: n > 4,
      createdAt: hoursAgo(n + 1),
    };
  });
}

export function makeProfile(userId, extra = {}) {
  // Unknown ids (deep links, removed users) yield the established not-found
  // result instead of another person's profile.
  const person = Object.values(PEOPLE).find((p) => p.id === userId);
  if (!person) return null;
  return {
    ...person,
    bio: "Building things on the internet. Coffee-powered.",
    postsCount: 24,
    followersCount: 1284,
    followingCount: 312,
    hasStory: true,
    ...extra,
  };
}

// --- Provider-shaped wrappers (match what each store expects) --------------

export const feedProvider = async ({ cursor, limit = 20 } = {}) => {
  await wait(450);
  const offset = cursor ? Number(cursor) : 0;
  const items = makePosts(limit, offset);
  const next = offset + limit < 60 ? String(offset + limit) : null;
  return { items, nextCursor: next };
};

export const reelProvider = async ({ cursor, limit = 20 } = {}) => {
  await wait(450);
  const offset = cursor ? Number(cursor) : 0;
  const items = makeReels(Math.min(limit, 12), offset);
  // Advance the cursor by the reels actually returned, not the raw limit.
  const next = offset + items.length < 36 ? String(offset + items.length) : null;
  return { items, nextCursor: next };
};

export const commentsProvider = async ({ limit = 20 } = {}) => {
  await wait(350);
  const authors = Object.values(PEOPLE);
  const items = Array.from({ length: Math.min(limit, 8) }, (_, i) => ({
    id: `c_${Date.now()}_${i}`,
    text: LOREM[(i + 2) % LOREM.length],
    author: authors[i % authors.length],
    likesCount: i * 2,
    isLiked: false,
    createdAt: hoursAgo(i + 1),
  }));
  return { items, nextCursor: null };
};

export const storiesProvider = async () => {
  await wait(400);
  return makeStories();
};

export const conversationsProvider = async () => {
  await wait(450);
  return makeConversations();
};

export const messagesProvider = async ({ conversationId = "c", limit = 30 } = {}) => {
  await wait(400);
  return { items: makeMessages(conversationId, Math.min(limit, 15)), nextCursor: null };
};

// Map the notificationStore filters ("mentions" | "follows" | "likes" |
// "comments") to the type values makeNotifications generates.
const NOTIFICATION_TYPE_BY_FILTER = {
  mentions: "mention",
  follows: "follow",
  likes: "like",
  comments: "comment",
};

export const notificationsProvider = async ({ limit = 20, filter = "all" } = {}) => {
  await wait(400);
  const generated = makeNotifications(limit);
  const type = NOTIFICATION_TYPE_BY_FILTER[filter];
  const items = type ? generated.filter((n) => n.type === type) : generated;
  return {
    items,
    nextCursor: null,
    unreadCount: items.filter((n) => !n.isRead).length,
  };
};

export const profileListProvider = async ({ type, limit = 20 } = {}) => {
  await wait(400);
  if (type === "followers" || type === "following") {
    return { items: Object.values(PEOPLE), nextCursor: null };
  }
  if (type === "reels") {
    return { items: makeReels(Math.min(limit, 12)), nextCursor: null };
  }
  if (type === "likes" || type === "saved") {
    const matches = (post) => (type === "likes" ? post.isLiked : post.isSaved);
    const items = makePosts(60).filter(matches).slice(0, Math.min(limit, 12));
    return { items, nextCursor: null };
  }
  return { items: makePosts(Math.min(limit, 12)), nextCursor: null };
};

export const meProvider = async () => {
  await wait(300);
  // Base on a known profile now that makeProfile no longer falls back for
  // unknown ids ("u_me" is not in PEOPLE).
  return makeProfile(PEOPLE.ada.id, { id: "u_me", name: "You", username: "you" });
};

export const profileProvider = async (userId) => {
  await wait(300);
  return makeProfile(userId);
};

export const createPostProvider = async (payload) => ({
  id: `p_${Date.now()}`,
  author: PEOPLE.ada,
  likesCount: 0,
  commentsCount: 0,
  repostsCount: 0,
  sharesCount: 0,
  isLiked: false,
  isSaved: false,
  createdAt: new Date().toISOString(),
  ...payload,
});

export const createReelProvider = async (payload) => ({
  id: `r_${Date.now()}`,
  likesCount: 0,
  commentsCount: 0,
  repostsCount: 0,
  sharesCount: 0,
  viewsCount: 0,
  isLiked: false,
  isReposted: false,
  isSaved: false,
  createdAt: new Date().toISOString(),
  ...payload,
});

export const createStoryProvider = async (payload) => ({
  id: `s_${Date.now()}`,
  author: PEOPLE.ada,
  mediaUri: null,
  likesCount: 0,
  replies: [],
  seen: false,
  createdAt: new Date().toISOString(),
  ...payload,
});
