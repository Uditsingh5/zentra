import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Cancel01Icon,
  Image02Icon,
  SmileIcon,
  SentIcon,
} from "@hugeicons/core-free-icons"

export default function NewPost({ triggerRef }) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState(null)

  // Get userId from Redux
  const userId = useSelector(state => state.user?.userInfo?.userId)

  // Listen for external trigger
  useEffect(() => {
    const handleClick = () => setIsOpen(true)
    
    if (triggerRef?.current) {
      triggerRef.current.addEventListener('click', handleClick)
    }

    return () => {
      triggerRef?.current?.removeEventListener('click', handleClick)
    }
  }, [triggerRef])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePost = async () => {
    console.log('=== handlePost called ===')
    console.log('userId:', userId)
    console.log('content:', content)
    console.log('images:', images.length)
    
    if (!content.trim() && images.length === 0) {
      console.log('No content or images')
      setError('Please add content or images')
      return
    }
    
    if (!userId) {
      console.log('No userId!')
      setError('Please log in first')
      return
    }

    setIsPosting(true)
    setError(null)

    try {
      const postData = {
        authorId: userId,
        content: content.trim(),
        attachments: images.length > 0 ? images : [],
      }

      console.log('Sending POST to http://localhost:8000/api/post/create')
      console.log('Payload:', postData)

      const response = await axios.post('http://localhost:8000/api/post/create', postData)
      
      console.log('Success:', response.data)
      setContent('')
      setImages([])
      setIsPosting(false)
      setIsOpen(false)
    } catch (err) {
      console.error('Error:', err)
      setError(err.response?.data?.message || 'Failed to create post. Please try again.')
      setContent('')
      setImages([])
      setIsPosting(false)
    }
  }

  const isPostDisabled = (!content.trim() && images.length === 0) || isPosting

  return (
    <>
      {/* Popup Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* Modal */}
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Create a New Post</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Text Area */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind? Share your thoughts, ideas, or updates..."
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none resize-none text-gray-900 placeholder-gray-500 font-medium"
                />

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover rounded-2xl"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

        
            <div className="border-t border-gray-100 bg-gray-50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-3">
                  
                  <label className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer group">
                    <HugeiconsIcon icon={Image02Icon} size={22} className="text-gray-600 group-hover:text-blue-500 transition-colors" />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

               
                  <button className="p-2 hover:bg-gray-200 rounded-full transition-colors group">
                    <HugeiconsIcon icon={SmileIcon} size={22} className="text-gray-600 group-hover:text-yellow-500 transition-colors" />
                  </button>
                </div>

                {/* Post Button */}
                <button
                  onClick={handlePost}
                  disabled={isPostDisabled}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                    isPostDisabled
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <HugeiconsIcon icon={SentIcon} size={18} />
                  {isPosting ? 'Posting...' : 'Post'}
                </button>
              </div>

              {/* Char Count */}
              <div className="text-sm text-gray-500 text-right">
                {content.length > 0 ? `${content.length} characters` : 'Start typing...'}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}