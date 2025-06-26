import React, { useState, useEffect, useCallback, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import postService from '../services/postService';
import userService from '../services/userService';
import PostCard from '../components/posts/PostCard';
import PostForm from '../components/posts/PostForm';
import BirthdayCard from '../components/home/BirthdayCard';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [birthdays, setBirthdays] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    // This function fetches posts for a specific page
    const fetchPosts = useCallback(async (pageNum, shouldRefresh = false) => {
        setLoading(true);
        try {
            const res = await postService.getPosts(pageNum);
            setPosts(prev => shouldRefresh ? res.data.data : [...prev, ...res.data.data]);
            setHasMore(res.data.pagination.currentPage < res.data.pagination.totalPages);
        } catch (error) {
            toast.error('Could not load posts.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        userService.getTodaysBirthdays()
            .then(res => setBirthdays(res.data.data))
            .catch(() => toast.error('Could not load birthday information.'));
    }, []);

    useEffect(() => {
        if (user) {
            fetchPosts(page);
        }
    }, [user, page, fetchPosts]);

    const lastPostElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const handleDataRefresh = () => {
        setPosts([]);
        setPage(1);
    };

    const dismissBirthday = (userId) => {
        setBirthdays(birthdays.filter(b => b._id !== userId));
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/3 order-1 lg:order-2 space-y-6">
                    <div className="bg-surface p-6 rounded-xl shadow-lg sticky top-24">
                        <h2 className="text-2xl font-bold text-on-surface mb-4">Happy Birthday! 🎂</h2>
                        {birthdays.length > 0 ? (
                            <div className="space-y-4">
                                {birthdays.map(bdayUser => <BirthdayCard key={bdayUser._id} user={bdayUser} onDismiss={dismissBirthday} />)}
                            </div>
                        ) : (
                            <div className="text-center text-muted py-4">No birthdays today.</div>
                        )}
                    </div>
                </div>

                <div className="w-full lg:w-2/3 order-2 lg:order-1 space-y-6">
                    <div className="bg-surface p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-on-surface mb-4">Create a Post</h2>
                        <PostForm onPostCreated={handleDataRefresh} />
                    </div>

                    {posts.map((post, index) => {
                        if (posts.length === index + 1) {
                            return <div ref={lastPostElementRef} key={post._id}><PostCard post={post} refreshFeed={handleDataRefresh} /></div>;
                        } else {
                            return <PostCard key={post._id} post={post} refreshFeed={handleDataRefresh} />;
                        }
                    })}

                    {loading && <Spinner />}
                    {!hasMore && posts.length > 0 && <p className="text-center text-muted py-4">You've reached the end!</p>}
                    {!loading && posts.length === 0 && (
                        <div className="bg-surface p-6 rounded-xl shadow-lg text-center">
                            <p className="text-muted">The community feed is empty. Be the first to share something!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
