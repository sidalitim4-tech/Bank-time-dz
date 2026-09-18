export type VolunteerCategory = 
  | 'بيئة وتشجير' 
  | 'نظافة وتهيئة' 
  | 'تعليم وتكوين' 
  | 'تنظيم وفعاليات' 
  | 'دعم اجتماعي' 
  | 'إعلام ورقميات';

export type PerkCategory = 
  | 'شهادة تقدير' 
  | 'تكوين وورشات' 
  | 'رحلات وملتقيات' 
  | 'مرافق وخدمات' 
  | 'تبادل بين الأقران';

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  youthCenter: string; // e.g. "دار الشباب الروينة"
  wilaya: string; // e.g. "عين الدفلى"
  monthlyPledgedHours: number; // e.g. 10 hours
  balanceHours: number; // Current spendable credit
  totalVolunteeredHours: number; // Lifetime hours
  skills: string[];
  joinedDate: string;
  avatarBg: string;
  tier: 'متطوع برونزي' | 'متطوع فضي' | 'متطوع ذهبي' | 'سفير التطوع';
  status?: 'نشط' | 'معطل';
}

export interface ActivityOpportunity {
  id: string;
  title: string;
  organization: string; // e.g. "جمعية أمل الشباب" or "دار الشباب الروينة"
  youthCenter: string;
  wilaya: string;
  location: string;
  category: VolunteerCategory;
  description: string;
  date: string;
  time: string;
  durationHours: number;
  requiredVolunteers: number;
  registeredVolunteerIds: string[];
  status: 'مفتوحة' | 'مكتملة' | 'منتهية' | 'معطلة';
  isPilotAinDefla?: boolean;
  creatorVolunteerId?: string;
  creatorVolunteerName?: string;
  completedAt?: string;
}

export interface TimeTransaction {
  id: string;
  volunteerId: string;
  volunteerName: string;
  activityTitle: string;
  hours: number;
  type: 'EARNED' | 'REDEEMED';
  date: string;
  status: 'معتمد' | 'قيد المراجعة';
  perkName?: string;
  notes?: string;
  verifiedBy?: string;
}

export interface Perk {
  id: string;
  title: string;
  description: string;
  costHours: number;
  category: PerkCategory;
  provider: string; // e.g. "دار الشباب الروينة"
  icon: string;
  badgeText: string;
  availableCount: number;
  perkType: 'certificate' | 'workshop' | 'trip' | 'facility' | 'p2p';
}

export interface Certificate {
  id: string;
  serialNumber: string;
  volunteerName: string;
  volunteerId: string;
  totalHours: number;
  activityCampaign: string;
  issueDate: string;
  issuedBy: string; // e.g. "دار الشباب الروينة - ديوان مؤسسات الشباب - مديرية الشباب والرياضة لولاية عين الدفلى"
  qrHash: string;
}
