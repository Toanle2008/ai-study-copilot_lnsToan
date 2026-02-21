
import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile, Document } from '../types';
import { HARDCODED_SUMMARIES, DEFAULT_SUMMARY } from '../hardcodedData';
import { 
  Layers, ChevronRight, Sparkles, RefreshCw, 
  ListTree, HelpCircle, Info, Bookmark, Quote, Search,
  BookOpen, Network, Zap
} from 'lucide-react';

interface SummaryPanelProps {
  profile: StudentProfile;
  documents: Document[];
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ profile, documents }) => {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Đang khởi tạo...');
  const [selection, setSelection] = useState({
    subject: profile.subjects.find(s => s.isActive)?.name || 'Toán',
    grade: profile.grade || 'Lớp 12',
    series: 'Kết Nối Tri Thức',
    lesson: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const seriesList = ['Cánh Diều', 'Kết Nối Tri Thức', 'Chân Trời Sáng Tạo'];
  const grades = ["Lớp 10", "Lớp 11", "Lớp 12"];

  // Quản lý thanh tiến trình và tin nhắn loading nhanh
  useEffect(() => {
    let progressInterval: any;
    let messageInterval: any;
    
    if (isLoading) {
      setLoadingProgress(0);
      progressInterval = setInterval(() => {
        setLoadingProgress(prev => (prev < 90 ? prev + (90 - prev) * 0.1 : prev));
      }, 100);

      const fastMessages = [
        "Truy xuất SGK...", "Phân tích logic...", "Định dạng LaTeX...", "Vẽ sơ đồ..."
      ];
      let msgIdx = 0;
      messageInterval = setInterval(() => {
        setLoadingMessage(fastMessages[msgIdx]);
        msgIdx = (msgIdx + 1) % fastMessages.length;
      }, 600);
    } else {
      setLoadingProgress(100);
    }
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isLoading]);

  const LESSONS_DB: Record<string, Record<string, Record<string, string[]>>> = {
    'Toán': {
      'Lớp 12': {
        'Kết Nối Tri Thức': [
          'Bài 1: Tính đơn điệu và cực trị của hàm số',
          'Bài 2: Giá trị lớn nhất và giá trị nhỏ nhất của hàm số',
          'Bài 3: Đường tiệm cận của đồ thị hàm số',
          'Bài 11: Tích phân',
          'Bài 12: Ứng dụng hình học của tích phân'
        ],
        'Cánh Diều': [
          'Chương 1 - Bài 1: Độ biến thiên của hàm số',
          'Chương 3 - Bài 2: Tích phân xác định'
        ]
      },
      'Lớp 11': {
        'Kết Nối Tri Thức': ['Bài 1: Giá trị lượng giác', 'Bài 8: Giới hạn của hàm số']
      }
    },
    'Vật Lý': {
      'Lớp 12': {
        'Kết Nối Tri Thức': ['Bài 1: Vật lí nhiệt', 'Bài 7: Dao động điều hòa']
      }
    }
  };

  const getAvailableLessons = () => {
    const { subject, grade, series } = selection;
    const subjectData = LESSONS_DB[subject];
    if (!subjectData) return [];
    const gradeData = subjectData[grade];
    if (!gradeData) return [];
    return gradeData[series] || gradeData[Object.keys(gradeData)[0]] || [];
  };

  const renderMath = () => {
    const container = contentRef.current;
    // @ts-ignore
    const renderMathInElement = window.renderMathInElement;
    if (container && renderMathInElement) {
      try {
        renderMathInElement(container, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ],
          throwOnError: false
        });
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (summaryData) {
      renderMath();
      const t1 = setTimeout(renderMath, 100);
      const t2 = setTimeout(renderMath, 500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [summaryData]);

  const handleGenerate = async (lessonName?: string) => {
    const targetLesson = lessonName || selection.lesson;
    if (!targetLesson) return;
    
    setIsLoading(true);
    setSummaryData(null);
    
    // Giả lập thời gian xử lý cực nhanh (500ms) thay vì gọi API
    setTimeout(() => {
      const data = HARDCODED_SUMMARIES[targetLesson] || {
        ...DEFAULT_SUMMARY,
        title: targetLesson
      };
      setSummaryData(data);
      setStep(5);
      setIsLoading(false);
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 md:py-32 space-y-8 animate-in fade-in duration-300">
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden">
            <div 
              className="absolute bottom-0 left-0 w-full bg-indigo-600 transition-all duration-300 ease-out" 
              style={{ height: `${loadingProgress}%` }}
            ></div>
            <Zap className={`relative z-10 ${loadingProgress > 50 ? 'text-white' : 'text-indigo-600'} animate-pulse`} size={40} />
          </div>
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
            {loadingMessage}
          </h3>
          <div className="flex items-center gap-2 justify-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest"></p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-2 md:py-6 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {step < 5 ? (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-indigo-600 text-white rounded-2xl shadow-xl mb-2">
              <Network className="w-8 h-8" />
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Kiến tạo sơ đồ tri thức</h2>
            <p className="text-sm text-slate-500 font-medium">Chọn bài học để AI tóm tắt logic chuẩn xác nhất.</p>
          </div>

          <div className="bg-white dark:bg-[#0f1115] border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
            <div className="w-full md:w-72 bg-slate-50 dark:bg-slate-900/50 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Môn học mục tiêu</label>
                <select 
                  value={selection.subject}
                  onChange={e => setSelection({...selection, subject: e.target.value})}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.keys(LESSONS_DB).map(s => <option key={s}>{s}</option>)}
                  {profile.subjects.filter(s => s.isActive && !LESSONS_DB[s.name]).map(s => <option key={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Khối lớp</label>
                <div className="grid grid-cols-3 gap-2">
                  {grades.map(g => (
                    <button 
                      key={g}
                      onClick={() => setSelection({...selection, grade: g})}
                      className={`py-2 rounded-xl text-[11px] font-black transition-all border ${selection.grade === g ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}
                    >
                      {g.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bộ sách hiện hành</label>
                <div className="space-y-2">
                  {seriesList.map(s => (
                    <button 
                      key={s}
                      onClick={() => setSelection({...selection, series: s})}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${selection.series === s ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-200' : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-white dark:bg-[#0f1115]">
              <div className="p-6 border-b border-slate-50 dark:border-slate-800">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Tìm tên bài học..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="grid grid-cols-1 gap-3">
                  {getAvailableLessons().filter(l => l.toLowerCase().includes(searchQuery.toLowerCase())).map((lesson, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelection({...selection, lesson});
                        handleGenerate(lesson);
                      }}
                      className="group flex items-center justify-between p-4 rounded-2xl border border-slate-50 dark:border-slate-800 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600">
                          {lesson}
                        </span>
                      </div>
                      <Zap className="text-slate-200 group-hover:text-amber-500 group-hover:scale-110 transition-all" size={16} fill="currentColor" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 md:px-0 pb-20">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-[#0f1115] p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <BookOpen size={20} />
                </div>
                <h4 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest">Nguồn học liệu</h4>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Môn học</p>
                  <p className="text-sm font-bold text-indigo-600">{selection.subject}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Bộ sách chuẩn</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{selection.series} - {selection.grade}</p>
                </div>
              </div>
              <button 
                onClick={() => setStep(1)}
                className="w-full mt-8 bg-indigo-600 text-white p-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95"
              >
                <RefreshCw size={14} /> Chọn bài khác
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-10">
            <header className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
                <Zap size={12} fill="currentColor" /> Lesson Summary
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-none tracking-tighter uppercase">
                {summaryData?.title || selection.lesson}
              </h1>
              <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
                {summaryData?.briefing}
              </p>
            </header>

            {/* Visual Mindmap - Sơ đồ hình cây trực quan */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3 uppercase tracking-tight italic">
                  <Network className="text-indigo-600" /> Sơ đồ logic (Mindmap)
                </h3>
              </div>
              <div className="bg-slate-50 dark:bg-[#0d0e12] p-6 md:p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Network size={200} className="text-indigo-500" />
                </div>
                
                <div className="space-y-8 relative z-10">
                   {/* Root Node */}
                   <div className="flex justify-center mb-12">
                      <div className="bg-indigo-600 text-white px-8 py-4 rounded-3xl shadow-2xl shadow-indigo-500/20 text-center font-black uppercase tracking-widest border-4 border-white/20">
                         {summaryData?.title?.split(':')[0] || "Chủ đề chính"}
                      </div>
                   </div>

                   {/* Branches */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                      {summaryData?.mindmap?.map((item: any, idx: number) => (
                        <div key={idx} className="bg-white dark:bg-[#15171c] p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                           <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-black text-xs">
                                {idx + 1}
                              </div>
                              <h4 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight text-sm">
                                {item.node}
                              </h4>
                           </div>
                           <div className="space-y-2 pl-4 border-l-2 border-slate-100 dark:border-slate-800 group-hover:border-indigo-500 transition-colors">
                              {item.children?.map((child: string, cidx: number) => (
                                <div key={cidx} className="flex items-start gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 py-1">
                                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></div>
                                   {child}
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </section>

            {/* Key Concepts */}
            <section className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3 uppercase tracking-tight italic">
                <Layers className="text-indigo-600" /> Khái niệm cốt lõi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {summaryData?.keyConcepts?.map((concept: any, idx: number) => (
                  <div key={idx} className="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all">
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                    <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2 italic">Concept #{idx + 1}</p>
                    <h5 className="text-lg font-black mb-2 uppercase tracking-tighter leading-none">{concept.term}</h5>
                    <p className="text-xs font-medium text-indigo-50 leading-relaxed">{concept.definition}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* QA Section */}
            <section className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3 uppercase tracking-tight italic">
                <HelpCircle className="text-indigo-600" /> Câu hỏi rèn luyện
              </h3>
              <div className="space-y-4">
                {summaryData?.qa?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-[#0f1115] p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 group hover:border-indigo-500 transition-all">
                    <div className="flex gap-4">
                       <Quote className="text-indigo-600 rotate-180 shrink-0" size={24} />
                       <div className="space-y-4 w-full">
                          <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight italic group-hover:text-indigo-600 transition-colors">
                            {item.question}
                          </p>
                          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border-l-4 border-indigo-600">
                             <p className="text-xs font-bold text-slate-600 dark:text-slate-400 italic">
                               <span className="text-indigo-600 not-italic mr-2">Gợi ý:</span>
                               {item.answer}
                             </p>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryPanel;
