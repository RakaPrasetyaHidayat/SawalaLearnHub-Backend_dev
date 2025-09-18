"use client";

import { useEffect, useState } from "react";
import PostsClient from "@/components/client/posts-client";
import { listMyPosts, PostItem } from "@/services/postsService";

interface PostData {
  id: string;
  user: { name: string; avatar: string };
  content: string;
  file?: { name: string; type: "image" | "document" };
  timestamp: string;
  initialLikes: number;
  initialComments: number;
}

function mapItemToPostData(item: PostItem): PostData {
  const date = new Date(item.createdAt);
  const timestamp = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return {
    id: item.id,
    user: { name: item.userName, avatar: item.userAvatar },
    content: item.content,
    file: item.file
      ? { name: item.file.name, type: item.file.type }
      : undefined,
    timestamp,
    initialLikes: item.likes,
    initialComments: item.comments,
  };
}

export default function AdminMyPostsPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { items } = await listMyPosts({ page: 1, limit: 20 });
        setPosts(items.map(mapItemToPostData));
      } catch (e) {
        console.error("Failed to load my posts", e);
        setError("Gagal memuat postingan saya");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return <div className="p-4 text-center text-gray-500">Memuat...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return <PostsClient posts={posts} />;
}
