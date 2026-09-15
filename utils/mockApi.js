// utils/mockApi.js
// Local stand-in for the backend so the app is fully navigable before a real
// API client exists. Each helper matches the provider signature its store
// expects, and the stores fall back to these when no provider is supplied.
//
// Swap in a real client at any time:
//   useFeedStore.getState().setProviders({ fetchPage: api.getFeed })
// or per call: fetchFeed({ fetchPage: api.getFeed })

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
      videoUri: null,
      audioName: `Original audio · ${authors[n % authors.length].username}`,
      likesCount: 40 + ((n * 13) % 900),
      commentsCount: (n * 5) % 80,
      sharesCount: n % 20,
      viewsCount: 300 + n * 47,
      isLiked: false,
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
      mediaUri: null,
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
  return authors.map((person, i) => ({
    id: `c_${person.id}`,
    type: "direct",
    participants: [person],
    unreadCount: i === 0 ? 2 : i === 2 ? 1 : 0,
    isMuted: i === 4,
    updatedAt: Date.now() - (i + 1) * 900 * 1000,
    lastMessage: {
      id: `cm_${i}`,
      text:
        i === 0
          ? "Are we still on for tomorrow?"
          : LOREM[(i + 5) % LOREM.length],
      isMine: i % 3 === 0,
      createdAt: new Date(Date.now() - (i + 1) * 900 * 1000).toISOString(),
    },
  }));
}

export function makeMessages(conversationId, count = 15, offset = 0) {
  return Array.from({ length: count }, (_, i) => {
    const n = offset + i;
    const mine = n % 3 === 0;
    return {
      id: `m_${conversationId}_${n}`,
      text: LOREM[n % LOREM.length],
      senderId: mine ? "me" : conversationId,
      isMine: mine,
      status: mine ? (n % 2 === 0 ? "read" : "sent") : undefined,
      createdAt: hoursAgo(24 - n),
    };
  });
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
  const person =
    Object.values(PEOPLE).find((p) => p.id === userId) ||
    Object.values(PEOPLE)[0];
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
  const next = offset + limit < 36 ? String(offset + limit) : null;
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

export const messagesProvider = async ({ limit = 30 } = {}) => {
  await wait(400);
  return { items: makeMessages("c", Math.min(limit, 15)), nextCursor: null };
};

export const notificationsProvider = async ({ limit = 20 } = {}) => {
  await wait(400);
  const items = makeNotifications(limit);
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
  return { items: makePosts(Math.min(limit, 12)), nextCursor: null };
};

export const meProvider = async () => {
  await wait(300);
  return makeProfile("u_me", { id: "u_me", name: "You", username: "you" });
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
  sharesCount: 0,
  viewsCount: 0,
  isLiked: false,
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
