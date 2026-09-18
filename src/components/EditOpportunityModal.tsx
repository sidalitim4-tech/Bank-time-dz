import { FC, useState, useEffect, FormEvent } from 'react';
import { ActivityOpportunity, VolunteerCategory } from '../types';
import { X, Edit3, Calendar, MapPin, Clock, Building, Sparkles } from 'lucide-react';

interface EditOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: ActivityOpportunity | null;
  onUpdateOpportunity: (updated: ActivityOpportunity) => void;
}

export const EditOpportunityModal: FC<EditOpportunityModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  onUpdateOpportunity,
}) => {
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<VolunteerCategory>('بيئة وتشجير');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [durationHours, setDurationHours] = useState(3);
  const [requiredVolunteers, setRequiredVolunteers] = useState(15);

  useEffect(() => {
    if (opportunity) {
      setTitle(opportunity.title);
      setOrganization(opportunity.organization);
      setLocation(opportunity.location);
      setCategory(opportunity.category);
      setDescription(opportunity.description);
      setDate(opportunity.date);
      setTime(opportunity.time);
      setDurationHours(opportunity.durationHours);
      setRequiredVolunteers(opportunity.requiredVolunteers);
    }
  }, [opportunity]);

  if (!isOpen || !opportunity) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updated: ActivityOpportunity = {
      ...opportunity,
      title: title.trim(),
      organization: organization.trim(),
      location: location.trim(),
      category,
      description: description.trim(),
      date: date.trim(),
      time: time.trim(),
      durationHours,
      requiredVolunteers,
    };

    onUpdateOpportunity(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 my-8 animate-in fade-in">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold">تعديل محتوى المبادرة التطوعية</h3>
              <p className="text-[11px] text-slate-300">صلاحية خاصة بصاحب المبادرة أو إدارة دار الشباب</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">عنوان المبادرة أو الحملة:</label>
            <input
              type="text"
              required
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
              <label className="block text-xs font-bold text-slate-700 mb-1">تاريخ التنظيم:</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">توقيت النشاط:</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ساعات الرصيد:</label>
              <input
                type="number"
                min="1"
                max="12"
                value={durationHours}
                onChange={(e) => setDurationHours(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المتطوعون المطلوبون:</label>
              <input
                type="number"
                min="1"
                max="100"
                value={requiredVolunteers}
                onChange={(e) => setRequiredVolunteers(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل وأهداف المبادرة:</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-xl transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>حفظ التعديلات</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
