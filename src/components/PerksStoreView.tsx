import { FC, useState } from 'react';
import { Perk, Volunteer, PerkCategory } from '../types';
import { Award, GraduationCap, HeartHandshake, Compass, Dumbbell, Users, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface PerksStoreViewProps {
  perks: Perk[];
  currentVolunteer: Volunteer | null;
  onRedeemPerk: (perk: Perk) => void;
  onNavigateToOpportunities: () => void;
  onOpenRegisterModal?: () => void;
}

const CATEGORIES: ('الكل' | PerkCategory)[] = [
  'الكل',
  'شهادة تقدير',
  'تكوين وورشات',
  'رحلات وملتقيات',
  'مرافق وخدمات',
  'تبادل بين الأقران'
];

export const PerksStoreView: FC<PerksStoreViewProps> = ({
  perks,
  currentVolunteer,
  onRedeemPerk,
  onNavigateToOpportunities,
  onOpenRegisterModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'الكل' | PerkCategory>('الكل');
  const [redeemedAlert, setRedeemedAlert] = useState<string | null>(null);

  const filteredPerks = perks.filter((p) => {
    if (selectedCategory === 'الكل') return true;
    return p.category === selectedCategory;
  });

  const getPerkIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="w-6 h-6 text-amber-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-blue-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-rose-600" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-purple-600" />;
      case 'Dumbbell':
        return <Dumbbell className="w-6 h-6 text-emerald-600" />;
      case 'Users':
        return <Users className="w-6 h-6 text-teal-600" />;
      default:
        return <Sparkles className="w-6 h-6 text-amber-600" />;
    }
  };

  const handleRedeem = (perk: Perk) => {
    if (!currentVolunteer) {
      onOpenRegisterModal?.();
      return;
    }
    if (currentVolunteer.balanceHours < perk.costHours) return;
    onRedeemPerk(perk);
    setRedeemedAlert(`تهانينا! تم استبدال ${perk.costHours} ساعة بنجاح مقابل "${perk.title}".`);
    setTimeout(() => setRedeemedAlert(null), 6000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Balance Reminder */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              سوق الامتيازات والتبادل بالرصيد الزمني
            </h2>
            <span className="bg-amber-100 text-amber-900 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
              تثمين التطوع
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            استثمر ساعاتك التطوعية للحصول على دورات تدريبية وتكوينات مجانية، أولوية في الرحلات والملتقيات، شهادات معتمدة، أو طلب مساعدة شبابية لمشروعك.
          </p>
        </div>

        {/* Current user balance card */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-right">
            <div className="text-[11px] text-emerald-800 font-semibold">
              {currentVolunteer ? `رصيد ${currentVolunteer.name}:` : 'رصيد الزائر:'}
            </div>
            <div className="text-lg font-extrabold text-emerald-950">
              {currentVolunteer ? currentVolunteer.balanceHours : 0} ساعة رصيد
            </div>
          </div>
        </div>
      </div>

      {/* Success alert message */}
      {redeemedAlert && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl flex items-center justify-between gap-3 shadow-md animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5" />
            <span>{redeemedAlert}</span>
          </div>
          <button
            onClick={() => setRedeemedAlert(null)}
            className="text-xs text-emerald-100 hover:text-white underline font-semibold"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Perks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPerks.map((perk) => {
          const userBalance = currentVolunteer ? currentVolunteer.balanceHours : 0;
          const hasEnough = currentVolunteer ? userBalance >= perk.costHours : false;
          const missingHours = Math.max(0, perk.costHours - userBalance);

          return (
            <div
              key={perk.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5">
                {/* Header of card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
                    {getPerkIcon(perk.icon)}
                  </div>
                  <div className="text-left">
                    <span className="inline-block bg-amber-50 text-amber-900 border border-amber-200 text-xs font-extrabold px-3 py-1 rounded-xl shadow-2xs">
                      {perk.costHours} ساعات رصيد
                    </span>
                    <div className="text-[10px] text-slate-400 font-semibold mt-1">
                      المتبقي: {perk.availableCount} مقعد
                    </div>
                  </div>
                </div>

                {/* Badge and Provider */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {perk.category}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {perk.badgeText}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition mb-2 leading-snug">
                  {perk.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {perk.description}
                </p>

                <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                  الجهة الموفرة: <span className="font-semibold text-slate-600">{perk.provider}</span>
                </div>
              </div>

              {/* Redeem button or insufficient balance indicator */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                {!currentVolunteer ? (
                  <button
                    onClick={onOpenRegisterModal}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>سجل كمتطوع للاستبدال ({perk.costHours} س)</span>
                  </button>
                ) : hasEnough ? (
                  <button
                    onClick={() => handleRedeem(perk)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>استبدال الرصيد الآن ({perk.costHours} س)</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1.5 rounded-lg">
                      <span className="flex items-center gap-1 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        رصيدك غير كافٍ حالياً
                      </span>
                      <span className="font-bold">ينقصك {missingHours} س</span>
                    </div>
                    <button
                      onClick={onNavigateToOpportunities}
                      className="w-full text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1"
                    >
                      <span>تطوع في نشاط لكسب الساعات</span>
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
