import { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Percent, 
  FileText, 
  Menu, 
  X, 
  Coins, 
  TrendingUp, 
  Phone, 
  Mail, 
  Heart, 
  UserCheck, 
  ArrowLeft,
  Sparkles,
  Award,
  ChevronLeft,
  BookOpen
} from 'lucide-react';
import { ActivePage, LeadDetails, UploadedFile } from './types';
import TaxCalculator from './components/TaxCalculator';
import AdvancedUploader from './components/AdvancedUploader';
import WhyUsSection from './components/WhyUsSection';
import BenefitsDetails from './components/BenefitsDetails';
import PricingSection from './components/PricingSection';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActivePage>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leadModal, setLeadModal] = useState<{ show: boolean; name: string; estimate: number } | null>(null);

  // Send Lead details and calculation info to backend to trigger SMTP Email
  const sendLeadToBackend = async (lead: LeadDetails, estimate: number, extraInfo?: any) => {
    // 1. Send via local full-stack server (Docker/Cloud Run Environment)
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lead,
          estimate,
          extraInfo
        })
      });
      const data = await response.json();
      console.log('Lead notification sent to server:', data);
    } catch (err) {
      console.warn('Backend server notification skipped or unavailable (normal when running as a static Netlify build):', err);
    }

    // 2. Send via native Netlify Forms (Netlify Deployment Environment)
    try {
      const isAdvanced = !!(extraInfo?.files && extraInfo.files.length > 0);
      const formName = isAdvanced ? 'advanced-file-lead' : 'tax-lead';
      
      const formData: Record<string, string> = {
        'form-name': formName,
        'fullName': lead.fullName || '',
        'email': lead.email || '',
        'phone': lead.phone || '',
        'taxYear': lead.taxYear || '',
        'comments': lead.comments || ''
      };

      if (isAdvanced) {
        formData['attachmentsList'] = extraInfo.files.map((f: any) => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join(', ');
      } else {
        formData['estimate'] = String(estimate);
        formData['isMiloimnik'] = extraInfo?.calculatorState?.isMiloimnik ? 'כן' : 'לא';
        formData['extraDetails'] = extraInfo?.calculatorState ? JSON.stringify(extraInfo?.calculatorState) : '';
      }

      // Encode the data as application/x-www-form-urlencoded
      const encodedBody = new URLSearchParams(formData).toString();

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodedBody
      });
      console.log('Netlify Form submission dispatched successfully for form:', formName);
    } catch (err) {
      console.error('Failed to dispatch Netlify Form submission:', err);
    }
  };

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      
      {/* 1. TOP STICKY MILOIM BANNER */}
      <div className="sticky top-0 z-50 w-full bg-gradient-to-l from-orange-500 via-amber-500 to-yellow-500 text-slate-950 font-bold py-2.5 px-4 text-center text-xs md:text-sm shadow-sm select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 flex-wrap">
          <span>🇮🇱 מצדיעים למילואימניקים: הנחות ענק למשרתי מילואים! 🛡️ עיינו בפרטים החמים</span>
          <button 
            onClick={() => setActiveTab('miloimnikim')} 
            className="bg-slate-950 text-white hover:bg-slate-900 transition-colors py-0.5 px-2.5 rounded-full text-[10px] md:text-xs font-black mr-2 cursor-pointer shadow-sm"
          >
            למימוש ההנחה
          </button>
        </div>
      </div>

      {/* 2. HEADER & NAVIGATION SITEMAP */}
      <header className="bg-white border-b border-slate-100 sticky top-[38px] md:top-[44px] z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Direct Logo & slogan */}
            <div 
              onClick={() => setActiveTab('home')} 
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center font-display font-black text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
                עושים
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black font-display text-slate-900 leading-tight">עושים החזר</h1>
                <p className="text-[10px] text-slate-500 font-bold tracking-tight">המדינה לוקחת, אנחנו מחזירים</p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-sm font-semibold text-slate-600">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'home' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                דף הבית
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'calculator' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                מחשבון בדיקת זכאות
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'advanced' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                מסלול למתקדמים (106)
              </button>
              <button
                onClick={() => setActiveTab('miloimnikim')}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'miloimnikim' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                הטבת מילואימניקים
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'pricing' ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                מחירים ושקיפות
              </button>
            </nav>

            {/* Desktop Quick check-out action */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setActiveTab('calculator')}
                className="py-2.5 px-5 bg-gradient-to-l from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer hover:shadow-md"
              >
                לבדיקת החזר חינם אונליין ←
              </button>
            </div>

            {/* Hamburger menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden text-right shadow-lg absolute w-full"
            >
              <div className="px-5 py-4 space-y-2">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold block ${
                    activeTab === 'home' ? 'bg-slate-950 text-white' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  דף הבית
                </button>
                <button
                  onClick={() => setActiveTab('calculator')}
                  className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold block ${
                    activeTab === 'calculator' ? 'bg-slate-950 text-white' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  מחשבון בדיקת זכאות
                </button>
                <button
                  onClick={() => setActiveTab('advanced')}
                  className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold block ${
                    activeTab === 'advanced' ? 'bg-slate-950 text-white' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  מסלול למתקדמים (106)
                </button>
                <button
                  onClick={() => setActiveTab('miloimnikim')}
                  className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold block ${
                    activeTab === 'miloimnikim' ? 'bg-slate-950 text-white' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  הטבת מילואימניקים
                </button>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold block ${
                    activeTab === 'pricing' ? 'bg-slate-950 text-white' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  מחירים ושקיפות
                </button>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    onClick={() => setActiveTab('calculator')}
                    className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl text-center shadow cursor-pointer transition-colors"
                  >
                    לבדיקת החזר חינם אונליין
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3. MAIN APP BODY ROUTER */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <AnimatePresence mode="wait">
          
          {/* ================= HOME VIEW ================= */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-12"
            >
              {/* SECTION 1: HERO CONTAINER */}
              <div className="bg-slate-950 text-white rounded-3xl p-6 md:p-12 relative overflow-hidden vault-shine text-right">
                {/* Decorative radial gradients */}
                <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="absolute left-0 bottom-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  
                  {/* Marketing text (7 spans) */}
                  <div className="lg:col-span-7 space-y-6">
                    <span className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-white text-xs font-extrabold rounded-full inline-flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      הספק הדיגיטלי המוביל בישראל לשנת מס 2024-2025
                    </span>
                    
                    <h2 className="text-4xl md:text-6xl font-black font-display tracking-tight leading-tight md:leading-tight text-white">
                      המדינה לוקחת, <br className="hidden md:inline" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-l from-orange-400 to-amber-300">
                        אנחנו מחזירים.
                      </span>
                    </h2>

                    <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
                      החזר המס הממוצע בישראל הוא <strong>₪8,450</strong>. אנחנו נלחמים עבורך מול רשות המיסים בדיגיטל מלא עם העמלה הנמוכה ביותר בישראל – בהתחייבות וללא שום דמי פתיחת משרד. 
                    </p>

                    {/* Quick check CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-3">
                      <button
                        onClick={() => setActiveTab('calculator')}
                        className="py-4 px-8 bg-gradient-to-l from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-center text-sm rounded-xl transition-all shadow-lg active:scale-[0.98] cursor-pointer"
                      >
                        לבדיקת זכאות מהירה בחינם 🚀
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('advanced')}
                        className="py-4 px-6 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-center text-sm rounded-xl transition-colors active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-4.5 h-4.5 text-blue-400" />
                        יש לי כבר טופס 106? להעלאה מהירה
                      </button>
                    </div>

                    {/* Proof element */}
                    <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>מעל 14,200 לוחמי מילואים ואזרחים כבר קיבלו את כספם מצוות מומחי המס.</span>
                    </div>
                  </div>

                  {/* Aesthetic estimate meter box (5 spans) */}
                  <div className="lg:col-span-5 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span className="font-bold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        מאובטח בתקן בנקאי
                      </span>
                      <span>חישוב דינמי</span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-slate-400 text-sm">החזר ממוצע משוער למשפחה בישראל:</p>
                      <p className="text-4xl md:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-l from-yellow-300 to-orange-400">
                        ₪8,450
                      </p>
                    </div>

                    <div className="border-t border-slate-800 pt-4 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>משכורת שכיר (ממוצע)</span>
                        <span className="font-mono font-bold text-white">₪14,500</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>חודשים בהפסקה או אבטלה</span>
                        <span className="font-mono font-bold text-white">2 חודשים</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>עמלת מילואימניקים 🇮🇱</span>
                        <span className="font-semibold text-emerald-400">13% עמלה מופחתת</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/80 p-3 rounded-lg text-[11px] text-slate-400 leading-normal">
                      💡 <strong>הדעת המקצועית:</strong> המערכת הדיגיטלית שלנו סורקת הצטלבות נתונים מ-6 השנים האחרונות כדי לגלות כסף אבוד שהמדינה שומרת לעצמה.
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION 2: WHY US COMPARISON */}
              <WhyUsSection />

              {/* SECTION 3: QUICK EXPLANATION STATS */}
              <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm text-right">
                <div className="max-w-3xl mx-auto text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 font-display">הכסף שלך שוכב בקופת המדינה? בוא לקחת אותו</h3>
                  <p className="text-slate-500 text-sm mt-1">אלו מדדי החזרי המס הנפוצים ביותר בישראל בהם אנו מומחים:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="p-5 bg-blue-50/40 rounded-xl border border-blue-50 text-right space-y-2">
                    <span className="text-2xl">💼</span>
                    <h4 className="font-bold text-slate-900 text-sm md:text-base">החלפת מעבידים</h4>
                    <p className="text-xs text-slate-500 leading-normal">שכירים שהחליפו עבודה במהלך השנה כמעט תמיד משלמים עודף מס כי כל מעביד מחשב מס ברירת מחדל שנתית.</p>
                  </div>
                  <div className="p-5 bg-amber-50/40 rounded-xl border border-amber-50 text-right space-y-2">
                    <span className="text-2xl">🌱</span>
                    <h4 className="font-bold text-slate-900 text-sm md:text-base">חל\"ת ואבטלה קיצונית</h4>
                    <p className="text-xs text-slate-500 leading-normal">שנת הקורונה ושירותי המילואים הארוכים השתלבו בהפסד חודשי עבודה שמובילים אוטומטית להחזרי מס של אלפי ש״ח.</p>
                  </div>
                  <div className="p-5 bg-emerald-50/40 rounded-xl border border-emerald-50 text-right space-y-2">
                    <span className="text-2xl">🍼</span>
                    <h4 className="font-bold text-slate-900 text-sm md:text-base">הולדת ילדים חגיגית</h4>
                    <p className="text-xs text-slate-500 leading-normal">ילד חדש מקנה נקודות זיכוי מותאמות שלא תמיד מותקנות בתלושי השכר בשנים מסוימות.</p>
                  </div>
                  <div className="p-5 bg-purple-50/40 rounded-xl border border-purple-50 text-right space-y-2">
                    <span className="text-2xl">💰</span>
                    <h4 className="font-bold text-slate-900 text-sm md:text-base">הפקדות עצמאיות לקרן השתלמות/פנסיה</h4>
                    <p className="text-xs text-slate-500 leading-normal">הפקדות כספים עצמאיות לקופות גמל, ביטוחי חיים, קרנות פנסיה או השתלמות לקבלת החזרי זיכוי וניכוי מס משמעותיים.</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">יש לך שאלות משפטיות או פיננסיות מקיפות?</p>
                    <p className="text-xs text-slate-500">רואי החשבון המשותפים שלנו זמינים עבורך לבדיקת 6 שנים לאחור.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('calculator')}
                    className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>קפוץ למחשבון אונליין</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </section>

              {/* JUMP TO CALCULATOR BLOCK IN-PAGE */}
              <section className="space-y-4">
                <div className="border-r-4 border-orange-500 pr-3">
                  <h3 className="text-xl font-bold text-slate-900 font-display">נסו את המחשבון כעת</h3>
                  <p className="text-xs text-slate-500">הזיזו את המכוונים וראו כמה מגיע לכם</p>
                </div>
                <TaxCalculator 
                  onSuccessSubmit={(lead, estimate, calcState) => {
                    setLeadModal({ show: true, name: lead.fullName, estimate });
                    sendLeadToBackend(lead, estimate, { calculatorState: calcState });
                  }} 
                />
              </section>

            </motion.div>
          )}

          {/* ================= TAX ESTIMATOR CALCULATOR VIEW ================= */}
          {activeTab === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="border-r-4 border-orange-500 pr-3">
                <h3 className="text-2xl font-black font-display text-slate-900">מד המס המהיר והחכם</h3>
                <p className="text-xs text-slate-500">בחר את האפשרויות המתאימות השנה, קרא את הנתונים וקח את כספך בחזרה.</p>
              </div>
              <TaxCalculator 
                onSuccessSubmit={(lead, estimate, calcState) => {
                  setLeadModal({ show: true, name: lead.fullName, estimate });
                  sendLeadToBackend(lead, estimate, { calculatorState: calcState });
                }} 
              />
            </motion.div>
          )}

          {/* ================= ADVANCED TRACK UPLOADER VIEW ================= */}
          {activeTab === 'advanced' && (
            <motion.div
              key="advanced"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <AdvancedUploader 
                onSuccessUpload={(files, lead) => {
                  setLeadModal({ show: true, name: lead.fullName, estimate: 8450 });
                  const mappedFiles = files.map(f => ({ name: f.name, size: f.size }));
                  sendLeadToBackend(lead, 8450, { files: mappedFiles });
                }} 
              />
            </motion.div>
          )}

          {/* ================= RESERVISTS BENEFITS DETAIL VIEW ================= */}
          {activeTab === 'miloimnikim' && (
            <motion.div
              key="miloimnikim"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <BenefitsDetails 
                onActivateMiloim={() => {
                  setActiveTab('calculator');
                }} 
              />
            </motion.div>
          )}

          {/* ================= PRICING & TRANSPARENCY FAQ VIEW ================= */}
          {activeTab === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <PricingSection />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* 4. DESIGNED DIALOG MODAL ON LEAD SUBMIT SUCCESS (INTERACTIVE FEEDBACK FLOW) */}
      <AnimatePresence>
        {leadModal && leadModal.show && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 text-right"
            >
              <div className="bg-gradient-to-l from-slate-950 to-slate-900 p-6 text-white relative">
                <button
                  onClick={() => setLeadModal(null)}
                  className="absolute left-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl w-max mb-3">
                  <Award className="w-6 h-6 animate-bounce" />
                </div>
                <h4 className="text-xl font-black font-display">הנתונים מאובטחים וננעלו ביעילות!</h4>
                <p className="text-xs text-slate-300 mt-1">מעריכים את האמון שלך, {leadModal.name}.</p>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  הצלחת לקבל אומדן מדהים של בקשת החזר מס קרובה בגובה של <strong className="text-emerald-600 text-lg font-mono font-black">₪{leadModal.estimate.toLocaleString()}</strong>. רואי החשבון המדורגים שלנו מתחילים כעת לאשר את דוח השוואת תלושי ה-106 שהזנת כדי למנוע טעויות.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <p><strong>🔒 שומרים על פרטיותך:</strong> הצפנת SSL-256 פעילה.</p>
                  <p><strong>📞 שלב הבא:</strong> תקבל שיחת אפיון קצרה מרואה חשבון בשעות הקרובות.</p>
                  <p><strong>🏷️ מודל הטיפול:</strong> ללא דמי משרד, העמלה הנמוכה בארץ (15% או 13% למשרתי מילואים) רק בהצלחה.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLeadModal(null)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer text-center"
                >
                  הבנתי, תודה!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. GORGEOUS FOOTER */}
      <footer className="bg-slate-950 text-white border-t border-slate-900 mt-16 leading-relaxed">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-slate-900 pb-8">
            
            {/* Branding widget */}
            <div className="space-y-4 font-mono">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-white text-slate-950 rounded-lg flex items-center justify-center font-display font-black text-[11px]">
                  עושים
                </div>
                <div>
                  <h3 className="text-lg font-black font-display text-white">עושים החזר</h3>
                  <p className="text-[9px] text-slate-400">המדינה לוקחת, אנחנו מחזירים</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                מערכת השוואת מס דיגיטלית ישירה הפועלת בהתאמה מלאה לפקודת מס הכנסה ומסלולי שינויי העסקה בישראל.
              </p>
            </div>

            {/* Sitemap Quick Jumper */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-slate-300">קישורים מהירים במפה</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button onClick={() => setActiveTab('home')} className="hover:text-amber-400 transition-colors cursor-pointer text-right">דף הבית</button></li>
                <li><button onClick={() => setActiveTab('calculator')} className="hover:text-amber-400 transition-colors cursor-pointer text-right">מחשבון החזר דינמי</button></li>
                <li><button onClick={() => setActiveTab('advanced')} className="hover:text-amber-400 transition-colors cursor-pointer text-right">מסלול למתקדמים (העלאת 106)</button></li>
                <li><button onClick={() => setActiveTab('miloimnikim')} className="hover:text-amber-400 transition-colors cursor-pointer text-right">הטבת מילואים (עמלה מופחתת)</button></li>
                <li><button onClick={() => setActiveTab('pricing')} className="hover:text-amber-400 transition-colors cursor-pointer text-right">מחירון שקוף ומשלים</button></li>
              </ul>
            </div>

            {/* Security SSL standards */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-slate-300">אבטחה ופרטיות</h4>
              <div className="space-y-2.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                  <span>עמידה בתקני הצפנה SSL 256-bit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4.5 h-4.5 text-emerald-400" />
                  <span>המידע נמחק אוטומטית שבוע לאחר סיום הטיפול</span>
                </div>
                <p className="text-[10px] text-slate-400">הטיפול מבוצע מול שלטונות המס על ידי רואי חשבון מורשים וחברים רשמיים בלשכת רואי החשבון.</p>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-slate-300">יצירת קשר</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-500 scale-x-[-1]" />
                  <span>טלפון תמיכה: 073-512-3400</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span>אימייל: support@tax-refund-miloim.co.il</span>
                </li>
                <li className="text-[10px]">מגדלי עזריאלי 3, קומה 24, תל אביב-יפו</li>
              </ul>
            </div>

          </div>

          {/* Footer bottom bar */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>© 2026 השירות הלאומי המהיר להחזרי מס לישראלים. כל הזכויות שמורות.</p>
            <div className="flex gap-4">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">תנאי שימוש</a>
              <span>•</span>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">מדיניות פרטיות</a>
              <span>•</span>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">הנגשה דיגיטלית</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
