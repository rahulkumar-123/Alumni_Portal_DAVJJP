import React, { useState, useEffect, useCallback, useRef } from "react";
import useAuth from "../hooks/useAuth";
import postService from "../services/postService";
import userService from "../services/userService";
import PostCard from "../components/posts/PostCard";
import PostForm from "../components/posts/PostForm";
import BirthdayCard from "../components/home/BirthdayCard";
import Spinner from "../components/common/Spinner";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user } = useAuth();

  /* ───── State ─────────────────────────────────────────────────────────────── */
  const [posts, setPosts]             = useState([]);
  const [birthdays, setBirthdays]     = useState([]);

  const [loadingPosts, setLoadingPosts]       = useState(true);
  const [loadingBirthdays, setLoadingBirthdays] = useState(true);

  const [page, setPage]   = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /* ───── Refs ──────────────────────────────────────────────────────────────── */
  const observer   = useRef();
  const loadingRef = useRef(false);          // FIX: prevents parallel fetches

  /* ───── Helpers ───────────────────────────────────────────────────────────── */
  const mergePosts = (prev, next) => {
    const map = new Map(prev.map(p => [p._id, p])); // existing posts first
    next.forEach(p => map.set(p._id, p));           // incoming overwrite / add
    return Array.from(map.values());
  };

  /* ───── Fetchers ──────────────────────────────────────────────────────────── */
  const fetchInitialData = useCallback(async () => {
    setLoadingBirthdays(true);
    try {
      const { data } = await userService.getTodaysBirthdays();
      setBirthdays(data.data);
    } catch {
      toast.error("Could not load birthday information.");
    } finally {
      setLoadingBirthdays(false);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    // FIX: guard against double-fetch
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoadingPosts(true);

    try {
      const res = await postService.getPosts(page);

      setPosts(prev => mergePosts(prev, res.data.data));          // dedupe
      setHasMore(
        res.data.pagination.currentPage < res.data.pagination.totalPages
      );
    } catch {
      toast.error("Could not load new posts.");
    } finally {
      setLoadingPosts(false);
      loadingRef.current = false;
    }
  }, [page]);

  /* ───── Effects ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (user) fetchInitialData();
  }, [user, fetchInitialData]);

  useEffect(() => {
    if (user) fetchPosts();
  }, [user, fetchPosts]);

  /* Disconnect observer on unmount */
  useEffect(() => () => observer.current?.disconnect(), []);

  /* ───── Infinite-scroll ref ──────────────────────────────────────────────── */
  const lastPostElementRef = useCallback(
    node => {
      if (loadingPosts) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(p => p + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingPosts, hasMore]
  );

  /* ───── UI helpers ────────────────────────────────────────────────────────── */
  const refreshAllData = () => {
    setPosts([]);
    setHasMore(true);
    setPage(1);
    fetchInitialData();
  };

  const handleNewPost = newPost =>
    setPosts(prev => mergePosts([newPost], prev));

  const handleDeletePost = deletedId =>
    setPosts(prev => prev.filter(p => p._id !== deletedId));

  const dismissBirthday = userId =>
    setBirthdays(prev => prev.filter(b => b._id !== userId));

  /* ───── Rendering ─────────────────────────────────────────────────────────── */

  if (loadingBirthdays && page === 1) return <Spinner />;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* ─── Sidebar (Birthdays) ───────────────────────────────────────────── */}
      <aside className="w-full lg:w-1/3 order-1 lg:order-2 space-y-6">
        <div className="bg-surface p-6 rounded-xl shadow-lg sticky top-24">
          <h2 className="text-2xl font-bold text-on-surface mb-4">
            Happy Birthday! 🎂
          </h2>

          {loadingBirthdays ? (
            <Spinner />
          ) : birthdays.length ? (
            birthdays.map(b => (
              <BirthdayCard
                key={b._id}
                user={b}
                onDismiss={dismissBirthday}
              />
            ))
          ) : (
            <p className="text-center text-muted py-4">No birthdays today.</p>
          )}
        </div>
      </aside>

      {/* ─── Main Feed ──────────────────────────────────────────────────────── */}
      <main className="w-full lg:w-2/3 order-2 lg:order-1 space-y-6">
        <div className="bg-surface p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-on-surface mb-4">
            Create a Post
          </h2>
          <PostForm onPostCreated={handleNewPost} />
        </div>

        {posts.map((post, i) => {
          const safe = {
            ...post,
            user: post.user ?? {
              _id: "",
              fullName: "Unknown User",
              role: "user",
              profilePicture: "no-photo.jpg",
            },
            likes: post.likes ?? [],
            comments: post.comments ?? [],
          };

          const card = (
            <PostCard
              key={post._id}
              post={safe}
              refreshFeed={refreshAllData}
              onDeletePost={handleDeletePost}
            />
          );

          return posts.length === i + 1 ? (
            <div ref={lastPostElementRef} key={post._id}>
              {card}
            </div>
          ) : (
            card
          );
        })}

        {loadingPosts && <Spinner />}

        {!hasMore && posts.length > 0 && !loadingPosts && (
          <p className="text-center text-muted py-4">You've reached the end!</p>
        )}

        {!loadingPosts && posts.length === 0 && (
          <div className="bg-surface p-6 rounded-xl shadow-lg text-center">
            <p className="text-muted">
              The community feed is empty. Be the first to share something!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
