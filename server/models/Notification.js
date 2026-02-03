import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
    required: function() {
      return this.type !== 'follow'; // postId not required for follow notifications
    }
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'reply', 'follow'],
    required: true,
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
});

const Notification = mongoose.model('notification', notificationSchema);
export default Notification;