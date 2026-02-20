
import React, { useState, useRef, useEffect } from 'react';
import { Message, StudentProfile, Attachment } from '../types';
import { chatWithAI } from '../geminiService';
import { Send, Bot, User, RefreshCw, Paperclip, Image as ImageIcon, Camera, X, FileText } from 'lucide-react';

interface ChatPanelProps {
  profile: StudentProfile;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ profile, messages, setMessages }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<{file: File, base64: string}[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderMath = () => {
    const container = chatContainerRef.current;
    // @ts-ignore
    const renderMathInElement = window.renderMathInElement;

    if (container && renderMathInElement) {
      try {
        renderMathInElement(container, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
          ],
          throwOnError: false,
          ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
          trust: true
        });
      } catch (e) {
        console.warn("KaTeX rendering...");
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    renderMath();
    const timerId = setTimeout(renderMath, 200);
    return () => clearTimeout(timerId);
  }, [messages, isLoading]);

  // Xử lý camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCameraOpen && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(err => {
          console.error("Camera error:", err);
          alert("Không thể truy cập Camera. Vui lòng kiểm tra quyền truy cập.");
          setIsCameraOpen(false);
        });
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [isCameraOpen]);

  // Chụp ảnh từ video stream và chuyển thành File
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg');
        const byteString = atob(base64.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        // Use the Uint8Array (ia) which contains the data as a BlobPart
        const file = new File([ia], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        setPendingAttachments(prev => [...prev, { file, base64: base64.split(',')[1] }]);
        setIsCameraOpen(false);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'all' | 'image') => {
    const files = e.target.files;
    if (!files) return;

    // Explicitly type the iterator to prevent 'unknown' inference for 'file'
    Array.from(files as FileList).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result?.toString().split(',')[1];
        if (base64) {
          setPendingAttachments(prev => [...prev, { file, base64 }]);
        }
      };
      // Explicitly ensuring file is passed as a Blob (File inherits from Blob)
      reader.readAsDataURL(file);
    });
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!input.trim() && pendingAttachments.length === 0) || isLoading) return;

    const currentText = input;
    const currentAtts = [...pendingAttachments];
    
    const messageAttachments: Attachment[] = currentAtts.map(att => ({
      url: `data:${att.file.type};base64,${att.base64}`,
      mimeType: att.file.type,
      name: att.file.name
    }));

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: currentText || (messageAttachments.length > 0 ? "Giải bài tập từ hình ảnh/tệp đính kèm này giúp mình nhé." : ""),
      timestamp: new Date(),
      attachments: messageAttachments
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setPendingAttachments([]);
    setIsLoading(true);

    try {
      const apiAttachments = currentAtts.map(att => ({
        data: att.base64,
        mimeType: att.file.type
      }));
      
      const response = await chatWithAI([...messages, userMsg], profile, apiAttachments);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response || "Xin lỗi, mình đang gặp sự cố kết nối. Hãy thử lại sau nhé!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0a0c] transition-colors relative">
      <header className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-3 md:p-4 flex items-center justify-between transition-colors sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-lg">
            <Bot className="text-white" size={18} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-xs md:text-sm">Copilot AI</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] md:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Trực tuyến</span>
            </div>
          </div>
        </div>
        {isCameraOpen && (
          <button onClick={() => setIsCameraOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <X size={20} />
          </button>
        )}
      </header>

      {/* Camera Modal/Overlay */}
      {isCameraOpen && (
        <div className="absolute inset-x-0 top-16 bottom-0 z-40 bg-black flex flex-col items-center justify-center">
          <video ref={videoRef} autoPlay playsInline className="max-h-[70%] w-full object-contain" />
          <div className="p-8 flex gap-6">
            <button 
              onClick={takePhoto}
              className="w-16 h-16 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-full"></div>
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 md:p-8 space-y-4 md:space-y-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full space-y-6 md:space-y-8">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[95%] md:max-w-[85%] flex gap-2 md:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-sm ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-indigo-600" />}
                </div>
                <div className={`p-3 md:p-4 rounded-2xl text-[13px] md:text-[14px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-[#15171c] text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-tl-none'
                }`}>
                  {/* Hiển thị attachments của tin nhắn */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {msg.attachments.map((att, i) => (
                        <div key={i} className="max-w-xs overflow-hidden rounded-lg border border-white/20 dark:border-slate-700">
                          {att.mimeType.startsWith('image/') ? (
                            <img src={att.url} alt="Attachment" className="max-h-48 w-full object-cover" />
                          ) : (
                            <div className="p-2 bg-slate-50 dark:bg-slate-900 flex items-center gap-2 text-xs font-medium">
                              <FileText size={16} className="text-indigo-500" />
                              <span className="truncate">{att.name || "File đính kèm"}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap break-words">
                    {msg.text}
                  </div>
                  <span className={`text-[9px] mt-2 block opacity-50 font-bold ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl rounded-tl-none flex gap-3 items-center">
                <RefreshCw size={12} className="animate-spin text-indigo-500" />
                <span className="text-[11px] text-slate-500 font-bold italic">Copilot đang phân tích...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-[#0a0a0c]/50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto space-y-3">
          
          {/* Pending Attachments Preview */}
          {pendingAttachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-2">
              {pendingAttachments.map((att, i) => (
                <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-indigo-200 dark:border-indigo-900 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                  {att.file.type.startsWith('image/') ? (
                    <img src={`data:${att.file.type};base64,${att.base64}`} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <FileText size={20} className="text-indigo-500" />
                  )}
                  <button 
                    onClick={() => removeAttachment(i)}
                    className="absolute top-0 right-0 bg-rose-500 text-white p-0.5 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-[8px] text-white px-1 truncate py-0.5">
                    {att.file.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <div className="flex items-center gap-1 sm:gap-2 mr-1">
              <button 
                onClick={() => setIsCameraOpen(true)}
                title="Chụp ảnh bài tập"
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
              >
                <Camera size={20} />
              </button>
              <button 
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "image/*";
                    fileInputRef.current.click();
                  }
                }}
                title="Tải ảnh"
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
              >
                <ImageIcon size={20} />
              </button>
              <button 
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "*/*";
                    fileInputRef.current.click();
                  }
                }}
                title="Đính kèm tệp"
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
              >
                <Paperclip size={20} />
              </button>
              <input 
                type="file" 
                multiple 
                ref={fileInputRef} 
                className="hidden" 
                onChange={(e) => handleFileSelect(e, 'all')} 
              />
            </div>

            <div className="flex-1 relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Hỏi bài tập hoặc đính kèm ảnh..."
                className="w-full pl-4 md:pl-6 pr-12 md:pr-14 py-3 md:py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs md:text-sm shadow-sm transition-all"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && pendingAttachments.length === 0)}
                className="absolute right-1.5 md:right-2 top-1.5 md:top-2 bottom-1.5 md:bottom-2 px-3 md:px-4 bg-indigo-600 text-white rounded-lg md:rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-30 active:scale-95 flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
