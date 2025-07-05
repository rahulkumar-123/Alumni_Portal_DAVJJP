import React, { useState } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import userService from '../../services/userService';
import postService from '../../services/postService';
import toast from 'react-hot-toast';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { formatDistanceToNowStrict } from 'date-fns';
// import useAuth from '../../hooks/useAuth';
import './mentionStyle.css';
import StyledText from '../common/StyledText';

export default function CommentSection({ postId, comments: initialComments, onCommentPosted }) {
    // const { user, isAdmin } = useAuth();
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchUsersForMention = (query, callback) => {
        if (!query) return;
        userService.searchUsers(query)
            .then(res => {

                const transformedData = res.data.data.map(user => ({ id: user.display, display: user.display }));
                callback(transformedData);
            })
            .catch(() => callback([]));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setLoading(true);
        try {
            const res = await postService.addComment(postId, { text: newComment });
            setComments(res.data.data);
            setNewComment('');
            onCommentPosted();
        } catch (error) {
            toast.error('Failed to post comment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-gray-100">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3 mb-4">
                <div className="flex-1">
                    <MentionsInput
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="mentions"
                        a11ySuggestionsListLabel={"Suggested users for mention"}
                    >
                        <Mention
                            trigger="@"
                            data={fetchUsersForMention}
                            markup="@[__display__]" // <-- Simplified markup
                            displayTransform={(id, display) => `@${display}`}
                            className="mentions__mention"
                        />
                    </MentionsInput>
                </div>
                <button 
                    type="submit" 
                    disabled={loading || !newComment.trim()} 
                    className="p-2.5 bg-blue-600 rounded-full text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                >
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </form>

            <div className="space-y-3">
                {comments
                    .slice()
                    .sort(createdAt => new Date(createdAt).getTime())
                    .map(comment => (
                        <div key={comment._id} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                            <div className="flex justify-between items-baseline mb-2">
                                <p className="font-semibold text-sm text-gray-900">{comment.name}</p>
                                <p className="text-xs text-gray-500">{formatDistanceToNowStrict(new Date(comment.createdAt))} ago</p>
                            </div>
                            <div className="text-gray-700 text-sm">
                                <StyledText text={comment.text} />
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
