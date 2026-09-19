import { FC, useState, FormEvent } from 'react';
import { Volunteer, ActivityOpportunity, AppNotification, NotificationType } from '../types';
import { X, Send, Megaphone, Bell, Users, TreePine, Sparkles, CheckCircle2 } from 'lucide-react';

interface BroadcastNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteers: Volunteer[];
  opportunities: ActivityOpportunity[];
  onSendNotification: (notification: AppNotification) => void;
}

export const BroadcastNotificationModal: FC<BroadcastNotificationModalProps> = ({
  isOpen,
  onClose,
  volunteers,
  opportunities,
  onSendNotification,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('announcement');
  const [targetType, setTargetType] = useState<'all' | 'specific_volunteer' | 'specific_opportunity'>('all');
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState('');
  const [linkTab, setLinkTab] = useState<'opportunities' | 'ledger' | 'perks' | 'certificates' | 'admin'>('opportunities');
  const [badgeText, setBadgeText] = useState('إعلان إداري');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    let targetVolunteerId = 'all';
    let targetRole: 'all' | 'volunteer' | 'admin' = 'all';

    if (targetType === 'specific_volunteer') {
      targetVolunteerId = selectedVolunteerId || (volunteers[0]?.id || 'all');
      targetRole = 'volunteer';
    } else if (targetType === 'specific_opportunity') {
      const op = opportunities.find((o) => o.id === selectedOpportunityId);
      // We can broadcast to all or target the opportunity participants
      targetVolunteerId = 'all';
    }

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      type,
      timestamp: new Date().toISOString(),
      read: false,
      targetVolunteerId,
      targetRole,
      linkTab,
      actionLabel: linkTab === 'opportunities' ? 'عرض المبادرات' : 'تفاصيل الرصيد',
      badge: badgeText.trim() || 'إشعار رسمي',
    };

    onSendNotification(newNotif);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setTitle('');
      setMessage('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-auto">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">بث إشعار وتنبيه إداري للشباب</h3>
              <p className="text-[11px] text-slate-300">إرسال إشعار فوري لجميع المتطوعين أو لمشارك محدد</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right">
          {isSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl p-4 flex items-center gap-3 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>تم إرسال وبث الإشعار بنجاح لجميع المستهدفين!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              عنوان الإشعار أو التنبيه:
            </label>
            <input
              type="text"
              required
              placeholder="مثال: تنبيه هام بخصوص موعد انطلاق حملة التشجير"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                نوع الإشعار:
              </label>
              <select
                value={type}
                onChange={(e) => {
                  const val = e.target.value as NotificationType;
                  setType(val);
                  if (val === 'opportunity') {
                    setLinkTab('opportunities');
                    setBadgeText('مبادرة جديدة');
                  } else if (val === 'hours') {
                    setLinkTab('ledger');
                    setBadgeText('ساعات معتمدة');
                  } else {
                    setBadgeText('إعلان إداري');
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500"
              >
                <option value="announcement">📢 إعلان وتنبيه إداري</option>
                <option value="opportunity">🌱 إشعار خاص بمبادرة</option>
                <option value="hours">⏱️ اعتماد وتحديث ساعات</option>
                <option value="system">ℹ️ تحديث نظام وإرشادات</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                وسم الإشعار (Badge):
              </label>
              <input
                type="text"
                placeholder="مثال: إعلان عاجل"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              الجهة المستهدفة بالإشعار:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetType('all')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition text-center ${
                  targetType === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                جميع المتطوعين
              </button>

              <button
                type="button"
                onClick={() => setTargetType('specific_opportunity')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition text-center ${
                  targetType === 'specific_opportunity'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                مبادرة معينة
              </button>

              <button
                type="button"
                onClick={() => setTargetType('specific_volunteer')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition text-center ${
                  targetType === 'specific_volunteer'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                متطوع محدد
              </button>
            </div>
          </div>

          {targetType === 'specific_opportunity' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اختر المبادرة المستهدفة:
              </label>
              <select
                value={selectedOpportunityId}
                onChange={(e) => setSelectedOpportunityId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500"
              >
                <option value="">-- اختر المبادرة --</option>
                {opportunities.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.title} ({op.registeredVolunteerIds.length} مسجلين)
                  </option>
                ))}
              </select>
            </div>
          )}

          {targetType === 'specific_volunteer' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اختر المتطوع المستهدف:
              </label>
              <select
                value={selectedVolunteerId}
                onChange={(e) => setSelectedVolunteerId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500"
              >
                <option value="">-- اختر من قائمة المتطوعين المسجلين --</option>
                {volunteers.map((vol) => (
                  <option key={vol.id} value={vol.id}>
                    {vol.name} - {vol.phone} ({vol.balanceHours} س)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              نص الرسالة والتفاصيل:
            </label>
            <textarea
              rows={3}
              required
              placeholder="اكتب هنا تفاصيل الإشعار الذي سيظهر في شريط إشعارات المتطوعين..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              القسم الذي ينقله الإشعار عند الضغط:
            </label>
            <select
              value={linkTab}
              onChange={(e) => setLinkTab(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500"
            >
              <option value="opportunities">فرص ومبادرات التطوع</option>
              <option value="ledger">سجل المعاملات والرصيد الزمني</option>
              <option value="perks">متجر الامتيازات والمكافآت</option>
              <option value="certificates">الشهادات الرسمية المعتمدة</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSuccess}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>إرسال وبث الإشعار الآن</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
