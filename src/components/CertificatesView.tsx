import { FC, useState, FormEvent } from 'react';
import { Certificate, Volunteer } from '../types';
import { Award, Printer, Plus, Sparkles, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface CertificatesViewProps {
  certificates: Certificate[];
  currentVolunteer: Volunteer | null;
  onPreviewCertificate: (cert: Certificate) => void;
  onGenerateNewCertificate: (campaignName: string) => void;
  onOpenRegisterModal?: () => void;
}

export const CertificatesView: FC<CertificatesViewProps> = ({
  certificates,
  currentVolunteer,
  onPreviewCertificate,
  onGenerateNewCertificate,
  onOpenRegisterModal,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState('المساهمة المتميزة في حملات التشجير والنظافة ببلدية الروينة');

  const userCertificates = currentVolunteer
    ? certificates.filter(
        (c) => c.volunteerId === currentVolunteer.id || c.volunteerName === currentVolunteer.name
      )
    : [];

  const canGenerate = currentVolunteer ? currentVolunteer.balanceHours >= 8 : false;

  const handleGenerate = (e: FormEvent) => {
    e.preventDefault();
    if (!currentVolunteer) {
      onOpenRegisterModal?.();
      return;
    }
    onGenerateNewCertificate(selectedCampaign);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              شهادات التقدير والعرفان الرسمية
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              معتمدة من دار الشباب
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            تتويجاً لساعاتك التطوعية في نهاية كل شهر، تحصل على شهادات شرفية معتمدة برقم تسلسلي ورمز استجابة سريعة تثري سيرتك الذاتية وتُثبت عطاءك المجتمعي.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentVolunteer) {
              onOpenRegisterModal?.();
            } else {
              setIsGenerating(true);
            }
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{currentVolunteer ? 'إصدار شهادة تقدير شهرية (8 ساعات)' : 'سجل كمتطوع للحصول على شهادة'}</span>
        </button>
      </div>

      {/* Generate form modal if active */}
      {isGenerating && currentVolunteer && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 animate-in fade-in">
          <h3 className="text-sm font-bold text-emerald-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>طلب إصدار شهادة تقدير شهرية جديدة</span>
          </h3>
          <p className="text-xs text-emerald-800 mb-4">
            سيتم استبدال 8 ساعات من رصيدك الحالي ({currentVolunteer.balanceHours} س متاح) وإصدار شهادة رسمية فورية باسم <strong>{currentVolunteer.name}</strong>.
          </p>

          <form onSubmit={handleGenerate} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                مجال المبادرة أو الحملة المذكورة في الشهادة:
              </label>
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="المساهمة الفعالة في حملات التشجير وحماية البيئة بدار الشباب الروينة">
                  المساهمة الفعالة في حملات التشجير وحماية البيئة بدار الشباب الروينة
                </option>
                <option value="المشاركة المتميزة في حملة النظافة الشاملة وتهيئة الفضاءات الشبابية">
                  المشاركة المتميزة في حملة النظافة الشاملة وتهيئة الفضاءات الشبابية
                </option>
                <option value="التنظيم والإشراف على ملتقى الإبداع والابتكار الشبابي بعين الدفلى">
                  التنظيم والإشراف على ملتقى الإبداع والابتكار الشبابي بعين الدفلى
                </option>
                <option value="تقديم حصص الدعم والمرافقة المدرسية لأبناء بلدية الروينة">
                  تقديم حصص الدعم والمرافقة المدرسية لأبناء بلدية الروينة
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={!canGenerate}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl transition ${
                  canGenerate
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                تأكيد وإصدار الشهادة الرسمية
              </button>
              <button
                type="button"
                onClick={() => setIsGenerating(false)}
                className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200"
              >
                إلغاء
              </button>
            </div>
            {!canGenerate && (
              <p className="text-[11px] text-rose-600 font-semibold mt-1">
                عذراً، رصيدك الحالي ({currentVolunteer.balanceHours} س) أقل من 8 ساعات المطلوبة لإصدار الشهادة.
              </p>
            )}
          </form>
        </div>
      )}

      {/* Grid of Certificates */}
      {userCertificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {userCertificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        معتمدة ومختومة
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        شهادة شكر وتقدير وعرفان
                      </h4>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                    {cert.serialNumber}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 space-y-1.5 mb-4 border border-slate-100">
                  <div>
                    المتطوع المكرّم: <strong className="text-slate-900">{cert.volunteerName}</strong>
                  </div>
                  <div>
                    الرصيد المعتمد: <strong className="text-emerald-700">{cert.totalHours} ساعة تطوعية</strong>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    الحملة: "{cert.activityCampaign}"
                  </div>
                  <div className="text-[11px] text-slate-400">
                    تاريخ الإصدار: {cert.issueDate} • {cert.issuedBy}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onPreviewCertificate(cert)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>معاينة وطباعة الشهادة</span>
                </button>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>صالحة للسيرة الذاتية</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {currentVolunteer ? `لا توجد شهادات صادرة بعد لـ ${currentVolunteer.name}` : 'سجّل كمتطوع للحصول على شهادات التقدير الرسمية'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            بإمكانك استبدال 8 ساعات من رصيدك التطوعي للحصول على شهادة رسمية فورية من دار الشباب الروينة.
          </p>
          {canGenerate && (
            <button
              onClick={() => setIsGenerating(true)}
              className="mt-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition"
            >
              إصدار شهادتك الأولى الآن
            </button>
          )}
        </div>
      )}

    </div>
  );
};
