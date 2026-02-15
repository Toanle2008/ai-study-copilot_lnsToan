
import React, { useState, useEffect } from 'react';
import { StudyTask, StudentProfile, Document } from '../types';
import { generateGroundedStudyPlan } from '../geminiService';
import { 
  Calendar, CheckCircle2, Circle, Clock, Sparkles, RefreshCw, 
  BookOpen, Target, Quote, ChevronRight, Book, Layers, AlertTriangle 
} from 'lucide-react';

interface PlannerPanelProps {
  profile: StudentProfile;
  documents: Document[];
}

const PlannerPanel: React.FC<PlannerPanelProps> = ({ profile, documents }) => {
  const [step, setStep] = useState(1);
  const [loadingMessage, setLoadingMessage] = useState('Đang bắt đầu...');
  const [selection, setSelection] = useState({
    subject: profile.subjects.find(s => s.isActive)?.name || 'Toán',
    topic: '',
    weakness: ''
  });

  const [tasks, setTasks] = useState<any[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);

  const loadingSteps = [
    "Đang tìm kiếm tài liệu liên quan...",
    "Đang phân tích lỗ hổng kiến thức...",
    "Đang xây dựng các task hành động...",
    "Đang tối ưu hóa thứ tự ưu tiên...",
    "Đang hoàn thiện lộ trình master..."
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      let idx = 0;
      setLoadingMessage(loadingSteps[0]);
      interval = setInterval(() => {
        idx = (idx + 1) % loadingSteps.length;
        setLoadingMessage(loadingSteps[idx]);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const commonTopics: Record<string, string[]> = {
    'Toán': ['Khảo sát hàm số', 'Tích phân', 'Hình học không gian', 'Xác suất thống kê'],
    'Vật Lý': ['Dao động điều hòa', 'Sóng cơ', 'Điện xoay chiều', 'Vật lý hạt nhân'],
    'Hóa Học': ['Este - Lipit', 'Polime', 'Kim loại kiềm', 'Hóa học hữu cơ'],
    'Tiếng Anh': ['Conditional Sentences', 'Passive Voice', 'Relative Clauses', 'Vocabulary: Environment'],
    'Ngữ Văn': ['Vợ chồng A Phủ', 'Tây Tiến', 'Đất Nước', 'Nghị luận văn học']
  };

  const handleStartPlanning = async () => {
    if (!selection.topic || !selection.weakness) {
      alert("Vui lòng nhập bài học và vấn đề bạn gặp phải nhé!");
      return;
    }
    
    setIsLoading(true);
    setHasPlan(true);
    try {
      const plan = await generateGroundedStudyPlan(profile, documents, selection);
      setGoals(plan.strategicGoals || []);
      const formattedTasks = (plan.tasks || []).map((t: any, i: number) => ({
        id: i.toString(),
        ...t,
        status: 'pending',
        dueDate: 'Trong hôm nay'
      }));
      setTasks(formattedTasks);
      setStep(4);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t));
  };

  const categoriesColors: Record<string, string> = {
    'lesson': 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    'practice': 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    'review': 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800',
  };

  const activeSubjects = profile.subjects.filter(s => s.isActive);

  const renderWizard = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
          <div className="bg-indigo-600/10 p-8 rounded-full mb-8 relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <RefreshCw className="animate-spin text-indigo-600 relative z-10" size={56} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight transition-all">{loadingMessage}</h3>
          <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">Powered by Gemini Flash-Lite ⚡</p>
        </div>
      );
    }

    if (step === 4) return null;

    return (
      <div className="max-w-3xl mx-auto space-y-8 py-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Học gì hôm nay?</h2>
          <p className="text-slate-500 dark:text-slate-400">Chọn mục tiêu để Copilot tạo lộ trình bám sát tài liệu cá nhân.</p>
        </div>

        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex items-center gap-2 ${step >= s ? 'text-indigo-600' : 'text-slate-300'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step === s ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg' : step > s ? 'bg-indigo-100 border-indigo-100' : 'border-slate-200'}`}>
                {s}
              </div>
              <div className={`h-1 w-12 rounded-full hidden sm:block ${step > s ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#0f1115] rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-xl transition-all">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Book className="text-indigo-500" size={20} />
                <h4 className="font-bold text-slate-700 dark:text-slate-200">Bước 1: Chọn môn học mục tiêu</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeSubjects.map(sub => (
                  <button 
                    key={sub.name}
                    onClick={() => { setSelection({...selection, subject: sub.name}); setStep(2); }}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm ${selection.subject === sub.name ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 shadow-md' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-indigo-200'}`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="text-indigo-500" size={20} />
                <h4 className="font-bold text-slate-700 dark:text-slate-200">Bước 2: Bạn đang học bài nào của môn {selection.subject}?</h4>
              </div>
              <div className="space-y-4">
                <input 
                  autoFocus
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  placeholder="Ví dụ: Dao động điều hòa, Tích phân mặt..."
                  value={selection.topic}
                  onChange={e => setSelection({...selection, topic: e.target.value})}
                />
                <div className="flex flex-wrap gap-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase w-full mb-1">Gợi ý từ chương trình:</p>
                  {commonTopics[selection.subject]?.map(t => (
                    <button 
                      key={t}
                      onClick={() => { setSelection({...selection, topic: t}); setStep(3); }}
                      className="text-[11px] bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full font-bold text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(1)} className="text-slate-400 font-bold text-sm">Quay lại</button>
                  <button 
                    disabled={!selection.topic}
                    onClick={() => setStep(3)} 
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                  >
                    Tiếp tục <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-amber-500" size={20} />
                <h4 className="font-bold text-slate-700 dark:text-slate-200">Bước 3: Phần nào khiến bạn thấy "yếu" nhất?</h4>
              </div>
              <textarea 
                autoFocus
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium min-h-[120px]"
                placeholder="Ví dụ: Em hay sai phần tính nhanh, Em chưa hiểu cách đổi biến, Em không làm được bài tập thực tế..."
                value={selection.weakness}
                onChange={e => setSelection({...selection, weakness: e.target.value})}
              />
              <div className="flex justify-between pt-4">
                <button onClick={() => setStep(2)} className="text-slate-400 font-bold text-sm">Quay lại</button>
                <button 
                  onClick={handleStartPlanning}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                >
                  <Sparkles size={18} /> Tạo lộ trình ngay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {renderWizard()}

      {step === 4 && (
        <>
          <div className="bg-white dark:bg-[#0f1115] rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm transition-all overflow-hidden relative">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 p-3 rounded-2xl text-white">
                    <Target size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Lộ trình: {selection.topic}</h2>
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Môn {selection.subject} • Dựa trên tài liệu cá nhân</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-2xl flex gap-3">
                  <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                    Trọng tâm: AI đã thiết kế các nhiệm vụ bên dưới để giúp bạn giải quyết: <b>"{selection.weakness}"</b>
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all"
                  >
                    <RefreshCw size={18} /> Đổi mục tiêu
                  </button>
                  <button 
                    onClick={handleStartPlanning}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md"
                  >
                    <RefreshCw size={18} /> Cập nhật lại tasks
                  </button>
                </div>
              </div>

              <div className="w-full lg:w-80 space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Target size={14} /> Mục tiêu chiến lược tuần này
                </h4>
                <div className="space-y-2">
                  {goals.map((goal, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-3 items-center">
                      <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold shadow-sm">{idx + 1}</div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{goal}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-lg uppercase tracking-tight">
                  <Calendar size={20} className="text-indigo-600 dark:text-indigo-400" /> Các bước hành động
                </h3>
              </div>

              <div className="space-y-3">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => toggleTask(task.id)}
                    className={`group p-6 rounded-[1.5rem] border transition-all cursor-pointer flex items-start gap-5 ${
                      task.status === 'completed' 
                        ? 'border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/20 dark:bg-emerald-900/5 opacity-60' 
                        : 'bg-white dark:bg-[#0f1115] border-slate-100 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md'
                    }`}
                  >
                    <div className={`mt-1 transition-colors ${task.status === 'completed' ? 'text-emerald-600' : 'text-slate-200 dark:text-slate-800 group-hover:text-indigo-400'}`}>
                      {task.status === 'completed' ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h5 className={`text-base font-bold text-slate-800 dark:text-slate-100 ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </h5>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${categoriesColors[task.category] || 'bg-slate-100'}`}>
                          {task.category === 'lesson' ? 'Lý thuyết' : task.category === 'practice' ? 'Luyện tập' : 'Ôn tập'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{task.description}</p>
                      <div className="flex items-center gap-4 text-[11px] font-bold">
                        <span className="flex items-center gap-1 text-slate-400"><Clock size={14} /> {task.dueDate}</span>
                        {task.sourceCitation && (
                          <span className="flex items-center gap-1 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md">
                            <Quote size={12} /> Nguồn: {task.sourceCitation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl">
                <h4 className="font-bold flex items-center gap-2 mb-4">
                  <BookOpen size={18} /> Tri thức sử dụng
                </h4>
                <p className="text-xs text-indigo-100 mb-6 leading-relaxed">
                  Lộ trình bám sát tài liệu cá nhân môn {selection.subject} bạn đã tải lên.
                </p>
                <div className="space-y-3">
                  {documents.filter(d => d.type === selection.subject).map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 bg-white/10 p-2 rounded-xl text-[11px] font-semibold">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <span className="truncate">{doc.name}</span>
                    </div>
                  ))}
                  {documents.filter(d => d.type === selection.subject).length === 0 && (
                    <p className="text-[10px] text-white/50 italic">Bạn chưa tải tài liệu cho môn này. AI đang dùng kiến thức chuẩn.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlannerPanel;
