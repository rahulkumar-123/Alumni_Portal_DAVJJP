import React, { useState } from 'react'; // <-- THIS IMPORT WAS MISSING
import { MentionsInput, Mention } from 'react-mentions';
import userService from '../../services/userService';
import postService from '../../services/postService';
import toast from 'react-hot-toast';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { formatDistanceToNowStrict } from 'date-fns';
import useAuth from '../../hooks/useAuth';
import './mentionStyles.css';

export default function CommentSection({ postId, comments: initialComments, onCommentPosted }) {
    const { user, isAdmin } = useAuth();
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
        <div className="p-5 bg-gray-50">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3 mb-4">
                <MentionsInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment... use @ to mention."
                    className="mentions"
                    a11ySuggestionsListLabel={"Suggested users for mention"}
                >
                    <Mention
                        trigger="@"
                        data={fetchUsersForMention}
                        className="mentions__mention"
                    />
                </MentionsInput>
                <button type="submit" disabled={loading} className="p-2 bg-primary rounded-full text-white hover:bg-primary-dark disabled:bg-primary-light transition-colors">
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </form>

            <div className="space-y-3">
                {comments
                    .slice()
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                    .map(comment => (
                        <div key={comment._id} className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="flex justify-between items-baseline">
                                <p className="font-bold text-sm text-on-surface">{comment.name}</p>
                                <p className="text-xs text-muted">{formatDistanceToNowStrict(new Date(comment.createdAt))} ago</p>
                            </div>
                            <p className="text-on-surface mt-1">{comment.text}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
}
