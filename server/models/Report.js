import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        enum: ['spam', 'harassment', 'inappropriate', 'violence', 'other'],
        default: 'other'
    },
    description: {
        type: String,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Prevent duplicate reports from same user on same post
reportSchema.index({ postId: 1, reporterId: 1 }, { unique: true });

export default mongoose.model('Report', reportSchema);
