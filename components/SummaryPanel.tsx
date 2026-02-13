import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile, Document } from '../types';
import { generateLessonSummary } from '../geminiService';
import { 
  Layers, ChevronRight, Sparkles, RefreshCw, 
  ListTree, HelpCircle, Info, Bookmark, Quote, Search,
  BookOpen
} from 'lucide-react';

interface SummaryPanelProps {
  profile: StudentProfile;
  documents: Document[];
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ profile, documents }) => {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
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
          'Chương 1 - Bài 2: Cực trị hàm số',
          'Chương 3 - Bài 1: Nguyên hàm lý thuyết',
          'Chương 3 - Bài 2: Tích phân xác định'
        ],
        'Chân Trời Sáng Tạo': [
          'Bài 1: Ứng dụng đạo hàm khảo sát hàm số',
          'Bài 2: Các đường tiệm cận',
          'Bài 15: Phương trình mặt phẳng Oxy',
          'Bài 16: Vị trí tương đối đường thẳng'
        ]
      },
      'Lớp 11': {
        'Kết Nối Tri Thức': ['Bài 1: Giá trị lượng giác', 'Bài 5: Dãy số', 'Bài 8: Giới hạn của hàm số'],
        'Cánh Diều': ['Bài 1: Góc lượng giác', 'Bài 2: Cấp số cộng', 'Bài 3: Cấp số nhân']
      }
    },
    'Sinh Học': {
      'Lớp 10': {
        'Kết Nối Tri Thức': [
          'Bài 1: Thành phần hóa học của tế bào',
          'Bài 4: Tế bào nhân sơ',
          'Bài 13: Chu kì tế bào và nguyên phân',
          'Bài 18: Chu kỳ tế bào và quá trình nguyên phân'
        ],
        'Cánh Diều': [
          'Bài 1: Giới thiệu chương trình môn Sinh',
          'Bài 5: Các phân tử sinh học',
          'Bài 18: Phân bào và ý nghĩa'
        ]
      },
      'Lớp 12': {
        'Kết Nối Tri Thức': [
          'Bài 1: Gen, mã di truyền và quá trình nhân đôi DNA',
          'Bài 2: Phiên mã và dịch mã',
          'Bài 15: Bằng chứng tiến hóa'
        ]
      }
    },
    'Vật Lý': {
      'Lớp 12': {
        'Kết Nối Tri Thức': ['Bài 1: Vật lí nhiệt', 'Bài 7: Dao động điều hòa', 'Bài 18: Mạch RLC'],
        'Cánh Diều': ['Chương 1: Nhiệt động lực học', 'Chương 2: Dao động cơ học']
      }
    },
    'Ngữ Văn': {
      'Lớp 12': {
        'Kết Nối Tri Thức': ['Văn bản: Tây Tiến', 'Văn bản: Việt Bắc', 'Văn bản: Đất Nước'],
        'Cánh Diều': ['Bài 1: Thơ ca cách mạng', 'Bài 2: Truyện ngắn hiện đại']
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
    const renderMathInElement = (window as any).renderMathInElement;

    if (container && renderMathInElement) {
      try {
        renderMathInElement(container, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ],
          throwOnError: false
        });
      } catch (e) {
        console.error("KaTeX rendering error:", e);
      }
    }
  };

  useEffect(() => {
    if (summaryData) {
      renderMath();
      const timerId = setTimeout(renderMath, 150);
      return () => clearTimeout(timerId);
    }
  }, [summaryData]);

  useEffect(() => {
    setSelection(prev => ({ ...prev, lesson: '' }));
    setSearchQuery('');
  }, [selection.subject, selection.grade, selection.series]);

  const handleGenerate = async (lessonName?: string) => {
    const targetLesson = lessonName || selection.lesson;
    if (!targetLesson) return;
    
    setIsLoading(true);
    try {
      const data = await generateLessonSummary({ ...selection, lesson: targetLesson }, documents);
      setSummaryData(data);
      setStep(5);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentLessonsList = getAvailableLessons();
  const filteredLessons = currentLessonsList.filter(lesson => 
    lesson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-24">
        <div className="relative mb-6 md:mb-8">
          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <RefreshCw className="animate-spin text-indigo-600 relative z-10 w-12 h-12 md:w-14 md:h-14" />
        </div>
        <div className="text-center space-y-2 px-4">
          <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">Đang kiến tạo bài học...</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm italic">Hệ thống đang tóm tắt "{selection.lesson}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-2 md:py-6 space-y-6 md:space-y-8 animate-in fade-in duration-700">
      {step < 5 ? (
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          <div className="text-center space-y-2 md:space-y-4 px-4">
            <div className="inline-flex p-2 md:p-3 bg-indigo-600 text-white rounded-xl md:rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none">
              <ListTree className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h2 className="text-xl md:text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Sơ đồ tóm tắt kiến thức</h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Chọn bài học từ mục lục SGK của bạn.</p>
          </div>

          <div className="bg-white dark:bg-[#0f1115] border border-slate-100 dark:border-slate-800 rounded-2xl md:rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col md:flex-row md:h-[600px]">
            <div className="w-full md:w-72 bg-slate-50 dark:bg-slate-900/50 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 p-4 md:p-6 space-y-4 md:space-y-6 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                <div className="space-y-1 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Môn học</label>
                  <select 
                    value={selection.subject}
                    onChange={e => setSelection({...selection, subject: e.target.value})}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 md:p-3 rounded-lg md:rounded-xl outline-none text-xs md:text-sm font-bold shadow-sm"
                  >
                    {Object.keys(LESSONS_DB).map(s => <option key={s}>{s}</option>)}
                    {profile.subjects.filter(s => s.isActive && !LESSONS_DB[s.name]).map(s => <option key={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Khối lớp</label>
                  <div className="flex gap-1">
                    {grades.map(g => (
                      <button 
                        key={g}
                        onClick={() => setSelection({...selection, grade: g})}
                        className={`flex-1 py-1.5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black transition-all ${selection.grade === g ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}
                      >
                        {g.split(' ')[1]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-1 md:space-y-2">
                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Bộ sách</label>
                <div className="flex md:block gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0 scrollbar-hide">
                  {seriesList.map(s => (
                    <button 
                      key={s}
                      onClick={() => setSelection({...selection, series: s})}
                      className={`whitespace-nowrap md:w-full text-left px-3 py-1.5 md:py-2 rounded-lg text-[10px] md:text-[11px] font-bold transition-all border ${selection.series === s ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-100 dark:border-indigo-900/30' : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="hidden md:block mt-auto p-4 bg-indigo-600 rounded-2xl text-white space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <span className="text-[10px] font-black uppercase">Sách chuẩn GDPT</span>
                </div>
                <p className="text-[11px] leading-relaxed font-medium text-indigo-100">Dữ liệu chuẩn theo chương trình phổ thông mới.</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-white dark:bg-[#0f1115] md:min-h-0 min-h-[400px]">
              <div className="p-4 md:p-6 border-b border-slate-50 dark:border-slate-800">
                <div className="relative">
                  <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 md:w-[18px] md:h-[18px]" />
                  <input 
                    type="text"
                    placeholder="Tìm bài học..."
                    className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 bg-slate-50 dark:bg-slate-900 rounded-lg md:rounded-xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-xs md:text-sm transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                <div className="grid grid-cols-1 gap-2">
                  {filteredLessons.length > 0 ? (
                    filteredLessons.map((lesson, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelection({...selection, lesson});
                          handleGenerate(lesson);
                        }}
                        className="group flex items-center justify-between p-3 md:p-4 rounded-lg md:rounded-xl border border-slate-50 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all text-left"
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded md:rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] md:text-xs font-bold text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            {idx + 1}
                          </div>
                          <span className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate max-w-[200px] sm:max-w-none">
                            {lesson}
                          </span>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all w-4 h-4 md:w-[18px] md:h-[18px]" />
                      </button>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 md:py-20 text-slate-400 italic text-xs md:text-sm">
                      <BookOpen className="mb-3 md:mb-4 opacity-20 w-8 h-8 md:w-10 md:h-10" />
                      Chưa có dữ liệu bài học.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 px-2 md:px-0">
          <div className="space-y-4 md:space-y-6 order-2 lg:order-1">
            <div className="bg-white dark:bg-[#0f1115] p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <Bookmark className="text-indigo-600 w-4 h-4 md:w-[18px] md:h-[18px]" fill="currentColor" />
                <h4 className="font-black text-slate-800 dark:text-white uppercase text-[9px] md:text-xs tracking-widest">Nguồn dữ liệu</h4>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-2.5 md:p-3 rounded-lg md:rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">SGK Chính thức</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{selection.series} - {selection.grade}</p>
                </div>
                {documents.filter(d => d.type === selection.subject).length > 0 ? (
                   documents.filter(d => d.type === selection.subject).map(doc => (
                     <div key={doc.id} className="bg-emerald-50/50 dark:bg-emerald-900/10 p-2.5 md:p-3 rounded-lg md:rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                        <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase mb-1">Tài liệu cá nhân</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{doc.name}</p>
                     </div>
                   ))
                ) : (
                  <p className="text-[9px] text-slate-400 italic px-1">Dùng kiến thức chuẩn SGK.</p>
                )}
              </div>
              <button 
                onClick={() => setStep(1)}
                className="w-full mt-6 md:mt-8 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-2.5 md:p-3 rounded-lg md:rounded-xl text-[11px] md:text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <RefreshCw size={14} /> Chọn bài khác
              </button>
            </div>
            <div className="bg-indigo-600 p-5 md:p-6 rounded-2xl md:rounded-[2rem] text-white shadow-xl">
              <h4 className="font-bold flex items-center gap-2 mb-3 md:mb-4 text-xs md:text-sm">
                <Info size={16} /> Insight của Copilot
              </h4>
              <p className="text-[11px] md:text-xs leading-relaxed text-indigo-100 font-medium">
                {summaryData?.briefing}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6 md:space-y-8 order-1 lg:order-2">
            <header className="flex flex-col gap-1 md:gap-2">
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                {summaryData?.title || selection.lesson}
              </h1>
              <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-bold text-slate-400">
                <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase">{selection.subject}</span>
                <span>•</span>
                <span>Hệ thống chuẩn GDPT</span>
              </div>
            </header>

            <section className="space-y-3 md:space-y-4">
              <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Layers className="text-indigo-600 w-[18px] h-[18px] md:w-5 md:h-5" /> Khái niệm cốt lõi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {summaryData?.keyConcepts?.map((concept: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-[#0f1115] p-4 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-indigo-500">
                    <p className="text-[10px] md:text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1 md:mb-2">{concept.term}</p>
                    <p className="text-[13px] md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{concept.definition}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3 md:space-y-4">
              <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <ListTree className="text-indigo-600 w-[18px] h-[18px] md:w-5 md:h-5" /> Tóm tắt logic
              </h3>
              <div className="bg-slate-50 dark:bg-[#0f1115] p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 space-y-4 md:space-y-6">
                {summaryData?.mindmap?.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 md:gap-6">
                    <div className="relative">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs md:text-sm font-bold z-10 relative">
                        {idx + 1}
                      </div>
                      {idx < (summaryData?.mindmap?.length || 0) - 1 && (
                        <div className="absolute top-8 md:top-10 bottom-0 left-1/2 w-0.5 bg-indigo-100 dark:bg-indigo-900/50 -translate-x-1/2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4 md:pb-6">
                      <h4 className="text-sm md:text-base font-black text-slate-800 dark:text-slate-100 mb-2 md:mb-3">{item.node}</h4>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {item.children?.map((child: string, cidx: number) => (
                          <div key={cidx} className="bg-white dark:bg-slate-800 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-1.5 md:gap-2">
                            <ChevronRight size={12} className="text-indigo-500" />
                            {child}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3 md:space-y-4">
              <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <HelpCircle className="text-indigo-600 w-[18px] h-[18px] md:w-5 md:h-5" /> Câu hỏi gợi mở
              </h3>
              <div className="space-y-3 md:space-y-4">
                {summaryData?.qa?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-indigo-50/30 dark:bg-indigo-900/5 p-4 md:p-6 rounded-xl md:rounded-2xl border border-indigo-100 dark:border-indigo-900/20">
                    <div className="flex gap-3 md:gap-4 items-start">
                      <Quote className="text-indigo-400 rotate-180 shrink-0 w-5 h-5 md:w-6 md:h-6" />
                      <div className="space-y-2 md:space-y-4">
                        <p className="text-[13px] md:text-sm font-black text-indigo-900 dark:text-indigo-200">{item.question}</p>
                        <p className="text-[13px] md:text-sm text-slate-600 dark:text-slate-400 italic pl-3 md:pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">{item.answer}</p>
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