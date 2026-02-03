import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId })
      .populate("senderId", "name username avatar")
      .populate("postId", "content")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (id === "all") {
      await Notification.updateMany({ userId, read: false }, { read: true });
      return res.status(200).json({ message: "All notifications marked as read" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (id === "all") {
      await Notification.deleteMany({ userId });
      return res.status(200).json({ message: "All notifications deleted" });
    }

    const notification = await Notification.findOneAndDelete({ _id: id, userId });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
