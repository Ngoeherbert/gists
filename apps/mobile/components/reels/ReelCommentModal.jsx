// apps/mobile/components/reels/ReelCommentModal.jsx
//
// The reel comment screen shares the exact same look and behaviour as the
// comments CommentModal. Re-export it here so the reels screen can keep using
// its own dedicated component name while rendering an identical comment
// experience (real user avatars, likes, replies, edit/report, count, etc.).
import React from "react";
import CommentModal from "../comments/CommentModal";

export default function ReelCommentModal(props) {
  return <CommentModal {...props} />;
}
