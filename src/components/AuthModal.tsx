import { FC, useState, useEffect, FormEvent } from 'react';
import { Volunteer } from '../types';
import { X, LogIn, UserPlus, Clock, CheckCircle2, Search, Sparkles } from 'lucide-react';
import { auth, googleProvider, signInWithPopup } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteers: Volunteer[];
  onLogin: (volunteer: Volunteer) => void;
  onRegister: (volunteer: Volunteer) => void;
  initialTab?: 'login' | 'register';
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

export const AuthModal: FC<AuthModalProps> = ({
  isOpen,
  onClose,
  volunteers,
  onLogin,
  onRegister,
  initialTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  
  // Login Tab States
  const [loginSearch, setLoginSearch] = useState('');
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string>(volunteers[0]?.id || '');

  // Register Tab States (for new people)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(20);
  const [youthCenter] = useState('دار الشباب الروينة');
  const [wilaya] = useState('عين الدفلى');
  const [monthlyPledgedHours, setMonthlyPledgedHours] = useState(10);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['تشجير وبستنة', 'نظافة وتهيئة الفضاءات']);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (!user) return;

      // Check if volunteer exists by email or uid
      const userEmail = user.email ? user.email.toLowerCase() : '';
      const existing = volunteers.find(
        (v) => (userEmail && v.email.toLowerCase() === userEmail) || v.id === user.uid
      );

      if (existing) {
        if (existing.status === 'معطل') {
          alert('تنبيه: هذا الحساب معطل مؤقتاً بقرار إداري من دار الشباب الروينة.');
          return;
        }
        onLogin(existing);
        onClose();
      } else {
        // Auto-create volunteer from Google profile
        const newVol: Volunteer = {
          id: user.uid,
          name: user.displayName || userEmail.split('@')[0] || 'متطوع جديد',
          phone: user.phoneNumber || '0550 00 00 00',
          email: userEmail || `${user.uid}@example.dz`,
          age: 21,
          youthCenter: 'دار الشباب الروينة',
          wilaya: 'عين الدفلى',
          monthlyPledgedHours: 10,
          balanceHours: 4, // Welcome 4 bonus hours
          totalVolunteeredHours: 4,
          skills: ['خدمة المجتمع', 'تنظيم وفعاليات'],
          joinedDate: new Date().toISOString().split('T')[0],
          avatarBg: 'bg-emerald-600',
          tier: 'متطوع برونزي',
          status: 'نشط',
        };
        onRegister(newVol);
        onClose();
      }
    } catch (err) {
      console.error('Firebase Google Auth error:', err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    const target = volunteers.find((v) => v.id === selectedVolunteerId);
    if (target) {
      if (target.status === 'معطل') {
        alert('تنبيه: هذا الحساب معطل مؤقتاً بقرار إداري من دار الشباب الروينة. يرجى مراجعة إدارة المؤسسة.');
        return;
      }
      onLogin(target);
      onClose();
    }
  };

  const handleRegisterSubmit = (e: FormEvent) => {
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
      balanceHours: 4, // Welcome 4 bonus hours
      totalVolunteeredHours: 4,
      skills: selectedSkills.length > 0 ? selectedSkills : ['خدمة المجتمع'],
      joinedDate: new Date().toISOString().split('T')[0],
      avatarBg: 'bg-emerald-600',
      tier: 'متطوع برونزي',
      status: 'نشط',
    };

    onRegister(newVol);
    onClose();
  };

  const filteredVolunteersForLogin = volunteers.filter(
    (v) =>
      v.name.toLowerCase().includes(loginSearch.toLowerCase()) ||
      v.phone.includes(loginSearch)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200 my-8">
        
        {/* Top Header with Tab Switcher */}
        <div className="bg-slate-900 text-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold">بوابة بنك الوقت - دار الشباب الروينة</span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>تسجيل الدخول</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>تسجيل كمتطوع جديد</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Login */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-right">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اختر حساب المتطوع أو ابحث باسمك:
              </label>

              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو رقم الهاتف..."
                  value={loginSearch}
                  onChange={(e) => setLoginSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 p-1 border border-slate-200 rounded-xl bg-slate-50/50">
                {filteredVolunteersForLogin.length === 0 ? (
                  <div className="p-5 text-center text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">لا توجد أسماء متطوعين مسجلة حالياً</p>
                    <p className="mt-1 text-[11px] text-slate-400">انتقل لخانة "تسجيل كمتطوع جديد" للانضمام وإنشاء حسابك</p>
                  </div>
                ) : (
                  filteredVolunteersForLogin.map((v) => {
                    const isSelected = selectedVolunteerId === v.id;
                    const isSuspended = v.status === 'معطل';
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVolunteerId(v.id)}
                        className={`p-2.5 rounded-xl border text-right cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 shadow-2xs'
                            : 'bg-white border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full ${v.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                            {v.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{v.name}</span>
                              {isSuspended && (
                                <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-full font-bold">
                                  معطل
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500">{v.phone} • {v.youthCenter}</div>
                          </div>
                        </div>

                        <div className="text-left">
                          <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                            {v.balanceHours} س
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{isGoogleLoading ? 'جاري تسجيل الدخول...' : 'الدخول السريع بحساب Google'}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!selectedVolunteerId}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>دخول إلى حسابي الآن</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
              >
                ليس لديك حساب بعد؟ انقر هنا لإنشاء حساب جديد
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Register (for new people) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 text-right">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>هدية ترحيبية: تحصل على 4 ساعات رصيد مجانية في حسابك فور التسجيل للانطلاق في المبادرات!</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{isGoogleLoading ? 'جاري تسجيل الدخول...' : 'التسجيل الفوري السريع بحساب Google'}</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-2 text-[10px] text-slate-400 font-bold">أو أكمل الاستمارة يدوياً</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الاسم واللقب:</label>
              <input
                type="text"
                required
                placeholder="مثال: حسام سعيدي"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف:</label>
                <input
                  type="text"
                  placeholder="05 / 06 / 07 ..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الالتزام الشهري المقترح:</label>
              <select
                value={monthlyPledgedHours}
                onChange={(e) => setMonthlyPledgedHours(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value={4}>4 ساعات شهرياً (ساعة كل أسبوع)</option>
                <option value={8}>8 ساعات شهرياً (ساعتان كل أسبوع - مستحسن)</option>
                <option value={12}>12 ساعة شهرياً (3 ساعات أسبوعياً)</option>
                <option value={20}>20 ساعة شهرياً (عطاء مكثف)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">مهاراتك واهتماماتك:</label>
              <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                {AVAILABLE_SKILLS.map((skill) => (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`text-[11px] px-2 py-0.5 rounded-lg border transition font-medium ${
                      selectedSkills.includes(skill)
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-xs mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>إنشاء الحساب وبدء التطوع فوراً</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
              >
                لديك حساب بالفعل؟ تسجيل الدخول
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
