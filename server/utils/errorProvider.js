export const errorCatalogue = {
  // Auth Errors
  INVALID_CREDENTIALS: { 
    message: "Invalid email or password.",
    statusCode: 401 
  },
  EMAIL_ALREADY_EXISTS: {
    message: "Email already exists, try logging in.",
    statusCode: 400
  },
  UNAUTHORIZED: {
    message: "Unauthorized access.",
    statusCode: 403
  },
  EMAIL_IN_USE: {
    message: "Email already in use.",
    statusCode: 400
  },

  //invalid or expired token.
  AUTH_FAILED: {
    message: "your session has expired, please login again.",
    statusCode: 401
  }, 
  INVALID_TOKEN: {
    message: "Invalid token",
    statusCode: 401
  },
  ACCOUNT_LOCKED: {
    message: "Account is locked",
    statusCode: 423
  },


   // User Errors

  USER_NOT_FOUND: {
     message: "User not found.",
     statusCode: 404
   },
  USER_NAME_TAKEN: {
    message: "Username is already taken.",
    statusCode: 400
  },
  PROFILE_UPDATE_FAILED: {
    message: "Failed to update profile.",
    statusCode: 500
  },
  INVALID_USER_ID: {
    message: "Invalid user ID.",
    statusCode: 400
  },

  // Post Errors
  POST_NOT_FOUND: {
    message: "Post not found.",
    statusCode: 404
  },
  POST_CREATION_FAILED: {
    message: "Failed to create post.",
    statusCode: 500
  },
  POST_DELETION_FAILED: {
    message: "Failed to delete post.",
    statusCode: 500
  },
  INVALID_POST_ID: {
    message: "Invalid post ID.",
    statusCode: 400
  },

  // Comment Errors
  COMMENT_NOT_FOUND: {
    message: "Comment no longer exists.",
    statusCode: 404
  },
  COMMENT_CREATION_FAILED: {
    message: "Failed to add your comment.",
    statusCode: 500
  },
  COMMENT_DELETION_FAILED: {
    message: "Failed to delete your comment.",
    statusCode: 500
  },
  INVALID_COMMENT_ID: {
    message: "Invalid comment ID.",
    statusCode: 400
  },

  // Notification Errors
  NOTIFICATION_NOT_FOUND: {
    message: "Notification not found, or already read.",
    statusCode: 404
  },
  NOTIFICATION_CREATION_FAILED: {
    message: "Failed to create notification.",
    statusCode: 500
  },

  // File Upload Errors
  FILE_UPLOAD_FAILED: {
    message: "File upload failed. Please try again.",
    statusCode: 500
  },
  INVALID_FILE_TYPE: {
    message: "Invalid file type. Allowed types are jpg, png, jpeg, gif",
    statusCode: 400
  },
  FILE_TOO_LARGE: {
    message: "File size exceeds the allowed limit.",
    statusCode: 413
  },
  FILE_NOT_FOUND: {
    message: "File not found.",
    statusCode: 404
  },

  // Common Errors
  SERVER_ERROR: {
    message: "An unexpected error occurred. Please try again later.",
    statusCode: 500
  },
  BAD_REQUEST: {
    message: "Bad request. Please check your input.",
    statusCode: 400
  },
  }


  export const customError = (code, extra = null) => {
    const errorObj = errorCatalogue[code] || errorCatalogue.SERVER_ERROR;
    const error = new Error(errorObj.message);
    error.code = code;
    error.status = errorObj.statusCode;
    error.extra = extra;
    return error;
  }

