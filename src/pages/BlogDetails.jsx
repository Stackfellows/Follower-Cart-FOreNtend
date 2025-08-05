import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader2, Info } from "lucide-react";

const BlogDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/followerApi/blogPosts/${id}`
        );
        setPost(res.data.post);
      } catch (err) {
        setError("Failed to fetch blog post.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        <span className="ml-4 text-xl text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-16 flex flex-col items-center">
        <Info className="h-12 w-12 mb-4" />
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Published on {new Date(post.createdAt).toLocaleDateString()} by{" "}
        {post.author || "Admin"}
      </p>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-auto rounded-lg shadow mb-6"
        />
      )}
      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
        {post.content}
      </p>
    </div>
  );
};

export default BlogDetails;
