import { FC, useState, FormEvent } from 'react';
import { ActivityOpportunity, VolunteerCategory, Volunteer } from '../types';
import { X, PlusCircle, Building2, Calendar, MapPin, Clock, UserCheck } from 'lucide-react';

interface CreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOpportunity: (opportunity: ActivityOpportunity) => void;
  currentVolunteer: Volunteer | null;
}

export const CreateOpportunityModal: FC<CreateOpportunityModalProps> = ({
  isOpen,
  onClose,
  onCreateOpportunity,
  currentVolunteer,
}) => {
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('دار الشباب الروينة بالتنسيق مع المجتمع المدني');
  const [location, setLocation] = useState('محيط بلدية الروينة، عين الدفلى');
  const [category, setCategory] = useState<VolunteerCategory>('بيئة وتشجير');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('السبت القادم');
  const [time, setTime] = useState('09:00 صباحاً - 12:00 زوالاً');
  const [durationHours, setDurationHours] = useState(3);
  const [requiredVolunteers, setRequiredVolunteers] = useState(15);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newOp: ActivityOpportunity = {
      id: `act-${Date.now()}`,
      title: title.trim(),
      organization: organization.trim(),
      youthCenter: 'دار الشباب الروينة',
      wilaya: 'عين الدفلى',
      location: location.trim(),
      category,
      description: description.trim() || 'مبادرة تطوعية تهدف لخدمة شباب ومواطني بلدية الروينة وتثمين العمل التطوعي.',
      date,
      time,
      durationHours,
      requiredVolunteers,
      registeredVolunteerIds: [],
      status: 'مفتوحة',
      isPilotAinDefla: true,
      creatorVolunteerId: currentVolunteer ? currentVolunteer.id : 'dar-chabab-admin',
      creatorVolunteerName: currentVolunteer ? currentVolunteer.name : 'إدارة دار الشباب الروينة',
    };

    onCreateOpportunity(newOp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold">نشر مبادرة تطوعية جديدة (للجمعيات ومؤسسات الشباب)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right">
          
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-900">
            <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span>المنشئ والمشرف على المبادرة: </span>
              <strong className="font-bold">{currentVolunteer ? currentVolunteer.name : 'إدارة دار الشباب الروينة'}</strong>
              <span className="block text-[11px] text-emerald-700 mt-0.5">
                وفقاً لضوابط المنصة: أنت وحدك من سيتمكن من تعديل تفاصيل هذه المبادرة أو إنهاء الحملة وتأكيد الساعات وتوزيعها آلياً على المتطوعين.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">عنوان المبادرة أو النشاط التطوعي:</label>
            <input
              type="text"
              required
              placeholder="مثال: حملة تشجير محيط وادي الشرفة وغرس 200 شجيرة"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المجال التطوعي:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VolunteerCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="بيئة وتشجير">بيئة وتشجير</option>
                <option value="نظافة وتهيئة">نظافة وتهيئة</option>
                <option value="تعليم وتكوين">تعليم وتكوين</option>
                <option value="تنظيم وفعاليات">تنظيم وفعاليات</option>
                <option value="إعلام ورقميات">إعلام ورقميات</option>
                <option value="دعم اجتماعي">دعم اجتماعي</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الجهة المنظمة / الجمعية:</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">مكان النشاط الميداني:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">عدد المتطوعين المطلوب:</label>
              <input
                type="number"
                min={2}
                max={100}
                value={requiredVolunteers}
                onChange={(e) => setRequiredVolunteers(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">التاريخ:</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">التوقيت:</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ساعات الرصيد المكتسبة:</label>
              <input
                type="number"
                min={1}
                max={12}
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">وصف تفصيلي للمهمة التطوعية:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="المهام المطلوبة من الشباب، الأدوات المتوفرة، والهدف من الحملة..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>نشر المبادرة في بنك الوقت</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
