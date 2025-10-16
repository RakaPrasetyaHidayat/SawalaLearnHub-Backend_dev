"use client";
import React, { useEffect, useState } from "react";
import Post from "../post/post";
import InputPost from "@/components/molecules/inputs/input-post/input-post";
import {
  listPosts,
  createPost,
  toggleLike,
  PostItem,
} from "@/services/postsService";

interface PostData {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  file?: {
    name: string;
    type: "image" | "document";
  };
  timestamp: string;
  likes: number;
  comments: number;
}

function mapItemToPostData(item: PostItem): PostData {
  const date = new Date(item.createdAt);
  const isValidDate = !isNaN(date.getTime());
  const timestamp = isValidDate
    ? date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Invalid date";
  const rawId =
    item.id ||
    item._id ||
    item.localId ||
    item.createdAt ||
    Math.random().toString(36).slice(2);
  const likes = Number.isFinite(item.likes)
    ? (item.likes as number)
    : Number(item.likes ?? 0) || 0;
  const comments = Number.isFinite(item.comments)
    ? (item.comments as number)
    : Number(item.comments ?? 0) || 0;

  return {
    id: String(rawId),
    user: { name: item.userName, avatar: item.userAvatar },
    content: item.content,
    file: item.file
      ? { name: item.file.name, type: item.file.type }
      : undefined,
    timestamp,
    likes,
    comments,
  };
}

export default function PostFeed() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { items } = await listPosts({ page: 1, limit: 10 });
        setPosts(items.map(mapItemToPostData));
      } catch (e) {
        console.error("Failed to load posts", e);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCreatePost = async ({
    text,
  }: {
    text: string;
    file?: File | null;
  }) => {
    if (!text.trim()) return;
    try {
      const created = await createPost({ content: text.trim() });
      setPosts((prev) => [mapItemToPostData(created), ...prev]);
    } catch (e) {
      console.error("Failed to create post", e);
      // Optional: show toast/error UI
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: Math.max(0, isLiked ? post.likes + 1 : post.likes - 1),
            }
          : post
      )
    );
    // Try toggling like on server (best-effort)
    toggleLike(postId).catch((e) => console.warn("toggleLike failed", e));
  };

  const handleComment = (postId: string) => {
    console.log("Comment on post:", postId);
  };

  return (
    <div className="space-y-4">
      <InputPost onSubmit={handleCreatePost} />

      {loading && (
        <div className="text-center text-gray-500">Loading posts...</div>
      )}
      {error && !loading && (
        <div className="text-center text-red-500">{error}</div>
      )}

      <div className="space-y-4 mt-3">
        {posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            user={post.user}
            content={post.content}
            file={post.file}
            timestamp={post.timestamp}
            initialLikes={post.likes}
            initialComments={post.comments}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center text-gray-500">No posts found.</div>
        )}
      </div>
    </div>
  );
}
