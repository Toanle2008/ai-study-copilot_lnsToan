
import React, { useState, useMemo, useEffect } from 'react';
import { StudentProfile, SubjectInfo, SubjectGrades } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Target, TrendingUp, Award, GraduationCap, Star, Edit2, Check, X, 
  Plus, ToggleLeft, ToggleRight, Sparkles, Bot, AlertCircle, Lightbulb,
  RefreshCw, ChevronRight
} from 'lucide-react';
import { generateProfileAnalysis } from '../geminiService';

interface ProfilePanelProps {
  profile: StudentProfile;
  onUpdateProfile: (p: StudentProfile) => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ profile, onUpdateProfile }) => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [editingGrade, setEditingGrade] = useState<{subj: string, field: string, idx?: number, val: string} | null>(null);

  const calculateAverage = (grades: SubjectGrades) => {
    let totalPoints = 0;
    let totalWeight = 0;

    const validFrequent = grades.frequent.filter(g => g !== null && !isNaN(g));
    validFrequent.forEach(g => {
      totalPoints += Number(g);
      totalWeight += 1;
    });

    if (grades.midterm !== null && !isNaN(grades.midterm)) {
      totalPoints += Number(grades.midterm) * 2;
      totalWeight += 2;
    }

    if (grades.final !== null && !isNaN(grades.final)) {
      totalPoints += Number(grades.final) * 3;
      totalWeight += 3;
    }

    if (totalWeight === 0) return 0;
    const avg = totalPoints / totalWeight;
    return parseFloat(avg.toFixed(1));
  };

  const radarData = useMemo(() => {
    return profile.subjects
      .filter(s => s.isActive)
      .map(s => ({
        subject: s.name,
        A: calculateAverage(s.grades) * 10,
        fullMark: 100
      }));
  }, [profile.subjects]);

  // Luôn sử dụng profile hiện tại từ props để phân tích
  const handleFetchAnalysis = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null); // Clear cũ để tạo cảm giác mới
    try {
      // Đảm bảo AI nhận được dữ liệu mới nhất bằng cách truyền profile trực tiếp
      const analysis = await generateProfileAnalysis(profile);
      if (analysis) {
        setAiAnalysis(analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (!aiAnalysis && !isAnalyzing) {
      handleFetchAnalysis();
    }
  }, []);

  const handleInfoSave = () => {
    onUpdateProfile(editForm);
    setIsEditingInfo(false);
  };

  const toggleSubject = (subjectName: string) => {
    const updatedSubjects = profile.subjects.map(s => 
      s.name === subjectName ? { ...s, isActive: !s.isActive } : s
    );
    onUpdateProfile({ ...profile, subjects: updatedSubjects });
  };

  const sanitizeGradeString = (input: string): string => {
    if (input === '') return '';
    let clean = input.replace(/[^0-9.]/g, '');
    const dots = clean.split('.');
    if (dots.length > 2) clean = dots[0] + '.' + dots.slice(1).join('');
    if (clean.length > 1 && clean.startsWith('0') && clean[1] !== '.') {
      clean = clean.replace(/^0+/, '');
      if (clean === '') clean = '0';
    }
    let num = parseFloat(clean);
    if (!isNaN(num) && num > 10) {
      if (clean.startsWith('10')) return '10';
      return clean[0];
    }
    if (clean === '10.') return '10';
    return clean;
  };

  const updateGradeState = (subjectName: string, field: string, value: string, index?: number) => {
    const sanitized = sanitizeGradeString(value);
    setEditingGrade({ subj: subjectName, field, idx: index, val: sanitized });

    const numValue = sanitized === '' || sanitized === '.' ? null : parseFloat(sanitized);
    
    const updatedSubjects = profile.subjects.map(s => {
      if (s.name === subjectName) {
        if (field === 'frequent' && index !== undefined) {
          const newFreq = [...s.grades.frequent];
          newFreq[index] = numValue;
          return { ...s, grades: { ...s.grades, frequent: newFreq } };
        } else {
          return { ...s, grades: { ...s.grades, [field]: numValue } };
        }
      }
      return s;
    });
    onUpdateProfile({ ...profile, subjects: updatedSubjects });
  };

  const addFrequentGrade = (subjectName: string) => {
    const updatedSubjects = profile.subjects.map(s => {
      if (s.name === subjectName) {
        return { ...s, grades: { ...s.grades, frequent: [...s.grades.frequent, null] } };
      }
      return s;
    });
    onUpdateProfile({ ...profile, subjects: updatedSubjects });
  };

  const removeFrequentGrade = (subjectName: string, index: number) => {
    const updatedSubjects = profile.subjects.map(s => {
      if (s.name === subjectName) {
        return { ...s, grades: { ...s.grades, frequent: s.grades.frequent.filter((_, i) => i !== index) } };
      }
      return s;
    });
    onUpdateProfile({ ...profile, subjects: updatedSubjects });
  };

  const getDisplayValue = (subjectName: string, field: string, currentVal: number | null, index?: number) => {
    if (editingGrade && editingGrade.subj === subjectName && editingGrade.field === field && editingGrade.idx === index) {
      return editingGrade.val;
    }
    return currentVal === null ? '' : currentVal.toString();
  };

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto px-4">
      {/* Header Profile Section */}
      <div className="bg-white dark:bg-[#0f1115] rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm transition-all relative">
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          <button 
            onClick={() => isEditingInfo ? handleInfoSave() : setIsEditingInfo(true)}
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-md p-2.5 rounded-2xl text-white transition-all active:scale-95 z-20"
          >
            {isEditingInfo ? <Check size={20} /> : <Edit2 size={20} />}
          </button>
        </div>
        <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-8 -mt-12 relative z-10">
          <div className="w-40 h-40 rounded-[2.5rem] border-8 border-white dark:border-[#0f1115] overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-2xl">
            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 pb-2">
            {isEditingInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 md:mt-0">
                <div className="flex flex-col gap-1">
                   <p className="text-[10px] font-black text-white/70 uppercase px-1 tracking-widest">Tên đầy đủ</p>
                   <input 
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xl font-black outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editForm.name} 
                    onChange={e => setEditForm({...editForm, name: e.target.value})} 
                  />
                </div>
                <div className="flex flex-col gap-1">
                   <p className="text-[10px] font-black text-white/70 uppercase px-1 tracking-widest">Trường học</p>
                   <input 
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editForm.school} 
                    onChange={e => setEditForm({...editForm, school: e.target.value})} 
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">{profile.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2 mt-1">
                  <GraduationCap size={18} className="text-indigo-500" /> {profile.school}
                </p>
              </>
            )}
          </div>
        </div>
        
        <div className="px-8 py-8 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-1.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ngày sinh</p>
            {isEditingInfo ? (
              <input type="date" className="bg-transparent border-b-2 border-indigo-500 text-sm font-black w-full outline-none py-1" value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} />
            ) : (
              <p className="text-sm font-black text-slate-700 dark:text-slate-200">{new Date(profile.dob).toLocaleDateString('vi-VN')}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Khối lớp</p>
            {isEditingInfo ? (
              <input className="bg-transparent border-b-2 border-indigo-500 text-sm font-black w-full outline-none py-1" value={editForm.grade} onChange={e => setEditForm({...editForm, grade: e.target.value})} />
            ) : (
              <p className="text-sm font-black text-slate-700 dark:text-slate-200">{profile.grade}</p>
            )}
          </div>
          <div className="space-y-1.5 col-span-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mục tiêu khối thi</p>
            {isEditingInfo ? (
              <input className="bg-transparent border-b-2 border-indigo-500 text-sm font-black w-full outline-none py-1" value={editForm.focusSubject} onChange={e => setEditForm({...editForm, focusSubject: e.target.value})} />
            ) : (
              <div className="flex gap-2">
                {profile.focusSubject.split(',').map(s => (
                  <span key={s} className="bg-indigo-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-sm">{s.trim()}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI REMARKS SECTION */}
      <div className="bg-indigo-600 dark:bg-indigo-900/40 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 transition-transform group-hover:scale-110 duration-700">
           <Bot size={180} />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                <Sparkles size={28} className="text-white" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Nhận xét của AI Study Copilot</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-md">Trạng thái:</span>
                  <span className="text-sm font-bold text-indigo-200">{isAnalyzing ? 'Đang phân tích...' : (aiAnalysis?.status || 'Đang bứt phá')}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleFetchAnalysis}
              disabled={isAnalyzing}
              className="bg-white text-indigo-600 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isAnalyzing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Làm mới nhận xét
            </button>
          </div>

          {isAnalyzing ? (
            <div className="py-10 flex flex-col items-center justify-center space-y-4">
               <RefreshCw size={40} className="animate-spin opacity-50" />
               <p className="text-sm font-bold italic opacity-70">AI đang soi xét học bạ của bạn...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-3">
                <h4 className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-indigo-200">
                  <Star size={18} /> Đánh giá tổng quát
                </h4>
                <p className="text-sm leading-relaxed font-medium">
                  {aiAnalysis?.overview || "Bạn đang có nền tảng tốt ở các môn tự nhiên. Hãy nhấn Làm mới để xem phân tích chi tiết."}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-3">
                <h4 className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-rose-300">
                  <AlertCircle size={18} /> Phân tích lỗ hổng
                </h4>
                <p className="text-sm leading-relaxed font-medium">
                  {aiAnalysis?.gaps || "Hãy cập nhật điểm số và nhấn Làm mới để AI tìm ra lỗ hổng kiến thức cho bạn."}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-3">
                <h4 className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-amber-300">
                  <Lightbulb size={18} /> Lời khuyên chiến thuật
                </h4>
                <div className="space-y-2">
                   {(aiAnalysis?.strategy || ["Cập nhật điểm để nhận lời khuyên"]).map((s: string, i: number) => (
                     <div key={i} className="flex items-start gap-2 text-[13px] font-bold">
                        <ChevronRight size={14} className="mt-0.5 shrink-0 text-amber-400" />
                        <span>{s}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3 uppercase tracking-tighter">
            <Target className="text-indigo-600 dark:text-indigo-400" size={24} /> Biểu đồ năng lực (Hệ 100)
          </h3>
          <div className="h-[320px] w-full">
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Học sinh" dataKey="A" stroke="#4f46e5" strokeWidth={3} fill="#4f46e5" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm italic font-bold">Hãy chọn môn học để xem biểu đồ</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-colors">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={24} /> Điểm trung bình môn (%)
            </h3>
            <div className="h-[240px] w-full">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={radarData} layout="vertical">
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis dataKey="subject" type="category" width={90} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: 700 }} />
                    <Tooltip 
                      cursor={{ fill: isDark ? '#ffffff08' : '#00000005' }} 
                      contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0', borderRadius: '16px', fontWeight: 800 }}
                    />
                    <Bar dataKey="A" radius={[0, 8, 8, 0]} barSize={20}>
                      {radarData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm italic font-bold">Dữ liệu trống</div>
              )}
            </div>
          </div>
          <div className="mt-6 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2rem] border border-emerald-100 dark:border-emerald-800/50 flex items-center gap-6">
            <Award className="text-emerald-600 dark:text-emerald-400 shrink-0" size={48} />
            <div>
              <p className="text-lg font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-tight">Dự báo xếp loại: {radarData.reduce((acc, curr) => acc + curr.A, 0) / (radarData.length || 1) >= 80 ? "Giỏi" : "Khá"}</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 italic">Dựa trên trung bình cộng {radarData.length} môn đang học.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Table Section */}
      <div className="bg-white dark:bg-[#0f1115] rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3 uppercase tracking-tighter">
            <Star className="text-amber-500" size={24} fill="currentColor" /> Bảng điểm vnEdu chuẩn
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Môn học</th>
                <th className="px-4 py-5">Thường xuyên (HS1)</th>
                <th className="px-4 py-5 text-center">Giữa kỳ (HS2)</th>
                <th className="px-4 py-5 text-center">Cuối kỳ (HS3)</th>
                <th className="px-4 py-5 text-center bg-indigo-50/50 dark:bg-indigo-900/10">TBM</th>
                <th className="px-8 py-5 text-right">Theo dõi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {profile.subjects.map((sub) => (
                <tr key={sub.name} className={`transition-all hover:bg-slate-50/50 dark:hover:bg-slate-900/20 ${!sub.isActive ? 'opacity-30' : ''}`}>
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{sub.name}</span>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {sub.grades.frequent.map((g, idx) => (
                        <div key={idx} className="relative group">
                          <input 
                            type="text" 
                            className="w-11 h-9 text-center bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                            value={getDisplayValue(sub.name, 'frequent', g, idx)}
                            onFocus={(e) => e.target.select()}
                            onBlur={() => setEditingGrade(null)}
                            onChange={e => updateGradeState(sub.name, 'frequent', e.target.value, idx)}
                          />
                          <button 
                            onClick={() => removeFrequentGrade(sub.name, idx)}
                            className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => addFrequentGrade(sub.name)}
                        className="w-9 h-9 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <input 
                      type="text"
                      className="w-16 h-10 text-center bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black border-2 border-indigo-100 dark:border-indigo-900/40 outline-none focus:ring-2 focus:ring-indigo-500"
                      value={getDisplayValue(sub.name, 'midterm', sub.grades.midterm)}
                      onFocus={(e) => e.target.select()}
                      onBlur={() => setEditingGrade(null)}
                      onChange={e => updateGradeState(sub.name, 'midterm', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-5 text-center">
                    <input 
                      type="text"
                      className="w-16 h-10 text-center bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black border-2 border-purple-100 dark:border-purple-900/40 outline-none focus:ring-2 focus:ring-purple-500"
                      value={getDisplayValue(sub.name, 'final', sub.grades.final)}
                      onFocus={(e) => e.target.select()}
                      onBlur={() => setEditingGrade(null)}
                      onChange={e => updateGradeState(sub.name, 'final', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-5 text-center bg-indigo-50/30 dark:bg-indigo-900/5">
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                      {calculateAverage(sub.grades)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => toggleSubject(sub.name)}
                      className={`p-1 rounded-lg transition-colors ${sub.isActive ? 'text-indigo-600' : 'text-slate-300'}`}
                    >
                      {sub.isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
