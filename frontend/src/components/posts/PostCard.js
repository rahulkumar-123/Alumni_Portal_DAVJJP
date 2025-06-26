import React, { useState, useEffect } from "react";
import {
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  TrashIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import CommentSection from "./CommentSection";
import useAuth from "../../hooks/useAuth";
import postService from "../../services/postService";
import Linkify from "react-linkify";

const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");

export default function PostCard({ post, refreshFeed, onDeletePost }) {
  const { user, isAdmin } = useAuth();

  /* ──────────────── LOCAL STATE ──────────────── */
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // ⇣⇣   🔴 NEW: fetch like status with dedicated API   ⇣⇣
  const [isLiked, setIsLiked] = useState(false);
  const [likeStatusLoading, setLikeStatusLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await postService.myLikeStatus(post._id);
        // माना `data.liked` boolean लौटाता है
        if (mounted) setIsLiked(!!data.liked);
      } catch {
        /* fallback: false — UI grey रहेगा */
      } finally {
        if (mounted) setLikeStatusLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [post._id]);
  // ⇡⇡   🔴 NEW CODE END   ⇡⇡

  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [commentsCount, setCommentsCount] = useState(
    Array.isArray(post.comments) ? post.comments.length : 0
  );

  /* ──────────────── HELPERS ──────────────── */
  const MAX_LENGTH = 300;
  const isLongPost = post.content.length > MAX_LENGTH;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await postService.deletePost(post._id);
      toast.success("Post deleted.");
      onDeletePost ? onDeletePost(post._id) : refreshFeed();
    } catch {
      toast.error("Failed to delete post.");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/posts/${post._id}`
    );
    toast.success("Post link copied to clipboard!");
  };

  const toggleLikePost = async () => {
    if (likeStatusLoading) return; // safeguard
    try {
      // UI-optimistic toggle
      const nextLiked = !isLiked;
      setIsLiked(nextLiked);
      setLikesCount((c) => (nextLiked ? c + 1 : c - 1));

      const { data } = await postService.toggleLikePost(post._id);
      /* optional: अगर API नया काउण्ट लौटाती है
         setLikesCount(data.totalLikes);
      */
      toast.success(nextLiked ? "Post liked!" : "Post unliked!");
    } catch {
      // rollback on error
      setIsLiked((prev) => !prev);
      setLikesCount((c) => (isLiked ? c + 1 : c - 1));
      toast.error("Failed to like post.");
    }
  };

  const profileImageUrl = post.user.profilePicture?.startsWith("http")
    ? post.user.profilePicture
    : post.user.profilePicture && post.user.profilePicture !== "no-photo.jpg"
    ? `${API_URL}${post.user.profilePicture}`
    : `https://ui-avatars.com/api/?name=${post.user.fullName}&background=8344AD&color=fff`;

  /* ──────────────── JSX ──────────────── */
  return (
    <div className="bg-surface rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-2xl">
      <div className="p-5">
        {/* header */}
        <div className="flex items-center mb-4">
          <img
            className="h-12 w-12 rounded-full mr-4 object-cover"
            src={profileImageUrl}
            alt={post.user.fullName}
          />
          <div className="flex-1">
            <p className="font-bold text-on-surface">{post.user.fullName}</p>
            <div className="flex items-center">
              <p className="text-sm text-muted">
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </p>
              {post.user.role === "admin" && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>
          </div>
          <span className="ml-auto bg-primary-light/20 text-primary-dark text-xs font-semibold px-2.5 py-1 rounded-full">
            {post.category}
          </span>
          {isAdmin && (
            <button
              onClick={handleDelete}
              className="ml-auto p-2 text-muted hover:text-red-500 rounded-full hover:bg-red-50 transition"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* body */}
        <h3 className="text-2xl font-bold mb-2 text-on-surface">
          {post.title}
        </h3>

        <div className="text-muted whitespace-pre-wrap">
          <Linkify
            componentDecorator={(href, text, key) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                {text}
              </a>
            )}
          >
            {isLongPost && !isExpanded
              ? `${post.content.slice(0, MAX_LENGTH)}…`
              : post.content}
          </Linkify>
        </div>

        {isLongPost && (
          <button
            onClick={() => setIsExpanded((e) => !e)}
            className="text-primary font-semibold mt-2 hover:underline"
          >
            {isExpanded ? "Show Less" : "Show More…"}
          </button>
        )}
      </div>

      {/* actions */}
      <div className="border-t border-gray-200 px-5 py-3 flex justify-around">
        <button
          disabled={likeStatusLoading}
          onClick={toggleLikePost}
          className="flex items-center space-x-2 text-muted hover:text-primary font-semibold transition-colors disabled:opacity-50"
        >
          <HeartIcon
            className={`w-6 h-6 ${isLiked ? "text-red-500" : "text-gray-700"}`}
          />
          <span>Like ({likesCount})</span>
        </button>

        <button
          onClick={() => setShowComments((s) => !s)}
          className="flex items-center space-x-2 text-muted hover:text-primary font-semibold transition-colors"
        >
          <ChatBubbleOvalLeftIcon className="w-6 h-6" />
          <span>Comment ({commentsCount})</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center space-x-2 text-muted hover:text-primary font-semibold transition-colors"
        >
          <ShareIcon className="w-6 h-6" />
          <span>Share</span>
        </button>
      </div>

      {/* comments */}
      {showComments && (
        <CommentSection
          postId={post._id}
          comments={post.comments}
          onCommentPosted={(updated) => {
            post.comments = updated;
            setCommentsCount(updated.length);
          }}
        />
      )}
    </div>
  );
}
