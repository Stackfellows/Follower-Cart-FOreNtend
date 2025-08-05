import React, { useEffect, useState } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Info as InfoIcon,
  Eye, // For vision icon
  Edit, // For edit icon
  Loader2, // For loading spinner
  XCircle, // For error icon
  CheckCircle, // For success icon
} from "lucide-react";
import axios from "axios"; // Axios import for API calls

const OwnerProfile = () => {
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({
    // State for editable form data
    name: "",
    email: "",
    phoneNumber: "",
    location: "",
    title: "",
    bio: "",
    vision: "",
  });
  const [profileImageFile, setProfileImageFile] = useState(null); // State for selected image file
  const [message, setMessage] = useState(""); // For success/error messages after update

  // Function to fetch owner profile data
  const fetchOwnerProfile = async () => {
    setLoading(true);
    setError(null);
    setMessage(""); // Clear messages on fetch
    try {
      // No token needed for GET ownerProfile (as per current backend route setup)
      const res = await axios.get(
        "http://localhost:5000/followerApi/ownerProfile"
      );
      setOwnerData(res.data.owner);
      // Initialize formData with fetched data for editing
      setFormData({
        name: res.data.owner.name || "",
        email: res.data.owner.email || "",
        phoneNumber: res.data.owner.phoneNumber || "",
        location: res.data.owner.location || "",
        title: res.data.owner.title || "",
        bio: res.data.owner.bio || "",
        vision: res.data.owner.vision || "",
      });
    } catch (err) {
      console.error("Error fetching owner profile:", err);
      setError(err.response?.data?.msg || "Failed to fetch owner profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProfileImageFile(e.target.files[0]);
  };

  // Function to handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear previous messages
    setError(null); // Clear previous errors

    try {
      const token = localStorage.getItem("token"); // <--- CRUCIAL: GET THE TOKEN FROM LOCAL STORAGE

      if (!token) {
        setMessage(
          "Error: You are not logged in. Please log in to update your profile."
        );
        setError("Authorization error.");
        setLoading(false);
        return;
      }

      // Create FormData object for sending both text data and the file
      const dataToSend = new FormData();
      for (const key in formData) {
        dataToSend.append(key, formData[key]);
      }
      if (profileImageFile) {
        dataToSend.append("profileImage", profileImageFile);
      }

      const config = {
        headers: {
          // IMPORTANT: When sending FormData with a file, Axios sets Content-Type automatically.
          // Do NOT manually set 'Content-Type': 'multipart/form-data' here.
          // Just set x-auth-token.
          "x-auth-token": token, // <--- CRUCIAL: ATTACH THE TOKEN HERE!
        },
      };

      const res = await axios.patch(
        "http://localhost:5000/followerApi/ownerProfile",
        dataToSend, // Send FormData
        config
      );

      setOwnerData(res.data.owner); // Update local state with updated owner data
      setMessage(res.data.msg); // Display success message
      setIsEditing(false); // Exit edit mode
      setProfileImageFile(null); // Clear selected file after successful upload
      fetchOwnerProfile(); // Re-fetch to ensure all data is consistent
    } catch (err) {
      console.error(
        "Error updating owner profile:",
        err.response ? err.response.data : err
      );
      setError(err.response?.data?.msg || "Failed to update profile.");
      setMessage("Update failed!"); // Display failure message
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        <p className="ml-3 text-lg text-gray-700">Loading owner profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600">
        <XCircle className="h-12 w-12 mb-4" />
        <p className="text-xl font-semibold">Error: {error}</p>
        <button
          onClick={fetchOwnerProfile}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!ownerData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-700">
        <p className="text-xl font-semibold">No owner data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        {/* Messages */}
        {message && (
          <div
            className={`p-4 mb-4 rounded-lg flex items-center ${
              error ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
            role="alert"
          >
            {error ? (
              <XCircle className="h-5 w-5 mr-3" />
            ) : (
              <CheckCircle className="h-5 w-5 mr-3" />
            )}
            <div>{message}</div>
          </div>
        )}

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start mb-8 pb-8 border-b border-gray-200">
          <div className="relative mb-6 md:mb-0 md:mr-8">
            <img
              src={
                profileImageFile
                  ? URL.createObjectURL(profileImageFile)
                  : ownerData.profileImageUrl
              }
              alt="Owner Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-purple-500 shadow-lg"
            />
            {isEditing && (
              <label
                htmlFor="profileImageInput"
                className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer shadow-md hover:bg-purple-700 transition-colors"
              >
                <Edit className="h-5 w-5 text-white" />
                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
          <div className="text-center md:text-left flex-grow">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-3xl font-bold text-gray-900 mb-2 w-full p-2 border rounded-md"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {ownerData.name}
              </h1>
            )}
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="text-xl text-purple-700 mb-4 w-full p-2 border rounded-md"
              />
            ) : (
              <p className="text-xl text-purple-700 mb-4">{ownerData.title}</p>
            )}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 text-white px-6 py-2 rounded-full flex items-center justify-center mx-auto md:mx-0 shadow-md hover:bg-purple-700 transition-colors"
              >
                <Edit className="h-5 w-5 mr-2" /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Mail className="h-6 w-6 text-purple-600 mr-2" /> Contact
            Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
            <div className="flex items-center text-gray-700">
              <Mail className="h-5 w-5 text-gray-500 mr-3" />
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                <span>{ownerData.email}</span>
              )}
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="h-5 w-5 text-gray-500 mr-3" />
              {isEditing ? (
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                <span>{ownerData.phoneNumber}</span>
              )}
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="h-5 w-5 text-gray-500 mr-3" />
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                <span>{ownerData.location}</span>
              )}
            </div>
            <div className="flex items-center text-gray-700">
              <Briefcase className="h-5 w-5 text-gray-500 mr-3" />
              <span>{ownerData.title}</span>{" "}
              {/* Display title from ownerData */}
            </div>
          </div>
        </div>

        {/* About Me Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <InfoIcon className="h-6 w-6 text-purple-600 mr-2" /> About Me
          </h2>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="5"
              className="w-full p-2 border rounded-md resize-y"
            ></textarea>
          ) : (
            <p className="text-gray-700 leading-relaxed">{ownerData.bio}</p>
          )}
        </div>

        {/* My Vision Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Eye className="h-6 w-6 text-purple-600 mr-2" /> My Vision
          </h2>
          {isEditing ? (
            <textarea
              name="vision"
              value={formData.vision}
              onChange={handleChange}
              rows="5"
              className="w-full p-2 border rounded-md resize-y"
            ></textarea>
          ) : (
            <p className="text-gray-700 leading-relaxed">{ownerData.vision}</p>
          )}
        </div>

        {isEditing && (
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={() => {
                setIsEditing(false);
                setMessage(""); // Clear messages on cancel
                setError(null); // Clear errors on cancel
                // Reset formData to original ownerData if edit is cancelled
                setFormData({
                  name: ownerData.name || "",
                  email: ownerData.email || "",
                  phoneNumber: ownerData.phoneNumber || "",
                  location: ownerData.location || "",
                  title: ownerData.title || "",
                  bio: ownerData.bio || "",
                  vision: ownerData.vision || "",
                });
                setProfileImageFile(null); // Clear selected file
              }}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerProfile;
