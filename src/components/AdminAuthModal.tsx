import { FC, useState, FormEvent } from 'react';
import { Shield, Lock, Eye, EyeOff, X, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Default demo passcode
    if (pin.trim() === '1234' || pin.trim() === 'admin2026') {
      setError(null);
      setPin('');
      onSuccess();
      onClose();
    } else {
      setError('رمز المرور غير صحيح. يرجى استخدام الرمز التجريبي: 1234');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">منطقة الإدارة والمصادقة</h3>
              <p className="text-[11px] text-slate-300">دار الشباب الروينة • ديوان مؤسسات الشباب • مديرية الشباب والرياضة</p>
            </div>
          </div>
          <button
            onClick={() => {
              setError(null);
              setPin('');
              onClose();
            }}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right">
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 leading-relaxed">
            <p className="font-semibold">تنبيه حماية الخصوصية:</p>
            <p className="mt-0.5 text-amber-800">
              هذه اللوحة خاصة بمسؤولي دار الشباب والجمعيات الشريكة لمراجعة طلبات ساعات التطوع والمصادقة عليها، وتفاصيل المتطوعين محمية ضد الوصول العام.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              رمز المرور الإداري (PIN):
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                autoFocus
                required
                placeholder="أدخل رمز المرور..."
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 pl-10 text-sm font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
              <span>رمز المرور المخصص للتجربة: <strong className="text-slate-700 font-mono">1234</strong></span>
              <Lock className="w-3 h-3 text-slate-400" />
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="submit"
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>تسجيل الدخول إلى لوحة الإدارة</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setPin('');
                onClose();
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition"
            >
              إلغاء
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
