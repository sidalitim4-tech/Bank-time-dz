import { FC, useState } from 'react';
import { ActivityOpportunity, Volunteer } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Building2,
  Lock,
  UserCheck,
  Edit3,
  Send,
  UserPlus,
  Shield,
  Phone,
} from 'lucide-react';
import { OpportunityParticipantsModal } from './OpportunityParticipantsModal';

interface OpportunityCardProps {
  activity: ActivityOpportunity;
  currentVolunteer: Volunteer | null;
  volunteers?: Volunteer[];
  onToggleJoin: (activityId: string) => void;
  onEditOpportunity: (activity: ActivityOpportunity) => void;
  onFinishAndDistributeHours: (activity: ActivityOpportunity) => void;
  isAdminMode?: boolean;
}

export const OpportunityCard: FC<OpportunityCardProps> = ({
  activity,
  currentVolunteer,
  volunteers = [],
  onToggleJoin,
  onEditOpportunity,
  onFinishAndDistributeHours,
  isAdminMode = false,
}) => {
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);

  const isJoined = currentVolunteer
    ? activity.registeredVolunteerIds.includes(currentVolunteer.id)
    : false;

  const percentFilled = Math.min(
    100,
    Math.round((activity.registeredVolunteerIds.length / activity.requiredVolunteers) * 100)
  );

  const isCreator =
    isAdminMode ||
    (currentVolunteer &&
      activity.creatorVolunteerId &&
      activity.creatorVolunteerId === currentVolunteer.id);

  const isCompleted = activity.status === 'منتهية';
  const isSuspended = activity.status === 'معطلة';

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'بيئة وتشجير':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'نظافة وتهيئة':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'تعليم وتكوين':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'تنظيم وفعاليات':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'إعلام ورقميات':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
        isSuspended
          ? 'border-rose-300 bg-rose-50/20'
          : isCompleted
          ? 'border-emerald-200/80 bg-emerald-50/20'
          : isCreator
          ? 'border-emerald-300 shadow-xs ring-1 ring-emerald-500/20'
          : 'border-slate-200 shadow-2xs hover:shadow-md'
      }`}
    >
      <div className="p-5">
        {/* Top badges & reward */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                activity.category
              )}`}
            >
              {activity.category}
            </span>
            {isSuspended && (
              <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                <Lock className="w-3 h-3 text-rose-600" />
                معطلة بقرار إداري
              </span>
            )}
            {activity.isPilotAinDefla && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                الروينة
              </span>
            )}
            {isCreator && (
              <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <UserCheck className="w-2.5 h-2.5 text-amber-400" />
                أنت المشرف
              </span>
            )}
          </div>

          <div className="bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>+{activity.durationHours} س</span>
          </div>
        </div>

        {/* Title and Organization */}
        <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug group-hover:text-emerald-700 transition">
          {activity.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700">{activity.organization}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
          {activity.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{activity.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{activity.date}</span>
            <span className="text-slate-300">•</span>
            <span>{activity.time}</span>
          </div>
        </div>

        {/* Volunteers Progress & Joined Participants */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-600 flex items-center gap-1 font-semibold">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              المتطوعون المسجلون:
            </span>
            <span className="font-extrabold text-slate-900">
              {activity.registeredVolunteerIds.length} من {activity.requiredVolunteers}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isCompleted
                  ? 'bg-slate-400'
                  : percentFilled >= 100
                  ? 'bg-amber-500'
                  : 'bg-emerald-600'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>

          {/* Quick Participants Preview & Modal Trigger */}
          <div className="mt-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowParticipantsModal(true)}
              className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 shadow-2xs"
              title="عرض قائمة المنضمين للمبادرة مع أرقام هواتفهم"
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {activity.registeredVolunteerIds.length > 0
                  ? `المنضمون (${activity.registeredVolunteerIds.length}) • إظهار الأسماء والهواتف`
                  : 'قائمة المنضمين (0)'}
              </span>
            </button>

            <span className="text-[10px] text-slate-400">
              نسبة التسجيل: {percentFilled}%
            </span>
          </div>

          {/* Mini participant chips */}
          {activity.registeredVolunteerIds.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {activity.registeredVolunteerIds.slice(0, 3).map((id) => {
                const vol = volunteers.find((v) => v.id === id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setShowParticipantsModal(true)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium border border-slate-200 transition"
                  >
                    <span className="font-semibold">{vol ? vol.name : 'متطوع'}</span>
                    {vol?.phone && (
                      <span className="text-emerald-700 font-mono text-[9px]">({vol.phone})</span>
                    )}
                  </button>
                );
              })}
              {activity.registeredVolunteerIds.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowParticipantsModal(true)}
                  className="text-[10px] font-bold text-emerald-700 hover:underline"
                >
                  +{activity.registeredVolunteerIds.length - 3} آخرين...
                </button>
              )}
            </div>
          )}
        </div>

        {/* Informational Creator / Completion Note */}
        {isCompleted ? (
          <div className="mt-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-2.5 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              انتهت هذه الحملة بنجاح، وتم إرسال واعتماد <strong>{activity.durationHours} ساعات</strong> تلقائياً لجميع المتطوعين المسجلين.
            </span>
          </div>
        ) : isCreator ? (
          <div className="mt-3 bg-amber-50/70 border border-amber-200/60 text-amber-900 rounded-xl p-2 text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              بصفتك منشئ المبادرة: يمكنك إنهاؤها وإرسال الساعات فوراً للمسجلين.
            </span>
          </div>
        ) : (
          <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>
              المخول الوحيد بتعديل المبادرة واعتماد الساعات: <strong>{activity.creatorVolunteerName || 'منشئ المبادرة'}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Requirement 3: Admin cannot register in campaigns */}
        {isAdminMode ? (
          <div className="flex-1 text-xs font-semibold py-2.5 px-3 rounded-xl bg-amber-50/80 text-amber-900 border border-amber-200/80 text-center flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>صفة إدارية إشرافية (لا تسجل الإدارة في الحملات)</span>
          </div>
        ) : isSuspended ? (
          <div className="flex-1 text-xs font-bold py-2.5 px-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-center flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-rose-600" />
            <span>المبادرة معطلة مؤقتاً بقرار إداري من دار الشباب</span>
          </div>
        ) : isCompleted ? (
          <div className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl bg-slate-100 text-slate-500 text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isJoined ? 'شاركت في هذه الحملة واستلمت رصيدك' : 'الحملة مكتملة ومغلقة'}</span>
          </div>
        ) : (
          /* Regular Join / Leave Button */
          <button
            onClick={() => onToggleJoin(activity.id)}
            className={`flex-1 text-xs font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              isJoined
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            {isJoined ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>أنت مسجل بالمبادرة</span>
              </>
            ) : currentVolunteer ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>انضمام للمبادرة</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>تسجيل كمتطوع للمشاركة</span>
              </>
            )}
          </button>
        )}

        {/* Creator-exclusive Action: Edit & End Campaign with Auto Hour Distribution */}
        {isCreator && !isCompleted && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEditOpportunity(activity)}
              className="text-xs font-semibold py-2.5 px-3 rounded-xl text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition flex items-center gap-1 shrink-0"
              title="تعديل نص وتفاصيل المبادرة"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>تعديل المنشور</span>
            </button>

            <button
              onClick={() => onFinishAndDistributeHours(activity)}
              className="text-xs font-bold py-2.5 px-3.5 rounded-xl text-white bg-slate-900 hover:bg-black transition flex items-center gap-1.5 shadow-xs shrink-0"
              title="إنهاء الحملة وإرسال الساعات المكتسبة فوراً لكل المتطوعين المسجلين"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>إنهاء وإرسال الساعات تلقائياً ({activity.registeredVolunteerIds.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Participants Modal displaying registered volunteer names & phone numbers */}
      <OpportunityParticipantsModal
        isOpen={showParticipantsModal}
        onClose={() => setShowParticipantsModal(false)}
        activity={activity}
        volunteers={volunteers}
      />
    </div>
  );
};
