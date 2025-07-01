import React, { useState } from 'react';
import postService from '../../services/postService';
import toast from 'react-hot-toast';
import { PaperAirplaneIcon, TrashIcon } from '@heroicons/react/24/solid';
import { formatDistanceToNowStrict } from 'date-fns';
import useAuth from '../../hooks/useAuth';
import { MentionsInput, Mention } from 'react-mentions';
// import './mentionStyles.css';

export default function CommentSection({ postId, comments: initialComments, onCommentPosted }) {
    const { user, isAdmin } = useAuth();
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchUsersForMention = (query, callback) => {
        if (!query) return;
        userService.searchUsers(query)
            .then(res => callback(res.data.data))
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
        } catch (error) {
            toast.error('Failed to post comment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 bg-gray-50">
            {/* The style tag is now included directly in the component */}
            <style>{`
                .mentions {
                  width: 100%;
                }
                .mentions__control {
                  background-color: white !important;
                  border-radius: 9999px !important;
                  padding: 0.5rem 1rem !important;
                  border: 1px solid #d1d5db !important;
                }
                .mentions__input {
                  padding: 0 !important;
                  border: 0 !important;
                  outline: 0 !important;
                  width: 100% !important;
                  font-size: 1rem !important;
                  line-height: 1.5rem !important;
                }
                .mentions__suggestions__list {
                  background-color: white;
                  border: 1px solid #d1d5db;
                  border-radius: 0.5rem;
                  margin-top: 0.5rem;
                  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                  max-height: 15rem;
                  overflow-y: auto;
                  z-index: 10;
                }
                .mentions__suggestions__item {
                  padding: 0.5rem 1rem;
                }
                .mentions__suggestions__item--focused {
                  background-color: #f3f4f6;
                }
                .mentions__mention {
                  background-color: #e0d4ec !important;
                  padding: 2px 1px !important;
                  border-radius: 4px !important;
                  font-weight: 600 !important;
                }
            `}</style>
            <form onSubmit={handleSubmit} className="flex items-center space-x-3 mb-4">
                <MentionsInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment... use @ to mention someone."
                    className="mentions"
                    a11ySuggestionsListLabel={"Suggested users for mention"}
                >
                    <Mention
                        trigger="@"
                        data={fetchUsersForMention}
                        className="mentions__mention"
                    />
                </MentionsInput>
                <button type="submit" disabled={loading} className="...">
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </form>

            <div className="space-y-3">
                {comments
                    .slice()
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                    .map(comment => {
                        const canDelete = user?._id === comment.user || isAdmin;
                        return (
                            <div key={comment._id} className="bg-white p-3 rounded-lg shadow-sm group relative">
                                <div className="flex justify-between items-baseline">
                                    <p className="font-bold text-sm text-on-surface">{comment.name}</p>
                                    <p className="text-xs text-muted">{formatDistanceToNowStrict(new Date(comment.createdAt))} ago</p>
                                </div>
                                <p className="text-on-surface mt-1">{comment.text}</p>
                                {canDelete && (
                                    <button onClick={() => { }} className="absolute top-2 right-2 p-1 text-gray-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-opacity">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )
                    })}
            </div>
        </div>
    );
}
