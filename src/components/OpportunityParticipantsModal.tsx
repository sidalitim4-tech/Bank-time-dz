import { FC } from 'react';
import { ActivityOpportunity, Volunteer } from '../types';
import { Users, X, Phone, Mail, Building2, MapPin, CheckCircle, ExternalLink } from 'lucide-react';

interface OpportunityParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityOpportunity | null;
  volunteers: Volunteer[];
}

export const OpportunityParticipantsModal: FC<OpportunityParticipantsModalProps> = ({
  isOpen,
  onClose,
  activity,
  volunteers,
}) => {
  if (!isOpen || !activity) return null;

  const participants = activity.registeredVolunteerIds.map((id) => {
    const found = volunteers.find((v) => v.id === id);
    if (found) return found;
    return {
      id,
      name: 'متطوع مسجل',
      phone: 'غير محدد',
      email: '',
      age: 20,
      youthCenter: activity.youthCenter,
      wilaya: activity.wilaya,
      monthlyPledgedHours: 8,
      balanceHours: 0,
      totalVolunteeredHours: 0,
      skills: [],
      joinedDate: '',
      avatarBg: 'bg-slate-600',
      tier: 'متطوع برونزي' as const,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">قائمة المتطوعين المنضمين للمبادرة</h3>
              <p className="text-xs text-slate-300">
                {activity.title} ({participants.length} من {activity.requiredVolunteers})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Opportunity Summary Banner */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 p-4 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              {activity.organization}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {activity.location}
            </span>
          </div>
          <div className="bg-emerald-600 text-white font-black px-2.5 py-0.5 rounded-lg text-[11px]">
            +{activity.durationHours} س معتمدة
          </div>
        </div>

        {/* Participants List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5 divide-y divide-slate-100">
          {participants.length > 0 ? (
            participants.map((vol, index) => {
              const formattedPhone = vol.phone ? vol.phone.replace(/\s+/g, '') : '';
              return (
                <div
                  key={vol.id}
                  className="pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-200">
                      {index + 1}
                    </div>

                    <div className={`w-9 h-9 rounded-full ${vol.avatarBg || 'bg-emerald-600'} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                      {vol.name.charAt(0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{vol.name}</span>
                        <span className="text-[10px] bg-emerald-100/70 text-emerald-800 border border-emerald-200 px-2 py-0.2 rounded-full font-semibold">
                          {vol.tier || 'متطوع'}
                        </span>
                      </div>

                      {/* Phone and Email */}
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                        {vol.phone ? (
                          <span className="font-mono text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span dir="ltr">{vol.phone}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">الهاتف: غير متوفر</span>
                        )}

                        {vol.email && (
                          <span className="text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span dir="ltr" className="truncate max-w-[150px]">{vol.email}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Contact Actions */}
                  {formattedPhone && (
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <a
                        href={`tel:${formattedPhone}`}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-2xs"
                        title="اتصال هاتفي مباشر"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>اتصال</span>
                      </a>

                      <a
                        href={`https://wa.me/213${formattedPhone.replace(/^0/, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shadow-2xs"
                        title="مراسلة عبر واتساب"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>واتساب</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-600">لا يوجد متطوعون منضمون لهذه المبادرة بعد</p>
              <p className="text-[11px] text-slate-400 mt-0.5">فور انضمام أي متطوع ستظهر بياناته ورقم هاتفه هنا تلقائياً.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>إجمالي المنضمين: <strong>{participants.length} متطوع</strong></span>
          <button
            onClick={onClose}
            className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-1.5 px-4 rounded-xl transition text-xs"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
