import React, { useState, useEffect } from 'react';
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

    const fetchData = async () => {
        try {
            const [postsRes, birthdaysRes] = await Promise.all([
                postService.getPosts(),
                userService.getTodaysBirthdays()
            ]);
            setPosts(postsRes.data.data);
            setBirthdays(birthdaysRes.data.data);
        } catch (error) {
            toast.error('Could not load community feed.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content: Post Feed */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-surface p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-on-surface mb-4">Create a Post</h2>
                        <PostForm onPostCreated={fetchData} />
                    </div>
                    {posts.length > 0 ? (
                        posts.map(post => <PostCard key={post._id} post={post} refreshFeed={fetchData} />)
                    ) : (
                        <div className="bg-surface p-6 rounded-xl shadow-lg text-center">
                            <p className="text-muted">The community feed is empty. Be the first to share something!</p>
                        </div>
                    )}
                </div>

                {/* Sidebar: Birthdays and other info */}
                <div className="lg:col-span-4 space-y-6">
                     <div className="bg-surface p-6 rounded-xl shadow-lg sticky top-24">
                        <h2 className="text-2xl font-bold text-on-surface mb-4">Happy Birthday! 🎂</h2>
                        {birthdays.length > 0 ? (
                            <div className="space-y-4">
                                {birthdays.map(bdayUser => <BirthdayCard key={bdayUser._id} user={bdayUser} />)}
                            </div>
                        ) : (
                            <div className="text-center text-muted py-4">
                                No birthdays today.
                            </div>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
}
