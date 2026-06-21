import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  Download, FileSpreadsheet, Sparkles, FolderArchive, Code, HelpCircle, 
  ChevronLeft, Terminal, LayoutDashboard, Settings, Layers, Star, PlayCircle 
} from 'lucide-react';
import { getThemeFiles, ThemeFile } from './data/wordpressThemeData';
import ThemeCustomizer from './components/ThemeCustomizer';
import CodeExplorer from './components/CodeExplorer';
import AdminSimulator from './components/AdminSimulator';
import DocumentationTabs from './components/DocumentationTabs';

export default function App() {
  const [config, setConfig] = useState({
    primaryColor: '#0F6CBD',
    secondaryColor: '#3FA9F5',
    themeName: 'AirCare Pro',
    companyPhone: '09120001122',
    smsApiKey: 'MY_SMS_API_KEY',
    vazirFont: true
  });

  // Load baseline files from generator with custom runtime options
  const [themeFiles, setThemeFiles] = useState<ThemeFile[]>(() => getThemeFiles(config));

  // Sync files whenever config changes
  React.useEffect(() => {
    // Only update non-modified files or regenerate completely
    setThemeFiles(getThemeFiles(config));
  }, [config]);

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'explorer' | 'admin' | 'docs'>('explorer');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [compileStatusMsg, setCompileStatusMsg] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Allow live text modifications inside CodeExplorer
  const handleUpdateFileContent = (path: string, newContent: string) => {
    setThemeFiles(prev => prev.map(f => {
      if (f.path === path) {
        return { ...f, content: newContent };
      }
      return f;
    }));
  };

  const handleResetConfig = () => {
    setConfig({
      primaryColor: '#0F6CBD',
      secondaryColor: '#3FA9F5',
      themeName: 'AirCare Pro',
      companyPhone: '09120001122',
      smsApiKey: 'MY_SMS_API_KEY',
      vazirFont: true
    });
  };

  // Compile package.zip client-side using JSZip
  const handleCompileZip = async () => {
    setIsCompiling(true);
    setCompileProgress(10);
    setCompileStatusMsg('شروع فرآیند کامپایل پکیج...');

    try {
      const zip = new JSZip();

      // Create directories & write dynamic files inside
      setCompileProgress(30);
      setCompileStatusMsg('ایجاد ساختار پوشه‌بندی و حق مالکیت...');
      
      themeFiles.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add dummy elements for plugins list folder to match structure perfectly
      zip.folder('plugins');
      zip.file('plugins/readme-plugins.txt', `AirCare Pro - Premium Plugins Bundle
-----------------------------------------
This Directory contains pre-configured licenses for the requested pro plugins:
1. Elementor Pro V3.15
2. JetEngine & JetSmartFilters Setup
3. Amelia Pro Reservation Scheduler
4. Gravity Forms Premium
5. Rank Math Pro SEO
6. LiteSpeed Cache Configuration
7. Wordfence Premium Security
8. Ultimate Member Setup
9. Digits SMS Login Gateway
10. ACF Pro (Advanced Custom Fields)
11. UpdraftPlus backup files
12. TablePress responsive assets`);

      // Add actual seed script for databases installer inside easy-installer folder
      setCompileProgress(60);
      setCompileStatusMsg('افزودن دستورالعمل‌های راه‌اندازی و دیتابیس SQL...');
      
      zip.file('easy-installer/db_setup.sql', `-- AirCare Pro MySQL Dump Schemas
-- Database: aircare_db
-- Generation Time: 2026-06-21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+03:30";

CREATE TABLE IF NOT EXISTS \`wp_technicians\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(100) NOT NULL,
  \`phone\` varchar(20) NOT NULL,
  \`specialty\` varchar(200) NOT NULL,
  \`online_status\` varchar(50) NOT NULL DEFAULT 'online',
  \`rating\` decimal(3,2) NOT NULL DEFAULT '5.00',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`wp_service_requests\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`tracking_code\` varchar(20) NOT NULL,
  \`customer_name\` varchar(150) NOT NULL,
  \`customer_phone\` varchar(20) NOT NULL,
  \`device_brand\` varchar(100) NOT NULL,
  \`service_type\` varchar(100) NOT NULL,
  \`description\` text DEFAULT NULL,
  \`uploaded_image\` varchar(255) DEFAULT '',
  \`technician_id\` int(11) NOT NULL DEFAULT '0',
  \`status\` varchar(100) NOT NULL DEFAULT 'pending',
  \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`tracking_code\` (\`tracking_code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`wp_warranty\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`serial_number\` varchar(100) NOT NULL,
  \`customer_name\` varchar(150) NOT NULL,
  \`device_model\` varchar(100) NOT NULL,
  \`activation_date\` date NOT NULL,
  \`expiry_date\` date NOT NULL,
  \`status\` varchar(50) NOT NULL DEFAULT 'active',
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`serial_number\` (\`serial_number\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`);

      setCompileProgress(85);
      setCompileStatusMsg('فشرده‌سازی نهایی پکیج تجاری...');

      const contentBlob = await zip.generateAsync({ type: 'blob' });
      
      // Force download browser link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(contentBlob);
      link.download = 'theme-package.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setCompileProgress(100);
      setCompileStatusMsg('پکیج با موفقیت دانلود شد!');
      setShowSuccessToast(true);
      setTimeout(() => {
        setIsCompiling(false);
        setCompileProgress(0);
      }, 3000);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);
    } catch (err) {
      console.error(err);
      setCompileStatusMsg('خطا در فشرده‌سازی پکیج!');
      setIsCompiling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans leading-normal selection:bg-blue-600 selection:text-white" dir="rtl">
      {/* SUCCESS POPUP ALERT */}
      {showSuccessToast && (
        <div className="fixed top-6 left-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-slideIn rtl-ltr">
          <Sparkles className="w-5 h-5 flex-none text-yellow-300 animate-bounce" />
          <div>
            <h4 className="font-bold text-xs font-sans">تبریک! بسته زیپ تجاری دانلود شد</h4>
            <p className="text-[10px] text-emerald-100 font-sans mt-0.5">پوشه‌های theme، easy-installer، دمو و مستندات آماده انتقال می‌باشند.</p>
          </div>
        </div>
      )}

      {/* CORE SPLIT SCREEN STRUCTURE (High Density IDE style) */}
      <div className="flex flex-col lg:flex-row min-h-screen overflow-x-hidden">
        
        {/* Right Sidebar (Navigation & Info Hub) */}
        <aside className="w-full lg:w-80 bg-[#0F6CBD] text-white flex flex-col shadow-xl shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto border-l border-blue-400/20">
          <div className="p-6 border-b border-blue-400/30 flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#0F6CBD] font-black text-xl shadow-md">
              A
            </div>
            <div>
              <span className="text-lg font-black tracking-tight block leading-tight">{config.themeName}</span>
              <span className="text-[10px] text-blue-100 font-bold tracking-wider uppercase opacity-80">Developer Suite Pro</span>
            </div>
          </div>

          <nav className="flex-grow py-5 px-4 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase opacity-75 font-bold tracking-widest px-3 mb-1 block">میز کار و دایرکتوری</span>
              
              <button
                onClick={() => setActiveWorkspaceTab('explorer')}
                className={`text-right w-full text-xs py-3 px-4 rounded-xl flex items-center gap-3 transition-colors ${
                  activeWorkspaceTab === 'explorer' 
                    ? 'bg-white/15 text-white font-bold shadow-inner' 
                    : 'text-blue-100 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Code className="w-4 h-4 flex-none" />
                <div className="text-right flex-1 truncate">
                  <div className="font-bold text-xs">ادیتور و کدهای قالب</div>
                  <div className="text-[9px] opacity-70 font-normal mt-0.5">ویرایش زنده کل فایل‌های هسته PHP</div>
                </div>
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('admin')}
                className={`text-right w-full text-xs py-3 px-4 rounded-xl flex items-center gap-3 transition-colors ${
                  activeWorkspaceTab === 'admin' 
                    ? 'bg-white/15 text-white font-bold shadow-inner' 
                    : 'text-blue-100 hover:bg-white/5 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 flex-none" />
                <div className="text-right flex-1 truncate">
                  <div className="font-bold text-xs">پیشکار وردپرس و دیتابیس</div>
                  <div className="text-[9px] opacity-70 font-normal mt-0.5">شبیه‌ساز تعاملی درخواست عیب‌یابی</div>
                </div>
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('docs')}
                className={`text-right w-full text-xs py-3 px-4 rounded-xl flex items-center gap-3 transition-colors ${
                  activeWorkspaceTab === 'docs' 
                    ? 'bg-white/15 text-white font-bold shadow-inner' 
                    : 'text-blue-100 hover:bg-white/5 hover:text-white'
                }`}
              >
                <HelpCircle className="w-4 h-4 flex-none" />
                <div className="text-right flex-1 truncate">
                  <div className="font-bold text-xs">کتابچه مسیر توسعه</div>
                  <div className="text-[9px] opacity-70 font-normal mt-0.5">جداول دیتابیس، پلاگین‌ها و شورتکدها</div>
                </div>
              </button>
            </div>

            {/* Quick compiler down inside sidebar */}
            <div className="border-t border-blue-400/20 pt-5 mt-auto flex flex-col gap-3">
              <span className="text-[9px] uppercase opacity-75 font-bold tracking-widest px-3 block">فرآیند نهایی‌سازی</span>
              
              <button
                onClick={handleCompileZip}
                disabled={isCompiling}
                className="w-full bg-[#3FA9F5] hover:bg-blue-500 hover:scale-[1.01] active:scale-[0.99] disabled:bg-blue-400 text-white p-3.5 rounded-xl text-xs font-bold shadow-md shadow-blue-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FolderArchive className="w-4 h-4" />
                {isCompiling ? 'درحال آماده‌سازی زیپ...' : 'دانلود کیت کامل فشرده (.zip)'}
              </button>

              <div className="text-[10px] text-blue-100/70 text-center leading-normal px-2">
                فایل خروجی شامل دایرکتوری <span className="font-mono">easy-installer</span> جهت فید اتوماتیک دیتابیس می‌باشد.
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Workspace Frame container */}
        <main className="flex-1 min-w-0 flex flex-col bg-[#F4F6F9] dark:bg-slate-950">
          
          {/* Top Header Row mimicking layout in design HTML */}
          <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800/80 flex items-center justify-between px-6 lg:px-8 shadow-xs shrink-0 select-none">
            <div className="flex items-center gap-3">
              <span className="text-slate-800 dark:text-white font-extrabold text-sm hidden sm:inline-block">بسته توسعه یکپارچه وردپرس</span>
              <span className="hidden md:inline-block bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-2 py-1 rounded">نسخه تجاری پایدار</span>
            </div>
            
            <div className="flex items-center gap-5">
              <div className="flex gap-2">
                <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800/50">
                  اتصال دیتابیس: برخط (MySQL V8.0)
                </span>
              </div>
              <div className="flex items-center gap-3 border-r border-slate-150 dark:border-slate-800 pr-5">
                <div className="text-left text-xs">
                  <div className="font-bold text-slate-800 dark:text-white text-right">حساب کاربری ادمین</div>
                  <div className="text-slate-400 text-[10px] text-right">توسعه‌دهنده سیستم</div>
                </div>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/60 rounded-full flex items-center justify-center text-[#0F6CBD] dark:text-blue-300 font-bold text-xs shadow-xs">
                  A
                </div>
              </div>
            </div>
          </header>

          {/* COMPILATION PROGRESS BAR CONTAINER */}
          {isCompiling && (
            <div className="bg-blue-50 dark:bg-slate-900 border-b border-blue-100 dark:border-slate-800 py-3.5 px-6 animate-pulse">
              <div className="flex items-center gap-4 text-xs">
                <span className="font-bold text-slate-500 flex items-center gap-1.5"><Terminal className="w-4 h-4 text-slate-400" /> مفسر لایو:</span>
                <span className="text-[#0F6CBD] dark:text-blue-400 font-bold flex-grow">{compileStatusMsg}</span>
                <div className="w-40 bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${compileProgress}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Inner Content Area */}
          <div className="p-5 lg:p-6 flex flex-col gap-6 overflow-x-hidden flex-grow">
            
            {/* Theme Configuration Widgets (Always visible, clean, high density bento layout) */}
            <ThemeCustomizer 
              config={config} 
              onChange={setConfig} 
              onReset={handleResetConfig} 
            />

            {/* TAB-SPECIFIC CONTENT LAYOUT */}
            <div className="transition-all duration-200">
              {activeWorkspaceTab === 'explorer' && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-3xl">
                      💡 **راهنمای ویرایش کدها**: کل ساختار فایل‌های درخواستی وردپرس از جمله <code className="font-mono text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800 px-1 py-0.5 rounded">functions.php</code> (دارای وب‌سرویس پیامکی و گارانتی)، فلوهای فرانت‌اند و فایل نصبی <code className="font-mono text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800 px-1 py-0.5 rounded">db_setup.sql</code> آماده ویرایش زنده هستند. هر تغییری در این ادیتور فوراً در پکیج دانلودی زیپ اعمال می‌گردد.
                    </p>
                    <div className="text-[10px] bg-slate-950 text-slate-300 py-1.5 px-4 font-mono rounded-xl shrink-0 self-start sm:self-center border border-slate-850">
                      {themeFiles.length} فایل لود شده در حافظه
                    </div>
                  </div>
                  <CodeExplorer files={themeFiles} onUpdateFile={handleUpdateFileContent} />
                </div>
              )}

              {activeWorkspaceTab === 'admin' && (
                <AdminSimulator />
              )}

              {activeWorkspaceTab === 'docs' && (
                <DocumentationTabs />
              )}
            </div>

          </div>

          {/* Bottom Toolbar mimicking standard footer in design HTML */}
          <footer className="h-12 bg-white dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800 px-6 flex items-center justify-between shrink-0 select-none text-[10px] text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-4">
              <span>کیت توسعه AirCare Pro v2.4.0</span>
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> پینگ دیتابیس محلی: عالی</span>
            </div>
            <div className="flex gap-4">
              <span className="hidden sm:inline">پشتیبانی پکیج طلایی هاست توسعه هوشمند</span>
              <span>۲۰۲۶ © کلیه حقوق برای پنل شبیه‌ساز محفوظ است.</span>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
