import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  Info,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { NotificationItem } from '../../types/clinical';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useData();
  const { role } = useAuth();
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4 text-[#A23A2C]" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#C2801F]" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const handleNotificationClick = (n: NotificationItem) => {
    // 1. Mark as read in local mock state
    markNotificationAsRead(n.id);

    // 2. Navigate to relevant mock screen / study dossier
    if (n.studyCode) {
      // Direct navigation to the universally accessible study dossier
      navigate(`/studies/${n.studyCode}`);
    } else if (n.link) {
      // If user's role has permission to access the link, open it; otherwise fallback to study or portal
      if (role && n.link.startsWith(`/${role}`)) {
        navigate(n.link);
      } else if (role) {
        navigate(`/${role}`);
      }
    }
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-12 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Popover Header */}
      <div className="p-3.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-sm text-slate-900">Notifications</span>
          {unreadCount > 0 ? (
            <span className="bg-[#A23A2C] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {unreadCount} unread
            </span>
          ) : (
            <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
              All caught up
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="text-[11px] text-[#1F3A34] hover:text-[#C2801F] hover:underline font-semibold cursor-pointer"
            >
              Mark all as read
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
            title="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3.5 py-1.5 bg-white border-b border-slate-100 flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-[#1F3A34] text-white font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
            filter === 'unread'
              ? 'bg-[#1F3A34] text-white font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-84 overflow-y-auto divide-y divide-slate-100">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-60" />
            <p className="font-semibold text-slate-600">No {filter === 'unread' ? 'unread' : ''} notifications</p>
            <p className="text-[11px] text-slate-400 mt-0.5">All clinical updates have been reviewed</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 text-left relative group ${
                !n.read ? 'bg-[#fdf8ed]/60' : 'bg-white'
              }`}
            >
              {/* Type Icon */}
              <div className="mt-0.5 shrink-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    n.type === 'urgent'
                      ? 'bg-rose-50 border border-rose-200'
                      : n.type === 'warning'
                      ? 'bg-amber-50 border border-amber-200'
                      : n.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  {getIcon(n.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h4
                    className={`text-xs leading-snug truncate ${
                      !n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
                    }`}
                  >
                    {n.title}
                  </h4>
                  {!n.read && (
                    <span
                      className="w-2 h-2 rounded-full bg-[#C2801F] shrink-0 mt-1"
                      title="Unread notification"
                    ></span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>

                {/* Footer Badges & Actions */}
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {n.studyCode && (
                      <span className="font-code text-slate-700 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                        {n.studyCode}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      {n.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!n.read && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markNotificationAsRead(n.id);
                        }}
                        className="text-[10px] font-semibold text-[#1F3A34] hover:text-[#C2801F] flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-slate-100"
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3" />
                        <span>Read</span>
                      </button>
                    )}

                    <span className="text-[10px] font-semibold text-[#1F3A34] group-hover:text-[#C2801F] flex items-center gap-0.5">
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Popover Footer */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center flex items-center justify-between px-4">
        <span className="text-[10px] text-slate-400 font-medium">
          Local Mock Notification State
        </span>
        <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Real-Time Sync
        </span>
      </div>
    </div>
  );
};
