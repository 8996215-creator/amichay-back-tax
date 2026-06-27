import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Lock, 
  ShieldCheck, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { UploadedFile, LeadDetails } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AdvancedUploaderProps {
  onSuccessUpload: (files: UploadedFile[], lead: LeadDetails) => void;
}

export default function AdvancedUploader({ onSuccessUpload }: AdvancedUploaderProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [leadDetails, setLeadDetails] = useState<LeadDetails>({
    fullName: '',
    phone: '',
    email: '',
    taxYear: '2024',
    comments: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag and drop states
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Add files to state and simulate upload progress
  const processFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic'];
      
      // Let's allow images and PDFs
      const fileId = Math.random().toString(36).substr(2, 9);
      const newFile: UploadedFile = {
        id: fileId,
        name: f.name,
        size: f.size,
        type: f.type,
        status: 'uploading',
        progress: 0,
        rawFile: f
      };
      
      newFiles.push(newFile);
      
      // Read file content as base64 asynchronously
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        setFiles(current =>
          current.map(item =>
            item.id === fileId ? { ...item, base64: base64Data } : item
          )
        );
      };
      reader.readAsDataURL(f);
      
      // Simulated upload progress animation
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 10;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setFiles(current => 
            current.map(item => 
              item.id === fileId ? { ...item, status: 'completed', progress: 100 } : item
            )
          );
        } else {
          setFiles(current => 
            current.map(item => 
              item.id === fileId ? { ...item, progress: currentProgress } : item
            )
          );
        }
      }, 150);
    }

    setFiles(current => [...current, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (id: string) => {
    setFiles(current => current.filter(item => item.id !== id));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!leadDetails.fullName.trim()) errors.fullName = 'נא להזין שם מלא';
    if (!leadDetails.phone.trim()) {
      errors.phone = 'נא להזין מספר טלפון';
    } else if (!/^05\d-?\d{7}$|^\+972\d{9}$|^0\d-?\d{7}$/.test(leadDetails.phone.replace(/[-\s]/g, ''))) {
      errors.phone = 'נא להזין מספר טלפון ישראלי תקין';
    }
    if (!leadDetails.email.trim()) {
      errors.email = 'נא להזין כתובת אימייל';
    } else if (!/\S+@\S+\.\S+/.test(leadDetails.email)) {
      errors.email = 'כתובת אימייל אינה תקינה';
    }
    if (files.length === 0) {
      errors.files = 'נא להעלות לפחות קובץ של טופס 106 או אישור הפסקת עבודה';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      onSuccessUpload(files, leadDetails);
    }
  };

  return (
    <div className="bg-[#101726] text-white p-6 md:p-10 rounded-3xl border border-slate-800 vault-gradient vault-shine text-right relative overflow-hidden">
      
      {/* Absolute vector lock watermark background */}
      <div className="absolute right-4 bottom-4 opacity-5 text-slate-100 pointer-events-none">
        <Lock className="w-96 h-96" />
      </div>

      <div className="relative z-10">
        
        {/* Title Content */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
          <div className="space-y-1">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20 inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              שרת מאובטח בתקן SSL-256 וידידותי למשתמש
            </span>
            <h3 className="text-2xl md:text-3xl font-black font-display text-white">מסלול מהיר למתקדמים (יש לי 106)</h3>
            <p className="text-sm text-slate-300">כבר יש לך את הטפסים ביד? אל תבזבז זמן על שאלונים. נכנסים ישירות לכספת.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700 max-w-sm shrink-0 self-start md:self-center">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-[11px] text-slate-300">
              <p className="font-bold">הצפנה בנקאית מבוטחת 🛡️</p>
              <p>כל הקבצים מאובטחים ונמחקים אוטומטית שבוע לאחר בדיקת רואה החשבון.</p>
            </div>
          </div>
        </div>

        {!isSubmitted ? (
          <form 
            name="advanced-file-lead" 
            method="POST" 
            data-netlify="true" 
            onSubmit={handleSubmit} 
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <input type="hidden" name="form-name" value="advanced-file-lead" />
            <input type="hidden" name="attachmentsList" value={files.map(f => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join(', ')} />
            
            {/* Drag & Drop Space (7 spans) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div 
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col justify-center items-center h-[280px] cursor-pointer ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-500/10 scale-[1.01]' 
                    : 'border-slate-700 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  multiple 
                  accept=".pdf, image/png, image/jpeg, image/png"
                  onChange={handleFileChange}
                />
                
                <div className="p-4 bg-slate-800 rounded-full text-blue-400 mb-4 shadow hover:scale-105 transition-transform duration-200">
                  <UploadCloud className="w-8 h-8" />
                </div>
                
                <h4 className="text-lg font-bold">גרור לכאן טופס 106 או אישורי העסקה</h4>
                
                <div className="my-2.5 max-w-sm sm:max-w-md space-y-1 bg-blue-500/5 px-4 py-2.5 rounded-xl border border-blue-500/20">
                  <p className="text-xs text-blue-300 font-bold">
                    📄 שים לב: הקבצים צריכים להיות קבצי PDF
                  </p>
                  <p className="text-[11.5px] text-slate-300 leading-normal">
                    אפשר בהחלט לעשות זאת, אך אם אתם מסתבכים – פשוט תשאירו את זה לנו ואנחנו נסתדר!
                  </p>
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  או לחצו כאן לבחירת קבצים מהמכשיר.
                </p>
                <div className="flex gap-3 mt-3 text-[10px] text-slate-500 bg-slate-900/80 px-4 py-1.5 rounded-lg border border-slate-850">
                  <span>📄 טופס 106 שנתי</span>
                  <span>•</span>
                  <span>💼 אישור דמי אבטלה</span>
                  <span>•</span>
                  <span>⚔️ אישור ימי מילואים</span>
                </div>
              </div>

              {formErrors.files && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formErrors.files}</span>
                </div>
              )}

              {/* Uploaded Files Progress Bar and List */}
              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">קבצים מוכנים לשליחה ({files.length}):</h5>
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {files.map((file) => (
                        <div 
                          key={file.id} 
                          className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-2 bg-slate-800 text-slate-300 rounded-lg shrink-0">
                              <FileText className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate text-slate-200">{file.name}</p>
                              <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>

                          {/* Progress/Success Indicators */}
                          <div className="flex items-center gap-3 shrink-0">
                            {file.status === 'uploading' && (
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-blue-500 h-full transition-all duration-150" 
                                    style={{ width: `${file.progress}%` }}
                                  ></div>
                                </div>
                                <span className="font-mono text-xs text-slate-400">{file.progress}%</span>
                              </div>
                            )}
                            {file.status === 'completed' && (
                              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> מוכן
                              </span>
                            )}
                            <button 
                              type="button"
                              onClick={() => removeFile(file.id)}
                              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Button with Plus icon to always have the option to add another file/form */}
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="w-full bg-slate-900/50 hover:bg-slate-900 border border-dashed border-blue-500/30 hover:border-blue-500/60 p-3.5 rounded-xl flex items-center justify-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-bold transition-all group cursor-pointer"
                    >
                      <span className="text-sm font-extrabold transition-transform group-hover:scale-125 inline-block bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/20 shadow-xs">+</span>
                      <span>העלאת טופס / קובץ נוסף</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Information capturing form (5 spans) */}
            <div className="lg:col-span-5 bg-slate-900/70 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-lg font-bold border-b border-slate-800 pb-3">פרטים ליצירת קשר ועיבוד התיק</h4>
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">שם מלא של המגיש/ה:</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="לדוגמה: משה כהן"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-900 border text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                    formErrors.fullName ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-blue-500'
                  }`}
                  value={leadDetails.fullName}
                  onChange={(e) => setLeadDetails(prev => ({ ...prev, fullName: e.target.value }))}
                />
                {formErrors.fullName && <p className="text-xs text-rose-400 mt-1">{formErrors.fullName}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">נייד ישראלי:</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="050-1234567"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-900 border text-white placeholder-slate-500 text-left focus:outline-none focus:ring-1 ${
                    formErrors.phone ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-blue-500'
                  }`}
                  value={leadDetails.phone}
                  onChange={(e) => setLeadDetails(prev => ({ ...prev, phone: e.target.value }))}
                />
                {formErrors.phone && <p className="text-xs text-rose-400 mt-1">{formErrors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">אימייל מאובטח לעדכונים:</label>
                <input
                  type="email"
                  name="email"
                  placeholder="eg. moshe@gmail.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-900 border text-white placeholder-slate-500 text-left focus:outline-none focus:ring-1 ${
                    formErrors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-blue-500'
                  }`}
                  value={leadDetails.email}
                  onChange={(e) => setLeadDetails(prev => ({ ...prev, email: e.target.value }))}
                />
                {formErrors.email && <p className="text-xs text-rose-400 mt-1">{formErrors.email}</p>}
              </div>

              {/* Dropdowns for Year & Comments */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">עבור שנת מס:</label>
                  <select
                    name="taxYear"
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white"
                    value={leadDetails.taxYear}
                    onChange={(e) => setLeadDetails(prev => ({ ...prev, taxYear: e.target.value }))}
                  >
                    <option value="2025">שנת 2025</option>
                    <option value="2024">שנת 2024</option>
                    <option value="2023">שנת 2023</option>
                    <option value="2022">שנת 2022</option>
                    <option value="2021">שנת 2021</option>
                    <option value="2020">שנת 2020</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <div className="w-full text-center text-xs text-slate-400 pb-2.5 font-medium">
                    🔍 בדיקה מיידית ב-6 שנות מס
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">דגשים מיוחדים (מילואים/הורי שכול... optional):</label>
                <textarea
                  name="comments"
                  placeholder="למשל: עשיתי 40 ימי מילואים, נולד ילד במרץ..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 h-16 resize-none"
                  value={leadDetails.comments}
                  onChange={(e) => setLeadDetails(prev => ({ ...prev, comments: e.target.value }))}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                נעל כספת ושלח לבדיקה 🔐
              </button>

              <div className="flex justify-center items-center gap-1 text-[10px] text-slate-500">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>מוצפן SSL • ללא תשלום מראש • העמלה הנמוכה בארץ</span>
              </div>

            </div>

          </form>
        ) : (
          <div className="text-center py-12 max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-black font-display text-white">הכספת ננעלה והקבצים נשלחו בהצלחה!</h4>
              <p className="text-slate-300 text-sm">
                תודה, {leadDetails.fullName}. העלאת <strong className="font-mono text-blue-400">{files.length} קבצים</strong> בהצלחה. מערכת הבלדרות המוצפנת שלנו שלחה אותם לרואה חשבון החברים בלשכת רואי החשבון בישראל.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-right max-w-md mx-auto space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-2 mb-2 font-bold">
                <span>מנהל התיק: רו״ח שירן פרץ</span>
                <span className="text-emerald-400">● ניתוח פעיל</span>
              </div>
              <p className="text-xs text-slate-300"><strong>שנת מס שנשלחה:</strong> {leadDetails.taxYear}</p>
              <p className="text-xs text-slate-300"><strong>שיטת חישוב:</strong> ישירה - פדיון טופס 106 מקסימלי</p>
              <p className="text-xs text-slate-200">סטטוס: נשלח אימייל אימות מקדים לכתובת <strong className="font-mono">{leadDetails.email}</strong> עם גישה למעקב התקדמות התיק.</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setFiles([]);
                setLeadDetails({ fullName: '', phone: '', email: '', taxYear: '2024', comments: '' });
              }}
              className="text-xs text-blue-400 hover:underline hover:text-blue-300 font-semibold cursor-pointer"
            >
              העלה קבצים נוספים עבור תיק משפחתי משותף ←
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
