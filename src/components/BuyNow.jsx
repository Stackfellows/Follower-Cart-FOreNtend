import React, { useState, useEffect, useMemo } from "react";
import { ShoppingCart, CheckCircle, XCircle, Info } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

// USD to PKR conversion rate (for consistency across the app)
const USD_TO_PKR = 278;

// Helper function to define service-specific packages
const getServicePackages = (currentService, USD_TO_PKR_RATE) => {
  // Define all possible packages for various services
  const allServicePackages = {
    // Default/Generic Followers packages (if no specific platform is given for followers)
    Followers: [
      {
        id: 0,
        amountDisplay: "100",
        amountValue: 100,
        priceUSD: 0.5,
        popular: false,
        warranty: "30-day refill",
      },
      {
        id: 1,
        amountDisplay: "500",
        amountValue: 500,
        priceUSD: 1.5,
        popular: true,
        warranty: "30-day refill",
      },
      {
        id: 2,
        amountDisplay: "1K",
        amountValue: 1000,
        priceUSD: 4,
        popular: false,
        warranty: "30-day refill",
      },
      {
        id: 3,
        amountDisplay: "2.5K",
        amountValue: 2500,
        priceUSD: 10,
        popular: false,
        warranty: "30-day refill",
      },
      {
        id: 4,
        amountDisplay: "5K",
        amountValue: 5000,
        priceUSD: 20,
        popular: false,
        warranty: "30-day refill",
      },
      {
        id: 5,
        amountDisplay: "10K",
        amountValue: 10000,
        priceUSD: 40,
        popular: false,
        warranty: "30-day refill",
      },
    ], // Specific Instagram services (assuming these are distinct from generic "Followers", "Likes", "Comments")
    "Instagram Followers": [
      {
        id: 0,
        amountDisplay: "1K",
        amountValue: 1000,
        priceUSD: 3.06,
        popular: true,
        warranty: "Lifetime",
      }, // Updated price
    ],
    "Instagram Likes": [
      {
        id: 0,
        amountDisplay: "1K",
        amountValue: 1000,
        priceUSD: 2.88,
        popular: true,
        warranty: "Lifetime",
      }, // Updated price
    ],
    "Instagram Comments": [
      {
        id: 0,
        amountDisplay: "1K",
        amountValue: 1000,
        priceUSD: 3.6,
        popular: true,
        warranty: "Lifetime",
      }, // Updated price
    ], // YouTube services
    "YouTube Watch Time": [
      {
        id: 0,
        amountDisplay: "4K Hours",
        amountValue: 4000,
        priceUSD: 14.39,
        popular: true,
        warranty: "Lifetime",
      }, // Updated price
    ],
    "YouTube Subscribers": [
      {
        id: 0,
        amountDisplay: "1K",
        amountValue: 1000,
        priceUSD: 7.19,
        popular: true,
        warranty: "Lifetime",
      }, // Updated price
    ], // TikTok services
    "TikTok Likes": [
      {
        id: 0,
        amountDisplay: "1K",
        amountValue: 1000,
        priceUSD: 2.52,
        popular: true,
        warranty: "Lifetime",
      }, // Updated price
    ],
    "TikTok Comments": [
      {
        id: 0,
        amountDisplay: "1K",
        amountValue: 1000,
        priceUSD: 3.6,
        popular: true,
        warranty: "Lifetime",
      }, // Updated price
    ],
    "TikTok Followers": [
      {
        id: 0,
        amountDisplay: "1K",
        amountValue: 1000,
        priceUSD: 5.04,
        popular: true,
        warranty: "Lifetime",
      }, // Updated price
    ], // Facebook services
    "Facebook Page Watch Time": [
      {
        id: 0,
        amountDisplay: "6K Hours",
        amountValue: 6000,
        priceUSD: 7.19,
        popular: true,
        warranty: "Lifetime",
      }, // Updated price
    ],
    "Facebook Followers": [
      {
        id: 0,
        amountDisplay: "1K",
        amountValue: 1000,
        priceUSD: 5.4,
        popular: true,
        warranty: "Lifetime",
      }, // Updated price
    ], // Fallback for "Other" or unknown services not explicitly listed
    Other: [
      {
        id: 0,
        amountDisplay: "Custom Amount",
        amountValue: 1,
        priceUSD: 1,
        popular: false,
        warranty: "None",
      },
    ],
  }; // Return the packages for the current service. // If the specific service is not found, default to "Followers" packages. // If "Followers" itself is not found (shouldn't happen with this setup), default to "Other".

  return (
    allServicePackages[currentService] ||
    allServicePackages["Followers"] ||
    allServicePackages["Other"]
  );
};

