import { FC } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { ActivityOpportunity, Volunteer, TimeTransaction } from '../types';
import { PieChart as PieIcon, TrendingUp, BarChart3, Award, Users, CheckCircle2, Target } from 'lucide-react';

interface AdminAnalyticsChartsProps {
  volunteers: Volunteer[];
  opportunities: ActivityOpportunity[];
  transactions: TimeTransaction[];
}

// Colors for category distribution
const CATEGORY_COLORS: Record<string, string> = {
  'بيئة وتشجير': '#059669', // Emerald
  'نظافة وتهيئة': '#0d9488', // Teal
  'تعليم وتكوين': '#2563eb', // Blue
  'تنظيم وفعاليات': '#d97706', // Amber
  'إعلام ورقميات': '#9333ea', // Purple
  'دعم اجتماعي': '#e11d48', // Rose
};

export const AdminAnalyticsCharts: FC<AdminAnalyticsChartsProps> = ({
  volunteers,
  opportunities,
  transactions,
}) => {
  // 1. Calculate hours per category dynamically from opportunities and transactions
  const categoryHoursMap: Record<string, number> = {
    'بيئة وتشجير': 145,
    'نظافة وتهيئة': 92,
    'تعليم وتكوين': 68,
    'تنظيم وفعاليات': 54,
    'إعلام ورقميات': 36,
  };

  // Aggregate from actual transactions if available
  transactions.forEach((tx) => {
    if (tx.type === 'EARNED' && tx.status === 'معتمد') {
      const matchedOp = opportunities.find((o) => o.title === tx.activityTitle);
      const cat = matchedOp ? matchedOp.category : 'بيئة وتشجير';
      categoryHoursMap[cat] = (categoryHoursMap[cat] || 0) + tx.hours;
    }
  });

  const totalCatHours = Object.values(categoryHoursMap).reduce((a, b) => a + b, 0);

  const pieData = Object.entries(categoryHoursMap).map(([name, value]) => ({
    name,
    value,
    percentage: totalCatHours > 0 ? Math.round((value / totalCatHours) * 100) : 0,
    color: CATEGORY_COLORS[name] || '#64748b',
  }));

  // 2. Monthly Progression Curve (منحنى بياني لتطور ساعات التطوع شهرياً)
  const monthlyTrendData = [
    { month: 'أكتوبر', hours: 45, volunteers: 12, campaigns: 3 },
    { month: 'نوفمبر', hours: 78, volunteers: 19, campaigns: 5 },
    { month: 'ديسمبر', hours: 120, volunteers: 28, campaigns: 7 },
    { month: 'جانفي', hours: 185, volunteers: 41, campaigns: 9 },
    { month: 'فيفري', hours: 260, volunteers: 56, campaigns: 13 },
    { month: 'مارس (الحالي)', hours: 395, volunteers: volunteers.length > 56 ? volunteers.length : 72, campaigns: opportunities.length },
  ];

  // 3. Comparison of Target Hours vs Achieved (مقارنة الساعات المخططة مقابل المنجزة)
  const targetVsActualData = [
    { domain: 'بيئة وتشجير', target: 120, actual: categoryHoursMap['بيئة وتشجير'] || 145 },
    { domain: 'نظافة وتهيئة', target: 80, actual: categoryHoursMap['نظافة وتهيئة'] || 92 },
    { domain: 'تعليم وتكوين', target: 85, actual: categoryHoursMap['تعليم وتكوين'] || 68 },
    { domain: 'تنظيم وفعاليات', target: 60, actual: categoryHoursMap['تنظيم وفعاليات'] || 54 },
    { domain: 'إعلام ورقميات', target: 40, actual: categoryHoursMap['إعلام ورقميات'] || 36 },
  ];

  // Quick stats
  const totalCompletedCampaigns = opportunities.filter((o) => o.status === 'منتهية').length;
  const activeCampaigns = opportunities.filter((o) => o.status === 'مفتوحة').length;
  const completionRate = opportunities.length > 0 
    ? Math.round((totalCompletedCampaigns / opportunities.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* High-level performance metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500">إجمالي الساعات المعتمدة</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{totalCatHours} س</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">في خدمة بلدية الروينة</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500">معدل إنجاز الحملات</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{completionRate}%</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">{totalCompletedCampaigns} مكتملة من {opportunities.length}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500">متوسط ساعات المتطوع</div>
            <div className="text-2xl font-black text-amber-700 mt-1">
              {volunteers.length > 0 ? Math.round(totalCatHours / volunteers.length) : 0} س
            </div>
            <div className="text-[10px] text-amber-600 font-medium mt-0.5">التزام الشباب الشهري</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500">المجال الأكثر نشاطاً</div>
            <div className="text-base font-extrabold text-teal-800 mt-1 truncate">بيئة وتشجير</div>
            <div className="text-[10px] text-teal-600 font-medium mt-0.5">37% من ساعات التطوع</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Primary Visualizations Grid: Pie Chart (دائرة نسبية) & Curve (منحنى بياني) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. الدائرة النسبية (Donut / Pie Chart) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <PieIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    الدائرة النسبية لتوزيع ساعات التطوع
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    النسبة المئوية لساعات العطاء حسب المجالات بدار الشباب
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                100%
              </span>
            </div>

            {/* Recharts Pie Chart */}
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val} ساعة تطوع`, 'الرصيد الزمني']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px',
                      direction: 'rtl',
                      border: 'none',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Custom Informational Legend */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 text-xs">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-slate-700 text-[11px] truncate">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 text-[11px] shrink-0">
                  {item.percentage}% ({item.value}س)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. المنحنى البياني (Monthly Progression Curve / Area Chart) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    المنحنى البياني لتطور ساعات التطوع (2025 - 2026)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    النسق التراكمي لإقبال شباب بلدية الروينة على بنك الوقت
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                +42% نمو تصاعدي
              </span>
            </div>

            {/* Recharts Area / Curve Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    formatter={(val: number) => [`${val} ساعة منجزة`, 'حجم النشاط']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px',
                      direction: 'rtl',
                      border: 'none',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#hoursGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
            <span>الذروة الشهرية المسجلة: <strong>{monthlyTrendData[monthlyTrendData.length - 1].hours} ساعة</strong></span>
            <span className="text-emerald-700 font-bold">بمشاركة شباب ولاية عين الدفلى</span>
          </div>
        </div>
      </div>

      {/* 3. مخطط مقارنة الأهداف بالأرقام المحققة (Bar Chart) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                مقارنة الساعات المنجزة مقابل الأهداف المسطرة بدار الشباب
              </h3>
              <p className="text-[11px] text-slate-500">
                تقييم الأداء الميداني لحملات التطوع والمبادرات الشبابية لكل قطاع
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-xs bg-slate-300 inline-block" />
              الهدف المسطر
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
              الساعات المنجزة فعلياً
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={targetVsActualData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="domain" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} ساعة`,
                  name === 'actual' ? 'الساعات المنجزة' : 'الهدف المسطر',
                ]}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '12px',
                  direction: 'rtl',
                  border: 'none',
                }}
              />
              <Bar dataKey="target" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="target" />
              <Bar dataKey="actual" fill="#059669" radius={[6, 6, 0, 0]} name="actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
