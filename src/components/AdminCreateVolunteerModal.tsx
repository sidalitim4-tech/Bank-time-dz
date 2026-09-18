import { FC, useState, FormEvent } from 'react';
import { Volunteer } from '../types';
import { X, UserPlus, Shield, Clock, CheckCircle2 } from 'lucide-react';

interface AdminCreateVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateVolunteer: (volunteer: Volunteer) => void;
}

const SKILL_OPTIONS = [
  'تشجير وبستنة',
  'نظافة وتهيئة الفضاءات',
  'إسعافات أولية وإنقاذ',
  'إعلام آلي وصيانة ورقميات',
  'تنظيم ملتقيات ومنافسات',
  'دعم مدرسي ومطالعة',
  'رسم وجداريات',
  'تصوير وتوثيق إعلامي',
  'إرشاد وتأطير أقران'
];

export const AdminCreateVolunteerModal: FC<AdminCreateVolunteerModalProps> = ({
  isOpen,
  onClose,
  onCreateVolunteer,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(20);
  const [youthCenter, setYouthCenter] = useState('دار الشباب الروينة');
  const [wilaya] = useState('عين الدفلى');
  const [monthlyPledgedHours, setMonthlyPledgedHours] = useState(8);
  const [initialBalance, setInitialBalance] = useState(4);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['تشجير وبستنة', 'نظافة وتهيئة الفضاءات']);

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newVolunteer: Volunteer = {
      id: `vol-adm-${Date.now()}`,
      name: name.trim(),
      phone: phone || '0550 00 00 00',
      email: email || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@chabab-elrouina.dz`,
      age,
      youthCenter,
      wilaya,
      monthlyPledgedHours,
      balanceHours: initialBalance,
      totalVolunteeredHours: initialBalance,
      skills: selectedSkills.length > 0 ? selectedSkills : ['خدمة المجتمع والبيئة'],
      joinedDate: new Date().toISOString().split('T')[0],
      avatarBg: 'bg-emerald-600',
      tier: 'متطوع برونزي',
      status: 'نشط',
    };

    onCreateVolunteer(newVolunteer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold">تسجيل عضو / متطوع جديد من قبل الإدارة</h3>
              <p className="text-[11px] text-slate-300">إضافة متطوع جديد إلى السجل الرسمي لدار الشباب الروينة</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right">
          
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-950 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-700 shrink-0" />
            <span>تسجيل رسمي إداري: يتم تفعيل حساب المتطوع فوراً وإدراجه في السجل الإداري وقاعدة البيانات.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل للمتطوع:</label>
            <input
              type="text"
              required
              placeholder="مثال: يوسف بن عيسى"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف:</label>
              <input
                type="text"
                placeholder="05 / 06 / 07 ..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">العمر:</label>
              <input
                type="number"
                min="14"
                max="35"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">المؤسسة / دار الشباب التابعة:</label>
            <input
              type="text"
              value={youthCenter}
              onChange={(e) => setYouthCenter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الالتزام الشهري (ساعات):</label>
              <input
                type="number"
                min="2"
                max="40"
                value={monthlyPledgedHours}
                onChange={(e) => setMonthlyPledgedHours(parseInt(e.target.value) || 8)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رصيد الساعات الافتتاحي:</label>
              <input
                type="number"
                min="0"
                max="50"
                value={initialBalance}
                onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">المهارات ومجالات التطوع:</label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
              {SKILL_OPTIONS.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium ${
                    selectedSkills.includes(skill)
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>إنشاء وتثبيت الحساب رسمياً</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
