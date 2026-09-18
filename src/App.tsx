/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Volunteer,
  ActivityOpportunity,
  TimeTransaction,
  Perk,
  Certificate
} from './types';
import {
  INITIAL_VOLUNTEERS,
  INITIAL_OPPORTUNITIES,
  INITIAL_TRANSACTIONS,
  INITIAL_PERKS,
  INITIAL_CERTIFICATES
} from './data/initialData';
import { Header } from './components/Header';
import { PilotInfoBanner } from './components/PilotInfoBanner';
import { OpportunitiesView } from './components/OpportunitiesView';
import { TimeLedgerView } from './components/TimeLedgerView';
import { PerksStoreView } from './components/PerksStoreView';
import { CertificatesView } from './components/CertificatesView';
import { DarChababAdminView } from './components/DarChababAdminView';
import { CertificateModal } from './components/CertificateModal';
import { AuthModal } from './components/AuthModal';
import { LogHoursModal } from './components/LogHoursModal';
import { CreateOpportunityModal } from './components/CreateOpportunityModal';
import { EditOpportunityModal } from './components/EditOpportunityModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import {
  CheckCircle2,
  HeartHandshake,
  Lock,
  Shield,
  KeyRound,
  AlertTriangle
} from 'lucide-react';
import {
  seedInitialDataIfEmpty,
  subscribeVolunteers,
  subscribeOpportunities,
  subscribeTransactions,
  subscribePerks,
  subscribeCertificates,
  saveVolunteerDoc,
  updateVolunteerDoc,
  saveOpportunityDoc,
  updateOpportunityDoc,
  saveTransactionDoc,
  saveCertificateDoc,
} from './services/firestoreService';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  // Persistent state
  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => {
    const saved = localStorage.getItem('timebank_volunteers');
    return saved ? JSON.parse(saved) : INITIAL_VOLUNTEERS;
  });

  const [currentVolunteerId, setCurrentVolunteerId] = useState<string>(() => {
    const v2Flag = localStorage.getItem('timebank_guest_flow_v2');
    if (!v2Flag) {
      localStorage.setItem('timebank_guest_flow_v2', 'true');
      localStorage.setItem('timebank_current_vol_id', '');
      return '';
    }
    return localStorage.getItem('timebank_current_vol_id') || '';
  });

  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('register');

  const [opportunities, setOpportunities] = useState<ActivityOpportunity[]>(() => {
    const saved = localStorage.getItem('timebank_opportunities');
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });

  const [transactions, setTransactions] = useState<TimeTransaction[]>(() => {
    const saved = localStorage.getItem('timebank_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [perks, setPerks] = useState<Perk[]>(() => {
    const saved = localStorage.getItem('timebank_perks');
    return saved ? JSON.parse(saved) : INITIAL_PERKS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('timebank_certificates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  // Admin privacy & security state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('timebank_admin_auth') === 'true';
  });

  // UI state - Defaults to 'admin' if admin session is active
  const [activeTab, setActiveTab] = useState<'opportunities' | 'ledger' | 'perks' | 'certificates' | 'admin'>(() => {
    return sessionStorage.getItem('timebank_admin_auth') === 'true' ? 'admin' : 'opportunities';
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // Creator editing modal
  const [editingOpportunity, setEditingOpportunity] = useState<ActivityOpportunity | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLogHoursOpen, setIsLogHoursOpen] = useState(false);
  const [isCreateOpportunityOpen, setIsCreateOpportunityOpen] = useState(false);
  const [selectedActivityForHours, setSelectedActivityForHours] = useState<ActivityOpportunity | null>(null);
  const [previewCertificate, setPreviewCertificate] = useState<Certificate | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('timebank_volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    localStorage.setItem('timebank_current_vol_id', currentVolunteerId);
  }, [currentVolunteerId]);

  useEffect(() => {
    localStorage.setItem('timebank_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('timebank_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('timebank_perks', JSON.stringify(perks));
  }, [perks]);

  useEffect(() => {
    localStorage.setItem('timebank_certificates', JSON.stringify(certificates));
  }, [certificates]);

  // Real-time Firestore synchronization and initialization
  useEffect(() => {
    seedInitialDataIfEmpty().catch(console.error);

    const unsubVolunteers = subscribeVolunteers((data) => {
      if (data && data.length > 0) setVolunteers(data);
    });

    const unsubOps = subscribeOpportunities((data) => {
      if (data && data.length > 0) setOpportunities(data);
    });

    const unsubTxs = subscribeTransactions((data) => {
      if (data && data.length > 0) setTransactions(data);
    });

    const unsubPerks = subscribePerks((data) => {
      if (data && data.length > 0) setPerks(data);
    });

    const unsubCerts = subscribeCertificates((data) => {
      if (data && data.length > 0) setCertificates(data);
    });

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user?.email && user.email.toLowerCase() === 'farouqse13@gmail.com') {
        setIsAdminAuthenticated(true);
        sessionStorage.setItem('timebank_admin_auth', 'true');
      }
    });

    return () => {
      unsubVolunteers();
      unsubOps();
      unsubTxs();
      unsubPerks();
      unsubCerts();
      unsubAuth();
    };
  }, []);

  // Current active volunteer (null if user is in visitor/unauthenticated mode)
  const currentVolunteer = currentVolunteerId
    ? volunteers.find((v) => v.id === currentVolunteerId) || null
    : null;

  const handleOpenAuthModal = (tab: 'login' | 'register' = 'register') => {
    setAuthModalTab(tab);
    setIsRegisterOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Handle Admin Login
  const handleAdminSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('timebank_admin_auth', 'true');
    setActiveTab('admin');
    showToast('تم التحقق بنجاح! مرحباً بك في لوحة إدارة وتنسيق دار الشباب الروينة.');
  };

  // Enforce role separation: Admin does NOT have volunteer ledger, perks store, or volunteer certificate claim
  useEffect(() => {
    if (isAdminAuthenticated && activeTab !== 'admin' && activeTab !== 'opportunities') {
      setActiveTab('admin');
    }
  }, [isAdminAuthenticated, activeTab]);

  // Handle Admin Logout
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('timebank_admin_auth');
    if (activeTab === 'admin') {
      setActiveTab('opportunities');
    }
    showToast('تم قفل لوحة الإدارة وتسجيل الخروج بنجاح لحماية الخصوصية.');
  };

  // Join / Leave Opportunity
  const handleToggleJoin = (activityId: string) => {
    // Critical restriction: Guests must register/login as volunteers before participating
    if (!currentVolunteer) {
      handleOpenAuthModal('register');
      showToast('لا يمكن المشاركة في المبادرات قبل تسجيل الدخول كمتطوع. يرجى تسجيل الدخول أو إنشاء حساب جديد.');
      return;
    }

    if (currentVolunteer.status === 'معطل') {
      showToast('عذراً: حسابك معطل حالياً بقرار إداري. يرجى مراجعة إدارة دار الشباب الروينة لتفعيل الحساب.');
      return;
    }

    setOpportunities((prev) =>
      prev.map((op) => {
        if (op.id !== activityId) return op;
        if (op.status === 'معطلة') {
          showToast('هذه المبادرة معطلة حالياً بقرار إداري ولا يمكن الانضمام إليها.');
          return op;
        }
        if (op.status === 'منتهية') {
          showToast('هذه الحملة انتهت بالفعل وتم توزيع ساعاتها.');
          return op;
        }

        const alreadyJoined = op.registeredVolunteerIds.includes(currentVolunteer.id);
        const updated = alreadyJoined
          ? op.registeredVolunteerIds.filter((id) => id !== currentVolunteer.id)
          : [...op.registeredVolunteerIds, currentVolunteer.id];

        // Persist to Firestore
        updateOpportunityDoc(activityId, { registeredVolunteerIds: updated }).catch(console.error);

        if (alreadyJoined) {
          showToast(`تم إلغاء تسجيلك في مبادرة: ${op.title}`);
        } else {
          showToast(`رائع! تم تسجيلك بنجاح في مبادرة: ${op.title}. ستصلك الساعات تلقائياً فور إنهاء الحملة.`);
        }

        return { ...op, registeredVolunteerIds: updated };
      })
    );
  };

  // Edit Opportunity (strictly for creator or admin)
  const handleOpenEditOpportunity = (activity: ActivityOpportunity) => {
    const isCreator = (currentVolunteer && activity.creatorVolunteerId === currentVolunteer.id) || isAdminAuthenticated;
    if (!isCreator) {
      showToast('عذراً: صاحب المبادرة وحده هو المخول بتعديل محتوى هذا المنشور.');
      return;
    }
    setEditingOpportunity(activity);
  };

  const handleUpdateOpportunity = (updated: ActivityOpportunity) => {
    setOpportunities((prev) =>
      prev.map((op) => (op.id === updated.id ? updated : op))
    );
    // Persist to Firestore
    updateOpportunityDoc(updated.id, updated).catch(console.error);
    showToast(`تم تحديث بيانات مبادرة "${updated.title}" بنجاح.`);
  };

  // Automated Hour Confirmation Upon Campaign Completion
  // Requirement: "بمجرد انتهاء الحملة يتم ارسال الساعات تلقائيا لكل المتطوعين"
  // Requirement: "من يضيف مبادرة تطوعية هو وحده من يستطيع تعديل محتوى المنشور او تاكيد الساعات"
  const handleFinishAndDistributeHours = (activity: ActivityOpportunity) => {
    const isCreator = (currentVolunteer && activity.creatorVolunteerId === currentVolunteer.id) || isAdminAuthenticated;
    if (!isCreator) {
      showToast('عذراً: صاحب المبادرة هو وحده من يستطيع إنهاء الحملة وتأكيد ساعاتها.');
      return;
    }

    if (activity.status === 'منتهية') {
      showToast('تم إنهاء هذه الحملة وتوزيع ساعاتها مسبقاً.');
      return;
    }

    const volunteerIdsToCredit = activity.registeredVolunteerIds;
    if (volunteerIdsToCredit.length === 0) {
      const confirmEnd = window.confirm(
        'لا يوجد أي متطوع مسجل حالياً في هذه المبادرة. هل تريد إغلاق الحملة وإنهاءها دون توزيع ساعات؟'
      );
      if (!confirmEnd) return;

      const completedAtStr = new Date().toISOString();
      setOpportunities((prev) =>
        prev.map((op) =>
          op.id === activity.id
            ? { ...op, status: 'منتهية', completedAt: completedAtStr }
            : op
        )
      );
      updateOpportunityDoc(activity.id, { status: 'منتهية', completedAt: completedAtStr }).catch(console.error);
      showToast(`تم إغلاق الحملة "${activity.title}".`);
      return;
    }

    const hoursPerVolunteer = activity.durationHours;
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Credit hours to all registered volunteers
    setVolunteers((prevVolunteers) =>
      prevVolunteers.map((vol) => {
        if (volunteerIdsToCredit.includes(vol.id)) {
          const updatedBalance = vol.balanceHours + hoursPerVolunteer;
          const updatedTotal = vol.totalVolunteeredHours + hoursPerVolunteer;
          updateVolunteerDoc(vol.id, {
            balanceHours: updatedBalance,
            totalVolunteeredHours: updatedTotal,
          }).catch(console.error);
          return {
            ...vol,
            balanceHours: updatedBalance,
            totalVolunteeredHours: updatedTotal,
          };
        }
        return vol;
      })
    );

    // 2. Automatically generate approved transactions for all registered volunteers
    const newTxList: TimeTransaction[] = volunteerIdsToCredit.map((volId) => {
      const matchedVol = volunteers.find((v) => v.id === volId);
      const volName = matchedVol ? matchedVol.name : 'متطوع مسجل';
      const tx: TimeTransaction = {
        id: `tx-auto-${Date.now()}-${volId}`,
        volunteerId: volId,
        volunteerName: volName,
        activityTitle: activity.title,
        hours: hoursPerVolunteer,
        type: 'EARNED',
        date: todayStr,
        status: 'معتمد',
        notes: `إرسال آلي وتأكيد مباشر لجميع المتطوعين فور انتهاء الحملة الميدانية من قبل صاحب المبادرة (${activity.creatorVolunteerName || currentVolunteer?.name || 'إدارة دار الشباب'}).`,
        verifiedBy: `منشئ المبادرة (${activity.creatorVolunteerName || currentVolunteer?.name || 'إدارة دار الشباب'}) بالتنسيق مع دار الشباب الروينة`,
      };
      saveTransactionDoc(tx).catch(console.error);
      return tx;
    });

    setTransactions((prev) => [...newTxList, ...prev]);

    // 3. Mark the activity as completed
    const completedTimestamp = new Date().toISOString();
    setOpportunities((prev) =>
      prev.map((op) =>
        op.id === activity.id
          ? {
              ...op,
              status: 'منتهية',
              completedAt: completedTimestamp,
            }
          : op
      )
    );
    updateOpportunityDoc(activity.id, { status: 'منتهية', completedAt: completedTimestamp }).catch(console.error);

    showToast(
      `🎉 تم إنهاء الحملة بنجاح وإرسال ${hoursPerVolunteer} ساعات تلقائياً إلى أرصدة جميع المتطوعين (${volunteerIdsToCredit.length} متطوع)!`
    );
  };

  // Log Hours from modal (manual fallback if needed)
  const handleLogHours = (activityTitle: string, hours: number, notes: string, autoApprove: boolean) => {
    if (!currentVolunteer) {
      handleOpenAuthModal('register');
      showToast('يرجى تسجيل الدخول كمتطوع أولاً لتسجيل الساعات.');
      return;
    }

    const newTxId = `tx-${Date.now()}`;
    const status = autoApprove ? 'معتمد' : 'قيد المراجعة';
    const verifiedBy = autoApprove ? 'دار الشباب الروينة' : undefined;

    const newTx: TimeTransaction = {
      id: newTxId,
      volunteerId: currentVolunteer.id,
      volunteerName: currentVolunteer.name,
      activityTitle,
      hours,
      type: 'EARNED',
      date: new Date().toISOString().split('T')[0],
      status,
      notes,
      verifiedBy,
    };

    setTransactions((prev) => [newTx, ...prev]);
    saveTransactionDoc(newTx).catch(console.error);

    if (autoApprove) {
      const newBal = currentVolunteer.balanceHours + hours;
      const newTot = currentVolunteer.totalVolunteeredHours + hours;
      updateVolunteerDoc(currentVolunteer.id, {
        balanceHours: newBal,
        totalVolunteeredHours: newTot,
      }).catch(console.error);

      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === currentVolunteer.id
            ? {
                ...v,
                balanceHours: newBal,
                totalVolunteeredHours: newTot,
              }
            : v
        )
      );
      showToast(`تم تسجيل واعتماد ${hours} ساعات في رصيدك بنجاح!`);
    } else {
      showToast(`تم رفع تقريرك بنجاح (${hours} ساعات). بانتظار مصادقة مدير دار الشباب.`);
    }
  };

  // Coordinator approves a pending transaction
  const handleApproveTransaction = (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;

    const approvedTx: TimeTransaction = { ...tx, status: 'معتمد', verifiedBy: 'مدير دار الشباب الروينة' };
    saveTransactionDoc(approvedTx).catch(console.error);

    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? approvedTx : t))
    );

    setVolunteers((prev) =>
      prev.map((v) => {
        if (v.id === tx.volunteerId) {
          const newBal = v.balanceHours + tx.hours;
          const newTot = v.totalVolunteeredHours + tx.hours;
          updateVolunteerDoc(v.id, {
            balanceHours: newBal,
            totalVolunteeredHours: newTot,
          }).catch(console.error);
          return {
            ...v,
            balanceHours: newBal,
            totalVolunteeredHours: newTot,
          };
        }
        return v;
      })
    );

    showToast(`تمت المصادقة بنجاح على ساعات المتطوع ${tx.volunteerName} وإيداعها في رصيده.`);
  };

  // Redeem a perk
  const handleRedeemPerk = (perk: Perk) => {
    if (!currentVolunteer) {
      handleOpenAuthModal('register');
      showToast('يرجى تسجيل الدخول كمتطوع أولاً لاستبدال الامتيازات.');
      return;
    }

    if (currentVolunteer.balanceHours < perk.costHours) {
      showToast('عذراً، رصيدك من الساعات غير كافٍ للحصول على هذا الامتياز.');
      return;
    }

    // Deduct hours
    const updatedBalance = currentVolunteer.balanceHours - perk.costHours;
    updateVolunteerDoc(currentVolunteer.id, { balanceHours: updatedBalance }).catch(console.error);

    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === currentVolunteer.id
          ? { ...v, balanceHours: updatedBalance }
          : v
      )
    );

    // Add redeemed transaction
    const txId = `tx-${Date.now()}`;
    const newTx: TimeTransaction = {
      id: txId,
      volunteerId: currentVolunteer.id,
      volunteerName: currentVolunteer.name,
      activityTitle: perk.title,
      hours: perk.costHours,
      type: 'REDEEMED',
      date: new Date().toISOString().split('T')[0],
      status: 'معتمد',
      perkName: perk.title,
      verifiedBy: 'إدارة بنك الوقت الروينة',
      notes: `استبدال رصيد مقابل: ${perk.title}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    saveTransactionDoc(newTx).catch(console.error);

    // If perk is certificate, generate it right away
    if (perk.perkType === 'certificate') {
      const serial = `DZ-AD-ROUINA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCert: Certificate = {
        id: `cert-${Date.now()}`,
        serialNumber: serial,
        volunteerName: currentVolunteer.name,
        volunteerId: currentVolunteer.id,
        totalHours: currentVolunteer.totalVolunteeredHours,
        activityCampaign: 'المساهمة المتميزة في خدمة المجتمع عبر بنك الوقت التطوعي بدار الشباب الروينة',
        issueDate: new Date().toISOString().split('T')[0],
        issuedBy: 'دار الشباب الروينة - ديوان مؤسسات الشباب - مديرية الشباب والرياضة لولاية عين الدفلى',
        qrHash: `VERIF-TIMEBANK-${serial}`,
      };
      setCertificates((prev) => [newCert, ...prev]);
      saveCertificateDoc(newCert).catch(console.error);
      setPreviewCertificate(newCert);
    }
  };

  // Generate certificate from CertificatesView
  const handleGenerateNewCertificate = (campaignName: string) => {
    if (!currentVolunteer) {
      handleOpenAuthModal('register');
      showToast('يرجى تسجيل الدخول كمتطوع أولاً لإصدار الشهادات.');
      return;
    }

    if (currentVolunteer.balanceHours < 8) return;

    // Deduct 8 hours
    const updatedBalance = currentVolunteer.balanceHours - 8;
    updateVolunteerDoc(currentVolunteer.id, { balanceHours: updatedBalance }).catch(console.error);

    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === currentVolunteer.id
          ? { ...v, balanceHours: updatedBalance }
          : v
      )
    );

    const serial = `DZ-AD-ROUINA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      serialNumber: serial,
      volunteerName: currentVolunteer.name,
      volunteerId: currentVolunteer.id,
      totalHours: currentVolunteer.totalVolunteeredHours,
      activityCampaign: campaignName,
      issueDate: new Date().toISOString().split('T')[0],
      issuedBy: 'دار الشباب الروينة - ديوان مؤسسات الشباب - مديرية الشباب والرياضة لولاية عين الدفلى',
      qrHash: `VERIF-TIMEBANK-${serial}`,
    };

    setCertificates((prev) => [newCert, ...prev]);
    saveCertificateDoc(newCert).catch(console.error);

    const txId = `tx-${Date.now()}`;
    const newTx: TimeTransaction = {
      id: txId,
      volunteerId: currentVolunteer.id,
      volunteerName: currentVolunteer.name,
      activityTitle: 'إصدار شهادة تقدير وعرفان رسمية مختومة',
      hours: 8,
      type: 'REDEEMED',
      date: new Date().toISOString().split('T')[0],
      status: 'معتمد',
      verifiedBy: 'دار الشباب الروينة',
      notes: `شهادة رقم: ${serial}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    saveTransactionDoc(newTx).catch(console.error);

    showToast('تم إصدار شهادة التقدير بنجاح! جاري عرض الشهادة للمعاينة والطباعة.');
    setPreviewCertificate(newCert);
  };

  // Register a new volunteer
  const handleRegisterVolunteer = (newVol: Volunteer) => {
    setVolunteers((prev) => [newVol, ...prev]);
    setCurrentVolunteerId(newVol.id);
    saveVolunteerDoc(newVol).catch(console.error);

    if (newVol.balanceHours > 0) {
      const welcomeTx: TimeTransaction = {
        id: `tx-welcome-${Date.now()}-${newVol.id}`,
        volunteerId: newVol.id,
        volunteerName: newVol.name,
        activityTitle: 'هدية ترحيبية لتشجيع العمل التطوعي',
        hours: newVol.balanceHours,
        type: 'EARNED',
        date: new Date().toISOString().split('T')[0],
        status: 'معتمد',
        verifiedBy: 'دار الشباب الروينة - بنك الوقت',
        notes: 'رصيد ترحيبي معتمد عند فتح الحساب',
      };
      setTransactions((prev) => [welcomeTx, ...prev]);
      saveTransactionDoc(welcomeTx).catch(console.error);
    }
    showToast(`مرحباً بك يا ${newVol.name}! تم إنشاء حسابك وحفظه بنجاح.`);
  };

  // Volunteer Login from AuthModal
  const handleVolunteerLogin = (vol: Volunteer) => {
    setCurrentVolunteerId(vol.id);
    showToast(`مرحباً بك مجدداً يا ${vol.name}! تم تسجيل الدخول بنجاح.`);
  };

  // Admin: Delete Opportunity permanently
  const handleDeleteOpportunity = (opId: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== opId));
    updateOpportunityDoc(opId, { status: 'معطلة' }).catch(console.error);
    showToast('تم حذف المبادرة نهائياً من نظام بنك الوقت.');
  };

  // Admin: Suspend or Reactivate Opportunity
  const handleToggleSuspendOpportunity = (opId: string) => {
    let newStatusText = '';
    setOpportunities((prev) =>
      prev.map((op) => {
        if (op.id !== opId) return op;
        const newStatus = op.status === 'معطلة' ? 'مفتوحة' : 'معطلة';
        newStatusText = newStatus === 'معطلة' ? 'معطلة مؤقتاً' : 'مفتوحة ونشطة';
        updateOpportunityDoc(op.id, { status: newStatus }).catch(console.error);
        return { ...op, status: newStatus };
      })
    );
    showToast(`تم تحديث حالة المبادرة إلى (${newStatusText}).`);
  };

  // Admin: Adjust volunteer hours (increase or decrease with reason)
  const handleAdjustVolunteerHours = (
    volunteerId: string,
    amount: number,
    isAddition: boolean,
    reason: string
  ) => {
    const targetVol = volunteers.find((v) => v.id === volunteerId);
    if (!targetVol) return;

    const adjustedBalance = isAddition
      ? targetVol.balanceHours + amount
      : Math.max(0, targetVol.balanceHours - amount);

    const adjustedTotal = isAddition
      ? targetVol.totalVolunteeredHours + amount
      : targetVol.totalVolunteeredHours;

    updateVolunteerDoc(volunteerId, {
      balanceHours: adjustedBalance,
      totalVolunteeredHours: adjustedTotal,
    }).catch(console.error);

    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === volunteerId
          ? { ...v, balanceHours: adjustedBalance, totalVolunteeredHours: adjustedTotal }
          : v
      )
    );

    const txId = `tx-adm-${Date.now()}`;
    const newTx: TimeTransaction = {
      id: txId,
      volunteerId: targetVol.id,
      volunteerName: targetVol.name,
      activityTitle: `تعديل رصيد إداري: ${reason}`,
      hours: amount,
      type: isAddition ? 'EARNED' : 'REDEEMED',
      date: new Date().toISOString().split('T')[0],
      status: 'معتمد',
      verifiedBy: 'إدارة دار الشباب الروينة',
      notes: `تعديل إداري مباشر (${isAddition ? 'إضافة' : 'حسم'} ${amount} س) - السبب: ${reason}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    saveTransactionDoc(newTx).catch(console.error);

    showToast(
      `تم ${isAddition ? 'إضافة' : 'حسم'} ${amount} ساعات بنجاح للمتطوع "${targetVol.name}". الرصيد الحالي: ${adjustedBalance} س.`
    );
  };

  // Admin: Delete Volunteer account
  const handleDeleteVolunteer = (volunteerId: string) => {
    const targetVol = volunteers.find((v) => v.id === volunteerId);
    setVolunteers((prev) => prev.filter((v) => v.id !== volunteerId));
    if (currentVolunteerId === volunteerId) {
      setCurrentVolunteerId('');
    }
    updateVolunteerDoc(volunteerId, { status: 'معطل' }).catch(console.error);
    showToast(`تم حذف حساب المتطوع "${targetVol?.name || ''}" نهائياً من قاعدة البيانات.`);
  };

  // Admin: Suspend or Reactivate Volunteer account
  const handleToggleVolunteerStatus = (volunteerId: string) => {
    let updatedStatus = '';
    setVolunteers((prev) =>
      prev.map((v) => {
        if (v.id !== volunteerId) return v;
        const newStatus = v.status === 'معطل' ? 'نشط' : 'معطل';
        updatedStatus = newStatus === 'معطل' ? 'معطل' : 'نشط';
        updateVolunteerDoc(volunteerId, { status: newStatus }).catch(console.error);
        return { ...v, status: newStatus };
      })
    );
    showToast(`تم تحديث حالة حساب المتطوع إلى (${updatedStatus}).`);
  };

  // Admin: Create Volunteer Account for new person
  const handleCreateVolunteer = (newVol: Volunteer) => {
    setVolunteers((prev) => [newVol, ...prev]);
    saveVolunteerDoc(newVol).catch(console.error);

    if (newVol.balanceHours > 0) {
      const newTx: TimeTransaction = {
        id: `tx-init-${Date.now()}`,
        volunteerId: newVol.id,
        volunteerName: newVol.name,
        activityTitle: 'رصيد افتتاحي ترحيبي معتمد من الإدارة',
        hours: newVol.balanceHours,
        type: 'EARNED',
        date: new Date().toISOString().split('T')[0],
        status: 'معتمد',
        verifiedBy: 'إدارة دار الشباب الروينة',
        notes: 'رصيد تحفيزي افتتاحي معتمد من الإدارة',
      };
      setTransactions((prev) => [newTx, ...prev]);
      saveTransactionDoc(newTx).catch(console.error);
    }
    showToast(`تم إنشاء وتثبيت حساب المتطوع الجديد "${newVol.name}" بنجاح في السجل الرسمي.`);
  };

  // Create Opportunity (attaches creator info)
  const handleCreateOpportunity = (newOp: ActivityOpportunity) => {
    setOpportunities((prev) => [newOp, ...prev]);
    saveOpportunityDoc(newOp).catch(console.error);
    showToast(`تم نشر مبادرة "${newOp.title}" بنجاح! بصفتك المنشئ، أنت وحدك من سيتمكن من تعديلها أو توزيع ساعاتها.`);
    setActiveTab('opportunities');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header & Nav (Admin button is strictly hidden unless authenticated) */}
      <Header
        currentVolunteer={currentVolunteer}
        onOpenRegisterModal={(tab) => handleOpenAuthModal(tab || 'register')}
        onLogoutVolunteer={() => {
          setCurrentVolunteerId('');
          localStorage.setItem('timebank_current_vol_id', '');
          showToast('تم تسجيل الخروج. أنت الآن في وضع الزائر؛ انقر على "تسجيل كمتطوع" للانضمام لأي مبادرة.');
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Pilot Informational Banner */}
        <PilotInfoBanner />

        {/* Tab views */}
        {activeTab === 'opportunities' && (
          <OpportunitiesView
            opportunities={opportunities}
            currentVolunteer={currentVolunteer}
            onToggleJoin={handleToggleJoin}
            onLogHoursForActivity={(act) => {
              if (!currentVolunteer) {
                handleOpenAuthModal('register');
                showToast('يرجى تسجيل الدخول أو التسجيل كمتطوع أولاً لتسجيل الساعات.');
                return;
              }
              setSelectedActivityForHours(act);
              setIsLogHoursOpen(true);
            }}
            onOpenCreateOpportunityModal={() => {
              if (!currentVolunteer && !isAdminAuthenticated) {
                handleOpenAuthModal('register');
                showToast('يرجى تسجيل الدخول أو التسجيل كمتطوع أولاً لتتمكن من إضافة مبادرة جديدة.');
                return;
              }
              setIsCreateOpportunityOpen(true);
            }}
            onEditOpportunity={handleOpenEditOpportunity}
            onFinishAndDistributeHours={handleFinishAndDistributeHours}
            isAdminMode={isAdminAuthenticated}
            onOpenAuthModal={(tab) => handleOpenAuthModal(tab || 'register')}
          />
        )}

        {!isAdminAuthenticated && activeTab === 'ledger' && (
          <TimeLedgerView
            currentVolunteer={currentVolunteer}
            transactions={transactions}
            onOpenLogHoursModal={() => {
              if (!currentVolunteer) {
                handleOpenAuthModal('register');
                showToast('يرجى تسجيل الدخول كمتطوع أولاً لتسجيل الساعات.');
                return;
              }
              setSelectedActivityForHours(null);
              setIsLogHoursOpen(true);
            }}
            onNavigateToPerks={() => setActiveTab('perks')}
            onNavigateToCertificates={() => setActiveTab('certificates')}
            onOpenRegisterModal={() => handleOpenAuthModal('register')}
          />
        )}

        {!isAdminAuthenticated && activeTab === 'perks' && (
          <PerksStoreView
            perks={perks}
            currentVolunteer={currentVolunteer}
            onRedeemPerk={handleRedeemPerk}
            onNavigateToOpportunities={() => setActiveTab('opportunities')}
            onOpenRegisterModal={() => handleOpenAuthModal('register')}
          />
        )}

        {!isAdminAuthenticated && activeTab === 'certificates' && (
          <CertificatesView
            certificates={certificates}
            currentVolunteer={currentVolunteer}
            onPreviewCertificate={(cert) => setPreviewCertificate(cert)}
            onGenerateNewCertificate={handleGenerateNewCertificate}
            onOpenRegisterModal={() => handleOpenAuthModal('register')}
          />
        )}

        {activeTab === 'admin' && (
          isAdminAuthenticated ? (
            <DarChababAdminView
              volunteers={volunteers}
              opportunities={opportunities}
              transactions={transactions}
              onApproveTransaction={handleApproveTransaction}
              onOpenCreateOpportunityModal={() => setIsCreateOpportunityOpen(true)}
              onLogout={handleAdminLogout}
              onEditOpportunity={handleOpenEditOpportunity}
              onFinishAndDistributeHours={handleFinishAndDistributeHours}
              onDeleteOpportunity={handleDeleteOpportunity}
              onToggleSuspendOpportunity={handleToggleSuspendOpportunity}
              onAdjustVolunteerHours={handleAdjustVolunteerHours}
              onDeleteVolunteer={handleDeleteVolunteer}
              onToggleVolunteerStatus={handleToggleVolunteerStatus}
              onCreateVolunteer={handleCreateVolunteer}
            />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto my-8 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">هذه الصفحة محمية وخاصة بإدارة دار الشباب</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                لا يمكن لأي شخص الاطلاع على محتوى لوحة الإدارة ومصادقة الساعات إلا بعد إدخال رمز المرور السري المخصص لمسؤول المؤسسة.
              </p>
              <button
                onClick={() => setIsAdminAuthModalOpen(true)}
                className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2 mx-auto shadow-xs"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>إدخال رمز المرور لفتح اللوحة</span>
              </button>
            </div>
          )
        )}

      </main>

      {/* Footer with discreet locked management entrance */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-700">
              مشروع بنك الوقت الشبابي - دار الشباب الروينة • ديوان مؤسسات الشباب • مديرية الشباب والرياضة لولاية عين الدفلى
            </span>
          </div>

          {/* Discreet admin lock trigger (Hidden from normal navigation) */}
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-400 text-center sm:text-left">
              منصة ابتكار اجتماعي لترسيخ التطوع وتبادل الساعات كقيمة ملموسة.
            </span>
            
            {isAdminAuthenticated ? (
              <button
                onClick={handleAdminLogout}
                className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg transition"
              >
                <Lock className="w-3 h-3" />
                <span>قفل جلسة الإدارة</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAdminAuthModalOpen(true)}
                className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 transition opacity-70 hover:opacity-100"
                title="دخول مخصص لإدارة دار الشباب الروينة فقط"
              >
                <Shield className="w-3 h-3" />
                <span>فضاء إشراف المؤسسة</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        volunteers={volunteers}
        onLogin={handleVolunteerLogin}
        onRegister={handleRegisterVolunteer}
        initialTab={authModalTab}
      />

      <LogHoursModal
        isOpen={isLogHoursOpen}
        onClose={() => {
          setIsLogHoursOpen(false);
          setSelectedActivityForHours(null);
        }}
        currentVolunteer={currentVolunteer}
        opportunities={opportunities}
        initialActivity={selectedActivityForHours}
        onLogHours={handleLogHours}
        isAdminMode={isAdminAuthenticated}
      />

      <CreateOpportunityModal
        isOpen={isCreateOpportunityOpen}
        onClose={() => setIsCreateOpportunityOpen(false)}
        onCreateOpportunity={handleCreateOpportunity}
        currentVolunteer={currentVolunteer}
      />

      <EditOpportunityModal
        isOpen={!!editingOpportunity}
        onClose={() => setEditingOpportunity(null)}
        opportunity={editingOpportunity}
        onUpdateOpportunity={handleUpdateOpportunity}
      />

      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      <CertificateModal
        certificate={previewCertificate}
        onClose={() => setPreviewCertificate(null)}
      />

    </div>
  );
}
