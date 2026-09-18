import { FC, useState, FormEvent } from 'react';
import { Volunteer } from '../types';
import { X, UserPlus, CheckCircle2, HeartHandshake, Clock } from 'lucide-react';

interface VolunteerRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (volunteer: Volunteer) => void;
}

const AVAILABLE_SKILLS = [
  'تشجير وبستنة',
  'نظافة وتهيئة الفضاءات',
  'إسعافات أولية وإنقاذ',
  'إعلام آلي وصيانة',
  'تنظيم ملتقيات ومعارض',
  'دعم مدرسي ومطالعة',
  'رسم وجداريات تحفيزية',
  'تصوير وتوثيق إعلامي'
];

export const VolunteerRegisterModal: FC<VolunteerRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(20);
  const [youthCenter, setYouthCenter] = useState('دار الشباب الروينة');
  const [wilaya] = useState('عين الدفلى');
  const [monthlyPledgedHours, setMonthlyPledgedHours] = useState(10);
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

    const newVol: Volunteer = {
      id: `vol-${Date.now()}`,
      name: name.trim(),
      phone: phone || '0550 00 00 00',
      email: email || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@example.dz`,
      age,
      youthCenter,
      wilaya,
      monthlyPledgedHours,
      balanceHours: 4, // Welcome gift 4 bonus hours to jumpstart the journey!
      totalVolunteeredHours: 4,
      skills: selectedSkills.length > 0 ? selectedSkills : ['خدمة المجتمع'],
      joinedDate: new Date().toISOString().split('T')[0],
      avatarBg: 'bg-emerald-600',
      tier: 'متطوع برونزي',
    };

    onRegister(newVol);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 my-8">
        
        {/* Header */}
        <div className="bg-emerald-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-300" />
            <h3 className="text-sm font-bold">تسجيل متطوع جديد في بنك الوقت الشبابي</h3>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right">
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>هدية ترحيبية: تحصل على 4 ساعات رصيد مجانية في حسابك فور التسجيل للانطلاق في المبادرات!</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الاسم واللقب:</label>
            <input
              type="text"
              required
              placeholder="مثال: فاروق بوعلام"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">العمر:</label>
              <input
                type="number"
                min={15}
                max={35}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المؤسسة الشبانية:</label>
              <select
                value={youthCenter}
                onChange={(e) => setYouthCenter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="دار الشباب الروينة">دار الشباب الروينة (النموذج الأولي)</option>
                <option value="دار الشباب العطاف">دار الشباب العطاف</option>
                <option value="دار الشباب عين الدفلى">دار الشباب عين الدفلى</option>
                <option value="دار الشباب خميس مليانة">دار الشباب خميس مليانة</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الالتزام التطوعي الشهري:</label>
              <select
                value={monthlyPledgedHours}
                onChange={(e) => setMonthlyPledgedHours(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value={6}>6 ساعات شهرياً</option>
                <option value={10}>10 ساعات شهرياً (مستحسن)</option>
                <option value={15}>15 ساعة شهرياً</option>
                <option value={20}>20 ساعة شهرياً</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              مهاراتك ومجالات اهتمامك التطوعية:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`text-right p-2 rounded-lg text-xs font-semibold border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{skill}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

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
              <HeartHandshake className="w-4 h-4" />
              <span>إنشاء حساب المتطوع وبدء المشاركة</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
