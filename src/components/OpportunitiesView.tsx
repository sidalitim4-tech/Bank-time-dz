import { FC, useState, useMemo } from 'react';
import { ActivityOpportunity, Volunteer, VolunteerCategory } from '../types';
import { OpportunityCard } from './OpportunityCard';
import { Search, Plus, Filter, TreePine, Sparkles, Building2, UserPlus, LogIn } from 'lucide-react';

interface OpportunitiesViewProps {
  opportunities: ActivityOpportunity[];
  currentVolunteer: Volunteer | null;
  onToggleJoin: (activityId: string) => void;
  onLogHoursForActivity: (activity: ActivityOpportunity) => void;
  onOpenCreateOpportunityModal: () => void;
  onEditOpportunity: (activity: ActivityOpportunity) => void;
  onFinishAndDistributeHours: (activity: ActivityOpportunity) => void;
  isAdminMode?: boolean;
  onOpenAuthModal?: (tab?: 'login' | 'register') => void;
}

const CATEGORIES: ('الكل' | VolunteerCategory)[] = [
  'الكل',
  'بيئة وتشجير',
  'نظافة وتهيئة',
  'تعليم وتكوين',
  'تنظيم وفعاليات',
  'إعلام ورقميات'
];

export const OpportunitiesView: FC<OpportunitiesViewProps> = ({
  opportunities,
  currentVolunteer,
  onToggleJoin,
  onLogHoursForActivity,
  onOpenCreateOpportunityModal,
  onEditOpportunity,
  onFinishAndDistributeHours,
  isAdminMode = false,
  onOpenAuthModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'الكل' | VolunteerCategory>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyPilot, setOnlyPilot] = useState(false);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((op) => {
      const matchCat = selectedCategory === 'الكل' || op.category === selectedCategory;
      const matchSearch =
        op.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPilot = onlyPilot ? op.isPilotAinDefla : true;

      return matchCat && matchSearch && matchPilot;
    });
  }, [opportunities, selectedCategory, searchQuery, onlyPilot]);

  return (
    <div className="space-y-6">
      {/* Unauthenticated / Guest Callout: Registration requirement for participation */}
      {!currentVolunteer && !isAdminMode && (
        <div className="bg-emerald-900 text-white rounded-2xl p-5 border border-emerald-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-600/60 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <UserPlus className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                هل ترغب في المشاركة في المبادرات التطوعية؟
              </h3>
              <p className="text-xs text-emerald-100/90 mt-0.5 leading-relaxed">
                لا يمكن للأشخاص المشاركة في المبادرات قبل تسجيل الدخول كمتطوع. سجّل كمتطوع بدار الشباب الروينة للانضمام وكسب رصيد الساعات.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => onOpenAuthModal?.('register')}
              className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 ring-2 ring-emerald-400/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4 text-emerald-950" />
              <span>تسجيل كمتطوع الآن</span>
            </button>
            <button
              onClick={() => onOpenAuthModal?.('login')}
              className="flex-1 md:flex-none bg-emerald-950/70 hover:bg-emerald-950 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-emerald-700/60 transition flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-300" />
              <span>تسجيل الدخول</span>
            </button>
          </div>
        </div>
      )}

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>الفرص والمبادرات التطوعية المتاحة</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
              {filteredOpportunities.length} مبادرة
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            اختر النشاط المناسب لمهاراتك، ساهم في خدمة مجتمعك، واكسب رصيد ساعات في بنك الوقت.
          </p>
        </div>

        <button
          onClick={onOpenCreateOpportunityModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مبادرة تطوعية جديدة (للمؤسسات والجمعيات)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن مبادرة، مكان، أو جمعية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-10 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
            />
          </div>

          {/* Quick Pilot Filter checkbox */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 select-none transition">
              <input
                type="checkbox"
                checked={onlyPilot}
                onChange={(e) => setOnlyPilot(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
              />
              <span>أنشطة دار الشباب الروينة فقط</span>
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 ml-2">المجال:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Opportunities */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpportunities.map((activity) => (
            <OpportunityCard
              key={activity.id}
              activity={activity}
              currentVolunteer={currentVolunteer}
              onToggleJoin={onToggleJoin}
              onEditOpportunity={onEditOpportunity}
              onFinishAndDistributeHours={onFinishAndDistributeHours}
              isAdminMode={isAdminMode}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">لا توجد مبادرات مطابقة لبحثك</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            جرّب تغيير فئة البحث أو إزالة التصفية لاستعراض جميع مبادرات دار الشباب والجمعيات الشريكة.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('الكل');
              setSearchQuery('');
              setOnlyPilot(false);
            }}
            className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl transition"
          >
            إعادة تعيين التصفية
          </button>
        </div>
      )}
    </div>
  );
};
