import React, { useState } from 'react';
import { BookOpen, Database, Code, HelpCircle, ArrowLeft, ArrowRight, ShieldCheck, CheckSquare } from 'lucide-react';

export default function DocumentationTabs() {
  const [activeSubTab, setActiveSubTab] = useState<'install' | 'database' | 'plugins' | 'shortcodes'>('install');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col gap-6" id="documentation-tabs">
      <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-md">کتابچه راهنما و داک فنی توسعه‌دهندگان</h3>
          <p className="text-xs text-slate-400">کدها و دستورالعمل‌های راه‌اندازی، روابط دیتابیس و شورتکدها</p>
        </div>
      </div>

      {/* Mini tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setActiveSubTab('install')}
          className={`py-2 px-4 rounded-xl font-bold transition ${
            activeSubTab === 'install' 
              ? 'bg-purple-600 text-white shadow-xs' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          گام‌های نصب خودکار
        </button>
        <button
          onClick={() => setActiveSubTab('database')}
          className={`py-2 px-4 rounded-xl font-bold transition ${
            activeSubTab === 'database' 
              ? 'bg-purple-600 text-white shadow-xs' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          جداول پایگاه داده (SQL)
        </button>
        <button
          onClick={() => setActiveSubTab('plugins')}
          className={`py-2 px-4 rounded-xl font-bold transition ${
            activeSubTab === 'plugins' 
              ? 'bg-purple-600 text-white shadow-xs' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          افزونه‌های همراه پکیج
        </button>
        <button
          onClick={() => setActiveSubTab('shortcodes')}
          className={`py-2 px-4 rounded-xl font-bold transition ${
            activeSubTab === 'shortcodes' 
              ? 'bg-purple-600 text-white shadow-xs' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          شورتکدها و قالب‌ها
        </button>
      </div>

      <div className="text-slate-700 dark:text-slate-300 text-xs leading-loose">
        {/* Sub Tab: Install */}
        {activeSubTab === 'install' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">آموزش گام به گام نصب با دستیار هوشمند (Easy Installer)</h4>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 flex-none rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold font-mono">1</span>
                <div>
                  <strong className="text-slate-800 dark:text-white block font-bold mb-1">بارگذاری فایل زیپ پکیج</strong>
                  <p className="text-slate-500 leading-normal">ابتدا فایل دانلودی `theme-package.zip` را استخراج کنید و تمام پوشه `easy-installer` را داخل ریشه هاست لینوکس خود آپلود و باز کنید.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 flex-none rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold font-mono">2</span>
                <div>
                  <strong className="text-slate-800 dark:text-white block font-bold mb-1">ثبت اتصالات MySQL</strong>
                  <p className="text-slate-500 leading-normal">آدرس سایت خود را به همراه مسیر `/easy-installer` باز کنید. اطلاعات مربوط به آدرس هاست دیتابیس (localhost)، نام کاربری و پسورد دیتابیس خود را مطابق فیلدها پر کنید.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 flex-none rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold font-mono">3</span>
                <div>
                  <strong className="text-slate-800 dark:text-white block font-bold mb-1">پیکربندی هوشمند و درون‌ریزی</strong>
                  <p className="text-slate-500 leading-normal">دستیار صب به طور اتوماتیک فایل `db_setup.sql` را خوانده و با ساخت جداول استعلام، قالب AirCare Pro، قالب مگامنوها و یوزرهای ادمین را ایجاد می کند.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sub Tab: Database SQL Schema */}
        {activeSubTab === 'database' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">ساختار کدهای جداول اختصاصی وردپرس (MySQL Schemas)</h4>
            <p className="text-slate-500 leading-relaxed">
              این جداول در زمان اولین فعال‌سازی قالب در بخش مدیریت دیتابیس وردپرس بارگذاری و بذرپاشی (Seed) می‌شوند تا قالب مستقل از ابزارهای فرعی گران‌قیمت کار کند. نمونه کپی‌برداری کدهای ساخت جدول لود شده در `functions.php`:
            </p>
            <pre className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-emerald-400 font-mono text-[10px] overflow-x-auto text-left rtl-ltr leading-normal">
{`CREATE TABLE wp_technicians (
    id mediumint(9) NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    phone varchar(20) NOT NULL,
    specialty varchar(200) NOT NULL,
    online_status enum('online', 'offline', 'busy') DEFAULT 'online' NOT NULL,
    rating decimal(3,2) DEFAULT 5.00 NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE wp_service_requests (
    id mediumint(9) NOT NULL AUTO_INCREMENT,
    tracking_code varchar(20) NOT NULL,
    customer_name varchar(150) NOT NULL,
    customer_phone varchar(20) NOT NULL,
    device_brand varchar(100) NOT NULL,
    service_type varchar(100) NOT NULL,
    description text DEFAULT '',
    uploaded_image varchar(255) DEFAULT '',
    technician_id mediumint(9) DEFAULT 0,
    status varchar(50) DEFAULT 'pending',
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY tracking_code (tracking_code)
);`}
            </pre>
          </div>
        )}

        {/* Sub Tab: Plugins Requirements */}
        {activeSubTab === 'plugins' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">لیست افزونه‌های همراه پکیج و سهم هر یک</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col gap-1.5 border border-slate-100 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white">🔹 Elementor Pro & JetEngine</span>
                <p className="text-slate-500 leading-normal text-[11px]">طراحی چیدمان ظاهری صفحات لندینگ عیب‌یابی برودتی، مدیریت متا داده‌های فیلتر پزشکان، مگامنوها و کارت‌های رسپانسیو.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col gap-1.5 border border-slate-100 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white">🔹 Amelia Pro</span>
                <p className="text-slate-500 leading-normal text-[11px]">موتور نوبت‌دهی آنلاین اختصاصی کولرگازی با قابلیت اتصال به درگاه‌های زرین‌پال و مدیریت بازه‌های زمانی مرخصی تکنسین‌ها.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col gap-1.5 border border-slate-100 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white">🔹 Gravity Forms</span>
                <p className="text-slate-500 leading-normal text-[11px]">طراحی سیستم ثبت نام پرسنل برودتی جدید، گرفتن لوکیشن مشتری، تصویر فاکتورها، و همگام بودن با AJAX.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col gap-1.5 border border-slate-100 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white">🔹 LiteSpeed Cache + Rank Math</span>
                <p className="text-slate-500 leading-normal text-[11px]">تضمین کننده لود و زمان آپتایم ۱ ثانیه‌ای سایت روی موبایل و ارتقای متادیتاهای اسکیما (Schema) برای گوگل.</p>
              </div>
            </div>
          </div>
        )}

        {/* Sub Tab: Shortcodes */}
        {activeSubTab === 'shortcodes' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">لیست هوشمند شورت‌کدهای بهینه‌سازی فرم‌ها</h4>
            <p className="text-slate-500 leading-relaxed">
              توسعه‌دهندگان و کاربران طراح می‌توانند کدهای زیر را در برگه‌های المنتور یا ویرایشگر گوتنبرگ به صورت مستقیم استفاده کنند تا پنل کاربری یا استعلام فراخوانی شود:
            </p>
            <div className="flex flex-col gap-3 font-mono mt-1">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
                <span className="text-purple-600 dark:text-purple-400 font-bold">[aircare_service_request_form]</span>
                <span className="text-slate-400 font-sans">فرم ثبت سفارش خدمات با آپلود تصویر فیش</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
                <span className="text-purple-600 dark:text-purple-400 font-bold">[aircare_warranty_lookup]</span>
                <span className="text-slate-400 font-sans">باجه استعلام آنلاین وضعیت کارت گارانتی طلایی</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
                <span className="text-purple-600 dark:text-purple-400 font-bold">[aircare_client_dashboard]</span>
                <span className="text-slate-400 font-sans">پنل یکپارچه مشتریان جهت تتبع زنده تکنسین</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
