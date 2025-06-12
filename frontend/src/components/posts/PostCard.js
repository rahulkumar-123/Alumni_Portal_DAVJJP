import React, { useState } from 'react';
import { ChatBubbleOvalLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import CommentSection from './CommentSection';
const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");
export default function PostCard({ post, refreshFeed }) {
    const [showComments, setShowComments] = useState(false);
    const handleShare = () => { navigator.clipboard.writeText(`${window.location.origin}/posts/${post._id}`); toast.success('Post link copied to clipboard!'); };
    const profileImageUrl = post.user.profilePicture?.startsWith('http') ? post.user.profilePicture : post.user.profilePicture !== 'no-photo.jpg' ? `${API_URL}${post.user.profilePicture}` : `https://ui-avatars.com/api/?name=${post.user.fullName}&background=8344AD&color=fff`;
    return (<div className="bg-surface rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-2xl">
        <div className="p-5"><div className="flex items-center mb-4">
            <img className="h-12 w-12 rounded-full mr-4 object-cover" src={profileImageUrl} alt={post.user.fullName} />
            <div><p className="font-bold text-on-surface">{post.user.fullName}</p><p className="text-sm text-muted">{formatDistanceToNow(new Date(post.createdAt))} ago</p></div>
            <span className="ml-auto bg-primary-light/20 text-primary-dark text-xs font-semibold px-2.5 py-1 rounded-full">{post.category}</span>
        </div><h3 className="text-2xl font-bold mb-2 text-on-surface">{post.title}</h3><p className="text-muted whitespace-pre-wrap">{post.content}</p></div>
        <div className="border-t border-gray-200 px-5 py-3 flex justify-around"><button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-2 text-muted hover:text-primary transition-colors font-semibold">
            <ChatBubbleOvalLeftIcon className="w-6 h-6" />
            <span>Comment ({post.comments.length})</span></button><button onClick={handleShare} className="flex items-center space-x-2 text-muted hover:text-primary transition-colors font-semibold">
                <ShareIcon className="w-6 h-6" /><span>Share</span></button></div>
        {showComments && <CommentSection postId={post._id} comments={post.comments} onCommentPosted={refreshFeed} />}
    </div>);
}