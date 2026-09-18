import { FC } from 'react';
import { Certificate } from '../types';
import { X, Printer, CheckCircle, ShieldCheck, QrCode } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: FC<CertificateModalProps> = ({
  certificate,
  onClose,
}) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 my-8">
        
        {/* Modal Controls Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold">معاينة شهادة التقدير الرسمية الصادرة عن دار الشباب</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div id="printable-certificate" className="p-8 sm:p-12 bg-gradient-to-b from-amber-50/40 via-white to-emerald-50/20 relative">
          
          {/* Ornate borders */}
          <div className="border-4 border-double border-emerald-800 p-6 sm:p-8 rounded-lg relative bg-white/80 shadow-xs">
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-600" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-600" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-600" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-600" />

            {/* Header / Republic Header */}
            <div className="text-center space-y-1 mb-6 border-b border-emerald-900/20 pb-4">
              <h4 className="text-xs font-bold text-slate-700 tracking-wider">
                الجمهورية الجزائرية الديمقراطية الشعبية
              </h4>
              <p className="text-[11px] font-semibold text-slate-600">
                وزارة الشباب والرياضة • مديرية الشباب والرياضة لولاية عين الدفلى • ديوان مؤسسات الشباب
              </p>
              <p className="text-[11px] font-bold text-emerald-800">
                مؤسسة دار الشباب الروينة • مشروع بنك الوقت التطوعي الشبابي
              </p>
            </div>

            {/* Main Certificate Title */}
            <div className="text-center my-6">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-widest">
                شهادة شكر وتقدير وعرفان
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 font-serif">
                شهادة رصيد العمل التطوعي
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600 mx-auto mt-2 rounded-full" />
            </div>

            {/* Certificate Body text */}
            <div className="text-center max-w-xl mx-auto space-y-4 my-6 text-sm text-slate-700 leading-relaxed">
              <p className="text-xs text-slate-500">
                تُشهد إدارة دار الشباب الروينة بأن الشاب المتطوع المتميز:
              </p>

              <div className="text-xl sm:text-2xl font-extrabold text-emerald-900 py-1 border-b-2 border-dashed border-emerald-300 inline-block px-8">
                {certificate.volunteerName}
              </div>

              <p className="leading-loose text-xs sm:text-sm">
                قد ساهم بكل إخلاص وتفانٍ في خدمة المجتمع عبر رصيد بلغ{' '}
                <strong className="text-emerald-800 font-extrabold text-base underline">
                  {certificate.totalHours} ساعة تطوعية معتمدة
                </strong>{' '}
                في بنك الوقت الشبابي، ولا سيما من خلال مشاركته الفعالة في:
              </p>

              <p className="font-bold text-slate-800 text-xs sm:text-sm bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                "{certificate.activityCampaign}"
              </p>

              <p className="text-xs text-slate-600 italic">
                وتقديراً لجهوده في ترسيخ قيم التضامن، المحافظة على البيئة، والمسؤولية المجتمعية بين أوساط شباب ولاية عين الدفلى، سُلمت له هذه الشهادة للاعتراف برصيده واستحقاقه لكافة الامتيازات الرمزية المقررة.
              </p>
            </div>

            {/* Signatures and Official Stamp */}
            <div className="grid grid-cols-3 items-end justify-between pt-6 mt-6 border-t border-emerald-900/20 text-center text-xs">
              
              {/* Left: QR Code & Verification */}
              <div className="text-right">
                <div className="inline-flex flex-col items-center bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <QrCode className="w-12 h-12 text-slate-800" />
                  <span className="text-[9px] font-mono text-slate-500 mt-1">
                    {certificate.serialNumber.slice(-8)}
                  </span>
                </div>
                <div className="text-[9px] text-slate-400 mt-1">
                  رمز التحقق الرقمي المعتمد
                </div>
              </div>

              {/* Center: Stamp Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-emerald-700/80 text-emerald-800 flex flex-col items-center justify-center text-[10px] font-bold p-1 text-center rotate-[-8deg] shadow-2xs bg-emerald-50/50">
                  <div className="text-[8px] font-semibold text-emerald-900">دار الشباب الروينة</div>
                  <div className="font-extrabold text-emerald-950 text-[10px]">بنك الوقت</div>
                  <div className="text-[8px] text-emerald-800">عين الدفلى</div>
                  <div className="text-[7px] text-slate-500 font-mono">2026-DZ</div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">الختم الرسمي للمؤسسة</span>
              </div>

              {/* Right: Director Signature */}
              <div className="text-left space-y-1">
                <div className="text-[11px] font-bold text-slate-800">
                  مدير دار الشباب الروينة
                </div>
                <div className="font-serif italic text-sm text-emerald-800 py-1 font-bold">
                  إدارة دار الشباب
                </div>
                <div className="text-[10px] text-slate-500">
                  تحريراً في: {certificate.issueDate}
                </div>
              </div>

            </div>

            {/* Serial Number Footer */}
            <div className="text-center pt-3 text-[10px] text-slate-400 font-mono">
              الرقم التسلسلي الرسمي: {certificate.serialNumber}
            </div>

          </div>

        </div>

        {/* Modal Footer (no-print) */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between no-print">
          <div className="text-xs text-slate-500">
            هذه الشهادة معتمدة رقمياً وتضاف تلقائياً إلى ملف إنجازاتك في دار الشباب.
          </div>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
