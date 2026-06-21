import React, { useState } from 'react';
import { Folder, FileCode, Check, Copy, PencilLine, Code, Search, AlertCircle } from 'lucide-react';
import { ThemeFile } from '../data/wordpressThemeData';

interface CodeExplorerProps {
  files: ThemeFile[];
  onUpdateFile: (path: string, newContent: string) => void;
}

export default function CodeExplorer({ files, onUpdateFile }: CodeExplorerProps) {
  const [selectedPath, setSelectedPath] = useState<string>('theme/functions.php');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeFile = files.find(f => f.path === selectedPath) || files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateFile(activeFile.path, e.target.value);
  };

  // Group files by directory category
  const categories = {
    theme: { name: 'پوسته اصلی (AirCare Pro Theme)', icon: '📁', files: files.filter(f => f.category === 'theme') },
    'easy-installer': { name: 'بسته نصبی آسان (Installer Wizard)', icon: '⚡', files: files.filter(f => f.category === 'easy-installer') },
    'demo-data': { name: 'فایل‌های دمو (Core Demo Export)', icon: '📊', files: files.filter(f => f.category === 'demo-data') },
    documentation: { name: 'مستندات و کتابچه توسعه', icon: '📝', files: files.filter(f => f.category === 'documentation') }
  };

  const filteredTree = Object.entries(categories).map(([key, group]) => {
    const matchingFiles = group.files.filter(f => 
      f.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { key, ...group, files: matchingFiles };
  }).filter(group => group.files.length > 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-4 h-[650px]" id="code-explorer">
      {/* Sidebar: File System Tree */}
      <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-l border-slate-800 p-5 flex flex-col gap-4 overflow-y-auto bg-slate-950/40">
        <div>
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-400" /> ساختار فایل‌های پروژه
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">امکان ویرایش کدهای PHP، استایل‌ها و دیتابیس جداول</p>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="جستجوی سریع فایل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-900 border border-slate-800/80 rounded-xl py-2.5 pr-9 pl-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Folder items hierarchy list */}
        <div className="flex flex-col gap-4 mt-2">
          {filteredTree.map(group => (
            <div key={group.key} className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 px-1 bg-slate-900/50 p-1.5 rounded-lg border border-slate-900">
                <span>{group.icon}</span>
                {group.name}
              </span>
              <div className="flex flex-col pr-2 mt-1 border-r border-slate-850 gap-0.5">
                {group.files.length === 0 ? (
                  <span className="text-[11px] text-slate-600 p-2 italic">فایلی یافت نشد.</span>
                ) : (
                  group.files.map(file => {
                    const parts = file.path.split('/');
                    const filename = parts[parts.length - 1];
                    const dir = parts.slice(0, -1).join('/');
                    const isSelected = selectedPath === file.path;

                    return (
                      <button
                        key={file.path}
                        onClick={() => {
                          setSelectedPath(file.path);
                          setIsEditing(false);
                        }}
                        className={`text-right text-[11px] font-mono py-2 px-2.5 rounded-lg flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-blue-600/15 text-blue-400 border border-blue-500/10 font-semibold'
                            : 'text-slate-400 hover:bg-slate-900/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <FileCode className={`w-3.5 h-3.5 flex-none ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                          <div className="truncate">
                            <span className="text-slate-600 block text-[9px] font-sans rtl-ltr">{dir}/</span>
                            <span className="text-[11px]">{filename}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Editor and Preview Pane */}
      <div className="lg:col-span-3 flex flex-col h-full bg-slate-950">
        {/* Editor tab toolbar */}
        <div className="flex items-center justify-between border-b border-slate-900 px-5 py-3.5 flex-none bg-slate-950/70">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs text-slate-500 bg-slate-900 p-1.5 rounded-lg font-mono">
              path:
            </span>
            <span className="text-xs text-slate-300 font-mono select-all truncate">
              {activeFile.path}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
                isEditing
                  ? 'bg-amber-600/15 text-amber-400 border border-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
              title="ویرایش مستقیم کد فایل برای خروجی زیپ"
            >
              <PencilLine className="w-3.5 h-3.5" />
              {isEditing ? 'حالت ویرایش (ویرایشگر فعال)' : 'ویرایشگر متنی'}
            </button>

            <button
              onClick={handleCopy}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs py-1.5 px-3 rounded-lg border border-slate-800 flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'کپی شد!' : 'کپی کد'}
            </button>
          </div>
        </div>

        {/* File descriptions bar */}
        <div className="bg-slate-900/40 px-5 py-2.5 text-xs text-slate-400 border-b border-slate-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-500 flex-none" />
          <span className="truncate">{activeFile.description}</span>
        </div>

        {/* Live editor area */}
        <div className="flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed relative flex">
          {isEditing ? (
            <textarea
              value={activeFile.content}
              onChange={handleContentChange}
              className="w-full h-full bg-slate-950 text-emerald-400 p-4 border border-slate-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-xs leading-relaxed resize-none shadow-inner"
              spellCheck={false}
              placeholder="کد وردپرس اختصاصی را اینجا ویرایش کنید..."
            />
          ) : (
            <div className="w-full select-text flex text-slate-300 pr-5 relative">
              {/* Line numbers mock stack */}
              <div className="text-slate-700 text-center select-none w-8 border-l border-slate-900 ml-4 flex flex-col">
                {activeFile.content.split('\n').map((_, i) => (
                  <span key={i} className="block select-none">{i + 1}</span>
                ))}
              </div>
              <pre className="flex-1 overflow-x-auto whitespace-pre font-mono text-left rtl-ltr scrollbar-thin">
                <code>{activeFile.content}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