// Helper component for input fields, wrapped with React.memo for optimization
const InputField = React.memo(
  ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    isRequired = true,
    error, // Directly pass the error for this field
    description, // New prop for additional description
  }) => {
    return (
      <div className="space-y-2">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        {description && (
          <p className="text-gray-500 text-sm mt-1">{description}</p>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-1 animate-pulse">{error}</p>
        )}
      </div>
    );
  }
);

const BuyNow = ({ user, service = "Followers", platform = "Instagram" }) => {
  const [selectedPackage, setSelectedPackage] = useState(null); // Initialize to null
  const [showForm, setShowForm] = useState(false); // New state for form visibility

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postLink, setPostLink] = useState("");
  const [profileLink, setProfileLink] = useState("");
  const [socialId, setSocialId] = useState("");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const packages = useMemo(
    () => getServicePackages(service, USD_TO_PKR),
    [service, USD_TO_PKR]
  );

  // Helper to determine if the current service requires a post link
  const requiresPostLink = useMemo(() => {
    const servicesThatNeedPostLink = [
      "Likes",
      "Comments",
      "Views",
      "Reels Views",
      "Story Views",
      "Live Stream",
      "Shares",
      "Watch Time",
    ];
    return servicesThatNeedPostLink.some((s) => service.includes(s));
  }, [service]);

  useEffect(() => {
    // Ensure selectedPackage is reset or validated when 'packages' array changes
    if (selectedPackage === null || selectedPackage >= packages.length) {
      setSelectedPackage(null); // Reset to no selection
      setShowForm(false); // Hide form if package selection becomes invalid
    }
  }, [packages, selectedPackage]);

  useEffect(() => {
    // Prioritize reorderData if available
    if (location.state && location.state.reorderData) {
      const { reorderData } = location.state;
      setName(reorderData.name || "");
      setEmail(reorderData.email || "");
      setPhoneNumber(reorderData.phoneNumber || "");
      setPostLink(reorderData.postLink || "");
      setProfileLink(reorderData.profileLink || "");
      setSocialId(reorderData.socialId || "");

      const pkgIndex = packages.findIndex(
        (pkg) => pkg.amountValue === reorderData.amount
      );
      if (pkgIndex !== -1) {
        setSelectedPackage(pkgIndex);
        setShowForm(true); // Show form if reorder data is present
      } else {
        setSelectedPackage(0); // Default to first package
        setShowForm(true); // Show form even if exact package not found
        setSubmissionMessage({
          type: "info",
          text: "Reorder amount not found in packages. Defaulting to first package.",
        });
      }
      setSubmissionMessage({
        type: "info",
        text: "Form pre-filled for reorder.",
      });
    } else if (user) {
      // If no reorderData, but user is logged in, pre-fill from user data
      setName(user.name || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      // Do not show form automatically, user still needs to select package
      setSubmissionMessage({
        type: "info",
        text: "Form pre-filled with your user information. Please select a package.",
      });
    }
  }, [location.state, user, packages]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address format (e.g., user@example.com)";
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^(\+92|0|92)?[0-9]{10}$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber =
        "Invalid Pakistani phone number format (e.g., +923XX-XXXXXXX or 03XX-XXXXXXX)";
    }

    // Regex for robust URL validation, ensuring https and a domain
    const urlRegex =
      /^(https:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/i;

    if (!profileLink.trim()) {
      newErrors.profileLink = "Profile link is required";
    } else {
      // Per user request, removed specific URL validation for profileLink.
      // Any non-empty string is now accepted as a valid profile link.
      // If further validation is needed in the future, it can be re-added here.
    }

    // Only validate post link if the service requires it
    if (requiresPostLink) {
      if (!postLink.trim()) {
        newErrors.postLink = "Post link is required for this service.";
      } else {
        let postLinkSpecificRegex;
        switch (platform.toLowerCase()) {
          case "instagram":
            postLinkSpecificRegex =
              /^(https:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[a-zA-Z0-9_-]+\/?.*)$/i; // Added reel/tv
            break;
          case "youtube":
            // User requested to remove this validation logic.
            // Any non-empty string for postLink will now be accepted for YouTube.
            break;
          case "tiktok":
            postLinkSpecificRegex =
              /^(https:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9_.]+\/video\/[0-9]+\/?)$/i;
            break;
          case "facebook":
            postLinkSpecificRegex =
              /^(https:\/\/(www\.)?facebook\.com\/(photo|video|posts|watch)\/[a-zA-Z0-9_.-]+\/?.*)$/i; // Added watch
            break;
          default:
            postLinkSpecificRegex = urlRegex; // Fallback to generic URL validation
            break;
        }
        // Only apply regex test if postLinkSpecificRegex was defined (i.e., not for YouTube where it's intentionally removed)
        if (
          postLinkSpecificRegex &&
          !postLinkSpecificRegex.test(postLink.trim())
        ) {
          newErrors.postLink = `Invalid ${platform} post link format. Please include https:// and ensure it's a valid ${platform} post URL.`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePackageSelect = (pkgId) => {
    setSelectedPackage(pkgId);
    setShowForm(true); // Show the form when a package is selected
    setErrors({}); // Clear any previous form errors when a new package is selected
    setSubmissionMessage(null); // Clear submission messages

    // Optional: Scroll to the form section smoothly
    setTimeout(() => {
      document
        .getElementById("buy-form-section")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handlePurchase = async () => {
    setSubmissionMessage(null);

    // Ensure a package is selected before validating and submitting
    if (selectedPackage === null) {
      setSubmissionMessage({
        type: "error",
        text: "Please select a package first.",
      });
      return;
    }

    const isValid = validateForm();
    if (!isValid) {
      setSubmissionMessage({
        type: "error",
        text: "Please fill in all required fields correctly.",
      });
      return;
    }

    setIsSubmitting(true);

    const selectedPkg = packages[selectedPackage];

    const data = {
      name,
      email,
      phoneNumber,
      postLink: postLink.trim(),
      profileLink: profileLink.trim(),
      requiredFollowers: selectedPkg.amountValue,
      platform,
      socialId: socialId.trim(),
      service,
      price: selectedPkg.priceUSD * USD_TO_PKR,
    };

    try {
      const res = await axios.post(
        "https://follower-cart-bacend1.onrender.com/followerApi/createOrder",
        data,
        { timeout: 15000 }
      );

      setSubmissionMessage({
        type: "success",
        text: `Order placed successfully! Order ID: ${res.data.id}. Redirecting to payment...`,
      });

      setTimeout(() => {
        navigate(`/payment/${res.data.id}`);
      }, 2500);
    } catch (error) {
      console.error("Error creating order:", error);
      let errorMessage =
        "Failed to create order. Please check your details and try again.";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage =
            error.response.data?.msg ||
            `Server Error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage =
            "No response from server. Please check your internet connection or try again later.";
        } else {
          errorMessage = error.message;
        }
        if (error.code === "ECONNABORTED") {
          errorMessage =
            "Request timed out. The server took too long to respond.";
        }
      }

      setSubmissionMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPostLinkPlaceholder = (platform) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return "https://instagram.com/p/yourpostid/";
      case "youtube":
        return "https://youtube.com/watch?v=yourvideoid";
      case "tiktok":
        return "https://tiktok.com/@yourusername/video/yourvideoid";
      case "facebook":
        return "https://facebook.com/yourpagename/posts/yourpostid";
      default:
        return `https://${platform.toLowerCase()}.com/postlink`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto w-full">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Buy {platform} {service}
          </h3>
          <p className="text-gray-600">
            Choose your package and boost your social presence.
          </p>
        </div>
        {submissionMessage && (
          <div
            className={`flex items-center justify-center p-4 rounded-lg text-white font-semibold mb-4 ${
              submissionMessage.type === "success"
                ? "bg-green-500"
                : submissionMessage.type === "info"
                ? "bg-blue-500"
                : "bg-red-500"
            }`}
          >
            {submissionMessage.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : submissionMessage.type === "info" ? (
              <Info className="h-5 w-5 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 mr-2" />
            )}
            {submissionMessage.text}
          </div>
        )}
        <div className="space-y-4 mb-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => handlePackageSelect(pkg.id)}
              className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedPackage === pkg.id
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center">
                <div>
                  <div className="font-semibold text-gray-900">
                    {pkg.amountDisplay}{" "}
                    {service.includes("Watch Time") ? "" : service}
                  </div>
                  {typeof pkg.amountValue === "number" &&
                    pkg.amountValue > 0 && (
                      <div className="text-sm text-gray-500">
                        ~USD{" "}
                        {((pkg.priceUSD / pkg.amountValue) * 1000).toFixed(2)}{" "}
                        per 1K
                      </div>
                    )}
                  {pkg.warranty && (
                    <div className="text-xs text-green-600 mt-1 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> {pkg.warranty}{" "}
                      Warranty
                    </div>
                  )}
                </div>
                <div className="text-left sm:text-right mt-2 sm:mt-0">
                  <div className="text-2xl font-bold text-purple-600">
                    USD {pkg.priceUSD.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    (PKR {(pkg.priceUSD * USD_TO_PKR).toFixed(0)})
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPackage === null && (
          <div className="text-center text-gray-500 mt-4 p-4 border border-blue-300 bg-blue-50 rounded-lg">
            <Info className="inline-block h-5 w-5 mr-2 text-blue-500" />
            Please select a package above to proceed with your order.
          </div>
        )}

        {showForm && selectedPackage !== null && (
          <div
            id="buy-form-section"
            className="space-y-4 mb-6 transition-all duration-500 ease-in-out opacity-100 transform translate-y-0"
            style={{
              transitionProperty: "opacity, transform",
              transitionTimingFunction: "ease-out",
            }}
          >
            <h4 className="text-xl font-semibold text-gray-800 pt-4">
              Your Details
            </h4>
            <InputField
              label="Your Full Name"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.name;
                  return newErrors;
                });
              }}
              placeholder="e.g., John Doe"
              isRequired={true}
              error={errors.name}
              description="Please enter your full name as you would like it to appear on your order."
            />
            <InputField
              label="Your Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.email;
                  return newErrors;
                });
              }}
              placeholder="e.g., yourname@example.com"
              isRequired={true}
              error={errors.email}
              description="We will send order confirmations and updates to this email address."
            />
            <InputField
              label="Your Phone Number"
              name="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.phoneNumber;
                  return newErrors;
                });
              }}
              placeholder="e.g., +923XX-XXXXXXX or 03XX-XXXXXXX"
              isRequired={true}
              error={errors.phoneNumber}
              description="Please provide a valid phone number including country code for order communication."
            />
            <InputField
              label={`${platform} Profile Link`}
              name="profileLink"
              type="url"
              value={profileLink}
              onChange={(e) => {
                setProfileLink(e.target.value);
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.profileLink;
                  return newErrors;
                });
              }}
              placeholder={`https://${platform.toLowerCase()}.com/yourusername`}
              isRequired={true}
              error={errors.profileLink}
            />

            {/* Conditionally rendered and dynamically labeled Post Link field */}
            {requiresPostLink && (
              <InputField
                label={`${platform} Post Link`}
                name="postLink"
                type="url"
                value={postLink}
                onChange={(e) => {
                  setPostLink(e.target.value);
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.postLink;
                    return newErrors;
                  });
                }}
                placeholder={getPostLinkPlaceholder(platform)}
                isRequired={true} // Now required for these specific services
                error={errors.postLink}
              />
            )}
            {/* End of dynamically rendered Post Link field */}

            <InputField
              label="Social Media Username/ID (Optional)"
              name="socialId"
              value={socialId}
              onChange={(e) => {
                setSocialId(e.target.value);
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.socialId;
                  return newErrors;
                });
              }}
              placeholder={`e.g., @yourusername or yourID`}
              isRequired={false}
              error={errors.socialId}
              description={`Optional: Your ${platform} username or ID. This can help us identify your profile if there are issues with the link.`}
            />
            <button
              onClick={handlePurchase}
              disabled={isSubmitting}
              className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" /> Buy Now - USD{" "}
                  {packages[selectedPackage]?.priceUSD?.toFixed(2) || "0.00"}
                  <span className="ml-2 text-sm opacity-80">
                    (PKR{" "}
                    {(
                      (packages[selectedPackage]?.priceUSD || 0) * USD_TO_PKR
                    ).toFixed(0)}
                    )
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>
            ✓ No password required{" "}
            {selectedPackage !== null &&
              packages[selectedPackage]?.warranty &&
              `✓ ${packages[selectedPackage].warranty} guarantee`}{" "}
            ✓ 24/7 support
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
