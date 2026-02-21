import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import UploadPanel from './components/UploadPanel';
import ProfilePanel from './components/ProfilePanel';
import PlannerPanel from './components/PlannerPanel';
import SummaryPanel from './components/SummaryPanel';
import { AppTab, StudentProfile, Document, Message } from './types';
import { Bell, Search, GraduationCap, Sun, Moon, Play, X, Info } from 'lucide-react';

const ALL_SUBJECTS = [
  "Toán", "Vật Lý", "Hóa Học", "Sinh Học", "Ngữ Văn", 
  "Lịch Sử", "Địa Lý", "Tiếng Anh", "Tin Học", "GDCD", 
  "Công Nghệ", "GDQP & An Ninh", "Thể Dục"
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CHAT);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: `Chào bạn! Mình là Copilot AI. Hôm nay bạn muốn học về chủ đề nào? Thử ví dụ về tích phân: $I = \\int x^2 \\, dx$ nhé!`,
      timestamp: new Date()
    }
  ]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; 
  });

  const [profile, setProfile] = useState<StudentProfile>({
    name: "LÊ NGUYỄN SONG TOÀN",
    dob: "2008-02-14",
    grade: "Lớp 12",
    school: "THPT Núi Thành",
    focusSubject: "Toán, Vật Lý",
    avatar: "https://api.dicebear.com/9.x/toon-head/svg?seed=Adrian",
    subjects: ALL_SUBJECTS.map(name => ({
      name,
      isActive: ["Toán", "Vật Lý", "Hóa Học", "Tiếng Anh", "Ngữ Văn"].includes(name),
      proficiency: 85,
      gaps: [],
      strengths: [],
      grades: {
        frequent: [8.5, 9.2, 8.8],
        midterm: 8.7,
        final: 9.3
      }
    })),
    recentErrors: [
      { topic: "Động lực học chất điểm", reason: "Nhầm lẫn giữa lực đàn hồi và lực hồi phục trong hệ quy chiếu phi quán tính", count: 2 },
      { topic: "Tích phân hàm ẩn", reason: "Sai sót trong việc xác định cận khi thực hiện phép đổi biến số loại 2", count: 1 },
      { topic: "Este hóa", reason: "Chưa tối ưu hóa được điều kiện cân bằng hóa học theo nguyên lý Le Chatelier", count: 1 }
    ]
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const addDocument = (doc: Document) => {
    setDocuments(prev => [doc, ...prev]);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const updateProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.CHAT: 
        return <ChatPanel 
          profile={profile} 
          messages={chatMessages} 
          setMessages={setChatMessages} 
        />;
      case AppTab.DOCUMENTS: 
        return <UploadPanel 
          profile={profile} 
          updateProfile={updateProfile} 
          addDocument={addDocument} 
          removeDocument={removeDocument} 
          documents={documents} 
        />;
      case AppTab.PROFILE: 
        return <ProfilePanel 
          profile={profile} 
          onUpdateProfile={updateProfile} 
        />;
      case AppTab.PLANNER: 
        return <PlannerPanel 
          profile={profile} 
          documents={documents} 
        />;
      case AppTab.SUMMARY:
        return <SummaryPanel 
          profile={profile} 
          documents={documents} 
        />;
      default: return null;
    }
  };

  const tabTitles = {
    [AppTab.CHAT]: "AI Copilot",
    [AppTab.DOCUMENTS]: "Tài liệu",
    [AppTab.PROFILE]: "Năng lực",
    [AppTab.PLANNER]: "Lộ trình",
    [AppTab.SUMMARY]: "Sơ đồ"
  };

  const isChatTab = activeTab === AppTab.CHAT;

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0a0c] text-slate-100' : 'bg-white text-slate-900'}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden pb-[64px] md:pb-0 transition-all duration-300">
        <header className="h-14 md:h-16 bg-white dark:bg-[#0f1115] border-b border-slate-100 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between shrink-0 transition-colors z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-base md:text-lg font-bold text-slate-800 dark:text-white truncate max-w-[150px] sm:max-w-none">
              {tabTitles[activeTab]}
            </h2>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Intro Video Button - NỔI BẬT NHẤT */}
            <button 
              onClick={() => setShowIntroVideo(true)}
              className="group flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-[11px] font-black uppercase tracking-wider transition-all shadow-lg animate-glow active:scale-95"
            >
              <Play size={12} fill="currentColor" />
              <span className="hidden sm:inline">Xem hướng dẫn</span>
            </button>

            <div className="h-6 w-[1px] bg-slate-100 dark:bg-slate-800 mx-1"></div>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              title="Chế độ sáng/tối"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white dark:border-slate-900"></span>
            </button>
            <div className="h-6 w-[1px] bg-slate-100 dark:bg-slate-800 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-2 md:gap-3 pl-1 md:pl-2 group cursor-pointer" onClick={() => setActiveTab(AppTab.PROFILE)}>
              <div className="text-right hidden lg:block">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{profile.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-500 font-medium">{profile.grade}</p>
              </div>
              <div className="bg-indigo-600 w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden shadow-md">
                {profile.avatar ? <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <GraduationCap size={16} className="text-white" />}
              </div>
            </div>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto custom-scrollbar ${isChatTab ? 'p-0' : 'p-3 md:p-6 bg-white dark:bg-[#0a0a0c] transition-colors'}`}>
          <div className={`h-full ${isChatTab ? 'max-w-none' : 'max-w-6xl mx-auto'}`}>
            {renderContent()}
          </div>
        </div>
      </main>

      {/* INTRO VIDEO MODAL */}
      {showIntroVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowIntroVideo(false)}
          />
          <div className="relative w-full max-w-4xl bg-white dark:bg-[#0f1115] rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl text-white">
                  <Play size={20} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-sm md:text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Hướng dẫn sử dụng AI Study Copilot</h3>
                  <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold">Làm chủ ứng dụng trong 2 phút cùng Copilot</p>
                </div>
              </div>
              <button 
                onClick={() => setShowIntroVideo(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-rose-500"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="aspect-video w-full bg-black relative flex items-center justify-center">
               <video 
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
               >
                 <source src="./intro.mp4" type="video/mp4" />
                 Trình duyệt của bạn không hỗ trợ phát video.
               </video>
            </div>

            <div className="p-4 md:p-6 bg-slate-50 dark:bg-[#15171c] flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Info size={18} />
                <span className="text-xs font-bold italic">Bắt đầu hành trình học tập thông minh ngay hôm nay!</span>
              </div>
              <button 
                onClick={() => setShowIntroVideo(false)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
              >
                Bắt đầu ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;