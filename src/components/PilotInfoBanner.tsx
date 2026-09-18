import { FC, useState } from 'react';
import { Sparkles, TreePine, Award, RefreshCw, UserCheck, ChevronUp, ChevronDown, MapPin, CheckCircle2 } from 'lucide-react';

export const PilotInfoBanner: FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-5 mb-8 shadow-sm border border-emerald-800/50">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-white">
                مشروع بنك الوقت التطوعي: خدمة المجتمع وتثمين جهود الشباب
              </h2>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                النموذج الأولي: دار الشباب الروينة - عين الدفلى
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-4xl">
              ابتكار اجتماعي داخل مؤسسات الشباب يُمكّن كل شاب من تقديم ساعات تطوعية لخدمة محيطه وبلديته، وتسجيلها كرصيد ساعات يُستبدل لاحقاً بتكوينات مجانية، أولوية في الرحلات، وشهادات تقدير رسمية.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="self-end lg:self-center text-xs font-semibold text-emerald-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg transition flex items-center gap-1 shrink-0"
        >
          <span>{isCollapsed ? 'عرض آلية التنفيذ والقيمة المضافة' : 'إخفاء التفاصيل'}</span>
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="mt-5 pt-4 border-t border-emerald-800/60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-right">
          {/* Pillar 1 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs mb-1.5">
              <UserCheck className="w-4 h-4" />
              <span>1. تسجيل المتطوعين</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              كل شاب يسجل عبر المنصة أو دار الشباب الروينة ويحدد مهاراته والتزامه الشهري بالساعات.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>2. رصيد الساعات (1=1)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              كل ساعة يقضيها المتطوع في حملات التشجير، النظافة أو الدعم تُضاف فوراً كرصيد قابل للصرف.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs mb-1.5">
              <RefreshCw className="w-4 h-4" />
              <span>3. التبادل والامتيازات</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              استبدال الرصيد بدورات تكوينية، شهادات رسمية، مشاركة في مخيمات، أو تبادل مساعدة مع أقرانه.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs mb-1.5">
              <TreePine className="w-4 h-4" />
              <span>4. التنسيق والمبادرات</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              الجمعيات ومؤسسات الشباب تنشر احتياجاتها (حملات تشجير، نظافة)، والشباب يلبون النداء بانتظام.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
