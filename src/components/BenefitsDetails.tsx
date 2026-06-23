import { ShieldAlert, Heart, Trophy, Percent, BadgeCheck, Sparkles, ArrowLeft } from 'lucide-react';

interface BenefitsDetailsProps {
  onActivateMiloim: () => void;
}

export default function BenefitsDetails({ onActivateMiloim }: BenefitsDetailsProps) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-100 shadow-sm leading-relaxed text-right space-y-8">
      
      {/* Decorative appreciation header */}
      <div className="relative rounded-2xl bg-gradient-to-l from-emerald-900 to-slate-900 text-white p-6 md:p-10 overflow-hidden text-center md:text-right flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="space-y-3 max-w-2xl relative z-10">
          <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30 inline-flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
            באהבה ובהצדעה למשרתי המילואים הפעילים 🇮🇱
          </span>
          <h3 className="text-3xl md:text-4xl font-black font-display tracking-tight text-white leading-tight">
            נתתם מעצמכם למדינה, עכשיו תורנו לדאוג שהמדינה תחזיר לכם!
          </h3>
          <p className="text-slate-300 text-sm md:text-base">
            שירתתם בחזית או בעורף? מגיע לכם צדק כלכלי. אנחנו מעניקים לכולכם גב פיננסי חזק והטבת עמלה מיוחדת של 13% בלבד (במקום 15%) על עמלת הטיפול המנצחת שלנו.
          </p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 min-w-[200px] shrink-0 text-center relative z-10">
          <p className="text-xs text-slate-300 font-medium">עמלת טיפול מיוחדת למילואימניק:</p>
          <p className="text-5xl font-black text-emerald-400 font-display my-1">13%</p>
          <p className="text-xs text-slate-400">במקום 15% (רק במידה וקיבלת החזר)</p>
          <div className="mt-4 border-t border-slate-700 pt-3">
            <button
              type="button"
              onClick={onActivateMiloim}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
            >
              הפעל הנחה במחשבון עכשיו ←
            </button>
          </div>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-3">
              <Percent className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1.5">הטבת עמלה מופחתת למילואים</h4>
            <p className="text-xs text-slate-500 leading-normal">
              שירות המילואים הפעיל שלכם מזכה אתכם בעמלה ממוקדת של 13% בלבד מסך החזר המס בהצלחה (במקום 15%), ללא דמי טיפול מוקדמים ובלי אותיות קטנות או דמי פתיחת משרד.
            </p>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold font-mono mt-3">
            ✓ ללא כל דמי פתיחת משרד או תיק
          </div>
        </div>

        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center mb-3">
              <Trophy className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1.5">מיצוי זכויות של המענק השנתי</h4>
            <p className="text-xs text-slate-500 leading-normal">
              רשות המיסים מעניקה נקודות זיכוי מיוחדות החל משנת 2026 לכל מי שביצע שירות מילואים מצטבר. רואי החשבון שלנו יוודאו שכל יום מצטבר יתורגם לשקל בחשבון הבנק שלך.
            </p>
          </div>
          <div className="text-[11px] text-blue-600 font-bold font-mono mt-3">
            ✓ סימולציה לשירות מילואים עורפי ויחידות לוחמות
          </div>
        </div>

        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center mb-3">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1.5">טיפול מועדף בתיקי לוחמים</h4>
            <p className="text-xs text-slate-500 leading-normal">
              תיקים של מבצעי מילואים השנה יתועדפו לצד פאסט-טראק של רואי החשבון השותפים שלנו מתוך שאיפה והערכה לעבודה הקשה והשמירה עלינו בחודשים הארוכים.
            </p>
          </div>
          <div className="text-[11px] text-amber-700 font-bold font-mono mt-3">
            ✓ פדיון מזורז של שלטונות המס
          </div>
        </div>

      </div>

      {/* Military info and steps section */}
      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-150">
        <h4 className="font-bold text-slate-900 text-lg mb-4 text-center md:text-right">איך מממשים את הטבת המילואים במערכת?</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center md:text-right">
          <div className="space-y-1">
            <span className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold mx-auto md:mx-0 mb-2">1</span>
            <p className="text-sm font-semibold text-slate-900">מדליקים מילואים</p>
            <p className="text-xs text-slate-400">במחשבון למעלה סמנו ב-V את שירות המילואים וציינו את מספר הימים.</p>
          </div>
          <div className="space-y-1">
            <span className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold mx-auto md:mx-0 mb-2">2</span>
            <p className="text-sm font-semibold text-slate-900">רואים את המספר עולה</p>
            <p className="text-xs text-slate-400">אומדן דמי ההחזר יתעדכן מיידית בהתאם לכתב הזכאות המעודכן.</p>
          </div>
          <div className="space-y-1">
            <span className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold mx-auto md:mx-0 mb-2">3</span>
            <p className="text-sm font-semibold text-slate-900">שולחים בדיקה חינם</p>
            <p className="text-xs text-slate-400">או מעלים טופס 106 מקורי במסלול הישיר למתקדמים.</p>
          </div>
          <div className="space-y-1">
            <span className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold mx-auto md:mx-0 mb-2">4</span>
            <p className="text-sm font-semibold text-slate-900">מבצעים את הקיזוז</p>
            <p className="text-xs text-slate-400">עמלת הטיפול מול רשויות המס תקוזז לזכותך ל-13% בלבד באופן אוטומטי.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
