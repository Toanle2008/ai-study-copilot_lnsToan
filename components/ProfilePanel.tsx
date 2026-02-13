
import React, { useState, useMemo } from 'react';
import { StudentProfile, SubjectInfo, SubjectGrades } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Target, TrendingUp, Award, GraduationCap, Star, Edit2, Check, X, Plus, ToggleLeft, ToggleRight } from 'lucide-react';

interface ProfilePanelProps {
  profile: StudentProfile;
  onUpdateProfile: (p: StudentProfile) => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ profile, onUpdateProfile }) => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  
  // State tạm thời để lưu giá trị đang nhập (giúp xử lý dấu chấm "." không bị mất)
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

  /**
   * HÀM XỬ LÝ CHUỖI ĐIỂM THÔNG MINH (vnEdu Logic)
   */
  const sanitizeGradeString = (input: string): string => {
    if (input === '') return '';

    // Chỉ giữ lại số và một dấu chấm
    let clean = input.replace(/[^0-9.]/g, '');
    const dots = clean.split('.');
    if (dots.length > 2) clean = dots[0] + '.' + dots.slice(1).join('');

    // 1. Xử lý số 0 ở đầu: 009 -> 9, 05 -> 5 (trừ 0.)
    if (clean.length > 1 && clean.startsWith('0') && clean[1] !== '.') {
      clean = clean.replace(/^0+/, '');
      if (clean === '') clean = '0';
    }

    // 2. Kiểm tra giới hạn 10
    let num = parseFloat(clean);
    if (!isNaN(num) && num > 10) {
      // Nếu bắt đầu bằng 10 (ví dụ 100, 10.5) -> Chốt 10
      if (clean.startsWith('10')) return '10';
      // Nếu là số lớn khác (ví dụ 9000, 9.9.9) -> Lấy chữ số đầu tiên
      return clean[0];
    }

    // 3. Quy tắc đặc biệt: Nếu là "10" thì không cho nhập thêm gì nữa (handled by parseFloat logic)
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

  // Helper để lấy giá trị hiển thị (ưu tiên chuỗi đang edit để không mất dấu chấm)
  const getDisplayValue = (subjectName: string, field: string, currentVal: number | null, index?: number) => {
    if (editingGrade && editingGrade.subj === subjectName && editingGrade.field === field && editingGrade.idx === index) {
      return editingGrade.val;
    }
    return currentVal === null ? '' : currentVal.toString();
  };

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="space-y-8 pb-10">
      {/* Header Profile Section */}
      <div className="bg-white dark:bg-[#0f1115] rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm transition-all">
        <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <button 
            onClick={() => isEditingInfo ? handleInfoSave() : setIsEditingInfo(true)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-xl text-white transition-all active:scale-95"
          >
            {isEditingInfo ? <Check size={18} /> : <Edit2 size={18} />}
          </button>
        </div>
        <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-10 relative z-10">
          <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-[#0f1115] overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-lg">
            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 pb-2">
            {isEditingInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 md:mt-0">
                <div className="flex flex-col gap-1">
                   <p className="text-[10px] font-bold text-white/70 uppercase px-1">Tên đầy đủ</p>
                   <input 
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xl font-bold outline-none"
                    value={editForm.name} 
                    onChange={e => setEditForm({...editForm, name: e.target.value})} 
                  />
                </div>
                <div className="flex flex-col gap-1">
                   <p className="text-[10px] font-bold text-white/70 uppercase px-1">Trường học</p>
                   <input 
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none"
                    value={editForm.school} 
                    onChange={e => setEditForm({...editForm, school: e.target.value})} 
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{profile.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                  <GraduationCap size={16} /> {profile.school}
                </p>
              </>
            )}
          </div>
        </div>
        
        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày sinh</p>
            {isEditingInfo ? (
              <input type="date" className="bg-transparent border-b border-indigo-200 dark:border-indigo-800 text-sm font-bold w-full outline-none" value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} />
            ) : (
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{new Date(profile.dob).toLocaleDateString('vi-VN')}</p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lớp</p>
            {isEditingInfo ? (
              <input className="bg-transparent border-b border-indigo-200 dark:border-indigo-800 text-sm font-bold w-full outline-none" value={editForm.grade} onChange={e => setEditForm({...editForm, grade: e.target.value})} />
            ) : (
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{profile.grade}</p>
            )}
          </div>
          <div className="space-y-1 col-span-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Môn học Tập trung</p>
            {isEditingInfo ? (
              <input className="bg-transparent border-b border-indigo-200 dark:border-indigo-800 text-sm font-bold w-full outline-none" value={editForm.focusSubject} onChange={e => setEditForm({...editForm, focusSubject: e.target.value})} />
            ) : (
              <div className="flex gap-2">
                {profile.focusSubject.split(',').map(s => (
                  <span key={s} className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{s.trim()}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Stats Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0f1115] p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Target className="text-indigo-600 dark:text-indigo-400" size={20} /> Biểu đồ năng lực (Hệ 100)
          </h3>
          <div className="h-[280px] w-full">
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Học sinh" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">Chọn môn học để xem biểu đồ</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f1115] p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-colors">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} /> Điểm trung bình môn (%)
            </h3>
            <div className="h-[200px] w-full">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={radarData} layout="vertical">
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis dataKey="subject" type="category" width={90} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                    <Tooltip 
                      cursor={{ fill: isDark ? '#ffffff10' : '#00000005' }} 
                      contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0', borderRadius: '12px' }}
                    />
                    <Bar dataKey="A" radius={[0, 4, 4, 0]} barSize={16}>
                      {radarData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">Dữ liệu trống</div>
              )}
            </div>
          </div>
          <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 flex items-center gap-4">
            <Award className="text-indigo-600 dark:text-indigo-400" size={32} />
            <div>
              <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Xếp loại dự kiến: {radarData.reduce((acc, curr) => acc + curr.A, 0) / (radarData.length || 1) >= 80 ? "Giỏi" : "Khá"}</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">Dựa trên trung bình cộng {radarData.length} môn học đang học.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Table Section */}
      <div className="bg-white dark:bg-[#0f1115] rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Star className="text-amber-500" size={20} fill="currentColor" /> Bảng điểm vnEdu Style
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Môn học</th>
                <th className="px-4 py-4">Thường xuyên (HS1)</th>
                <th className="px-4 py-4 text-center">Giữa kỳ (HS2)</th>
                <th className="px-4 py-4 text-center">Cuối kỳ (HS3)</th>
                <th className="px-4 py-4 text-center bg-indigo-50/50 dark:bg-indigo-900/10">TBM</th>
                <th className="px-4 py-4 text-right">Học</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {profile.subjects.map((sub) => (
                <tr key={sub.name} className={`transition-all hover:bg-slate-50/50 dark:hover:bg-slate-900/20 ${!sub.isActive ? 'opacity-40 bg-slate-50/30 dark:bg-transparent' : ''}`}>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{sub.name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {sub.grades.frequent.map((g, idx) => (
                        <div key={idx} className="relative group">
                          <input 
                            type="text" 
                            className="w-10 h-8 text-center bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold focus:ring-1 focus:ring-indigo-500 outline-none transition-all appearance-none"
                            value={getDisplayValue(sub.name, 'frequent', g, idx)}
                            onFocus={(e) => e.target.select()}
                            onBlur={() => setEditingGrade(null)}
                            onChange={e => updateGradeState(sub.name, 'frequent', e.target.value, idx)}
                          />
                          <button 
                            onClick={() => removeFrequentGrade(sub.name, idx)}
                            className="absolute -top-1 -right-1 bg-rose-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={8} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => addFrequentGrade(sub.name)}
                        className="w-8 h-8 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <input 
                      type="text"
                      className="w-14 h-8 text-center bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold border-2 border-indigo-100 dark:border-indigo-900/40 outline-none appearance-none"
                      value={getDisplayValue(sub.name, 'midterm', sub.grades.midterm)}
                      onFocus={(e) => e.target.select()}
                      onBlur={() => setEditingGrade(null)}
                      onChange={e => updateGradeState(sub.name, 'midterm', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <input 
                      type="text"
                      className="w-14 h-8 text-center bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold border-2 border-purple-100 dark:border-purple-900/40 outline-none appearance-none"
                      value={getDisplayValue(sub.name, 'final', sub.grades.final)}
                      onFocus={(e) => e.target.select()}
                      onBlur={() => setEditingGrade(null)}
                      onChange={e => updateGradeState(sub.name, 'final', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-4 text-center bg-indigo-50/30 dark:bg-indigo-900/5">
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                      {calculateAverage(sub.grades)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button 
                      onClick={() => toggleSubject(sub.name)}
                      className={`p-1 rounded-lg transition-colors ${sub.isActive ? 'text-indigo-600' : 'text-slate-300'}`}
                    >
                      {sub.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
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
