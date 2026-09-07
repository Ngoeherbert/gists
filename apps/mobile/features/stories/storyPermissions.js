// apps/mobile/features/stories/storyPermissions.js

export function canViewStory(story, currentUserId) {
  if (!story || story.status === "deleted") return false;
  if (story.status === "expired") return false;

  const authorId = story.userId || story.author?.id || story.author?.userId;

  if (authorId === currentUserId) return true;

  if (story.audience === "custom") {
    return Boolean(story.canView || story.isAllowedViewer);
  }

  if (story.audience === "close_friends") {
    return Boolean(story.isCloseFriend || story.canView);
  }

  return true;
}

export function canCreateStory(user) {
  return Boolean(user && !user.isBlocked && !user.isSuspended);
}

export function canEditStory(story, currentUserId) {
  if (!story || !currentUserId) return false;

  const authorId = story.userId || story.author?.id || story.author?.userId;

  return (
    authorId === currentUserId &&
    story.status !== "deleted" &&
    story.status !== "expired"
  );
}

export function canDeleteStory(story, currentUserId) {
  if (!story || !currentUserId) return false;

  const authorId = story.userId || story.author?.id || story.author?.userId;

  return authorId === currentUserId;
}

export function canReplyToStory(story, currentUserId) {
  return canViewStory(story, currentUserId);
}

export function canReactToStory(story, currentUserId) {
  if (!canViewStory(story, currentUserId)) return false;

  return !story?.isReacted && !story?.reacted;
}

export function canRemoveReaction(story, currentUserId) {
  if (!canViewStory(story, currentUserId)) return false;

  return Boolean(story?.isReacted || story?.reacted);
}

export function canShareStory(story, currentUserId) {
  return canViewStory(story, currentUserId);
}

export function canReportStory(story, currentUserId) {
  if (!story || !currentUserId) return false;

  const authorId = story.userId || story.author?.id || story.author?.userId;

  return authorId !== currentUserId;
}

export default {
  canViewStory,
  canCreateStory,
  canEditStory,
  canDeleteStory,
  canReplyToStory,
  canReactToStory,
  canRemoveReaction,
  canShareStory,
  canReportStory,
};
