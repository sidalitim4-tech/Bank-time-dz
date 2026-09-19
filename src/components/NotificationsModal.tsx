import { FC, useState, useMemo } from 'react';
import { AppNotification, Volunteer, NotificationType } from '../types';
import {
  X,
  Bell,
  Clock,
  TreePine,
  Gift,
  Award,
  Megaphone,
  UserCheck,
  CheckCheck,
  Trash2,
  ExternalLink,
  Shield,
  Sparkles,
  Info,
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearAll: () => void;
  onNavigateTab: (tab: 'opportunities' | 'ledger' | 'perks' | 'certificates' | 'admin') => void;
  currentVolunteer: Volunteer | null;
  isAdminMode: boolean;
}

export const NotificationsModal: FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  onNavigateTab,
  currentVolunteer,
  isAdminMode,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'unread' | 'hours' | 'opportunity' | 'announcement'>('all');

  // Filter relevant notifications for current user persona
  const userRelevantNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      if (isAdminMode) {
        // Admin sees all administrative announcements, opportunities, hours verification, and general broadcasts
        return notif.targetRole === 'admin' || notif.targetVolunteerId === 'all' || notif.targetRole === 'all' || !notif.targetVolunteerId;
      }
      if (currentVolunteer) {
        // Volunteer sees their specific personal notifications + general announcements
        return (
          notif.targetVolunteerId === 'all' ||
          notif.targetRole === 'all' ||
          notif.targetVolunteerId === currentVolunteer.id ||
          notif.targetRole === 'volunteer' ||
          !notif.targetVolunteerId
        );
      }
      // Guest
      return notif.targetVolunteerId === 'all' || notif.targetRole === 'all' || !notif.targetVolunteerId;
    });
  }, [notifications, isAdminMode, currentVolunteer]);

  // Apply tab filters
  const filteredNotifications = useMemo(() => {
    return userRelevantNotifications.filter((n) => {
      if (activeCategory === 'unread') return !n.read;
      if (activeCategory === 'hours') return n.type === 'hours';
      if (activeCategory === 'opportunity') return n.type === 'opportunity';
      if (activeCategory === 'announcement') return n.type === 'announcement' || n.type === 'system';
      return true;
    });
  }, [userRelevantNotifications, activeCategory]);

  const unreadCount = userRelevantNotifications.filter((n) => !n.read).length;

  if (!isOpen) return null;

  const formatNotificationTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 2) return 'الآن';
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      if (diffDays === 1) return 'أمس';
      if (diffDays < 7) return `منذ ${diffDays} أيام`;
      return date.toLocaleDateString('ar-DZ', { month: 'short', day: 'numeric' });
    } catch {
      return 'مؤخراً';
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'hours':
        return {
          icon: Clock,
          bg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        };
      case 'opportunity':
        return {
          icon: TreePine,
          bg: 'bg-teal-100 text-teal-700 border-teal-200',
        };
      case 'perk':
        return {
          icon: Gift,
          bg: 'bg-amber-100 text-amber-700 border-amber-200',
        };
      case 'certificate':
        return {
          icon: Award,
          bg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        };
      case 'announcement':
        return {
          icon: Megaphone,
          bg: 'bg-purple-100 text-purple-700 border-purple-200',
        };
      case 'volunteer':
        return {
          icon: UserCheck,
          bg: 'bg-blue-100 text-blue-700 border-blue-200',
        };
      default:
        return {
          icon: Bell,
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">مركز الإشعارات والتنبيهات</h3>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    {unreadCount} جديد
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                تحديثات بنك الوقت، المبادرات الميدانية، واعتمادات الساعات
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Action Controls */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              الكل ({userRelevantNotifications.length})
            </button>
            <button
              onClick={() => setActiveCategory('unread')}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1 ${
                activeCategory === 'unread'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <span>غير المقروءة</span>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveCategory('hours')}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                activeCategory === 'hours'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              الساعات والرصيد
            </button>
            <button
              onClick={() => setActiveCategory('opportunity')}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                activeCategory === 'opportunity'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              المبادرات
            </button>
            <button
              onClick={() => setActiveCategory('announcement')}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                activeCategory === 'announcement'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              إعلانات الإدارة
            </button>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-xl transition flex items-center gap-1"
                title="تحديد جميع الإشعارات كمقروءة"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">قراءة الكل</span>
              </button>
            )}

            {userRelevantNotifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 px-2.5 py-1.5 rounded-xl transition flex items-center gap-1"
                title="مسح كل الإشعارات"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">مسح</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400 shadow-2xs">
                <Bell className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">لا توجد إشعارات في هذا التصنيف</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  ستصلك هنا كافة التنبيهات حول المبادرات المنشورة، واعتمادات الساعات، والتحديثات الإدارية الصادرة عن دار الشباب الروينة.
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const { icon: IconComponent, bg } = getNotificationIcon(notif.type);
              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.read) onMarkAsRead(notif.id);
                  }}
                  className={`pt-3 first:pt-0 pb-1 rounded-2xl transition-all cursor-pointer group flex items-start justify-between gap-3 ${
                    notif.read ? 'opacity-85 hover:opacity-100' : 'bg-amber-50/20 p-2.5'
                  }`}
                >
                  <div className="flex items-start gap-3 w-full">
                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${bg}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="space-y-1 flex-1 text-right">
                      <div className="flex items-center gap-2 flex-wrap justify-between">
                        <div className="flex items-center gap-1.5">
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 ring-2 ring-amber-200"></span>
                          )}
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            {notif.title}
                          </h4>
                        </div>

                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatNotificationTime(notif.timestamp)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        {notif.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            {notif.badge}
                          </span>
                        )}

                        {notif.linkTab && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!notif.read) onMarkAsRead(notif.id);
                              if (notif.linkTab) onNavigateTab(notif.linkTab);
                              onClose();
                            }}
                            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-0.5 rounded-md transition flex items-center gap-1"
                          >
                            <span>{notif.actionLabel || 'عرض التفاصيل'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Single Delete */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNotification(notif.id);
                    }}
                    className="text-slate-300 hover:text-rose-500 p-1 rounded-lg transition opacity-0 group-hover:opacity-100"
                    title="حذف هذا الإشعار"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>نظام إشعارات رسمي لمتابعة أنشطة ديوان مؤسسات الشباب</span>
          </div>

          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-1.5 rounded-xl transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
