const currentUser = {
  id: "user-001",
  name: "Ngoe Herbert",
  username: "herbert237",
  avatar: "https://i.pravatar.cc/150?img=12",
  verified: true,
};

const stories = [
  {
    id: "story-002",
    userId: "user-002",
    name: "Sarah",
    username: "sarah",
    avatar: "https://i.pravatar.cc/150?img=47",
    uri: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1200",
    viewed: false,
  },
  {
    id: "story-003",
    userId: "user-003",
    name: "Michael",
    username: "michael",
    avatar: "https://i.pravatar.cc/150?img=11",
    uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
    viewed: false,
  },
  {
    id: "story-004",
    userId: "user-004",
    name: "Jessica",
    username: "jessica",
    avatar: "https://i.pravatar.cc/150?img=32",
    uri: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200",
    viewed: true,
  },
  {
    id: "story-005",
    userId: "user-005",
    name: "Daniel",
    username: "daniel",
    avatar: "https://i.pravatar.cc/150?img=68",
    uri: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=1200",
    viewed: false,
  },
  {
    id: "story-006",
    userId: "user-006",
    name: "Emma",
    username: "emma",
    avatar: "https://i.pravatar.cc/150?img=44",
    uri: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200",
    viewed: true,
  },
];

const posts = [
  {
    id: "post-001",
    userId: "user-002",

    user: {
      id: "user-002",
      name: "Sarah Williams",
      username: "sarahw",
      avatar: "https://i.pravatar.cc/150?img=47",
      verified: true,
    },

    timestamp: "12 min ago",
    location: "Buea, Cameroon",
    verified: true,

    caption:
      "Beautiful morning in Buea ☀️. Sometimes you just need to slow down and enjoy the moment.",

    mediaUrl:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1200",
    mediaType: "image",
    aspectRatio: 1.25,

    liked: true,
    likeCount: 128,
    commentCount: 24,

    reposted: false,
    repostCount: 8,

    saved: false,
    isLiked: true,
    isReposted: false,
    isSaved: false,
  },

  {
    id: "post-002",
    userId: "user-003",

    user: {
      id: "user-003",
      name: "Michael Johnson",
      username: "mikejohnson",
      avatar: "https://i.pravatar.cc/150?img=11",
    },

    timestamp: "35 min ago",
    location: "Limbe, Cameroon",
    verified: false,

    caption: "The ocean has a way of putting everything into perspective. 🌊",

    mediaUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
    mediaType: "image",
    aspectRatio: 1.25,

    liked: false,
    likeCount: 94,
    commentCount: 17,

    reposted: true,
    repostCount: 12,

    saved: true,
    isLiked: false,
    isReposted: true,
    isSaved: true,
  },

  {
    id: "post-003",
    userId: "user-004",

    user: {
      id: "user-004",
      name: "Jessica Brown",
      username: "jessicab",
      avatar: "https://i.pravatar.cc/150?img=32",
      verified: true,
    },

    timestamp: "1 hr ago",
    location: "Douala, Cameroon",
    verified: true,

    caption:
      "Working on something exciting. Can't wait to share it with you all! 🚀",

    mediaUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200",
    mediaType: "image",
    aspectRatio: 1.15,

    liked: false,
    likeCount: 246,
    commentCount: 31,

    reposted: false,
    repostCount: 21,

    saved: false,
    isLiked: false,
    isReposted: false,
    isSaved: false,
  },

  {
    id: "post-004",
    userId: "user-005",

    user: {
      id: "user-005",
      name: "Daniel Carter",
      username: "danielc",
      avatar: "https://i.pravatar.cc/150?img=68",
    },

    timestamp: "2 hrs ago",
    location: "Yaoundé, Cameroon",
    verified: false,

    caption:
      "A little reminder: progress doesn't always look impressive. Keep going. 💪",

    mediaUrl:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=1200",
    mediaType: "image",
    aspectRatio: 1.2,

    liked: true,
    likeCount: 312,
    commentCount: 42,

    reposted: false,
    repostCount: 18,

    saved: true,
    isLiked: true,
    isReposted: false,
    isSaved: true,
  },

  {
    id: "post-005",
    userId: "user-006",

    user: {
      id: "user-006",
      name: "Emma Anderson",
      username: "emmaa",
      avatar: "https://i.pravatar.cc/150?img=44",
    },

    timestamp: "3 hrs ago",
    location: "Bamenda, Cameroon",
    verified: false,

    caption: "Weekend vibes with good people and even better memories. ❤️",

    mediaUrl:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200",
    mediaType: "image",
    aspectRatio: 1.2,

    liked: false,
    likeCount: 76,
    commentCount: 13,

    reposted: false,
    repostCount: 4,

    saved: false,
    isLiked: false,
    isReposted: false,
    isSaved: false,
  },

  {
    id: "post-006",
    userId: "user-007",

    user: {
      id: "user-007",
      name: "Chris Morgan",
      username: "chrism",
      avatar: "https://i.pravatar.cc/150?img=13",
      verified: true,
    },

    timestamp: "5 hrs ago",
    location: "Kribi, Cameroon",
    verified: true,

    caption:
      "Nothing beats discovering new places. This view was absolutely worth the trip. 🌴",

    mediaUrl:
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1200",
    mediaType: "image",
    aspectRatio: 1.25,

    liked: false,
    likeCount: 189,
    commentCount: 27,

    reposted: true,
    repostCount: 16,

    saved: false,
    isLiked: false,
    isReposted: true,
    isSaved: false,
  },

  {
    id: "post-007",
    userId: "user-008",

    user: {
      id: "user-008",
      name: "Olivia Martin",
      username: "oliviam",
      avatar: "https://i.pravatar.cc/150?img=5",
    },

    timestamp: "Yesterday",
    location: "Buea, Cameroon",
    verified: false,

    caption:
      "What are you currently listening to? Drop your favorite song below 🎵",

    mediaUrl: null,
    mediaType: "text",
    aspectRatio: 1,

    liked: false,
    likeCount: 54,
    commentCount: 39,

    reposted: false,
    repostCount: 7,

    saved: false,
    isLiked: false,
    isReposted: false,
    isSaved: false,
  },
];

const profile = {
  id: currentUser.id,
  name: currentUser.name,
  username: currentUser.username,
  bio: "Building ideas, sharing moments, and connecting with amazing people. 🚀",
  avatar: currentUser.avatar,
  cover: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200",
  location: "Buea, Cameroon",
  website: "gists.app",
  verified: true,
  followers: 12800,
  following: 642,
  posts: posts.length,
  likes: posts.reduce((total, post) => total + post.likeCount, 0),
  isFollowing: false,
};

const profilePosts = posts
  .filter((post) => post.mediaUrl)
  .map((post) => ({
    id: post.id,
    image: post.mediaUrl,
    likes: post.likeCount,
    comments: post.commentCount,
  }));

const reels = [
  {
    id: "reel-1",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700",
    views: 18200,
  },
  {
    id: "reel-2",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=700",
    views: 12400,
  },
  {
    id: "reel-3",
    image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=700",
    views: 9800,
  },
  {
    id: "reel-4",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=700",
    views: 22100,
  },
  {
    id: "reel-5",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=700",
    views: 7600,
  },
  {
    id: "reel-6",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700",
    views: 14300,
  },
];

export { currentUser, stories, posts, reels, profile, profilePosts };

export default {
  currentUser,
  stories,
  posts,
  reels,
  profile,
  profilePosts,
};
