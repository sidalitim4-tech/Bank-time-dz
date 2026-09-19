import { FC, useState, useEffect, FormEvent } from 'react';
import { Volunteer } from '../types';
import { UserCheck, X, Save, ShieldAlert, Phone, Mail, MapPin, Building2, Clock, Sparkles } from 'lucide-react';

interface AdminEditVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: Volunteer | null;
  onSave: (volunteerId: string, updates: Partial<Volunteer>) => void;
}

export const AdminEditVolunteerModal: FC<AdminEditVolunteerModalProps> = ({
  isOpen,
  onClose,
  volunteer,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number>(20);
  const [youthCenter, setYouthCenter] = useState('دار الشباب الروينة');
  const [wilaya, setWilaya] = useState('عين الدفلى');
  const [balanceHours, setBalanceHours] = useState<number>(0);
  const [totalVolunteeredHours, setTotalVolunteeredHours] = useState<number>(0);
  const [monthlyPledgedHours, setMonthlyPledgedHours] = useState<number>(8);
  const [skillsStr, setSkillsStr] = useState('');
  const [status, setStatus] = useState<'نشط' | 'معطل'>('نشط');

  useEffect(() => {
    if (volunteer) {
      setName(volunteer.name);
      setPhone(volunteer.phone || '');
      setEmail(volunteer.email || '');
      setAge(volunteer.age || 20);
      setYouthCenter(volunteer.youthCenter || 'دار الشباب الروينة');
      setWilaya(volunteer.wilaya || 'عين الدفلى');
      setBalanceHours(volunteer.balanceHours ?? 0);
      setTotalVolunteeredHours(volunteer.totalVolunteeredHours ?? 0);
      setMonthlyPledgedHours(volunteer.monthlyPledgedHours ?? 8);
      setSkillsStr(volunteer.skills?.join('، ') || '');
      setStatus(volunteer.status === 'معطل' ? 'معطل' : 'نشط');
    }
  }, [volunteer]);

  if (!isOpen || !volunteer) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedSkills = skillsStr
      .split(/[,،]/)
      .map((s) => s.trim())
      .filter(Boolean);

    // Determine tier based on total hours
    let tier: Volunteer['tier'] = 'متطوع برونزي';
    if (totalVolunteeredHours >= 50) tier = 'سفير التطوع';
    else if (totalVolunteeredHours >= 30) tier = 'متطوع ذهبي';
    else if (totalVolunteeredHours >= 15) tier = 'متطوع فضي';

    const updates: Partial<Volunteer> = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      age: Number(age),
      youthCenter: youthCenter.trim(),
      wilaya: wilaya.trim(),
      balanceHours: Math.max(0, Number(balanceHours)),
      totalVolunteeredHours: Math.max(0, Number(totalVolunteeredHours)),
      monthlyPledgedHours: Math.max(1, Number(monthlyPledgedHours)),
      skills: parsedSkills.length > 0 ? parsedSkills : ['عمل تطوعي عام'],
      status,
      tier,
    };

    onSave(volunteer.id, updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">تعديل بيانات المتطوع المسجل</h3>
              <p className="text-xs text-slate-300">{volunteer.name} • المعرف: {volunteer.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right overflow-y-auto flex-1">
          
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-700" />
            <span>
              صلاحية إدارية خاصة بمدير دار الشباب الروينة لتحديث وتصحيح بيانات المتطوع وسجل ساعاته.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل واللقب:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف:</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                  placeholder="06XXXXXXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pl-8 text-xs font-mono text-right focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني:</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pl-8 text-xs text-right focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">العمر:</label>
              <input
                type="number"
                min="10"
                max="80"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المؤسسة الشبانية:</label>
              <div className="relative">
                <input
                  type="text"
                  value={youthCenter}
                  onChange={(e) => setYouthCenter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pr-8 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <Building2 className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الولاية:</label>
              <div className="relative">
                <input
                  type="text"
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pr-8 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Balance Hours & Total Hours */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>إدارة الرصيد والساعات الميدانية:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">الرصيد المتاح (س):</label>
                <input
                  type="number"
                  min="0"
                  value={balanceHours}
                  onChange={(e) => setBalanceHours(Number(e.target.value))}
                  className="w-full bg-white border border-emerald-300 text-emerald-800 font-extrabold rounded-lg py-1.5 px-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">إجمالي الساعات المنجزة (س):</label>
                <input
                  type="number"
                  min="0"
                  value={totalVolunteeredHours}
                  onChange={(e) => setTotalVolunteeredHours(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 font-bold text-slate-800 rounded-lg py-1.5 px-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">الالتزام الشهري (س/شهر):</label>
                <input
                  type="number"
                  min="1"
                  value={monthlyPledgedHours}
                  onChange={(e) => setMonthlyPledgedHours(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 font-bold text-slate-800 rounded-lg py-1.5 px-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Skills & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المهارات ومجالات التطوع (مفصولة بفواصل):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  placeholder="مثال: تشجير، تنظيم فعاليات، إسعافات أولية"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pr-8 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <Sparkles className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">حالة الحساب:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'نشط' | 'معطل')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="نشط">نشط (مفعل)</option>
                <option value="معطل">معطل مؤقتاً</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>حفظ التعديلات في النظام</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
