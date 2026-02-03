import React, { useState, useRef, useEffect } from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { Image02Icon, SmileIcon, SentIcon, Cancel01Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import API from "../../api/axios";
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const NewPost = ({ onPostCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);
  const [showFeelings, setShowFeelings] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const triggerRef = useRef(null);
  const feelingsRef = useRef(null);
  const { userInfo } = useSelector(state => state.user);

  // Standard feelings/emojis - 2x3 matrix
  const feelings = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😍', label: 'Loving' },
    { emoji: '😡', label: 'Angry' },
    { emoji: '😂', label: 'Funny' },
    { emoji: '😎', label: 'Cool' },
  ];

  const handleFeelingSelect = (feeling) => {
    setSelectedFeeling(feeling);
    setShowFeelings(false);
  };

  const removeFeeling = () => {
    setSelectedFeeling(null);
  };

  // Close feelings picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (feelingsRef.current && !feelingsRef.current.contains(event.target)) {
        setShowFeelings(false);
      }
    };

    if (showFeelings) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFeelings]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Store files for preview
    const previewPromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ file, preview: reader.result });
        reader.readAsDataURL(file);
      });
    });

    const previews = await Promise.all(previewPromises);
    setImages(prev => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!content.trim() && images.length === 0) {
      toast.error('Please add some content or images');
      return;
    }

    setIsPosting(true);
    setError(null);

    try {
      // Upload images first
      let uploadedImageUrls = [];
      if (images.length > 0) {
        const uploadPromises = images.map(async (imageData) => {
          const formData = new FormData();
          formData.append('file', imageData.file);
          
          const uploadRes = await API.post('/upload/single', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          console.log('Upload response:', uploadRes.data);
          console.log('File object:', uploadRes.data.file);

          // Cloudinary returns the file object with url property
          const imageUrl = uploadRes.data.file?.url || uploadRes.data.file?.secure_url || uploadRes.data.file?.path;
          console.log('Extracted URL:', imageUrl);

          if (!imageUrl) {
            console.error('No image URL found in response:', uploadRes.data);
            throw new Error('Failed to get image URL from upload response');
          }

          return imageUrl;
        });
        
        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      const postData = {
        content,
        images: uploadedImageUrls,
        feeling: selectedFeeling ? { emoji: selectedFeeling.emoji, label: selectedFeeling.label } : null
      };

      console.log('Creating post with data:', postData);

      const postResponse = await API.post("/post/create", postData);
      console.log('Post creation response:', postResponse.data);

      setContent("");
      setImages([]);
      setSelectedFeeling(null);
      setIsOpen(false);
      toast.success('Post created successfully!');

      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error("Failed to create post:", err);
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  const isPostDisabled = isPosting || (!content.trim() && images.length === 0);

  return (
    <>
      {/* Clean Post Trigger */}
      <div
        className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-color)] cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
        onClick={() => setIsOpen(true)}
        ref={triggerRef}
      >
        <div className="flex items-center gap-3">
          {userInfo?.avatar ? (
            <img src={userInfo.avatar} alt="User" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-secondary)] font-semibold">
              {userInfo?.name?.[0] || "U"}
            </div>
          )}

          <div className="flex-1 text-[var(--text-tertiary)]">
            What's on your mind, {userInfo?.name?.split(" ")[0]}?
          </div>

          <div 
            className="aspect-square p-2 text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors duration-200 cursor-pointer flex items-center justify-center"
          >
            <HugeiconsIcon icon={Edit02Icon} size={20} />
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Card */}
          <div
            className="bg-[var(--bg-card)] rounded-2xl w-full max-w-lg sm:max-w-xl lg:max-w-2xl max-h-[85vh] sm:max-h-[600px] overflow-hidden flex flex-col shadow-xl border border-[var(--border-color)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-semibold text-[var(--text-main)]">Create Post</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--border-hover)]"
                aria-label="Close"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={20} className="text-[var(--text-secondary)]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-5 space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* User & Textarea */}
                <div className="flex gap-3">
                  {userInfo?.avatar ? (
                    <img 
                      src={userInfo.avatar} 
                      alt="User" 
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-secondary)] font-semibold text-sm flex-shrink-0">
                      {userInfo?.name?.[0] || "U"}
                    </div>
                  )}
                  <div className="flex-1">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={`What's on your mind, ${userInfo?.name}?`}
                      className="w-full min-h-[120px] sm:min-h-[150px] max-h-[300px] p-0 border-none text-[15px] text-[var(--text-main)] placeholder-[var(--text-tertiary)] bg-transparent resize-none focus:outline-none"
                      autoFocus
                    />
                    {/* Selected Feeling Badge */}
                    {selectedFeeling && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-hover)] rounded-full text-sm">
                          <span>{selectedFeeling.emoji}</span>
                          <span className="text-[var(--text-secondary)]">{selectedFeeling.label}</span>
                          <button
                            onClick={removeFeeling}
                            className="ml-1 hover:bg-[var(--bg-active)] rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--border-hover)]"
                            aria-label="Remove feeling"
                          >
                            <HugeiconsIcon icon={Cancel01Icon} size={12} className="text-[var(--text-secondary)]" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className={`grid gap-3 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {images.map((imageData, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border border-[var(--border-color)]">
                        <img
                          src={imageData.preview || imageData}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-[var(--bg-card)]/95 hover:bg-[var(--bg-card)] text-[var(--text-main)] p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--border-hover)]"
                          aria-label="Remove image"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--border-color)] px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <label className="px-3 py-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-main)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--border-hover)]">
                    <HugeiconsIcon icon={Image02Icon} size={18} />
                    <span className="text-sm">Photo</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="relative" ref={feelingsRef}>
                    <button 
                      onClick={() => setShowFeelings(!showFeelings)}
                      className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--border-hover)] ${
                        showFeelings ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]'
                      }`}
                      aria-label="Add feeling"
                    >
                      <HugeiconsIcon icon={SmileIcon} size={18} />
                      <span className="text-sm">Feeling</span>
                    </button>

                    {/* Feelings Picker - Fixed overflow */}
                    {showFeelings && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl p-3 w-64 z-50">
                        <div className="grid grid-cols-3 gap-3">
                          {feelings.map((feeling, index) => (
                            <button
                              key={index}
                              onClick={() => handleFeelingSelect(feeling)}
                              className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[var(--border-hover)]"
                              title={feeling.label}
                            >
                              <span className="text-2xl">{feeling.emoji}</span>
                              <span className="text-xs text-[var(--text-tertiary)] truncate w-full text-center">{feeling.label}</span>
                  </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Button */}
                <button
                  onClick={handlePost}
                  disabled={isPostDisabled}
                  className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--border-hover)] ${
                    isPostDisabled
                      ? 'bg-[var(--bg-hover)] text-[var(--text-tertiary)] cursor-not-allowed'
                      : 'bg-[var(--primary)] dark:bg-[var(--accent)] text-white dark:text-[var(--bg-main)] hover:bg-[var(--primary-hover)] dark:hover:opacity-90'
                    }`}
                >
                  {isPosting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Posting...
                    </span>
                  ) : (
                    'Post'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewPost;