import { FC } from 'react';
import { Clock, Award, Users, CheckCircle, Shield, Building2, UserPlus, Lock, LogOut, LogIn, Bell } from 'lucide-react';
import { Volunteer } from '../types';

interface HeaderProps {
  currentVolunteer: Volunteer | null;
  onOpenRegisterModal: (tab?: 'login' | 'register') => void;
  onLogoutVolunteer?: () => void;
  activeTab: 'opportunities' | 'ledger' | 'perks' | 'certificates' | 'admin';
  setActiveTab: (tab: 'opportunities' | 'ledger' | 'perks' | 'certificates' | 'admin') => void;
  isAdminAuthenticated: boolean;
  onAdminLogout: () => void;
  isFirebaseConnected?: boolean;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
}

export const Header: FC<HeaderProps> = ({
  currentVolunteer,
  onOpenRegisterModal,
  onLogoutVolunteer,
  activeTab,
  setActiveTab,
  isAdminAuthenticated,
  onAdminLogout,
  isFirebaseConnected = true,
  unreadNotificationsCount = 0,
  onOpenNotifications,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top institution bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              🇩🇿 النموذج الأولي التجريبي
            </span>
            <span className="font-semibold text-white">دار الشباب الروينة</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">ديوان مؤسسات الشباب</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">مديرية الشباب والرياضة لولاية عين الدفلى</span>
          </div>

          <div className="flex items-center gap-3">
            {isAdminAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                  <Shield className="w-3.5 h-3.5" />
                  جلسة إدارة دار الشباب نشطة
                </span>
                <button
                  onClick={onAdminLogout}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium text-rose-300 hover:text-white bg-slate-800 hover:bg-rose-900/60 border border-slate-700 transition flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>قفل وخروج</span>
                </button>
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>منصة بنك الوقت - فضاء التطوع والتبادل الزمني</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo and Brand */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 shrink-0">
              <Clock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  بنك الوقت التطوعي
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  الروينة
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                خدمة المجتمع مقابل رصيد زمني وامتيازات رمزية للشباب
              </p>
            </div>
          </div>

          {/* User Profile Bar / Balance widget */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Notifications Bell Button */}
            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 flex items-center justify-center transition shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                title="مركز الإشعارات والتنبيهات"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs animate-pulse">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {isAdminAuthenticated ? (
              /* Requirement 3: Admin cannot have volunteer hours or participant switcher */
              <div className="flex items-center gap-2.5">
                <div className="bg-amber-50 border border-amber-200/90 rounded-xl px-3.5 py-2 flex items-center gap-2 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-amber-800">حساب مؤسساتي إشرافي</div>
                    <div className="text-xs font-black text-amber-950">إدارة دار الشباب الروينة</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 text-right shadow-xs">
                  <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold leading-tight">طاقم الإدارة</div>
                    <div className="text-[9px] text-slate-300">صفة إشرافية (دون رصيد)</div>
                  </div>
                  <button
                    onClick={onAdminLogout}
                    className="text-[10px] text-rose-300 hover:text-white bg-slate-800 hover:bg-rose-900/60 px-2 py-1 rounded-md font-bold mr-1.5 transition flex items-center gap-1"
                    title="قفل جلسة الإدارة"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>خروج</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Regular volunteer or guest mode */
              <div className="flex items-center gap-2.5">
                
                {/* Time credits balance badge */}
                <div 
                  onClick={() => {
                    if (currentVolunteer) setActiveTab('ledger');
                    else onOpenRegisterModal('register');
                  }}
                  className="cursor-pointer bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl px-3.5 py-2 flex items-center gap-2.5 transition-all shadow-2xs"
                  title={currentVolunteer ? 'انقر لعرض تفاصيل الرصيد والمعاملات' : 'سجل كمتطوع لبدء كسب الساعات واستبدالها'}
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-medium text-emerald-800">رصيدك الزمني</div>
                    <div className="text-base font-extrabold text-emerald-950 flex items-center gap-1">
                      <span>{currentVolunteer ? currentVolunteer.balanceHours : 0}</span>
                      <span className="text-xs font-semibold text-emerald-700">ساعة رصيد</span>
                    </div>
                  </div>
                </div>

                {/* Requirement: If registered, show volunteer profile & logout. If not registered, show "تسجيل كمتطوع" and "تسجيل الدخول" */}
                {currentVolunteer ? (
                  <div className="flex items-center gap-2.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-right shadow-2xs">
                    <div className={`w-7 h-7 rounded-full ${currentVolunteer.avatarBg} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                      {currentVolunteer.name.charAt(0)}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-xs font-bold text-slate-900 leading-tight">{currentVolunteer.name}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">{currentVolunteer.tier}</div>
                    </div>
                    {onLogoutVolunteer && (
                      <button
                        onClick={onLogoutVolunteer}
                        className="text-slate-400 hover:text-rose-600 p-1 hover:bg-slate-200/80 rounded-md transition mr-1"
                        title="تسجيل الخروج من الحساب للعودة إلى وضع الزائر"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenRegisterModal('login')}
                      className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-200 shadow-2xs hover:border-slate-300"
                      title="تسجيل الدخول إلى حسابك في بنك الوقت"
                    >
                      <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تسجيل الدخول</span>
                    </button>
                    <button
                      onClick={() => onOpenRegisterModal('register')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs ring-2 ring-emerald-500/20"
                      title="إنشاء حساب متطوع جديد والحصول على 4 ساعات مجانية"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>انضم كمتطوع (+4 س)</span>
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
          {isAdminAuthenticated ? (
            /* Requirement: Administration does NOT have time ledger, perks store, or volunteer certificate claim */
            <>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === 'admin'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>لوحة إدارة وتنسيق دار الشباب (الإحصائيات، السجل، والاعتماد)</span>
              </button>

              <button
                onClick={() => setActiveTab('opportunities')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === 'opportunities'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>المبادرات والحملات التطوعية</span>
              </button>
            </>
          ) : (
            /* Volunteer & Visitor Navigation Tabs */
            <>
              <button
                onClick={() => setActiveTab('opportunities')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === 'opportunities'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>الفرص والمبادرات التطوعية</span>
              </button>

              <button
                onClick={() => setActiveTab('ledger')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === 'ledger'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>رصيد الساعات وسجل المعاملات</span>
              </button>

              <button
                onClick={() => setActiveTab('perks')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === 'perks'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>سوق الامتيازات والتبادل</span>
              </button>

              <button
                onClick={() => setActiveTab('certificates')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === 'certificates'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>شهادات التقدير الرسمية</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
