import { FC, useState } from 'react';
import { Volunteer, ActivityOpportunity, TimeTransaction, AppNotification } from '../types';
import {
  Building2,
  CheckCircle2,
  Clock,
  Users,
  TreePine,
  Plus,
  ShieldCheck,
  Search,
  Award,
  MapPin,
  Lock,
  LogOut,
  Edit3,
  Send,
  Check,
  BarChart3,
  Trash2,
  PauseCircle,
  PlayCircle,
  SlidersHorizontal,
  UserX,
  UserCheck,
  UserPlus,
  AlertTriangle,
  PlusCircle,
  MinusCircle,
  Phone,
  Megaphone,
  Bell,
} from 'lucide-react';
import { AdminAnalyticsCharts } from './AdminAnalyticsCharts';
import { AdminAdjustHoursModal } from './AdminAdjustHoursModal';
import { AdminCreateVolunteerModal } from './AdminCreateVolunteerModal';
import { AdminEditVolunteerModal } from './AdminEditVolunteerModal';
import { OpportunityParticipantsModal } from './OpportunityParticipantsModal';
import { BroadcastNotificationModal } from './BroadcastNotificationModal';

interface DarChababAdminViewProps {
  volunteers: Volunteer[];
  opportunities: ActivityOpportunity[];
  transactions: TimeTransaction[];
  notifications?: AppNotification[];
  onApproveTransaction: (txId: string) => void;
  onOpenCreateOpportunityModal: () => void;
  onLogout?: () => void;
  onEditOpportunity?: (op: ActivityOpportunity) => void;
  onFinishAndDistributeHours?: (op: ActivityOpportunity) => void;
  onDeleteOpportunity?: (opId: string) => void;
  onToggleSuspendOpportunity?: (opId: string) => void;
  onAdjustVolunteerHours?: (
    volunteerId: string,
    amount: number,
    isAddition: boolean,
    reason: string
  ) => void;
  onDeleteVolunteer?: (volunteerId: string) => void;
  onToggleVolunteerStatus?: (volunteerId: string) => void;
  onCreateVolunteer?: (volunteer: Volunteer) => void;
  onUpdateVolunteer?: (volunteerId: string, updates: Partial<Volunteer>) => void;
  onClearAllVolunteers?: () => void;
  onSendNotification?: (notification: AppNotification) => void;
  onDeleteNotification?: (id: string) => void;
}

