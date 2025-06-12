import React, { useState } from 'react';
import postService from '../../services/postService';
import toast from 'react-hot-toast';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { formatDistanceToNowStrict } from 'date-fns';
export default function CommentSection({ postId, comments: initialComments, onCommentPosted }) {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault(); if (!newComment.trim()) return; setLoading(true);
        try { const res = await postService.addComment(postId, { text: newComment }); setComments(res.data.data); setNewComment(''); onCommentPosted(); } catch (error) { toast.error('Failed to post comment.'); } finally { setLoading(false); }
    };
    return (<div className="p-5 bg-gray-50"><form onSubmit={handleSubmit} className="flex items-center space-x-3 mb-4">
        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className="flex-1 px-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
        <button type="submit" disabled={loading} className="p-2 bg-primary rounded-full text-white hover:bg-primary-dark disabled:bg-primary-light transition-colors"><PaperAirplaneIcon className="w-5 h-5" /></button>
    </form><div className="space-y-3">
            {comments.map(comment => (<div key={comment._id} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex justify-between items-baseline"><p className="font-bold text-sm text-on-surface">{comment.name}</p><p className="text-xs text-muted">{formatDistanceToNowStrict(new Date(comment.createdAt))} ago</p></div>
                <p className="text-on-surface mt-1">{comment.text}</p>
            </div>))}
        </div></div>);
}
