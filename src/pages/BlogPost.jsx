import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Rss,
  Calendar,
  User as UserIcon,
  ArrowRight,
  Loader2,
  Info,
  PlusCircle,
  XCircle,
  CheckCircle,
  Trash2,
  Pencil,
} from "lucide-react";

const Blog = ({ user }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImageFile, setNewPostImageFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);

  const fetchBlogPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        "http://localhost:5000/followerApi/blogPosts"
      );
      const fetchedData = res.data || [];

      const formatted = fetchedData.map((post) => ({
        id: post._id,
        title: post.title,
        content: post.content,
        date: new Date(post.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        author: post.author?.name || "Admin",
        snippet: post.content?.substring(0, 150) + "...",
      }));

      setBlogPosts(formatted);
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage(null);

    const token = localStorage.getItem("token");
    if (!token || !user || user.role !== "admin") {
      setFormMessage({
        type: "error",
        text: "You must be logged in as an admin.",
      });
      setFormLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newPostTitle);
      formData.append("content", newPostContent);
      if (newPostImageFile) {
        formData.append("image", newPostImageFile);
      }

      await axios.post(
        "http://localhost:5000/followerApi/blogPosts",
        formData,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormMessage({
        type: "success",
        text: "Blog post created successfully!",
      });

      setNewPostTitle("");
      setNewPostContent("");
      setNewPostImageFile(null);
      setShowCreateForm(false);
      fetchBlogPosts();
    } catch (err) {
      console.error("Create error:", err);
      setFormMessage({
        type: "error",
        text:
          err.response?.data?.msg ||
          err.response?.data?.error ||
          "Failed to create blog post.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditImageFile(null);
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditTitle("");
    setEditContent("");
    setEditImageFile(null);
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("content", editContent);
      if (editImageFile) {
        formData.append("image", editImageFile);
      }

      await axios.put(
        `http://localhost:5000/followerApi/blogPosts/${id}`,
        formData,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Post updated.");
      cancelEdit();
      fetchBlogPosts();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update post.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/followerApi/blogPosts/${id}`, {
        headers: { "x-auth-token": token },
      });
      alert("Post deleted.");
      fetchBlogPosts();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete post.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <Rss className="w-10 h-10 inline-block text-purple-600 mb-2" />
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600">Insights from FollowersCart team</p>
        </div>

        {user?.role === "admin" && (
          <div className="text-center mb-6">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              {showCreateForm ? "Cancel" : "Create Blog Post"}
            </button>
          </div>
        )}

        {showCreateForm && (
          <form
            onSubmit={handleNewPostSubmit}
            className="bg-white p-6 rounded-lg shadow mb-8 space-y-4"
          >
            {formMessage && (
              <div
                className={`p-3 rounded text-white ${
                  formMessage.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {formMessage.text}
              </div>
            )}
            <input
              type="text"
              placeholder="Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              required
              className="w-full border p-3 rounded"
            />
            <textarea
              placeholder="Content"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              required
              className="w-full border p-3 rounded h-40"
            ></textarea>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewPostImageFile(e.target.files[0])}
              className="w-full"
            />
            <button
              type="submit"
              disabled={formLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              {formLoading ? "Submitting..." : "Add Post"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="h-8 w-8 animate-spin inline-block text-purple-600" />
            <p className="mt-2">Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg p-5 shadow relative"
              >
                {editingPostId === post.id ? (
                  <form
                    onSubmit={(e) => handleUpdate(e, post.id)}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      className="w-full border p-2 rounded"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full border p-2 rounded h-32"
                      required
                    ></textarea>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditImageFile(e.target.files[0])}
                      className="w-full"
                    />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2">{post.snippet}</p>
                    <div className="text-gray-400 text-xs mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> {post.date}{" "}
                      <UserIcon className="h-4 w-4 ml-2" /> {post.author}
                    </div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-purple-600 font-medium hover:underline inline-flex items-center"
                    >
                      Read More <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>

                    {user?.role === "admin" && (
                      <div className="absolute top-3 right-3 flex gap-3">
                        <button onClick={() => handleEdit(post)} title="Edit">
                          <Pencil className="text-blue-600 hover:text-blue-800" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          title="Delete"
                        >
                          <Trash2 className="text-red-600 hover:text-red-800" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
