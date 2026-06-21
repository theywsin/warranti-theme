import React, { useState } from 'react';
import { 
  BarChart, Users, ClipboardList, ShieldAlert, Award, FileText, 
  Settings, MessageSquare, ShieldCheck, CheckCircle2, UserPlus, 
  Wifi, WifiOff, RefreshCw, Database, HelpCircle, Smartphone, ExternalLink 
} from 'lucide-react';

interface Technician {
  id: number;
  name: string;
  phone: string;
  specialty: string;
  online_status: 'online' | 'offline' | 'busy';
  rating: number;
}

interface ServiceRequest {
  id: number;
  tracking_code: string;
  customer_name: string;
  customer_phone: string;
  device_brand: string;
  service_type: string;
  description: string;
  uploaded_image?: string;
  technician_id: number;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'canceled';
  created_at: string;
}

interface Warranty {
  id: number;
  serial_number: string;
  customer_name: string;
  device_model: string;
  activation_date: string;
  expiry_date: string;
  status: 'active' | 'expired' | 'voided';
}

export default function AdminSimulator() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Simulated State Table: wp_technicians
  const [technicians, setTechnicians] = useState<Technician[]>([
    { id: 1, name: 'سعید رضایی', phone: '09121112233', specialty: 'کولرهای گازی اسپیلیت و داکت اسپیلیت', online_status: 'online', rating: 4.9 },
    { id: 2, name: 'علیرضا حسینی', phone: '09123334455', specialty: 'تعمیر کمپرسور و برد الکترونیکی', online_status: 'online', rating: 4.8 },
    { id: 3, name: 'محسن کریمی', phone: '09197778899', specialty: 'سرویس دوره ای و عیب یابی تخصصی', online_status: 'offline', rating: 4.7 }
  ]);

  // Simulated State Table: wp_service_requests
  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: 1,
      tracking_code: 'AC-H8FD9K',
      customer_name: 'رضا علیزاده',
      customer_phone: '09159998877',
      device_brand: 'LG',
      service_type: 'سرویس دوره‌ای کولر',
      description: 'کولر روشن می‌شود ولی پرتاب باد گرم دارد و موتور خارجی صدا می‌دهد.',
      technician_id: 1,
      status: 'assigned',
      created_at: '2026-06-21 08:30'
    },
    {
      id: 2,
      tracking_code: 'AC-Y2X3B9',
      customer_name: 'مینا احمدی',
      customer_phone: '09371112233',
      device_brand: 'Samsung',
      service_type: 'تعمیرات کمپرسور',
      description: 'پنل خاموش است و کد خطای لرزش می دهد.',
      technician_id: 0,
      status: 'pending',
      created_at: '2026-06-21 09:15'
    }
  ]);

  // Simulated State Table: wp_warranty
  const [warranties, setWarranties] = useState<Warranty[]>([
    { id: 1, serial_number: 'WAR-992381', customer_name: 'داوود راد', device_model: 'کولر گازی ۲۴۰۰۰ اسپند', activation_date: '2026-01-10', expiry_date: '2027-07-10', status: 'active' },
    { id: 2, serial_number: 'WAR-110292', customer_name: 'مریم اکبری', device_model: 'داکت اسپیلیت ال جی', activation_date: '2025-02-15', expiry_date: '2026-02-15', status: 'expired' }
  ]);

  // Modals / Input Forms States
  const [newTech, setNewTech] = useState({ name: '', phone: '', specialty: '', online_status: 'online' as any });
  const [newWarranty, setNewWarranty] = useState({ serial: 'WAR-' + Math.floor(100000 + Math.random() * 90000) , name: '', model: '', duration: '18' });
  const [smsLogs, setSmsLogs] = useState<{ id: number; phone: string; msg: string; time: string }[]>([]);
  const [warrantySearch, setWarrantySearch] = useState('');
  const [warrantySearchResult, setWarrantySearchResult] = useState<any>(null);

  // Add Technicians callback
  const handleAddTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTech.name || !newTech.phone) return;
    const added: Technician = {
      id: technicians.length + 1,
      name: newTech.name,
      phone: newTech.phone,
      specialty: newTech.specialty || 'خدمات عمومی',
      online_status: newTech.online_status,
      rating: 5.0
    };
    setTechnicians([...technicians, added]);
    setNewTech({ name: '', phone: '', specialty: '', online_status: 'online' });
  };

  // Change online status callback
  const toggleTechStatus = (id: number) => {
    setTechnicians(technicians.map(t => {
      if (t.id === id) {
        const statuses: ('online' | 'offline' | 'busy')[] = ['online', 'offline', 'busy'];
        const currentIdx = statuses.indexOf(t.online_status);
        const nextIdx = (currentIdx + 1) % statuses.length;
        return { ...t, online_status: statuses[nextIdx] };
      }
      return t;
    }));
  };

  // Assign request callback
  const handleAssignRequest = (requestId: number, techId: number) => {
    setRequests(requests.map(r => {
      if (r.id === requestId) {
        const tech = technicians.find(t => t.id === techId);
        // Fire simulated SMS gateway log
        if (tech) {
          const logMsg = `پیامک به مشتری ${r.customer_name}: درخواست گارانتی مطبوع شما ثبت شده و تکنسین مجرب ما جناب ${tech.name} هم‌اکنون به سمت آدرس اعزام شد. تلفن هماهنگی: ${tech.phone}`;
          const currentT = new Date().toLocaleTimeString('fa-IR');
          setSmsLogs(prev => [{ id: prev.length + 1, phone: r.customer_phone, msg: logMsg, time: currentT }, ...prev]);
        }
        return { ...r, technician_id: techId, status: techId > 0 ? 'assigned' : 'pending' };
      }
      return r;
    }));
  };

  // Update request status callback
  const handleStatusChange = (requestId: number, newStatus: any) => {
    setRequests(requests.map(r => {
      if (r.id === requestId) {
        const currentT = new Date().toLocaleTimeString('fa-IR');
        const tech = technicians.find(t => t.id === r.technician_id);
        const logMsg = `پیامک به مشتری ${r.customer_name}: وضعیت درخواست شما با موفقیت به [ ${newStatus === 'completed' ? 'تکمیل شده و دارای ۱۸ ماه گارانتی قطعات' : 'در حال انجام'} ] تغییر یافت.`;
        setSmsLogs(prev => [{ id: prev.length + 1, phone: r.customer_phone, msg: logMsg, time: currentT }, ...prev]);
        return { ...r, status: newStatus };
      }
      return r;
    }));
  };

  // Issue golden warranty callback
  const handleIssueWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWarranty.name || !newWarranty.model) return;
    
    const today = new Date();
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + parseInt(newWarranty.duration));

    const added: Warranty = {
      id: warranties.length + 1,
      serial_number: newWarranty.serial,
      customer_name: newWarranty.name,
      device_model: newWarranty.model,
      activation_date: today.toISOString().split('T')[0],
      expiry_date: expiry.toISOString().split('T')[0],
      status: 'active'
    };
    
    setWarranties([added, ...warranties]);
    setNewWarranty({ serial: 'WAR-' + Math.floor(100000 + Math.random() * 90000), name: '', model: '', duration: '18' });
  };

  // Live warranty searching callback
  const handleWarrantySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = warranties.find(w => w.serial_number.toUpperCase().trim() === warrantySearch.toUpperCase().trim());
    setWarrantySearchResult(found || 'not_found');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl" id="admin-simulator">
      {/* Simulation Banner header */}
      <div className="bg-blue-600 text-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 animate-pulse" />
          <div>
            <h3 className="font-extrabold text-sm md:text-md">پیش‌نمایش زنده دیتابیس و پیشکار مدیریت (WordPress Admin)</h3>
            <p className="text-[10px] text-blue-100 mt-0.5">شبیه‌ساز ارتباط وب‌سایت با جداول wp_service_requests, wp_warranty, wp_technicians</p>
          </div>
        </div>
        <span className="text-[10px] bg-blue-700/80 p-2 rounded-xl px-4 border border-blue-500 font-mono tracking-widest uppercase">
          db_status: Connected (MySQL V8.0)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 min-h-[500px]">
        {/* WP Admin Left Sidebar Menus */}
        <div className="col-span-1 bg-slate-900 text-slate-300 p-4 flex flex-col gap-1 border-l border-slate-800">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 block">پیشکار وردپرس</span>
          
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`text-right w-full text-xs py-3 px-3.5 rounded-xl flex items-center justify-between transition ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2"><BarChart className="w-4 h-4" /> پیشخوان کلی (Dashboard)</span>
          </button>

          <button 
            onClick={() => setActiveTab('technicians')} 
            className={`text-right w-full text-xs py-3 px-3.5 rounded-xl flex items-center justify-between transition ${
              activeTab === 'technicians' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> مدیریت تکنسین‌ها</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-lg">
              {technicians.filter(t => t.online_status === 'online').length} آنلاین
            </span>
          </button>

          <button 
            onClick={() => setActiveTab('requests')} 
            className={`text-right w-full text-xs py-3 px-3.5 rounded-xl flex items-center justify-between transition ${
              activeTab === 'requests' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2"><ClipboardList className="w-4 h-4" /> سفارشات و عیب‌یابی</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-400 font-mono px-2 py-0.5 rounded-lg">
              {requests.filter(r => r.status === 'pending').length} در انتظار
            </span>
          </button>

          <button 
            onClick={() => setActiveTab('warranty')} 
            className={`text-right w-full text-xs py-3 px-3.5 rounded-xl flex items-center justify-between transition ${
              activeTab === 'warranty' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2"><Award className="w-4 h-4" /> صدور و گارانتی طلایی</span>
          </button>

          <button 
            onClick={() => setActiveTab('sms-logs')} 
            className={`text-right w-full text-xs py-3 px-3.5 rounded-xl flex items-center justify-between transition ${
              activeTab === 'sms-logs' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> وب‌سرویس پیامکی</span>
            {smsLogs.length > 0 && (
              <span className="text-[9px] bg-red-500 text-white font-mono px-1.5 py-0.5 rounded-full">
                {smsLogs.length}
              </span>
            )}
          </button>

          <div className="border-t border-slate-800/80 my-4 pt-4 flex flex-col gap-1.5">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 block">ارتباطات افزونه ها</span>
            <div className="text-[10px] text-slate-400 px-3 flex flex-col gap-1">
              <span className="flex items-center gap-1.5">🔸 Elementor Pro + Jet</span>
              <span className="flex items-center gap-1.5">🔸 Amelia Setup</span>
              <span className="flex items-center gap-1.5">🔸 Gravity Core Settings</span>
            </div>
          </div>
        </div>

        {/* Content Box Panels */}
        <div className="col-span-1 md:col-span-4 p-6 bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100">
          
          {/* TAB 1: DASHBOARD METRICS */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-md">مرور کلی وضعیت وب‌سایت کمپانی</h4>
                <p className="text-xs text-slate-400">آمار یکپارچه تراکنش‌ها و ارتباط هاب‌های گوناگون</p>
              </div>

              {/* Grid 3 metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
                  <span className="text-xs text-slate-400 font-bold">کل تکنسین ها (wp_technicians)</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{technicians.length}</span>
                    <span className="text-[10px] text-emerald-500 font-semibold">({technicians.filter(t => t.online_status === 'online').length} فعال برای اعزام)</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
                  <span className="text-xs text-slate-400 font-bold">درخواست خدمات (wp_service_requests)</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{requests.length}</span>
                    <span className="text-[10px] text-amber-500 font-semibold">({requests.filter(r => r.status === 'pending').length} پاسخ داده نشده)</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
                  <span className="text-xs text-slate-400 font-bold">کارت گارانتی طلایی صادر شده</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{warranties.length}</span>
                    <span className="text-[10px] text-purple-500 font-semibold">({warranties.filter(w => w.status === 'active').length} بیمه نامه فعال)</span>
                  </div>
                </div>
              </div>

              {/* Developer relations diagram */}
              <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/40 dark:border-blue-900/40 rounded-2xl p-5 flex flex-col gap-3">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                  <Database className="w-4 h-4" /> روابط جداول دیتابیس اختصاصی AirCare Pro
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  هنگامی که مشتری درخواست خدماتی در برگه ثبت سفارش ثبت می کند، یک رکورد با یک **کد پیگیری هوشمند و یونیک** در جدول `wp_service_requests` ثبت شده و به طور پیش فرض به تکنسین آنلاین برتر که دارای بالاترین رنکینگ در جدول `wp_technicians` است واگذار می گردد. در ادامه با اتمام فرآیند، فیلد گارانتی جدید با شماره سریال کارت در جدول `wp_warranty` ثبت می شود.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mt-2.5">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] font-mono">
                    wp_technicians
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] font-mono text-blue-600 font-bold">
                    wp_service_requests
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] font-mono">
                    wp_warranty
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] font-mono">
                    wp_appointments
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICIANS DATABASE */}
          {activeTab === 'technicians' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-md">مدیریت تکنسینهای تهویه مطبوع</h4>
                  <p className="text-xs text-slate-400">کنترل آنلاین بودن پرسنل اعزام به آدرس، شماره تماس و سوابق کیفی</p>
                </div>
              </div>

              {/* Form Add Tech */}
              <form onSubmit={handleAddTech} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[10px] text-slate-400 mb-1">نام و نام خانوادگی</label>
                  <input 
                    type="text" 
                    placeholder="علیرضا امیری" 
                    value={newTech.name}
                    onChange={(e) => setNewTech({...newTech, name: e.target.value})}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-250/50 dark:border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[10px] text-slate-400 mb-1">تلفن همراه</label>
                  <input 
                    type="tel" 
                    placeholder="0912..." 
                    value={newTech.phone}
                    onChange={(e) => setNewTech({...newTech, phone: e.target.value})}
                    className="w-full text-xs font-mono text-left bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-250/50 dark:border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[10px] text-slate-400 mb-1">تخصص برودتی</label>
                  <input 
                    type="text" 
                    placeholder="برد، کمپرسور، پمپ" 
                    value={newTech.specialty}
                    onChange={(e) => setNewTech({...newTech, specialty: e.target.value})}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-250/50 dark:border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1">
                  <UserPlus className="w-3.5 h-3.5" /> افزودن نیرو
                </button>
              </form>

              {/* Tech list table */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 overflow-hidden shadow-xs">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 p-3 border-b border-slate-100 dark:border-slate-800">
                      <th className="p-3 text-slate-500">کد</th>
                      <th className="p-3 text-slate-500">نام و تلفن</th>
                      <th className="p-3 text-slate-500">تخصص اصلی فنی</th>
                      <th className="p-3 text-slate-500 text-center">وضعیت زنده</th>
                      <th className="p-3 text-slate-400 text-center">امتیاز مشتری</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {technicians.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <td className="p-3 font-mono text-slate-400">#{t.id}</td>
                        <td className="p-3 font-bold">
                          <div>{t.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono text-right rtl-ltr mt-0.5">{t.phone}</div>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-350">{t.specialty}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => toggleTechStatus(t.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold transition mx-auto cursor-pointer ${
                              t.online_status === 'online' 
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' 
                                : t.online_status === 'busy'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                            }`}
                          >
                            {t.online_status === 'online' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                            {t.online_status === 'online' ? 'آماده اعزام' : t.online_status === 'busy' ? 'در محل مشتری' : 'آفلاین'}
                          </button>
                        </td>
                        <td className="p-3 text-center font-bold text-amber-500">⭐ {t.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER SERVICE INQUIRIES */}
          {activeTab === 'requests' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-md">پرونده‌های فعال عیب‌یابی و درخواست خدمات</h4>
                <p className="text-xs text-slate-400">ثبت شده توسط فرانت‌اند به همراه اختصاص دادن تکنسین آنلاین و فلوهای پیامکی</p>
              </div>

              <div className="flex flex-col gap-4">
                {requests.map(r => {
                  const assignedTech = technicians.find(t => t.id === r.technician_id);
                  return (
                    <div key={r.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-xs flex flex-col gap-4">
                      {/* Flex header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 dark:border-slate-700 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 p-1 px-2.5 rounded-lg">
                            {r.tracking_code}
                          </span>
                          <span className="text-xs font-bold text-slate-500">{r.service_type}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{r.created_at}</span>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block mb-1">مشتری ارجمند</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{r.customer_name}</span>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{r.customer_phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-1">جزئیات کولر گازی</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{r.device_brand} - {r.description}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-1">تکنسین اختصاص یافته</span>
                          {r.technician_id === 0 ? (
                            <span className="text-rose-500 font-semibold flex items-center gap-1">❌ اختصاص داده نشده</span>
                          ) : (
                            <span className="text-emerald-600 font-semibold">👨‍🔧 {assignedTech?.name}</span>
                          )}
                        </div>
                      </div>

                      {/* Assignment controls footer */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-50 dark:border-slate-700/80 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-semibold">تغییر وضعیت پرونده:</span>
                          <select
                            value={r.status}
                            onChange={(e) => handleStatusChange(r.id, e.target.value as any)}
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-250/50 dark:border-slate-700 p-1.5 rounded-lg text-[11px] focus:outline-none"
                          >
                            <option value="pending">در انتظار تایید</option>
                            <option value="assigned">ارجاع شده به تکنسین</option>
                            <option value="in_progress">در حال انجام کار</option>
                            <option value="completed">پایان کار و تسویه فاکتور</option>
                            <option value="canceled">لغو شده</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-semibold">ارجاع مستقیم پرسنل:</span>
                          <select
                            value={r.technician_id}
                            onChange={(e) => handleAssignRequest(r.id, parseInt(e.target.value))}
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-250/50 dark:border-slate-700 p-1.5 rounded-lg text-[11px] focus:outline-none"
                          >
                            <option value="0">انتخاب و تخصیص تکنسین...</option>
                            {technicians.map(t => (
                              <option key={t.id} value={t.id}>{t.name} ({t.online_status === 'online' ? 'آنلاین' : 'آفلاین'})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: GOLD WARRANTY CREATION */}
          {activeTab === 'warranty' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Section A: Golden Warranty Issuer */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-md">کارت گارانتی گلد خدمات</h4>
                    <p className="text-xs text-slate-400 font-medium">صدور خودکار ضمانت بیمه برای قطعات نصب و تعمیر</p>
                  </div>

                  <form onSubmit={handleIssueWarranty} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 flex flex-col gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">شماره سریال طلایی صادر شده</label>
                      <input 
                        type="text" 
                        readOnly 
                        value={newWarranty.serial} 
                        className="w-full text-center font-mono font-bold text-blue-600 bg-slate-55 p-2.5 rounded-xl border border-slate-100" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">نام و فامیل مشتری گارانتی</label>
                      <input 
                        type="text" 
                        placeholder="داوود راد..." 
                        value={newWarranty.name}
                        onChange={(e) => setNewWarranty({ ...newWarranty, name: e.target.value })}
                        required
                        className="w-full text-xs bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/50 focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">مدل و برند کولر گازی</label>
                      <input 
                        type="text" 
                        placeholder="کولر گازی ۲۴۰۰۰ اسپند" 
                        value={newWarranty.model}
                        onChange={(e) => setNewWarranty({ ...newWarranty, model: e.target.value })}
                        required
                        className="w-full text-xs bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/50 focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">مدت زمان اعتبار بیمه</label>
                      <select 
                        value={newWarranty.duration}
                        onChange={(e) => setNewWarranty({ ...newWarranty, duration: e.target.value })}
                        className="w-full text-xs bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/50 focus:outline-none"
                      >
                        <option value="12">۱۲ ماه گارانتی قطعات</option>
                        <option value="18">۱۸ ماه گارانتی کیفیت طلایی</option>
                        <option value="24">۲۴ ماه گارانتی کمپرسور خارجی</option>
                      </select>
                    </div>

                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs mt-2 transition shadow-xs">
                      صدور نهایی کارت طلایی گارانتی
                    </button>
                  </form>
                </div>

                {/* Section B: Warranty Lookup Tester */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-md font-bold">تست و استعلام فرانت‌اند</h4>
                    <p className="text-xs text-slate-400">شبیه ساز استعلام زنده کارت گارانتی توسط مشتریان سایت</p>
                  </div>

                  <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col gap-4 border border-slate-800">
                    <form onSubmit={handleWarrantySearch} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="WAR-992381..." 
                        value={warrantySearch}
                        onChange={(e) => setWarrantySearch(e.target.value)}
                        className="flex-1 text-xs text-center font-mono tracking-widest uppercase bg-slate-950 p-2.5 rounded-xl border border-slate-800 focus:outline-none" 
                      />
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold px-4 py-2.5 rounded-xl text-xs transition">استعلام</button>
                    </form>

                    {/* Searching outputs */}
                    {warrantySearchResult === 'not_found' && (
                      <div className="p-3.5 bg-red-900/20 border border-red-500/20 text-red-400 text-xs rounded-xl">
                        ❌ کارت گارانتی طلایی صادر نشده یا مفقود می باشد.
                      </div>
                    )}

                    {warrantySearchResult && warrantySearchResult !== 'not_found' && (
                      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs flex flex-col gap-2.5">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4" /> ضمانت نامه معتبر فعال یافت شد
                        </span>
                        <div className="text-slate-400 flex flex-col gap-1.5 mt-1 font-sans">
                          <span>نام دارنده: <strong className="text-white">{warrantySearchResult.customer_name}</strong></span>
                          <span>دستگاه تحت پشتیبانی: <strong className="text-white">{warrantySearchResult.device_model}</strong></span>
                          <span className="font-mono text-[10px]">تاریخ انقضا: {warrantySearchResult.expiry_date}</span>
                          <span>وضعیت گارانتی: <strong className="text-emerald-500">معتبر و فعال</strong></span>
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-3">
                      💡 راهنمایی: برای تست یکی از موارد زیر را کپی کرده و استعلام بگیرید: 
                      <div className="mt-1 font-mono text-blue-400">WAR-992381 یا WAR-110292</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SMS logs preview */}
          {activeTab === 'sms-logs' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-md">داینامیک هاب وب‌سرویس پیامکی (SMS logs)</h4>
                <p className="text-xs text-slate-400">لاگ وب‌راست های ارسالی به درگاه ملی‌پیامک/کاوه‌نگار بر اثر تغییرات دیتابیس</p>
              </div>

              <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
                {smsLogs.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center text-slate-400 text-xs">
                    درحال حاضر هیچ رویدادی برای ارسال پیامک ثبت نشده است. تغییراتی در پنل گارانتی یا سفارشات ایجاد کنید تا پیامک ارسال گردد.
                  </div>
                ) : (
                  smsLogs.map(log => (
                    <div key={log.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-150/40 dark:border-slate-850 text-xs flex flex-col gap-2 shadow-xs">
                      <div className="flex justify-between items-center text-slate-400 text-[10px]">
                        <span className="font-mono font-bold">گیرنده: {log.phone}</span>
                        <span className="font-mono">{log.time}</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 leading-normal font-sans">{log.msg}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
