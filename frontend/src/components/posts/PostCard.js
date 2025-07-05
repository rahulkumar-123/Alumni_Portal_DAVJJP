import React, { useState, useEffect } from "react";
import {
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  TrashIcon,
  HeartIcon as HeartIconOutline,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import CommentSection from "./CommentSection";
import useAuth from "../../hooks/useAuth";
import postService from "../../services/postService";
import Linkify from "react-linkify";
import AlumniDetailModal from "../directory/AlumniDetailModal";
import { shareLink } from "../../utils/shareLink";

const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");

export default function PostCard({ post, refreshFeed }) {
  const { user: loggedInUser, isAdmin } = useAuth();

  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    setIsLiked(likes.includes(loggedInUser?._id));
  }, [likes, loggedInUser?._id]); // ← unique dep

  const handleLike = async () => {
    const originalLikes = [...likes];
    const newLikes = isLiked
      ? likes.filter((id) => id !== loggedInUser._id)
      : [...likes, loggedInUser._id];

    setLikes(newLikes); 

    try {
      const res = await postService.likePost(post._id);
      setLikes(res.data.data);
    } catch {
      toast.error("Failed to update like.");
      setLikes(originalLikes);
    }
  };

  const MAX_LENGTH = 400;
  const isLongPost = post.content.length > MAX_LENGTH;
  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const canDelete = isAdmin || loggedInUser?._id === post.user?._id;
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postService.deletePost(post._id);
        toast.success("Post deleted.");
        refreshFeed();
      } catch {
        toast.error("Failed to delete post.");
      }
    }
  };

  const handleShare = async () => {
    if (isSharing) return; 
    
    setIsSharing(true);
    
    try {
      const result = await shareLink(
        `${window.location.origin}/posts/${post._id}`,
        {
          title: post.title.slice(0, 50) + (post.title.length > 50 ? "…" : ""),
          text: post.content.slice(0, 120) + (isLongPost ? "…" : ""),
        }
      );
      
      // console.log("Share result:", result);

      if (result === true) {
        toast.success("Shared successfully!");
      } else if (result === "copied") {
        toast.success("Link copied to clipboard!");
      } else {
        toast.error("Could not share. Please try again.");
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Could not share. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  /* -------------------- Helpers -------------------- */
  const profileImageUrl = post.user.profilePicture?.startsWith("http")
    ? post.user.profilePicture
    : post.user.profilePicture && post.user.profilePicture !== "no-photo.jpg"
    ? `${API_URL}${post.user.profilePicture}`
    : `https://ui-avatars.com/api/?name=${post.user.fullName}&background=8344AD&color=fff`;

  /* ================================================= */
  return (
    <div className="bg-surface rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-xl">
      {/* ================= HEADER ================= */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Avatar + name */}
          <button
            onClick={() => setSelectedUser(post.user)}
            className="flex items-center hover:opacity-90"
          >
            <img
              src={profileImageUrl}
              alt={post.user.fullName}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="ml-3 text-left">
              <p className="font-bold text-on-surface text-sm sm:text-base">
                {post.user?.fullName}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted">
                <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                {post.user.role === "admin" && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </button>

          {/* Right-side actions */}
          <div className="ml-auto flex items-center gap-2">
            <span className="bg-primary-light/20 text-primary-dark text-xs font-semibold px-2.5 py-1 rounded-full">
              {post.category}
            </span>

            {canDelete && (
              <button
                onClick={handleDelete}
                title="Delete Post"
                className="p-2 rounded-full text-muted hover:text-red-500 hover:bg-red-50 transition"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <h3 className="text-xl sm:text-2xl font-bold mb-2 text-on-surface">
          {post.title}
        </h3>

        <div className="text-muted whitespace-pre-wrap text-sm sm:text-base">
          <Linkify
            componentDecorator={(href, text, key) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold break-words"
              >
                {text}
              </a>
            )}
          >
            {isLongPost && !isExpanded
              ? `${post.content.substring(0, MAX_LENGTH)}…`
              : post.content}
          </Linkify>
        </div>

        {isLongPost && (
          <button
            onClick={toggleExpanded}
            className="mt-2 text-sm text-primary font-semibold hover:underline"
          >
            {isExpanded ? "Show Less" : "Show More…"}
          </button>
        )}
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="border-t border-gray-200 px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between text-sm">
        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 font-semibold transition ${
            isLiked ? "text-red-500" : "text-muted hover:text-red-500"
          }`}
        >
          {isLiked ? (
            <HeartIconSolid className="h-5 w-5" />
          ) : (
            <HeartIconOutline className="h-5 w-5" />
          )}
          <span>
            {likes.length} Like{likes.length !== 1 && "s"}
          </span>
        </button>

        {/* Comment */}
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-2 font-semibold text-muted hover:text-primary transition"
        >
          <ChatBubbleOvalLeftIcon className="h-5 w-5" />
          <span>Comment ({post.comments.length})</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          disabled={isSharing}
          className={`flex items-center gap-2 font-semibold transition-all duration-200 ${
            isSharing 
              ? "text-gray-400 cursor-not-allowed" 
              : "text-muted hover:text-primary"
          }`}
        >
          <ShareIcon className={`h-5 w-5 ${isSharing ? 'animate-spin' : ''}`} />
          <span>{isSharing ? "Sharing..." : "Share"}</span>
        </button>
      </div>

      {/* ================= FOOTER ================= */}
      {showComments && (
        <CommentSection
          postId={post._id}
          comments={post.comments}
          onCommentPosted={refreshFeed}
        />
      )}

      {selectedUser && (
        <AlumniDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
