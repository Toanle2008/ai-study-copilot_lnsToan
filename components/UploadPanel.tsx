
import React, { useState, useMemo } from 'react';
import { Upload, FileText, Search, Loader2, Book, Save, Trash2, PlusCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { analyzeDocument } from '../geminiService';
import { Document, StudentProfile } from '../types';

interface UploadPanelProps {
  profile: StudentProfile;
  updateProfile: (p: StudentProfile) => void;
  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
  documents: Document[];
}

interface TextbookMetadata {
  id: string;
  name: string;
  subject: string;
  grade: string;
  series: 'Cánh Diều' | 'Kết Nối Tri Thức' | 'Chân Trời Sáng Tạo';
}

const UploadPanel: React.FC<UploadPanelProps> = ({ profile, updateProfile, addDocument, removeDocument, documents }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('Toán');
  const [selectedGrade, setSelectedGrade] = useState(profile.grade || 'Lớp 10');
  
  const [activeTextbookIds, setActiveTextbookIds] = useState<string[]>([]);

  const textbookDatabase: TextbookMetadata[] = useMemo(() => {
    const subjects = profile.subjects.map(s => s.name);
    const grades = ["Lớp 10", "Lớp 11", "Lớp 12"];
    const seriesList: ('Cánh Diều' | 'Kết Nối Tri Thức' | 'Chân Trời Sáng Tạo')[] = ['Cánh Diều', 'Kết Nối Tri Thức', 'Chân Trời Sáng Tạo'];
    
    const db: TextbookMetadata[] = [];
    
    grades.forEach(g => {
      subjects.forEach(s => {
        seriesList.forEach(ser => {
          const id = `${s.toLowerCase().replace(/\s/g, '')}-${g.replace(/\s/g, '')}-${ser.toLowerCase().split(' ')[0]}`;
          db.push({
            id,
            name: `SGK ${s} ${g.split(' ')[1]} – ${ser}`,
            subject: s,
            grade: g,
            series: ser
          });
        });
      });
    });
    
    return db;
  }, [profile.subjects]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatus(`Đang tải lên tài liệu môn ${selectedSubject}...`);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result?.toString().split(',')[1];
      if (base64Data) {
        try {
          setStatus('AI Study Copilot đang phân tích kiến thức...');
          const analysis = await analyzeDocument(base64Data, file.type);
          
          const newDoc: Document = {
            id: Date.now().toString(),
            name: file.name,
            type: selectedSubject,
            content: analysis || "",
            summary: analysis?.substring(0, 150) + "..." || "",
            timestamp: new Date()
          };
          
          addDocument(newDoc);
          setStatus('Đã lưu vào kho tài liệu!');
          setTimeout(() => setStatus(null), 3000);
        } catch (error) {
          console.error(error);
          setStatus('Gặp lỗi khi phân tích. Thử lại nhé!');
        } finally {
          setIsUploading(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleTextbook = (id: string) => {
    setActiveTextbookIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSubject = (subjectName: string) => {
    const updatedSubjects = profile.subjects.map(s => 
      s.name === subjectName ? { ...s, isActive: !s.isActive } : s
    );
    updateProfile({ ...profile, subjects: updatedSubjects });
  };

  const groupedTextbooks = useMemo(() => {
    const gradeBooks = textbookDatabase.filter(book => book.grade === selectedGrade);
    const groups: Record<string, TextbookMetadata[]> = {};
    gradeBooks.forEach(book => {
      if (!groups[book.subject]) groups[book.subject] = [];
      groups[book.subject].push(book);
    });
    return groups;
  }, [selectedGrade, textbookDatabase]);

  const grades = ["Lớp 10", "Lớp 11", "Lớp 12"];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-2">
        <Book className="text-amber-500" size={24} fill="currentColor" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Kho tài liệu học tập</h2>
      </div>

      {/* Filters Area */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-[#0f1115] p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Book size={16} className="text-slate-400" />
          <select 
            value={selectedGrade} 
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm font-semibold outline-none text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {grades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        <div className="flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <p className="text-xs text-slate-500 font-medium">Chọn môn học active:</p>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm font-semibold outline-none text-indigo-600 dark:text-indigo-400 cursor-pointer"
          >
            {profile.subjects.filter(s => s.isActive).map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
        </div>

        <button className="ml-auto bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-600/20 transition-all">
          <Save size={16} /> Đồng bộ hồ sơ
        </button>
      </div>

      {/* Upload Area */}
      <div className="bg-white dark:bg-[#0f1115] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all hover:border-indigo-400 dark:hover:border-indigo-600 group relative">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-4 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
          {isUploading ? <Loader2 className="text-indigo-600 animate-spin" size={28} /> : <Upload className="text-slate-400 group-hover:text-indigo-600" size={28} />}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Upload tài liệu bổ sung cho môn <span className="text-indigo-600 font-bold">{selectedSubject}</span> {selectedGrade}</p>
        <label className="mt-4 cursor-pointer inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95">
          <PlusCircle size={18} />
          Chọn tệp (PDF/Ảnh)
          <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} accept="image/*,application/pdf" />
        </label>
        {status && <p className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">{status}</p>}
      </div>

      {/* Subject List with Toggle Mechanism */}
      <div className="space-y-12">
        {profile.subjects.map(subject => (
          <div key={subject.name} className={`space-y-4 transition-all ${subject.isActive ? '' : 'grayscale opacity-60'}`}>
            <div className="flex items-center justify-between gap-3 px-1 border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] text-white font-bold ${subject.isActive ? 'bg-indigo-600' : 'bg-slate-400'}`}>
                  {subject.name[0]}
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-sm">
                  {subject.name} {selectedGrade === profile.grade ? "" : `(${selectedGrade})`}
                </h4>
              </div>
              
              <button 
                onClick={() => toggleSubject(subject.name)}
                className={`flex items-center gap-2 text-xs font-bold transition-colors ${subject.isActive ? 'text-indigo-600' : 'text-slate-400'}`}
              >
                {subject.isActive ? "Đang học (Kích hoạt)" : "Không học (Vô hiệu)"}
                {subject.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
            </div>
            
            {subject.isActive && (
              <>
                <div className="grid gap-3">
                  {groupedTextbooks[subject.name]?.map(book => {
                    const isActive = activeTextbookIds.includes(book.id);
                    return (
                      <div 
                        key={book.id} 
                        className={`bg-[#fcfcfc] dark:bg-[#15171c] p-4 rounded-xl border transition-all flex items-center gap-4 group ${
                          isActive 
                            ? 'border-indigo-100 dark:border-indigo-900/30 opacity-100 shadow-sm' 
                            : 'border-slate-100 dark:border-slate-800 opacity-40 grayscale-[0.8] hover:opacity-60 transition-opacity'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-slate-50 dark:bg-slate-800'}`}>
                          <FileText className={isActive ? 'text-indigo-500' : 'text-slate-400'} size={20} />
                        </div>
                        <div className="flex-1">
                          <span className={`text-sm font-semibold transition-colors ${isActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-600'}`}>
                            {book.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm border transition-all ${
                            book.series === 'Cánh Diều' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            book.series === 'Kết Nối Tri Thức' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                            'bg-teal-50 text-teal-600 border-teal-100'
                          }`}>
                            {book.series}
                          </span>
                          
                          <button 
                            onClick={() => toggleTextbook(book.id)}
                            className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${
                              isActive 
                                ? 'text-rose-500 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40' 
                                : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40'
                            }`} 
                            title={isActive ? "Gỡ bỏ" : "Kích hoạt"}
                          >
                            {isActive ? <Trash2 size={16} /> : <PlusCircle size={16} />}
                            {isActive ? "Gỡ bỏ" : "Kích hoạt"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {documents.filter(d => d.type === subject.name).length > 0 && (
                  <div className="pl-8 pt-2 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Tài liệu cá nhân đã tải lên</p>
                    {documents.filter(d => d.type === subject.name).map(doc => (
                      <div key={doc.id} className="bg-white dark:bg-[#111318] p-3 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center gap-3 group hover:shadow-sm transition-all shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
                        <FileText className="text-indigo-400" size={16} />
                        <div className="flex-1">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 block">{doc.name}</span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => removeDocument(doc.id)}
                            className="p-1 hover:bg-rose-50 text-rose-400 rounded transition-colors" 
                            title="Xóa tài liệu"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadPanel;
