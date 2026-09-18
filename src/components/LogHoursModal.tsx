import { FC, useState, FormEvent } from 'react';
import { Volunteer, ActivityOpportunity } from '../types';
import { X, Clock, CheckCircle2, Shield } from 'lucide-react';

interface LogHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVolunteer: Volunteer | null;
  opportunities: ActivityOpportunity[];
  initialActivity?: ActivityOpportunity | null;
  onLogHours: (activityTitle: string, hours: number, notes: string, autoApprove: boolean) => void;
  isAdminMode: boolean;
}

export const LogHoursModal: FC<LogHoursModalProps> = ({
  isOpen,
  onClose,
  currentVolunteer,
  opportunities,
  initialActivity,
  onLogHours,
  isAdminMode,
}) => {
  const [selectedActivityTitle, setSelectedActivityTitle] = useState(
    initialActivity ? initialActivity.title : opportunities[0]?.title || 'حملة تشجير ونظافة ببلدية الروينة'
  );
  const [customTitle, setCustomTitle] = useState('');
  const [hours, setHours] = useState(initialActivity ? initialActivity.durationHours : 3);
  const [notes, setNotes] = useState('إتمام المهام التطوعية الموكلة بكل نجاح وتفانٍ');
  const [useCustom, setUseCustom] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalTitle = useCustom && customTitle.trim() ? customTitle.trim() : selectedActivityTitle;
    onLogHours(finalTitle, hours, notes, isAdminMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200 my-8">
        
        {/* Modal Header */}
        <div className="bg-emerald-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-300" />
            <h3 className="text-sm font-bold">تسجيل ساعات عمل تطوعي منجزة</h3>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right">
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
            المتطوع: <strong className="text-slate-900">{currentVolunteer?.name || 'متطوع جديد'}</strong> •{' '}
            <span>{currentVolunteer?.youthCenter || 'دار الشباب الروينة'}</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">النشاط أو المبادرة المنفذة:</label>
              <button
                type="button"
                onClick={() => setUseCustom(!useCustom)}
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
              >
                {useCustom ? 'اختر من المبادرات المسجلة' : 'كتابة نشاط مخصص أو ميداني'}
              </button>
            </div>

            {useCustom ? (
              <input
                type="text"
                required
                placeholder="مثال: حملة تشجير حي الإخوة الشهداء بالروينة"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            ) : (
              <select
                value={selectedActivityTitle}
                onChange={(e) => setSelectedActivityTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                {opportunities.map((op) => (
                  <option key={op.id} value={op.title}>
                    {op.title} ({op.durationHours} س)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              عدد الساعات المنجزة (تُضاف للرصيد الزمني 1=1):
            </label>
            <div className="flex items-center gap-2">
              {[2, 3, 4, 5, 6].map((h) => (
                <button
                  type="button"
                  key={h}
                  onClick={() => setHours(h)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    hours === h
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {h} ساعات
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              تقرير موجز عن العمل المنجز أو الملاحظات:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              placeholder="وصف مختصر للنشاط، المكان، أو دورك..."
            />
          </div>

          {isAdminMode ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600 shrink-0" />
              <span>أنت في وضع مدير/منسق دار الشباب: سيتم اعتماد الساعات وإيداعها في الرصيد فوراً!</span>
            </div>
          ) : (
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <span>سيتم إرسال الطلب لمدير دار الشباب الروينة للمصادقة وإيداع الرصيد.</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تأكيد تسجيل الساعات التطوعية</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
