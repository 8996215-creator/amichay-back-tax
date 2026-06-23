import { Coins, HelpCircle, BadgePercent, Lock, CheckCircle, TrendingUp, Sparkles } from 'lucide-react';

export default function PricingSection() {
  const faqs = [
    {
      q: 'הדלקתם בדיקה במערכת, האם זה מחייב אותי לשלם משהו?',
      a: 'ממש לא! בדיקת הזכאות הראשונית אונליין ופתיחת התיק על ידי רואה החשבון נעשית בחינם מוחלט. אנחנו גובים עמלה אך ורק אם מצאנו החזר והכסף הופקד בחשבון הבנק שלך בפועל.'
    },
    {
      q: 'מהי עמלת ה-Low Cost שלכם ואיך היא בהשוואה לשוק?',
      a: 'בעוד שהשוק המסורתי נע בין 18% ל-25% מגובה ההחזר (בתוספת דמי פתיחת משרד קבועים), אצלנו העמלה עומדת על 15% בלבד ללא שום עלויות מוקדמות. מילואימניקים זכאים להטבה מיוחדת של 13% עמלה בלבד כהוקרת תודה על שירותם.'
    },
    {
      q: 'מה קורה אם רשות המיסים מוצאת שיש לי חוב?',
      a: 'אל דאגה – רואה החשבון המשותף שלנו עובד עבורך ולא ישלח שום דוח לרשות המסים אם הוא מזהה אפילו הפרש קל לרעתך. המטרה היא לקחת כסף מהמדינה חזרה, לא לתת לה שקלים נוספים.'
    },
    {
      q: 'כמה זמן לוקח עד שהכסף מגיע לחשבון שלי?',
      a: 'אומדן התיק הדיגיטלי נתרם תוך פחות מ-24 שעות. החזר הכסף מהמדינה ישירות לחשבונו של המבקש נע בדרך כלל בין 45 ל-90 ימים, כתלות בתור ולחץ העבודה ברשות המסים האזורית.'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-100 shadow-sm leading-relaxed text-right space-y-10">
      
      {/* Pricing Header Explanation */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="px-3.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full inline-flex items-center gap-1">
          <BadgePercent className="w-3.5 h-3.5 text-amber-600" />
          ללא דמי פתיחת משרד • ללא סיכון דוחות
        </span>
        <h3 className="text-3xl font-black font-display text-slate-900">
          מדוע אנחנו הזולים ביותר בישראל? 🎯
        </h3>
        <p className="text-slate-500 text-sm md:text-base">
          רשות המיסים בישראל מחזיקה במיליארדי שקלים של אזרחים עצמאיים ושכירים כתוצאה מפרטי תמחור מס מעוותים. במודל הדיגיטלי שלנו אין תשלומים נסתרים. אתם רק מרוויחים.
        </p>
      </div>

      {/* Grid: Fee breakdown and low-cost model explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        
        {/* Right slot - The low cost engine details */}
        <div className="space-y-6">
          <h4 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">הפירוט המלא של המבנה והמודל</h4>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-start pb-4 border-b border-slate-50">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm md:text-base">0 ש"ח דמי פתיחת תיק</h5>
                <p className="text-xs text-slate-500 mt-0.5">
                  משרדים פרטיים יבקשו ממך 300 או 500 ש״ח מיידית רק על מנת להתחיל לפתוח את המסמכים שלך. אצלנו הבדיקה ופתיחת התיק המלאה היא חינם לחלוטין.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start pb-4 border-b border-slate-50">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                <BadgePercent className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm md:text-base">עמלה מהנמוכות בשוק: 15% בלבד (ו-13% למילואימניקים)</h5>
                <p className="text-xs text-slate-500 mt-0.5">
                  אנחנו גובים רק 15% עמלה מסך הכסף שחוזר אליך בפועל, ורק 13% עבור מילואימניקים פעילים. זאת בהשוואה ל-20% או 25% ודמי פתיחת תיק גבוהים בחברות אחרות.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start pb-4 border-b border-slate-50">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm md:text-base">אין החזר מס = אתה לא משלם שקל</h5>
                <p className="text-xs text-slate-500 mt-0.5">
                  האינטרס שלנו ושל המשתמש הוא 100% זהה. אנחנו מרוויחים רק אם הצלחנו להשיג לך כסף שיושב בקופת המדינה בצדק.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Left slot - The secure bank / high speed certificate */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">איכות ופיקוח מקצועי</span>
            <h4 className="font-extrabold text-slate-900 text-lg">בקרת רואי חשבון מוסמכים</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              למרות היותה מערכת דיגיטלית ומהירה, כל תיזר של קבצים טופס 106 מקבל מגע אנושי של רואה חשבון מוסמך מהחברות המובילות בישראל. הטיפול מול רשות המיסים מבוצע באופן מלא ומאובטח.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/60 flex items-center gap-3">
            <Lock className="w-7 h-7 text-emerald-600 shrink-0" />
            <div className="text-[11px] text-slate-600 leading-normal">
              <span className="font-bold block text-slate-900">תקן כספת SSL לביטחון מקסימלי 🛡️</span>
              הנתונים והמסמכים שלך משמשים אך ורק לצורך ניתוח הפרשי השכר והפקדות המס ונשמרים בדיסקרטיות מוחלטת בהתאם לחוקי הגנת הפרטיות.
            </div>
          </div>
        </div>

      </div>

      {/* Frequently Asked Questions (FAQ) Grid */}
      <div className="border-t border-slate-100 pt-8 space-y-6">
        <h4 className="text-xl font-bold text-slate-800 text-center md:text-right">שאלות נפוצות בנושא עלויות ושירות</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="p-5 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2">
              <h5 className="font-bold text-slate-900 text-sm md:text-base flex items-start gap-1.5">
                <HelpCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h5>
              <p className="text-xs text-slate-500 leading-relaxed pr-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
