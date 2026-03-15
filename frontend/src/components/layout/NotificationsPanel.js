import React, { useEffect, useState } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import notificationService from "../../services/notificationService";
import Spinner from "../common/Spinner";
import {
  BellIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");


export default function NotificationsPanel({ onClose }) {

const { notifications, unreadCount, loading: contextLoading, error, markAllAsRead, refreshNotifications, clearError } =
useNotifications();
const navigate = useNavigate();
const [loading, setLoading] = useState(false);

  const handleNotificationClick = async (notification) => {
    try {
      setLoading(true);
      if (!notification.read) {
        await notificationService.markOneAsRead(notification._id);
        refreshNotifications();
      }
      
      onClose();
      
      if (notification.post && notification.post._id) {
        navigate(`/posts/${notification.post._id}`);
      } else if (notification.group && notification.group._id) {
        navigate(`/groups/${notification.group._id}`);
      } else {
        navigate('/notifications');
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      onClose();
      navigate('/notifications');
    } finally {
      setLoading(false);
    }
  };

  const getNotificationText = (n) => {
    if (!n || !n.type) {
      return (
        <>
          <strong className="font-semibold text-on-surface">System</strong>{" "}
          <span className="text-muted">sent you a notification</span>
        </>
      );
    }

    let content = "";
    switch (n.type) {
      case "new_like":
        content = `liked your post${n.post?.title ? `: "${n.post.title}"` : ""}`;
        break;
      case "new_comment":
        content = `commented on your post${n.post?.title ? `: "${n.post.title}"` : ""}`;
        break;
      case "new_post":
        content = `created a new post${n.post?.title ? `: "${n.post.title}"` : ""}`;
        break;
      case "mention_comment":
        content = `mentioned you in a comment${n.post?.title ? ` on "${n.post.title}"` : ""}`;
        break;
      case "mention_chat":
        content = `mentioned you in the group${n.group?.name ? `: "${n.group.name}"` : ""}`;
        break;
      case "new_group_message":
        content = `sent a message in the group${n.group?.name ? `: "${n.group.name}"` : ""}`;
        break;
      default:
        content = "sent you a new notification.";
    }
    return (
      <>
        <strong className="font-semibold text-on-surface">
          {n.sender?.fullName || "Someone"}
        </strong>{" "}
        <span className="text-muted">{content}</span>
      </>
    );
  };

  const getNotificationIcon = (type) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case "new_like":
        return <HeartIcon className={`${iconClass} text-red-400`} />;
      case "new_comment":
        return <ChatBubbleLeftIcon className={`${iconClass} text-primary`} />;
      case "new_post":
        return <DocumentTextIcon className={`${iconClass} text-green-400`} />;
      case "mention_comment":
        return <ChatBubbleLeftIcon className={`${iconClass} text-secondary`} />;
      case "mention_chat":
        return <UserGroupIcon className={`${iconClass} text-primary-light`} />;
      case "new_group_message":
        return <ChatBubbleLeftIcon className={`${iconClass} text-primary`} />;
      default:
        return <BellIcon className={`${iconClass} text-muted`} />;
    }
  };

  return (
    <div className="absolute right-0 z-20 mt-2 w-72 sm:w-80 lg:w-96 origin-top-right rounded-xl bg-surface shadow-2xl border border-white/10 focus:outline-none overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/10 p-3 sm:p-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <h3 className="font-bold text-base sm:text-lg text-on-surface">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full min-w-[18px] sm:min-w-[20px] text-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={async () => {
                  try {
                    await markAllAsRead();
                  } catch (error) {
                    console.error('Failed to mark all as read:', error);
                  }
                }}
                className="text-primary/80 hover:text-primary text-xs sm:text-sm font-medium hover:underline transition-colors duration-200"
              >
                Mark All Read
              </button>
            )}
            <Link
              to="/notifications"
              onClick={onClose}
              className="text-primary/80 hover:text-primary text-xs sm:text-sm font-medium hover:underline transition-colors duration-200"
            >
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {contextLoading ? (
          <div className="flex justify-center py-6 sm:py-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <div className="text-red-400 text-sm mb-2">{error}</div>
            <button
              onClick={() => {
                clearError();
                refreshNotifications();
              }}
              className="text-primary hover:text-primary-light text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-white/5">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification._id}
                className={`p-3 sm:p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <img
                      src={
                        notification.sender?.profilePicture?.startsWith("http")
                          ? notification.sender.profilePicture
                          : notification.sender?.profilePicture && notification.sender.profilePicture !== "no-photo.jpg"
                          ? `${API_URL}${notification.sender.profilePicture}`
                          : `https://ui-avatars.com/api/?name=${notification.sender?.fullName || 'User'}&background=f5a623&color=080808`
                      }
                      alt={notification.sender?.fullName || 'User'}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-white/10"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base text-on-surface font-medium line-clamp-2">
                          {getNotificationText(notification)}
                        </p>
                        <p className="text-xs sm:text-sm text-muted mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                      notification.read ? 'bg-white/10' : 'bg-primary'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <div className="text-3xl sm:text-4xl mb-2">🔔</div>
            <p className="text-muted text-sm sm:text-base">No notifications yet</p>
            <p className="text-muted text-xs sm:text-sm mt-1">We'll notify you when something happens</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 5 && (
        <div className="border-t border-white/10 p-3 sm:p-4">
          <Link
            to="/notifications"
            onClick={onClose}
            className="block text-center text-sm text-primary hover:text-primary-light font-medium transition-colors"
          >
            View all {notifications.length} notifications
          </Link>
        </div>
      )}
    </div>
  );
}
