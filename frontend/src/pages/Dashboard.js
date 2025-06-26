// import React, { useState, useEffect, useCallback, useRef } from "react";
// import useAuth from "../hooks/useAuth";
// import postService from "../services/postService";
// import userService from "../services/userService";
// import PostCard from "../components/posts/PostCard";
// import PostForm from "../components/posts/PostForm";
// import BirthdayCard from "../components/home/BirthdayCard";
// import Spinner from "../components/common/Spinner";
// import toast from "react-hot-toast";

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [posts, setPosts] = useState([]);
//   const [birthdays, setBirthdays] = useState([]);
//   const [loadingPosts, setLoadingPosts] = useState(true);
//   const [loadingBirthdays, setLoadingBirthdays] = useState(true);

//   // State for infinite scroll
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const observer = useRef();

//   const fetchInitialData = useCallback(async () => {
//     setLoadingPosts(true);
//     setLoadingBirthdays(true);
//     try {
//       // Fetch birthdays only once on initial load
//       const birthdaysRes = await userService.getTodaysBirthdays();
//       setBirthdays(birthdaysRes.data.data);
//     } catch (error) {
//       toast.error("Could not load birthday information.");
//     } finally {
//       setLoadingBirthdays(false);
//     }
//   }, []);

//   const fetchPosts = useCallback(async () => {
//     setLoadingPosts(true);
//     try {
//       const res = await postService.getPosts(page);
//       setPosts((prevPosts) => [...prevPosts, ...res.data.data]);
//       setHasMore(
//         res.data.pagination.currentPage < res.data.pagination.totalPages
//       );
//     } catch (error) {
//       toast.error("Could not load new posts.");
//     } finally {
//       setLoadingPosts(false);
//     }
//   }, [page]);

//   // Fetch initial data on component mount
//   useEffect(() => {
//     if (user) {
//       fetchInitialData();
//     }
//   }, [user, fetchInitialData]);

//   // Fetch posts when page number changes
//   useEffect(() => {
//     if (user) {
//       fetchPosts();
//     }
//   }, [user, fetchPosts]);

//   const lastPostElementRef = useCallback(
//     (node) => {
//       if (loadingPosts) return;
//       if (observer.current) observer.current.disconnect();
//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       });
//       if (node) observer.current.observe(node);
//     },
//     [loadingPosts, hasMore]
//   ); // Function to refresh all data
//   const refreshAllData = () => {
//     setPosts([]);
//     setPage(1); // This will trigger the useEffect for fetching posts
//     fetchInitialData(); // Re-fetch birthdays too
//   };
//   // Function to add a new post to the feed without refreshing everything
//   const handleNewPost = (newPost) => {
//     // Add the new post to the top of the posts array
//     setPosts((prevPosts) => [newPost, ...prevPosts]);
//   };

//   // Function to remove a deleted post from the feed without refreshing everything
//   const handleDeletePost = (deletedPostId) => {
//     // Remove the deleted post from the posts array
//     setPosts((prevPosts) =>
//       prevPosts.filter((post) => post._id !== deletedPostId)
//     );
//   };

//   const dismissBirthday = (userId) => {
//     setBirthdays(birthdays.filter((b) => b._id !== userId));
//   };

//   if (loadingBirthdays && page === 1) {
//     return <Spinner />;
//   }

//   return (
//     <div className="flex flex-col lg:flex-row gap-8">
//       {/* Sidebar: Birthdays (Order 1 on mobile) */}
//       <div className="w-full lg:w-1/3 order-1 lg:order-2 space-y-6">
//         <div className="bg-surface p-6 rounded-xl shadow-lg sticky top-24">
//           <h2 className="text-2xl font-bold text-on-surface mb-4">
//             Happy Birthday! 🎂
//           </h2>
//           {loadingBirthdays ? (
//             <Spinner />
//           ) : birthdays.length > 0 ? (
//             <div className="space-y-4">
//               {birthdays.map((bdayUser) => (
//                 <BirthdayCard
//                   key={bdayUser._id}
//                   user={bdayUser}
//                   onDismiss={dismissBirthday}
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center text-muted py-4">
//               No birthdays today.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Main Content: Post Feed (Order 2 on mobile) */}
//       <div className="w-full lg:w-2/3 order-2 lg:order-1 space-y-6">
//         {" "}

//         <div className="bg-surface p-6 rounded-xl shadow-lg">
//           <h2 className="text-2xl font-bold text-on-surface mb-4">
//             Create a Post
//           </h2>
//           <PostForm onPostCreated={handleNewPost} />
        
//         </div>{" "}

//         {posts.map((post, index) => {
//           // Ensure post has all required fields
//           const safePost = {
//             ...post,
//             user: post.user || {
//               _id: "",
//               fullName: "Unknown User",
//               role: "user",
//               profilePicture: "no-photo.jpg",
//             },
//             likes: post.likes || [],
//             comments: post.comments || [],
//           };

//           // Attach the ref to the last post element
//           if (posts.length === index + 1) {
//             return (
//               <div ref={lastPostElementRef} key={post._id || index}>
//                 <PostCard
//                   post={safePost}
//                   refreshFeed={refreshAllData}
//                   onDeletePost={handleDeletePost}
//                 />
//               </div>
//             );
//           } else {
//             return (
//               <PostCard
//                 key={post._id || index}
//                 post={safePost}
//                 refreshFeed={refreshAllData}
//                 onDeletePost={handleDeletePost}
//               />
//             );
//           }
//         })}

//         {loadingPosts && <Spinner />}

//         {!hasMore && posts.length > 0 && (
//           <p className="text-center text-muted py-4">You've reached the end!</p>
//         )}

//         {!loadingPosts && posts.length === 0 && (
//           <div className="bg-surface p-6 rounded-xl shadow-lg text-center">
//             <p className="text-muted">
//               The community feed is empty. Be the first to share something!
//             </p>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }









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