export const DarChababAdminView: FC<DarChababAdminViewProps> = ({
  volunteers,
  opportunities,
  transactions,
  onApproveTransaction,
  onOpenCreateOpportunityModal,
  onLogout,
  onEditOpportunity,
  onFinishAndDistributeHours,
  onDeleteOpportunity,
  onToggleSuspendOpportunity,
  onAdjustVolunteerHours,
  onDeleteVolunteer,
  onToggleVolunteerStatus,
  onCreateVolunteer,
  onUpdateVolunteer,
  onClearAllVolunteers,
  notifications = [],
  onSendNotification,
  onDeleteNotification,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'roster' | 'analytics' | 'pending' | 'activities' | 'notifications'>('roster');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [adjustModalVolunteer, setAdjustModalVolunteer] = useState<Volunteer | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isCreateVolunteerModalOpen, setIsCreateVolunteerModalOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);
  const [isEditVolunteerModalOpen, setIsEditVolunteerModalOpen] = useState(false);
  const [selectedOpForParticipants, setSelectedOpForParticipants] = useState<ActivityOpportunity | null>(null);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Pending transactions awaiting youth center approval
  const pendingTransactions = transactions.filter((tx) => tx.status === 'قيد المراجعة');

  // Stats calculation
  const totalCommunityHours = volunteers.reduce((acc, v) => acc + v.totalVolunteeredHours, 0);
  const totalRegisteredVolunteers = volunteers.length;
  const activeOpportunitiesCount = opportunities.filter((o) => o.status === 'مفتوحة').length;
  const suspendedOpportunitiesCount = opportunities.filter((o) => o.status === 'معطلة').length;

  const handleDeleteOpConfirm = (op: ActivityOpportunity) => {
    if (!onDeleteOpportunity) return;
    const ok = window.confirm(`هل أنت متأكد من حذف مبادرة "${op.title}" نهائياً من النظام؟`);
    if (ok) {
      onDeleteOpportunity(op.id);
    }
  };

  const handleDeleteVolunteerConfirm = (v: Volunteer) => {
    if (!onDeleteVolunteer) return;
    const ok = window.confirm(
      `هل أنت متأكد من حذف حساب المتطوع "${v.name}" نهائياً من قاعدة بيانات دار الشباب؟`
    );
    if (ok) {
      onDeleteVolunteer(v.id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Management Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm border border-slate-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  لوحة التنسيق والإشراف: دار الشباب الروينة
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  إدارة المبادرات والتحكم في نظام الساعات
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                تنظيم جهود المتطوعين، إدارة الساعات للمشاركين (زيادة / إنقاص)، حذف أو تعطيل المبادرات والأعضاء، وإنشاء حسابات رسمية جديدة للشباب.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onCreateVolunteer && (
              <button
                onClick={() => setIsCreateVolunteerModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs shrink-0"
                title="إنشاء حساب لمتطوع جديد مباشرة من الإدارة"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ تسجيل عضو جديد</span>
              </button>
            )}

            <button
              onClick={onOpenCreateOpportunityModal}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs shrink-0"
              title="إضافة ونشر مبادرة تطوعية جديدة حصرياً عبر البانل"
            >
              <Plus className="w-4 h-4" />
              <span>نشر مبادرة جديدة</span>
            </button>

            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs shrink-0"
              title="إرسال إشعار وبث تنبيه لجميع المتطوعين"
            >
              <Megaphone className="w-4 h-4 text-amber-300" />
              <span>بث إشعار للشباب</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600 font-bold text-xs px-3 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs shrink-0"
                title="تسجيل الخروج وقفل لوحة الإدارة للحفاظ على الخصوصية"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>قفل وخروج</span>
              </button>
            )}
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700 text-right">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-slate-400">إجمالي ساعات خدمة المجتمع</div>
            <div className="text-xl font-extrabold text-white mt-1">{totalCommunityHours} ساعة</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">ساعات مسجلة ومعتمدة</div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-slate-400">شباب متطوعون مسجلون</div>
            <div className="text-xl font-extrabold text-white mt-1">{totalRegisteredVolunteers} متطوع</div>
            <div className="text-[10px] text-slate-300 mt-0.5">قاعدة بيانات دار الشباب</div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-slate-400">ساعات بانتظار الاعتماد</div>
            <div className="text-xl font-extrabold text-amber-400 mt-1">
              {pendingTransactions.reduce((acc, t) => acc + t.hours, 0)} ساعة
            </div>
            <div className="text-[10px] text-amber-300 mt-0.5">{pendingTransactions.length} طلبات معلقة</div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-slate-400">مبادرات المؤسسة الميدانية</div>
            <div className="text-xl font-extrabold text-emerald-400 mt-1">
              {activeOpportunitiesCount}{' '}
              {suspendedOpportunitiesCount > 0 && (
                <span className="text-xs text-rose-400 font-normal">({suspendedOpportunitiesCount} معطلة)</span>
              )}
            </div>
            <div className="text-[10px] text-emerald-300 mt-0.5">مفتوحة للشباب</div>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveAdminTab('roster')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
            activeAdminTab === 'roster'
              ? 'bg-slate-900 text-white shadow-2xs font-extrabold ring-2 ring-slate-800/30'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>خانة المتطوعين والمسجلين ({volunteers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('activities')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
            activeAdminTab === 'activities'
              ? 'bg-slate-900 text-white shadow-2xs font-extrabold ring-2 ring-slate-800/30'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <TreePine className="w-3.5 h-3.5 text-emerald-400" />
          <span>إدارة وتعطيل المبادرات ({opportunities.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('pending')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
            activeAdminTab === 'pending'
              ? 'bg-amber-500 text-slate-950 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>طلبات اعتماد الساعات ({pendingTransactions.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('analytics')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
            activeAdminTab === 'analytics'
              ? 'bg-emerald-600 text-white shadow-2xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>الإحصائيات والرسوم البيانية</span>
        </button>
      </div>

      {/* Tab 0: Visual Analytics & Statistics */}
      {activeAdminTab === 'analytics' && (
        <AdminAnalyticsCharts
          volunteers={volunteers}
          opportunities={opportunities}
          transactions={transactions}
        />
      )}

      {/* Tab 1: Pending Approvals */}
      {activeAdminTab === 'pending' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                طلبات تسجيل الساعات الميدانية المقدمة من المتطوعين
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تأكيد حضور المتطوعين في حملات التشجير والنظافة وإيداع الساعات فوراً في أرصدتهم.
              </p>
            </div>
          </div>

          {pendingTransactions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {pendingTransactions.map((tx) => (
                <div key={tx.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{tx.volunteerName}</span>
                      <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                        بانتظار التأكيد
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 font-semibold">{tx.activityTitle}</div>
                    <div className="text-[11px] text-slate-500">
                      التاريخ: {tx.date} {tx.notes && `• الملاحظات: "${tx.notes}"`}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-left">
                      <div className="text-sm font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                        +{tx.hours} ساعات رصيد
                      </div>
                    </div>
                    <button
                      onClick={() => onApproveTransaction(tx.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>اعتماد وإيداع في الرصيد</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <div className="text-xs font-bold text-slate-700">لا توجد طلبات معلقة حالياً!</div>
              <div className="text-[11px] text-slate-500 mt-1">
                جميع ساعات المتطوعين في دار الشباب الروينة تمت مراجعتها واعتمادها بنجاح.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Roster & Member Management */}
      {activeAdminTab === 'roster' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  سجل المتطوعين والتحكم في نظام الساعات (دار الشباب الروينة)
                </h3>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                  <Lock className="w-3 h-3 text-amber-700" />
                  صلاحيات الإدارة المباشرة
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                تتحكم الإدارة هنا في زيادة أو إنقاص ساعات المشاركين، تعطيل أو حذف الأعضاء، وإنشاء حسابات رسمية جديدة.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {onCreateVolunteer && (
                <button
                  onClick={() => setIsCreateVolunteerModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ إنشاء حساب للناس الجدد</span>
                </button>
              )}

              {onClearAllVolunteers && (
                <button
                  onClick={onClearAllVolunteers}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                  title="إفراغ وتفريغ جميع الأسماء وحذفها نهائياً من الموقع وقاعدة البيانات"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>إفراغ كل الأسماء</span>
                </button>
              )}

              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="بحث بالاسم أو المهارة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 font-semibold">المتطوع والحالة</th>
                  <th className="py-3 px-4 font-semibold">المؤسسة / البلدية</th>
                  <th className="py-3 px-4 font-semibold">الرصيد المتاح</th>
                  <th className="py-3 px-4 font-semibold">إجمالي العطاء</th>
                  <th className="py-3 px-4 font-semibold text-center bg-amber-50/60 text-amber-900 border-x border-amber-100">
                    التحكم بالساعات (زيادة / إنقاص)
                  </th>
                  <th className="py-3 px-4 font-semibold text-center">إدارة العضوية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(() => {
                  const filteredVolunteers = volunteers.filter(
                    (v) =>
                      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (v.phone && v.phone.includes(searchTerm)) ||
                      (v.email && v.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                      (v.wilaya && v.wilaya.toLowerCase().includes(searchTerm.toLowerCase())) ||
                      v.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
                  );

                  if (filteredVolunteers.length === 0) {
                    return (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Users className="w-8 h-8 text-slate-300" />
                            <p className="text-xs font-semibold text-slate-700">لا توجد أي أسماء مسجلة حالياً في النظام</p>
                            <p className="text-[11px] text-slate-400">تم إفراغ الموقع بالكامل. يمكنك إضافة متطوعين جدد متى شئت.</p>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return filteredVolunteers.map((v) => {
                    const isSuspended = v.status === 'معطل';

                    return (
                      <tr key={v.id} className={`transition ${isSuspended ? 'bg-rose-50/30' : 'hover:bg-slate-50/80'}`}>
                        {/* Volunteer identity & status */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full ${v.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                              {v.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{v.name}</span>
                                {isSuspended ? (
                                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <UserX className="w-3 h-3" />
                                    معطل
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-full">
                                    نشط
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                                <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80 flex items-center gap-1">
                                  <Phone className="w-2.5 h-2.5 text-emerald-600" />
                                  <span dir="ltr">{v.phone}</span>
                                </span>
                                <span>• {v.monthlyPledgedHours} س/شهر</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Center & Wilaya */}
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          <div>{v.youthCenter}</div>
                          <div className="text-[10px] text-slate-400">{v.wilaya}</div>
                        </td>

                        {/* Balance */}
                        <td className="py-3.5 px-4">
                          <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-sm">
                            {v.balanceHours} س
                          </span>
                        </td>

                        {/* Total volunteered */}
                        <td className="py-3.5 px-4 font-bold text-slate-700">
                          {v.totalVolunteeredHours} ساعة
                        </td>

                        {/* Requirement 3: Admin Controls Hours (Increase / Decrease) */}
                        <td className="py-3.5 px-4 bg-amber-50/40 border-x border-amber-100/80">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Quick +1 hour */}
                            {onAdjustVolunteerHours && (
                              <button
                                onClick={() =>
                                  onAdjustVolunteerHours(v.id, 1, true, 'إضافة ساعة إدارية تشجيعية')
                                }
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition shadow-2xs flex items-center gap-1"
                                title="إضافة ساعة واحدة فوراً (+1)"
                              >
                                <PlusCircle className="w-3 h-3" />
                                <span>+1س</span>
                              </button>
                            )}

                            {/* Quick -1 hour */}
                            {onAdjustVolunteerHours && (
                              <button
                                onClick={() =>
                                  onAdjustVolunteerHours(v.id, 1, false, 'حسم ساعة إدارية')
                                }
                                disabled={v.balanceHours <= 0}
                                className="px-2 py-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-lg font-bold text-[11px] transition shadow-2xs flex items-center gap-1"
                                title="حسم ساعة واحدة فوراً (-1)"
                              >
                                <MinusCircle className="w-3 h-3" />
                                <span>-1س</span>
                              </button>
                            )}

                            {/* Advanced Adjustment Modal Trigger */}
                            <button
                              onClick={() => {
                                setAdjustModalVolunteer(v);
                                setIsAdjustModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-bold text-[11px] transition flex items-center gap-1 shadow-2xs"
                              title="فتح نافذة التحكم وتحديد عدد الساعات والسبب"
                            >
                              <SlidersHorizontal className="w-3 h-3 text-amber-700" />
                              <span>تعديل الساعات (+ / -)</span>
                            </button>
                          </div>
                        </td>

                        {/* Admin Volunteer Actions: Edit, Suspend, Delete */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit Volunteer Details */}
                            {onUpdateVolunteer && (
                              <button
                                onClick={() => {
                                  setEditingVolunteer(v);
                                  setIsEditVolunteerModalOpen(true);
                                }}
                                className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition border border-blue-200"
                                title="تعديل بيانات المتطوع وسجل ساعاته"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Suspend / Activate Toggle */}
                            {onToggleVolunteerStatus && (
                              <button
                                onClick={() => onToggleVolunteerStatus(v.id)}
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 border ${
                                  isSuspended
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                                }`}
                                title={isSuspended ? 'تفعيل حساب هذا العضو' : 'تعطيل حساب هذا العضو'}
                              >
                                {isSuspended ? (
                                  <>
                                    <UserCheck className="w-3 h-3 text-emerald-600" />
                                    <span>تنشيط</span>
                                  </>
                                ) : (
                                  <>
                                    <UserX className="w-3 h-3 text-amber-700" />
                                    <span>تعطيل</span>
                                  </>
                                )}
                              </button>
                            )}

                            {/* Delete Member */}
                            {onDeleteVolunteer && (
                              <button
                                onClick={() => handleDeleteVolunteerConfirm(v)}
                                className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-600 rounded-lg transition border border-rose-200/80"
                                title="حذف العضو نهائياً"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Activities - Requirement 1: Delete & Suspend Initiatives */}
      {activeAdminTab === 'activities' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                إدارة مبادرات وحملات المؤسسة (التحكم، التعطيل، والحذف)
              </h3>
              <p className="text-xs text-slate-500">
                يمكن للمسؤولين تعطيل أي مبادرة مؤقتاً أو حذفها نهائياً وتعديل تفاصيلها وتوزيع ساعاتها.
              </p>
            </div>

            <button
              onClick={onOpenCreateOpportunityModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>نشر مبادرة جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map((op) => {
              const isOpCompleted = op.status === 'منتهية';
              const isOpSuspended = op.status === 'معطلة';

              return (
                <div
                  key={op.id}
                  className={`bg-white rounded-2xl border p-5 shadow-2xs space-y-3 flex flex-col justify-between transition ${
                    isOpSuspended
                      ? 'border-rose-300 bg-rose-50/15'
                      : isOpCompleted
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {op.category}
                        </span>

                        {isOpSuspended ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                            <PauseCircle className="w-3 h-3 text-rose-600" />
                            معطلة بقرار إداري
                          </span>
                        ) : isOpCompleted ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            مكتملة وموزعة الساعات
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                            مفتوحة ونشطة
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-extrabold text-emerald-700 shrink-0">
                        +{op.durationHours} س للمتطوع
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{op.title}</h4>

                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{op.location}</span>
                      </div>
                      {op.creatorVolunteerName && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>صاحب المبادرة: <strong>{op.creatorVolunteerName}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2.5">
                    <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>
                        المتطوعون المسجلون: <strong>{op.registeredVolunteerIds.length}</strong> من {op.requiredVolunteers}
                      </span>
                      <span className={isOpCompleted ? 'text-emerald-700 font-bold' : isOpSuspended ? 'text-rose-700 font-bold' : 'text-amber-700 font-bold'}>
                        {isOpCompleted ? 'الساعات معتمدة آلياً' : isOpSuspended ? 'المبادرة معطلة' : 'الحملة جارية'}
                      </span>
                    </div>

                    {/* View joined participants with names & phone numbers */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOpForParticipants(op);
                        setIsParticipantsModalOpen(true);
                      }}
                      className="w-full text-xs font-bold py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200 transition flex items-center justify-center gap-1.5 shadow-2xs"
                      title="عرض قائمة المتطوعين المنضمين مع أرقام هواتفهم للتواصل الميداني"
                    >
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {op.registeredVolunteerIds.length > 0
                          ? `عرض المنضمين (${op.registeredVolunteerIds.length}) • إظهار الأسماء والهواتف`
                          : 'قائمة المنضمين (0)'}
                      </span>
                    </button>

                    {/* Action buttons: Edit, Finish, Suspend, and Delete */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {onEditOpportunity && (
                        <button
                          onClick={() => onEditOpportunity(op)}
                          className="flex-1 text-xs font-bold py-2 px-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition flex items-center justify-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>
                      )}

                      {!isOpCompleted && onFinishAndDistributeHours && (
                        <button
                          onClick={() => onFinishAndDistributeHours(op)}
                          className="flex-1 text-xs font-bold py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-black text-white transition flex items-center justify-center gap-1 shadow-xs"
                          title="إنهاء الحملة وتوزيع الساعات تلقائياً لكل المتطوعين المسجلين"
                        >
                          <Send className="w-3.5 h-3.5 text-amber-400" />
                          <span>توزيع الساعات ({op.registeredVolunteerIds.length})</span>
                        </button>
                      )}

                      {/* Requirement 1: Suspend / Reactivate Initiative */}
                      {onToggleSuspendOpportunity && (
                        <button
                          onClick={() => onToggleSuspendOpportunity(op.id)}
                          className={`text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1 border ${
                            isOpSuspended
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                          }`}
                          title={isOpSuspended ? 'إعادة تفعيل المبادرة للمتطوعين' : 'تعطيل المبادرة مؤقتاً'}
                        >
                          {isOpSuspended ? (
                            <>
                              <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>تفعيل</span>
                            </>
                          ) : (
                            <>
                              <PauseCircle className="w-3.5 h-3.5 text-amber-700" />
                              <span>تعطيل</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* Requirement 1: Delete Initiative */}
                      {onDeleteOpportunity && (
                        <button
                          onClick={() => handleDeleteOpConfirm(op)}
                          className="text-xs font-bold py-2 px-3 rounded-xl text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 transition flex items-center justify-center gap-1"
                          title="حذف المبادرة نهائياً من بنك الوقت"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Adjust Hours Modal */}
      <AdminAdjustHoursModal
        isOpen={isAdjustModalOpen}
        volunteer={adjustModalVolunteer}
        onClose={() => {
          setIsAdjustModalOpen(false);
          setAdjustModalVolunteer(null);
        }}
        onConfirmAdjust={(volId, amount, isAdd, reason) => {
          if (onAdjustVolunteerHours) {
            onAdjustVolunteerHours(volId, amount, isAdd, reason);
          }
        }}
      />

      {/* Create Volunteer Modal for Admin */}
      {onCreateVolunteer && (
        <AdminCreateVolunteerModal
          isOpen={isCreateVolunteerModalOpen}
          onClose={() => setIsCreateVolunteerModalOpen(false)}
          onCreateVolunteer={onCreateVolunteer}
        />
      )}

      {/* Edit Volunteer Modal for Admin */}
      <AdminEditVolunteerModal
        isOpen={isEditVolunteerModalOpen}
        volunteer={editingVolunteer}
        onClose={() => {
          setIsEditVolunteerModalOpen(false);
          setEditingVolunteer(null);
        }}
        onSave={(volId, updates) => {
          if (onUpdateVolunteer) {
            onUpdateVolunteer(volId, updates);
          }
        }}
      />

      {/* Opportunity Participants Modal */}
      <OpportunityParticipantsModal
        isOpen={isParticipantsModalOpen}
        onClose={() => {
          setIsParticipantsModalOpen(false);
          setSelectedOpForParticipants(null);
        }}
        activity={selectedOpForParticipants}
        volunteers={volunteers}
      />

    </div>
  );
};

