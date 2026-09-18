import { FC, useState, FormEvent } from 'react';
import { Volunteer } from '../types';
import { X, Clock, PlusCircle, MinusCircle, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminAdjustHoursModalProps {
  isOpen: boolean;
  volunteer: Volunteer | null;
  onClose: () => void;
  onConfirmAdjust: (
    volunteerId: string,
    amount: number,
    isAddition: boolean,
    reason: string
  ) => void;
}

const COMMON_REASONS = [
  'مكافأة تميز وجهد استثنائي في حملة ميدانية',
  'مساهمة إضافية في تنظيم وتأطير نشاط بدار الشباب',
  'تعويض ساعات تطوعية خارجية معتمدة',
  'تصحيح ومطابقة إدارية للرصيد الزمني',
  'حسم ساعات بسبب غياب غير مبرر عن مبادرة مسجلة',
  'تسوية رصيد استبدال يدوي لخدمة بدار الشباب',
];

export const AdminAdjustHoursModal: FC<AdminAdjustHoursModalProps> = ({
  isOpen,
  volunteer,
  onClose,
  onConfirmAdjust,
}) => {
  const [isAddition, setIsAddition] = useState<boolean>(true);
  const [hoursAmount, setHoursAmount] = useState<number>(2);
  const [reason, setReason] = useState<string>(COMMON_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');

  if (!isOpen || !volunteer) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalReason = customReason.trim() || reason;
    if (hoursAmount <= 0) return;

    onConfirmAdjust(volunteer.id, hoursAmount, isAddition, finalReason);
    onClose();
  };

  const calculatedNewBalance = isAddition
    ? volunteer.balanceHours + hoursAmount
    : Math.max(0, volunteer.balanceHours - hoursAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200 my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold">تعديل رصيد ساعات المتطوع</h3>
              <p className="text-[11px] text-slate-300">نظام إدارة الساعات - دار الشباب الروينة</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right">
          
          {/* Volunteer Info Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">{volunteer.name}</div>
              <div className="text-[11px] text-slate-500">{volunteer.youthCenter} • {volunteer.phone}</div>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-slate-500 font-semibold">الرصيد الحالي</div>
              <div className="text-sm font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
                {volunteer.balanceHours} س
              </div>
            </div>
          </div>

          {/* Action Type Toggle (+ Addition / - Deduction) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">نوع التعديل الإداري:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsAddition(true)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                  isAddition
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>زيادة وإضافة ساعات (+)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddition(false)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                  !isAddition
                    ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <MinusCircle className="w-4 h-4" />
                <span>إنقاص وحسم ساعات (-)</span>
              </button>
            </div>
          </div>

          {/* Hours Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">عدد الساعات المراد تعديلها:</label>
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setHoursAmount(num)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition border ${
                    hoursAmount === num
                      ? isAddition
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                        : 'bg-rose-100 text-rose-900 border-rose-400'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isAddition ? `+${num}` : `-${num}`} س
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="number"
                min="0.5"
                step="0.5"
                required
                value={hoursAmount}
                onChange={(e) => setHoursAmount(parseFloat(e.target.value) || 1)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">ساعات</span>
            </div>
          </div>

          {/* Preset Reasons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">السبب والبيان الإداري:</label>
            <select
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setCustomReason('');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-amber-500 mb-2"
            >
              {COMMON_REASONS.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="أو اكتب سبباً مخصصاً للتعديل..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          {/* Preview of change */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-950 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>الرصيد بعد التعديل:</span>
            </div>
            <div className="font-extrabold text-sm text-slate-900">
              {volunteer.balanceHours} س <span className="text-amber-700 font-bold mx-1">➜</span>{' '}
              <span className={isAddition ? 'text-emerald-700 font-black' : 'text-rose-700 font-black'}>
                {calculatedNewBalance} س
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition shadow-xs flex items-center justify-center gap-1.5 ${
                isAddition ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>اعتماد وتطبيق التعديل</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
