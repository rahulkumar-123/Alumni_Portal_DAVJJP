import React, { useState, useEffect } from 'react';
import { ChatBubbleOvalLeftIcon, ShareIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import CommentSection from './CommentSection';
import useAuth from '../../hooks/useAuth';
import postService from '../../services/postService';
import Linkify from 'react-linkify';
import AlumniDetailModal from '../directory/AlumniDetailModal';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
//import { useState, useEffect } from 'react';
const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");

export default function PostCard({ post, refreshFeed }) {
    const { user: loggedInUser, isAdmin } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [likes, setLikes] = useState(post.likes || []);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        setIsLiked(likes.includes(loggedInUser?._id));
    }, [likes, loggedInUser]);

    const handleLike = async () => {
        // Optimistic UI update
        const originalLikes = [...likes];
        const newLikes = isLiked ? likes.filter(id => id !== loggedInUser._id) : [...likes, loggedInUser._id];
        setLikes(newLikes);

        try {
            const res = await postService.likePost(post._id);
            setLikes(res.data.data); // Sync with server state
        } catch (error) {
            toast.error("Failed to update like.");
            setLikes(originalLikes); // Revert on error
        }
    };
    // character limit for collapsing post
    const MAX_LENGTH = 400;
    const isLongPost = post.content.length > MAX_LENGTH;

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    const canDelete = isAdmin || (loggedInUser && loggedInUser._id === post.user?._id);
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await postService.deletePost(post._id);
                toast.success("Post deleted successfully.");
                refreshFeed();
            } catch (error) {
                toast.error("Failed to delete post.");
            }
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(`${window.location.origin}/posts/${post._id}`);
        toast.success('Post link copied to clipboard!');
    };

    const profileImageUrl = post.user.profilePicture?.startsWith('http')
        ? post.user.profilePicture
        : post.user.profilePicture && post.user.profilePicture !== 'no-photo.jpg'
            ? `${API_URL}${post.user.profilePicture}`
            : `https://ui-avatars.com/api/?name=${post.user.fullName}&background=8344AD&color=fff`;

    return (
        <div className="bg-surface rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-2xl">
            <div className="p-5">
                <div className="flex items-center mb-4">
                    <button onClick={() => setSelectedUser(post.user)} className="flex items-center text-left hover:opacity-80 transition-opacity">
                        <img className="h-12 w-12 rounded-full mr-4 object-cover" src={profileImageUrl} alt={post.user.fullName} />
                        <div className="flex-1">
                            <p className="font-bold text-on-surface">{post.user?.fullName}</p>
                            <div className="flex items-center">
                                <p className="text-sm text-muted">{formatDistanceToNow(new Date(post.createdAt))} ago</p>
                                {post.user.role === 'admin' && (
                                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">Admin</span>
                                )}
                            </div>
                        </div>
                    </button>
                    <span className="ml-auto bg-primary-light/20 text-primary-dark text-xs font-semibold px-2.5 py-1 rounded-full">{post.category}</span>
                    {canDelete && (
                        <button onClick={handleDelete} className="ml-auto p-2 text-muted hover:text-red-500 rounded-full hover:bg-red-50 transition">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <h3 className="text-2xl font-bold mb-2 text-on-surface">{post.title}</h3>

                <div className="text-muted whitespace-pre-wrap">
                    <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (<a target="_blank" rel="noopener noreferrer" href={decoratedHref} key={key} className="text-primary hover:underline font-semibold">{decoratedText}</a>)}>
                        {isLongPost && !isExpanded ? `${post.content.substring(0, MAX_LENGTH)}...` : post.content}
                    </Linkify>
                </div>

                {isLongPost && (
                    <button onClick={toggleExpanded} className="text-primary font-semibold mt-2 hover:underline">
                        {isExpanded ? 'Show Less' : 'Show More...'}
                    </button>
                )}
            </div>

            <div className="border-t border-gray-200 px-5 py-3 flex justify-around">
                <button onClick={handleLike} className={`flex items-center space-x-2 font-semibold transition-colors ${isLiked ? 'text-red-500' : 'text-muted hover:text-red-500'}`}>
                    {isLiked ? <HeartIconSolid className="w-6 h-6" /> : <HeartIconOutline className="w-6 h-6" />}
                    <span>{likes.length} Like{likes.length !== 1 && 's'}</span>
                </button>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-2 text-muted hover:text-primary transition-colors font-semibold">
                    <ChatBubbleOvalLeftIcon className="w-6 h-6" />
                    <span>Comment ({post.comments.length})</span>
                </button>
                <button onClick={handleShare} className="flex items-center space-x-2 text-muted hover:text-primary transition-colors font-semibold">
                    <ShareIcon className="w-6 h-6" />
                    <span>Share</span>
                </button>
            </div>

            {showComments && <CommentSection postId={post._id} comments={post.comments} onCommentPosted={refreshFeed} />}
            {selectedUser && <AlumniDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    );
}
