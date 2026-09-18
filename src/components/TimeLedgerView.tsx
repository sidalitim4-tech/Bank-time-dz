import { FC, useState } from 'react';
import { Volunteer, TimeTransaction } from '../types';
import { Clock, PlusCircle, ArrowUpRight, ArrowDownLeft, ShieldCheck, AlertCircle, Award, CheckCircle2, FileText } from 'lucide-react';

interface TimeLedgerViewProps {
  currentVolunteer: Volunteer | null;
  transactions: TimeTransaction[];
  onOpenLogHoursModal: () => void;
  onNavigateToPerks: () => void;
  onNavigateToCertificates: () => void;
  onOpenRegisterModal?: () => void;
}

export const TimeLedgerView: FC<TimeLedgerViewProps> = ({
  currentVolunteer,
  transactions,
  onOpenLogHoursModal,
  onNavigateToPerks,
  onNavigateToCertificates,
  onOpenRegisterModal,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'EARNED' | 'REDEEMED'>('ALL');

  const userTransactions = currentVolunteer
    ? transactions.filter((tx) => tx.volunteerId === currentVolunteer.id)
    : [];

  const filteredTransactions = userTransactions.filter((tx) => {
    if (filterType === 'ALL') return true;
    return tx.type === filterType;
  });

  const earnedHours = userTransactions
    .filter((tx) => tx.type === 'EARNED' && tx.status === 'معتمد')
    .reduce((sum, tx) => sum + tx.hours, 0);

  const redeemedHours = userTransactions
    .filter((tx) => tx.type === 'REDEEMED')
    .reduce((sum, tx) => sum + tx.hours, 0);

  // Monthly commitment percentage
  const currentMonthEarned = currentVolunteer ? 12 : 0;
  const pledgedHours = currentVolunteer?.monthlyPledgedHours || 10;
  const monthlyGoalPercent = currentVolunteer
    ? Math.min(100, Math.round((currentMonthEarned / pledgedHours) * 100))
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Unregistered Visitor Notice */}
      {!currentVolunteer && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">أنت تتصفح المنصة كزائر غير مسجل</h4>
              <p className="text-xs text-slate-600">
                سجل كمتطوع بدار الشباب الروينة لتبدأ بكسب الساعات، توثيق مساهماتك الميدانية، واستبدالها بالامتيازات والشهادات.
              </p>
            </div>
          </div>
          {onOpenRegisterModal && (
            <button
              onClick={onOpenRegisterModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs whitespace-nowrap"
            >
              تسجيل كمتطوع الآن
            </button>
          )}
        </div>
      )}

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Available Balance */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute left-[-10px] bottom-[-10px] opacity-10">
            <Clock className="w-28 h-28" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between text-emerald-100 text-xs font-semibold mb-2">
              <span>الرصيد الزمني المتاح للصرف</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">جاهز للاستبدال</span>
            </div>
            <div className="text-3xl font-extrabold flex items-baseline gap-1.5 mb-2">
              <span>{currentVolunteer ? currentVolunteer.balanceHours : 0}</span>
              <span className="text-sm font-semibold opacity-90">ساعة رصيد</span>
            </div>
            <p className="text-[11px] text-emerald-100/90 leading-tight">
              يمكنك استخدام هذا الرصيد للاستفادة من دورات تكوينية، شهادات تقدير، أو رحلات.
            </p>
          </div>
        </div>

        {/* Card 2: Total Volunteered Lifetime */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>إجمالي ساعات خدمة المجتمع</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 flex items-baseline gap-1.5 mb-2">
            <span>{currentVolunteer ? currentVolunteer.totalVolunteeredHours : 0}</span>
            <span className="text-xs font-semibold text-slate-500">ساعة مسجلة</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>رصيد تراكمي مثبت في قاعدة البيانات</span>
          </div>
        </div>

        {/* Card 3: Monthly Pledge & Continuity */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>الالتزام الشهري (الاستمرارية)</span>
            <span className="text-xs font-bold text-slate-700">
              {currentMonthEarned} / {pledgedHours} س
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-2">
            {monthlyGoalPercent}%
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${monthlyGoalPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500">
            {currentVolunteer
              ? 'حققت هدف التزامك الشهري لشهر سبتمبر بدار الشباب الروينة!'
              : 'سجل كمتطوع لتحديد ساعات التزامك الشهري ومتابعة إنجازاتك.'}
          </p>
        </div>

        {/* Card 4: Tier & Recognition */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
              <span>المرتبة التطوعية الحالية</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-lg font-extrabold text-slate-900 mb-1">
              {currentVolunteer ? currentVolunteer.tier : 'زائر غير مسجل'}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              دار الشباب الروينة - عين الدفلى
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onNavigateToCertificates}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>استخراج شهادة تقدير</span>
            </button>
          </div>
        </div>

      </div>

      {/* Action Banner */}
      <div className="bg-slate-100/80 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-right">
          <div className="w-9 h-9 rounded-xl bg-white text-emerald-600 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">هل أكملت نشاطاً تطوعياً جديداً مؤخراً؟</h4>
            <p className="text-[11px] text-slate-500">
              سجّل ساعات العمل التطوعي الخاصة بك لتقديمها لمسؤول دار الشباب للمصادقة وإيداعها في رصيدك.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenLogHoursModal}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>تسجيل ساعات تطوعية جديدة</span>
          </button>
          <button
            onClick={onNavigateToPerks}
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>صرف الرصيد في سوق الامتيازات</span>
          </button>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              دفتر حساب الساعات وسجل المعاملات
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              كشف تفصيلي يوضح كل ساعة تم اكتسابها أو استبدالها مع الجهة المشرفة.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                filterType === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الكل ({userTransactions.length})
            </button>
            <button
              onClick={() => setFilterType('EARNED')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${
                filterType === 'EARNED' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>مكتسبة</span>
            </button>
            <button
              onClick={() => setFilterType('REDEEMED')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${
                filterType === 'REDEEMED' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>مستبدلة</span>
            </button>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-4 sm:px-5 hover:bg-slate-50/80 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      tx.type === 'EARNED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {tx.type === 'EARNED' ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{tx.activityTitle}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tx.status === 'معتمد'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span>التاريخ: {tx.date}</span>
                      {tx.verifiedBy && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            المعتمد: {tx.verifiedBy}
                          </span>
                        </>
                      )}
                      {tx.notes && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="italic text-slate-600">"{tx.notes}"</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="self-end sm:self-center">
                  <span
                    className={`text-sm font-extrabold px-3 py-1 rounded-xl inline-block ${
                      tx.type === 'EARNED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {tx.type === 'EARNED' ? `+${tx.hours} ساعة` : `-${tx.hours} ساعة`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            لا توجد معاملات مسجلة في هذا التصنيف.
          </div>
        )}
      </div>

    </div>
  );
};
