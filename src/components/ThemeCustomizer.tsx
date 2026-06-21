import React from 'react';
import { Sliders, Phone, MessageSquare, Shield, Type, RefreshCw } from 'lucide-react';

interface CustomizerProps {
  config: {
    primaryColor: string;
    secondaryColor: string;
    themeName: string;
    companyPhone: string;
    smsApiKey: string;
    vazirFont: boolean;
  };
  onChange: (newConfig: any) => void;
  onReset: () => void;
}

export default function ThemeCustomizer({ config, onChange, onReset }: CustomizerProps) {
  const handleColorChange = (key: 'primaryColor' | 'secondaryColor', val: string) => {
    onChange({ ...config, [key]: val });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col gap-6" id="theme-customizer">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-md">شخصی‌سازی سریع بسته</h3>
            <p className="text-xs text-slate-400">ویرایش متغیرهای رنگی، وب سروس پیامک و اطلاعات پشتیبانی</p>
          </div>
        </div>
        <button 
          onClick={onReset} 
          className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1.5 p-1 px-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          بازنشانی به پیش‌فرض
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Row 1: Brand details */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-slate-500" /> هویت برند و قالب
          </h4>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">نام تجاری قالب</label>
              <input
                type="text"
                value={config.themeName}
                onChange={(e) => onChange({ ...config, themeName: e.target.value })}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">پشتیبانی و تماس</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={config.companyPhone}
                  onChange={(e) => onChange({ ...config, companyPhone: e.target.value })}
                  className="w-full text-xs font-mono font-medium text-left bg-slate-50 dark:bg-slate-800/80 p-3 pl-9 rounded-xl border border-slate-200/50 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Colors and styling */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-4 h-4 text-slate-500" /> رنگ‌ها و فونت‌ها
          </h4>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">رنگ اصلی (Primary)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="w-10 h-10 p-0 border-0 rounded-lg cursor-pointer overflow-hidden bg-transparent"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="flex-1 text-xs font-mono bg-slate-50 dark:bg-slate-800 p-2 text-center rounded-xl border border-slate-100 dark:border-slate-800 uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">رنگ دوم (Secondary)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="w-10 h-10 p-0 border-0 rounded-lg cursor-pointer overflow-hidden bg-transparent"
                  />
                  <input
                    type="text"
                    value={config.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="flex-1 text-xs font-mono bg-slate-50 dark:bg-slate-800 p-2 text-center rounded-xl border border-slate-100 dark:border-slate-800 uppercase"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">فونت زبان فارسی (Farsi UI Font)</label>
              <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onChange({ ...config, vazirFont: true })}
                  className={`flex-1 text-xs py-2 px-3 rounded-lg font-bold transition-all ${
                    config.vazirFont
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  فونت وزیر (Vazirmatn)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...config, vazirFont: false })}
                  className={`flex-1 text-xs py-2 px-3 rounded-lg font-bold transition-all ${
                    !config.vazirFont
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ایران‌سنس (IRANSans)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Add-ons / Integrations */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-slate-500" /> وب‌سرویس پیامکی و ابزارها
          </h4>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">کد هوراز پابلیک API پیامک (SMS KEY)</label>
              <input
                type="text"
                placeholder="مثال: s_api_99342718..."
                value={config.smsApiKey}
                onChange={(e) => onChange({ ...config, smsApiKey: e.target.value })}
                className="w-full text-xs font-mono font-medium bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
              />
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/20 rounded-xl p-3 flex gap-2.5 items-start mt-1">
              <span className="text-amber-500 pt-0.5 text-xs font-bold">⚠️</span>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-normal">
                برقراری کانکشن‌های پیامکی به صورت پیش‌پرداخت در وب‌سرویس‌ها انجام می‌شود. این کلید در هیت‌مپ امنیتی اریجینال هاست مخفی خواهد ماند.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
