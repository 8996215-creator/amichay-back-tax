import { Check, X, Shield, Coins, AlertCircle, Sparkles } from 'lucide-react';

export default function WhyUsSection() {
  return (
    <div id="why-us-section" className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm leading-relaxed text-right">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <span className="px-3.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full inline-flex items-center gap-1 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
          הבטחת המחיר הנמוך בישראל - בהתחייבות!
        </span>
        <h3 className="text-2xl md:text-3xl font-black font-display text-slate-900">
          למה לשלם יותר לחברות החזרי מס מסורתיות?
        </h3>
        <p className="text-slate-500 text-sm md:text-base mt-2">
          אנחנו לא מעסיקים סוכני מכירות טלפוניים ומשרדים מפוארים. בזכות מודל דיגיטלי מתקדם, אנחנו חוסכים עלויות תפעול אדירות – ומחזירים את החיסכון הזה ישירות לכיס שלך.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Contrast Table (8 spans) */}
        <div className="lg:col-span-8 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs md:text-sm">
                <th className="p-4 font-bold">השוואה מהירה</th>
                <th className="p-4 font-black text-center bg-orange-500 text-white">השירות שלנו (Low-Cost)</th>
                <th className="p-4 font-medium text-center text-slate-400">חברות החזרי מס אחרות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-semibold text-slate-800">דמי פתיחת תיק</td>
                <td className="p-4 text-center font-bold text-emerald-600 bg-emerald-50/20">₪0 (חינם לחלוטין)</td>
                <td className="p-4 text-center text-slate-500">₪250 - ₪500 (מיידי)</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-semibold text-slate-800">עמלת טיפול (רק בהצלחה)</td>
                <td className="p-4 text-center font-black text-slate-900 bg-orange-500/10 text-orange-700">15% עמלה מנצחת</td>
                <td className="p-4 text-center text-slate-500">18% - 25% + מע״מ</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-semibold text-slate-800">הנחת מילואימניק פעיל 🇮🇱</td>
                <td className="p-4 text-center font-bold text-emerald-600 bg-emerald-50/20">רק 13% עמלה למילואים! ⚔️</td>
                <td className="p-4 text-center text-slate-400">אין הטבה מובנית</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-semibold text-slate-800">חישוב החזר משוער</td>
                <td className="p-4 text-center text-emerald-600 bg-emerald-50/20 font-bold flex items-center justify-center gap-1">
                  <Check className="w-4.5 h-4.5" /> תוך 3 דקות אונליין
                </td>
                <td className="p-4 text-center text-slate-500">מצריך תיאום טלפוני ארוך</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-semibold text-slate-800">סודיות קבצים והעלאה</td>
                <td className="p-4 text-center text-slate-800 font-medium">כספת דיגיטלית SSL מאובטחת</td>
                <td className="p-4 text-center text-slate-400">מבוסס סריקות והודעות וואטסאפ</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Small Value details card (4 spans) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 bg-slate-950 text-white rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl"></div>
            <div className="p-2.5 bg-orange-500/10 text-orange-400 rounded-lg w-max">
              <Coins className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold">איך אנחנו כל כך זולים?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              האלגוריתם הדיגיטלי שלנו סורק ומבצע תיוק אוטומטי למדרגות המס של רשות המיסים לפי נתוני טופס 106. רואי החשבון המוסמכים שלנו רק עוברים על הנתונים ומאשרים – במקום שעות של הקלדה ידנית משרדית.
            </p>
            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] text-amber-400 font-bold">
              <span>החיסכון בתקורה = רווח שלך!</span>
              <span>100% שקיפות</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 leading-normal">
              <p className="font-bold">אין החזר? אין תשלום!</p>
              <p>הבדיקה אינה מחייבת ולא גוררת כל עלות. אם רואי החשבון שלנו מצאו שאינך זכאי להחזר, אינך משלם לנו שקל אחד. אפס סיכון עליך.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
