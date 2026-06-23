import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Baby, 
  Gift, 
  Briefcase, 
  Calendar, 
  ShieldAlert, 
  BadgeCheck, 
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  GraduationCap,
  Award,
  Coins,
  Globe,
  Heart,
  X
} from 'lucide-react';
import { CalculatorState, LeadDetails } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface TaxCalculatorProps {
  onSuccessSubmit: (lead: LeadDetails, estimate: number, calculatorState?: CalculatorState) => void;
  isMiloimOverride?: boolean;
}

export default function TaxCalculator({ onSuccessSubmit, isMiloimOverride = false }: TaxCalculatorProps) {
  // Init state
  const [inputs, setInputs] = useState<CalculatorState>({
    averageSalary: 14500,
    monthsWorked: 11,
    isMiloimnik: isMiloimOverride,
    miloimDays: isMiloimOverride ? 22 : 0,
    newChildren: 0,
    hasUnemployment: false,
    unemploymentMonths: 0,
    changedEmployer: false,
    donationsAmount: 0,
    livedInTaxTargetArea: false,
    dischargedSoldier: false,
    finishedDegree: false,
    independentPensionDeposits: false,
    pensionDepositAmount: 0,
    pensionPeriod: 'annual',
    hishtalmutDepositAmount: 0,
    hishtalmutPeriod: 'annual',
    childWithLearningDisabilities: false,
    singleParentOrDivorcedPaysAlimony: false,
    newImmigrantOrReturningResident: false
  });

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [estimatedRefund, setEstimatedRefund] = useState<number>(0);
  const [showLeadForm, setShowLeadForm] = useState<boolean>(false);
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);
  
  const [leadDetails, setLeadDetails] = useState<LeadDetails>({
    fullName: '',
    phone: '',
    email: '',
    taxYear: '2024'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showMiloimPopup, setShowMiloimPopup] = useState<boolean>(false);
  const [paidTax, setPaidTax] = useState<'yes' | 'no' | 'unset'>('unset');
  const [taxAmountPaid, setTaxAmountPaid] = useState<string>('');

  // Sync isMiloimOverride with input state
  useEffect(() => {
    if (isMiloimOverride) {
      setInputs(prev => ({
        ...prev,
        isMiloimnik: true,
        miloimDays: prev.miloimDays === 0 ? 22 : prev.miloimDays
      }));
      setShowMiloimPopup(true);
    }
  }, [isMiloimOverride]);

  // Real-time calculation logic
  const getCalculationBreakdown = () => {
    const genderPoints = gender === 'female' ? 2.75 : 2.25;
    const childrenPoints = inputs.newChildren * 2.5;
    
    // Learning disabilities: 2 points per child if checked, or at least 2 points
    const learningDisabilityPoints = inputs.childWithLearningDisabilities 
      ? (inputs.newChildren > 0 ? inputs.newChildren * 2 : 2) 
      : 0;

    const singleParentPoints = inputs.singleParentOrDivorcedPaysAlimony ? 1 : 0;
    const armyPoints = inputs.dischargedSoldier ? 2 : 0;
    const degreePoints = inputs.finishedDegree ? 1 : 0;
    const immigrantPoints = inputs.newImmigrantOrReturningResident ? 1 : 0;

    const total_points_monthly = genderPoints + childrenPoints + learningDisabilityPoints + singleParentPoints + armyPoints + degreePoints + immigrantPoints;
    
    const base_points = genderPoints;
    const extra_points_monthly = Math.max(0, total_points_monthly - base_points);
    
    // Annual value of points: scaled properly
    const value_from_points_annual = total_points_monthly * 242 * inputs.monthsWorked;
    const value_from_extra_points_annual = extra_points_monthly * 242 * inputs.monthsWorked;

    // Additional cash elements
    const settlement_amount_annual = inputs.livedInTaxTargetArea ? 1000 * 12 : 0;
    const employerChangeRefund = inputs.changedEmployer ? 1000 : 0;

    const pensionBenefit = inputs.independentPensionDeposits 
      ? (inputs.pensionDepositAmount * 0.35) * (inputs.pensionPeriod === 'monthly' ? 12 : 1)
      : 0;
    const hishtalmutBenefit = inputs.independentPensionDeposits
      ? (inputs.hishtalmutDepositAmount * 0.20) * (inputs.hishtalmutPeriod === 'monthly' ? 12 : 1)
      : 0;

    const pension_hishtalmut_total = pensionBenefit + hishtalmutBenefit;

    // Gap refund
    const missingMonths = 12 - inputs.monthsWorked;
    let gapRefund = 0;
    if (missingMonths > 0 && inputs.averageSalary > 6500) {
      const estimatedTaxRate = inputs.averageSalary > 25000 ? 0.35 : inputs.averageSalary > 15000 ? 0.20 : 0.14;
      const monthlyTaxPaidApproximation = inputs.averageSalary * estimatedTaxRate;
      gapRefund = Math.min(18000, missingMonths * monthlyTaxPaidApproximation * 0.7);
    }

    // Unemployment
    const unemploymentRefund = (inputs.hasUnemployment && inputs.unemploymentMonths > 0)
      ? Math.min(12000, inputs.unemploymentMonths * (inputs.averageSalary * 0.12))
      : 0;

    // Donations
    const donationsRefund = inputs.donationsAmount * 0.35;

    // Reserves (Temporarily set to 0 as requested - does not affect the calculation right now)
    const miloimBenefit = 0;

    return {
      total_points_monthly,
      base_points,
      extra_points_monthly,
      value_from_points_annual,
      value_from_extra_points_annual,
      settlement_amount_annual,
      employerChangeRefund,
      pensionBenefit,
      hishtalmutBenefit,
      pension_hishtalmut_total,
      gapRefund,
      unemploymentRefund,
      donationsRefund,
      miloimBenefit,
      immigrantPoints
    };
  };

  useEffect(() => {
    if (paidTax === 'no') {
      setEstimatedRefund(0);
      return;
    }

    const calc = getCalculationBreakdown();
    
    let refundAmount = 0;

    // Apply the mathematical factors
    refundAmount += calc.gapRefund;
    refundAmount += calc.employerChangeRefund;
    refundAmount += calc.unemploymentRefund;
    refundAmount += calc.donationsRefund;
    refundAmount += calc.miloimBenefit;
    refundAmount += calc.pension_hishtalmut_total;

    if (inputs.livedInTaxTargetArea) {
      refundAmount += calc.settlement_amount_annual;
    }

    // Points-based extra refund: difference between total points and gender default base points
    const basePoints = gender === 'female' ? 2.75 : 2.25;
    const extraPoints = Math.max(0, calc.total_points_monthly - basePoints);
    refundAmount += extraPoints * 242 * inputs.monthsWorked;

    // Floor and round the refund beautifully
    let finalRefund = Math.max(0, Math.floor(refundAmount / 50) * 50);

    // Minimum fallback if any high yield triggers are selected (excluding miloim for now as requested)
    if (finalRefund === 0 && (
      inputs.changedEmployer || 
      inputs.newChildren > 0 ||
      inputs.livedInTaxTargetArea ||
      inputs.dischargedSoldier ||
      inputs.finishedDegree ||
      inputs.independentPensionDeposits ||
      inputs.childWithLearningDisabilities ||
      inputs.singleParentOrDivorcedPaysAlimony ||
      inputs.newImmigrantOrReturningResident
    )) {
      finalRefund = 3450;
    }

    // Cap with tax paid if some amount was entered
    if (paidTax === 'yes' && taxAmountPaid) {
      const parsedTaxPaid = parseFloat(taxAmountPaid);
      if (!isNaN(parsedTaxPaid) && parsedTaxPaid > 0) {
        finalRefund = Math.min(finalRefund, parsedTaxPaid);
      }
    }

    setEstimatedRefund(finalRefund);
  }, [inputs, gender, paidTax, taxAmountPaid]);

  const handleInputChange = (field: keyof CalculatorState, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
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
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLeadSubmitted(true);
      onSuccessSubmit(leadDetails, estimatedRefund, inputs);
    }
  };

  return (
    <div id="calculator-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right">
      
      {/* Input controls (8 spans on wide layout) */}
      <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm leading-relaxed">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-slate-800">סימולטור החזר מס אינטראקטיבי</h3>
            <p className="text-sm text-slate-500">הזן נתונים בסיסיים כדי לקבל אומדן החזר מיידי.</p>
          </div>
        </div>

        <div className="space-y-6">
          {paidTax === 'unset' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 py-2 text-right"
            >
              <div className="bg-gradient-to-l from-indigo-50/70 to-blue-50/70 border border-blue-150 p-5 rounded-2xl">
                <span className="text-xs bg-indigo-600 text-white font-extrabold px-3 py-1 rounded-full mb-3 inline-block shadow-xs">צעד 1 מתוך 2</span>
                <h4 className="text-lg font-bold text-slate-800 leading-snug">האם שילמת מס הכנסה (או נוכה משכרך) בשנה החולפת?</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  רשות המיסים מחזירה כספים מתוך המיסים ששולמו בפועל במהלך שנת המס. לכן, תנאי בסיסי לקבלת החזר הוא תשלום מס כלשהו (כשכיר דרך תלוש השכר, או כעצמאי דרך מקדמות).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaidTax('yes')}
                  className="p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50/20 active:scale-[0.98] transition-all flex flex-col items-center text-center gap-3 group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Coins className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800 text-base">כן, שילמתי מס הכנסה</span>
                    <span className="block text-[11px] text-slate-400 mt-1 leading-normal">הייתי שכיר/ה או עצמאי/ת ונוכו לי מיסים מההכנסה</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaidTax('no')}
                  className="p-5 rounded-2xl border-2 border-slate-100 hover:border-rose-300 hover:bg-rose-50/20 active:scale-[0.98] transition-all flex flex-col items-center text-center gap-3 group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800 text-base">לא, לא שילמתי מס</span>
                    <span className="block text-[11px] text-slate-400 mt-1 leading-normal">לא עבדתי או שהשכר שלי היה נמוך מסף המס</span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {paidTax === 'no' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 md:p-8 text-center space-y-6 bg-rose-50/30 border border-rose-100 rounded-2xl leading-normal text-right"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-rose-500/10 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-150">
                  <Heart className="w-10 h-10 fill-rose-500 text-rose-500 animate-pulse" />
                </div>
              </div>

              <div className="max-w-md mx-auto space-y-3.5 text-center">
                <h3 className="text-xl md:text-2xl font-black text-rose-950 font-display">לא, לא שילמתי מס ❤️ איך יהיה החזר?</h3>
                <p className="text-sm text-rose-800 leading-relaxed font-bold">
                  ראשית, אנחנו מעריכים מאוד את הכנות שלך! 
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  רשות המיסים מחזירה כסף אך ורק מתוך <strong>כספי מס שנוכו ממך בפועל</strong> במהלך השנה (למשל בתלוש המשכורת או כמקדמות). 
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  אם לא שילמת מס הכנסה כלל (למשל כי לא עבדת, או שהשכר שלך היה נמוך מסף המס והיה פטור ממס), אין בקופה כסף ששייך לך ושאותו ניתן לבקש בחזרה.
                </p>
                <p className="text-xs sm:text-sm text-rose-700 bg-rose-500/5 py-2 px-3 rounded-lg border border-rose-100/50 inline-block font-semibold">
                  🛡️ אל דאגה, אתה תמיד יכול לחזור בשנה הבאה לבדוק!
                </p>
                <div className="bg-white/90 border border-rose-100/60 p-4 rounded-xl text-right text-xs text-rose-900 leading-relaxed mt-2 shadow-xs">
                  💡 <strong>טיפ חם:</strong> הבדיקה נעשית עבור 6 השנים האחרונות! ייתכן שבשנים אחרות (למשל 2020 או 2022) כן עבדת ושילמת מס גבוה מהנדרש. כדאי לבדוק עבור שנים אלו!
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={() => setPaidTax('unset')}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-950 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  ← חזרה ובדיקה מחדש
                </button>
                <button
                  type="button"
                  onClick={() => setPaidTax('yes')}
                  className="flex-1 py-3 px-4 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  בכל זאת שילמתי מס הכנסה
                </button>
              </div>
            </motion.div>
          )}

          {paidTax === 'yes' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Input for: How much tax paid */}
              <div className="p-4 bg-blue-50/50 border border-blue-200/50 rounded-xl space-y-3 text-right">
                <div className="flex justify-between items-center text-right">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Coins className="w-4.5 h-4.5 text-blue-600 animate-bounce" />
                    שלב א׳: כמה מס הכנסה שילמת השנה בערך?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPaidTax('unset');
                      setTaxAmountPaid('');
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-800 hover:underline font-bold cursor-pointer"
                  >
                    [אפס ובדוק שוב ↺]
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    pattern="[0-9]*"
                    value={taxAmountPaid}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setTaxAmountPaid(val);
                    }}
                    placeholder="למשל: 8,000"
                    className="w-full pl-8 pr-12 py-2.5 bg-white border border-slate-200 rounded-xl text-left text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-left"
                  />
                  <span className="absolute right-4 top-3 text-slate-400 text-sm font-semibold">₪</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  הזן את מס ההכנסה השנתי שנוכה ממך (מופיע בטופס 106 תחת "מס הכנסה"). אם אין לך את המספר המדויק, תוכל להכניס הערכה. הערכת ההחזר תוגבל אוטומטית לגובה המס ששילמת.
                </p>
              </div>

              {/* Gender & Base */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">מגדר המגיש/ה (משפיע על נקודות זיכוי בסיס):</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                  gender === 'male' 
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold shadow-sm' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                גבר (2.25 נק' זיכוי)
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                  gender === 'female' 
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold shadow-sm' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                אישה (2.75 נק' זיכוי)
              </button>
            </div>
          </div>

          {/* Average Gross Salary Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <span>משכורת חודשית ממוצעת ברוטו:</span>
              </label>
              <span className="font-mono text-base font-bold text-blue-600">₪{inputs.averageSalary.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="4000"
              max="50000"
              step="500"
              value={inputs.averageSalary}
              onChange={(e) => handleInputChange('averageSalary', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>₪50,000</span>
              <span>₪25,000</span>
              <span>₪4,000</span>
            </div>
          </div>

          {/* Months Worked Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-semibold text-slate-700">
                חודשי עבודה בפועל במהלך השנה:
              </label>
              <span className="font-mono text-base font-bold text-blue-600">{inputs.monthsWorked} חודשים</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={inputs.monthsWorked}
              onChange={(e) => handleInputChange('monthsWorked', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>12 חודשים (מלא)</span>
              <span>6 חודשים</span>
              <span>חודש אחד</span>
            </div>
            {inputs.monthsWorked < 12 && (
              <div className="mt-2 text-xs bg-amber-50 text-amber-800 p-2.5 rounded-lg border border-amber-100 flex items-start gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span><strong>פוטנציאל גבוה להחזר!</strong> חודשים ללא עבודה יוצרים זכאות מובנית להחזר גבוה עקב אי-ניצול מדרגות מס שנתיות.</span>
              </div>
            )}
          </div>

          {/* Grid of Checkboxes & Sub-options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* Reserves Checkbox */}
            <div className={`p-4 rounded-xl border transition-all ${
              inputs.isMiloimnik 
                ? 'bg-emerald-50/40 border-emerald-200' 
                : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
            }`}>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.isMiloimnik}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    handleInputChange('isMiloimnik', checked);
                    if (checked) {
                      setShowMiloimPopup(true);
                    }
                  }}
                  className="w-4.5 h-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                  ⚔️ שירות מילואים פעיל
                </span>
              </label>
              
              {inputs.isMiloimnik && (
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-600">
                    <span>כמה ימי מילואים ביצעת?</span>
                    <span className="text-emerald-700 font-bold">{inputs.miloimDays} ימים</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="90"
                    value={inputs.miloimDays}
                    onChange={(e) => handleInputChange('miloimDays', parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-emerald-600"
                  />
                  <p className="text-[11px] text-emerald-700 font-medium">🇮🇱 עמלת טיפול מופחתת של 13% בלבד מובטחת עבורך!</p>
                </div>
              )}
            </div>

            {/* Kids Selector */}
            <div className={`p-4 rounded-xl border transition-all ${
              inputs.newChildren > 0 
                ? 'bg-blue-50/30 border-blue-200' 
                : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Baby className="w-4.5 h-4.5 text-blue-500" />
                  נולד או אומץ ילד בשנים האחרונות?
                </span>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => handleInputChange('newChildren', Math.max(0, inputs.newChildren - 1))}
                    className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 transition-colors font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 font-mono text-sm font-bold text-slate-700">{inputs.newChildren}</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('newChildren', Math.min(5, inputs.newChildren + 1))}
                    className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 transition-colors font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                כל תינוק מוסיף נקודות זיכוי חודשיות ששוות אלפי שקלים בשנה שלא תמיד מתעדכנות בזמן אמת.
              </p>
            </div>

            {/* Changed Employer */}
            <div className={`p-4 rounded-xl border transition-all ${
              inputs.changedEmployer 
                ? 'bg-purple-50/40 border-purple-200' 
                : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.changedEmployer}
                  onChange={(e) => handleInputChange('changedEmployer', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                    <Briefcase className="w-4 h-4 text-purple-500" />
                    חל שינוי במעסיקים במהלך השנה?
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    מעבר בין עבודות, תקופות כפל שכר או חפיפה יוצרים תשלומי מס עודפים.
                  </span>
                </div>
              </label>
            </div>

            {/* Furlough / Unemployment */}
            <div className={`p-4 rounded-xl border transition-all ${
              inputs.hasUnemployment 
                ? 'bg-rose-50/30 border-rose-200' 
                : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={inputs.hasUnemployment}
                  onChange={(e) => handleInputChange('hasUnemployment', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-rose-500" />
                    חל\"ת (פדוש), מחלה או אבטלה?
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    קבלת דמי אבטלה מביטוח לאומי במקביל לשירות מוליכה לקפיצת מס.
                  </span>
                </div>
              </label>
              
              {inputs.hasUnemployment && (
                <div className="mt-2 border-t border-rose-100 pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-600">חודשי אבטלה/חל\"ת סה\"כ:</span>
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg overflow-hidden shrink-0">
                    <button
                      type="button"
                      onClick={() => handleInputChange('unemploymentMonths', Math.max(0, inputs.unemploymentMonths - 1))}
                      className="px-2.5 py-0.5 text-slate-500 hover:bg-slate-100 transition-colors font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="px-2.5 font-mono text-xs font-bold text-slate-700">{inputs.unemploymentMonths}</span>
                    <button
                      type="button"
                      onClick={() => handleInputChange('unemploymentMonths', Math.min(12, inputs.unemploymentMonths + 1))}
                      className="px-2.5 py-0.5 text-slate-500 hover:bg-slate-100 transition-colors font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Lived/Moved in Tax Beneficiary Locality */}
            <div className={`p-4 rounded-xl border transition-all ${
              inputs.livedInTaxTargetArea 
                ? 'bg-amber-50/30 border-amber-200' 
                : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.livedInTaxTargetArea}
                  onChange={(e) => handleInputChange('livedInTaxTargetArea', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                    האם עברת/גרת ביישוב מזכה מס?
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    סיוע מוגדל לתושבי הנגב, הגליל, עוטף עזה והפריפריה שמקנה הנחות ענק במס הכנסה.
                  </span>
                </div>
              </label>
            </div>

            {/* Discharged Soldier */}
            <div className={`p-4 rounded-xl border transition-all ${
              inputs.dischargedSoldier 
                ? 'bg-emerald-50/35 border-emerald-200' 
                : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.dischargedSoldier}
                  onChange={(e) => handleInputChange('dischargedSoldier', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1 flex-wrap">
                    <Award className="w-4 h-4 text-emerald-500 shrink-0" />
                    השתחררת מהצבא ב-3 השנים האחרונות?
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    נקודות זיכוי מיוחדות לחיילים משוחררים ולמסיימי שירות לאומי שמצטברות לאלפי שקלים.
                  </span>
                </div>
              </label>
            </div>

            {/* Finished Academic Degree */}
            <div className={`p-4 rounded-xl border transition-all ${
              inputs.finishedDegree 
                ? 'bg-blue-50/30 border-blue-200' 
                : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.finishedDegree}
                  onChange={(e) => handleInputChange('finishedDegree', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                    <GraduationCap className="w-4 h-4 text-blue-500 shrink-0" />
                    סיימת תואר אקדמי או לימודי תעודה בשנתיים האחרונות?
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    זכאות להטבת מס (נקודות זיכוי) המגיעה לבוגרי תואר ראשון, תואר שני או לימודי תעודה מקצועיים ממוסדות מוכרים.
                  </span>
                </div>
              </label>
            </div>

            {/* New Immigrant / Returning Resident */}
            <div className={`p-4 rounded-xl border transition-all ${
              inputs.newImmigrantOrReturningResident 
                ? 'bg-blue-50/30 border-blue-200' 
                : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.newImmigrantOrReturningResident}
                  onChange={(e) => handleInputChange('newImmigrantOrReturningResident', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                    <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                    עולה חדש / תושב חוזר ותיק?
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    זכאות לנקודות זיכוי חודשיות (נקודה 1 לחודש) הניתנות לעולים חדשים ולתושבים ותיקים שחזרו לישראל.
                  </span>
                </div>
              </label>
            </div>

            {/* Independent Pension Deposits */}
            <div className={`p-4 rounded-xl border transition-all md:col-span-2 ${
              inputs.independentPensionDeposits 
                ? 'bg-purple-50/45 border-purple-300' 
                : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.independentPensionDeposits}
                  onChange={(e) => handleInputChange('independentPensionDeposits', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                    <Coins className="w-4 h-4 text-purple-500 shrink-0" />
                    ביצעת הפקדות עצמאיות לפנסיה/קרן השתלמות?
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    הפקדות כספים עצמאיות לקופות גמל וקרנות חסכון מזכות בניכויי וזיכויי מס לפי סעיף 45 ו-47.
                  </span>
                </div>
              </label>

              {inputs.independentPensionDeposits && (
                <div className="mt-4 pt-4 border-t border-purple-150 space-y-4">
                  <p className="text-xs text-purple-800 font-bold bg-purple-50 p-2.5 rounded-lg border border-purple-100 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600 animate-pulse shrink-0" />
                    <span>הזן סכומים בערך (אפשר לרשום בערך לא סכום מדוייק, אנחנו כבר נדייק אותך)</span>
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Pension Amount input with Frequency choice */}
                    <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-2 shadow-xs">
                      <span className="text-xs font-bold text-slate-700 block">סכום הפקדה לפנסיה / קופת גמל:</span>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-2 text-slate-400 text-xs font-mono">₪</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="לדוגמא 10,000"
                            value={inputs.pensionDepositAmount || ''}
                            onChange={(e) => handleInputChange('pensionDepositAmount', parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-200 py-1.5 pl-3 pr-8 rounded-lg text-left font-mono font-bold text-xs focus:outline-none focus:border-purple-500 text-slate-700"
                          />
                        </div>
                        <select
                          value={inputs.pensionPeriod}
                          onChange={(e) => handleInputChange('pensionPeriod', e.target.value as 'monthly' | 'annual')}
                          className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-purple-500"
                        >
                          <option value="monthly">חודשי</option>
                          <option value="annual">שנתי</option>
                        </select>
                      </div>
                      <p className="text-[10px] text-purple-600 font-medium">החזר מס צפוי: 35% מגובה ההפקדה</p>
                    </div>

                    {/* Keren Hishtalmut Amount input with Frequency choice */}
                    <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-2 shadow-xs">
                      <span className="text-xs font-bold text-slate-700 block">סכום הפקדה לקרן השתלמות עצמאית:</span>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-2 text-slate-400 text-xs font-mono">₪</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="לדוגמא 8,000"
                            value={inputs.hishtalmutDepositAmount || ''}
                            onChange={(e) => handleInputChange('hishtalmutDepositAmount', parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-200 py-1.5 pl-3 pr-8 rounded-lg text-left font-mono font-bold text-xs focus:outline-none focus:border-purple-500 text-slate-700"
                          />
                        </div>
                        <select
                          value={inputs.hishtalmutPeriod}
                          onChange={(e) => handleInputChange('hishtalmutPeriod', e.target.value as 'monthly' | 'annual')}
                          className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-purple-500"
                        >
                          <option value="monthly">חודשי</option>
                          <option value="annual">שנתי</option>
                        </select>
                      </div>
                      <p className="text-[10px] text-purple-600 font-medium">החזר מס צפוי: 20% מגובה ההפקדה</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Child with Learning Disabilities */}
            <div className={`p-4 rounded-xl border transition-all ${
              inputs.childWithLearningDisabilities 
                ? 'bg-rose-50/30 border-rose-200' 
                : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.childWithLearningDisabilities}
                  onChange={(e) => handleInputChange('childWithLearningDisabilities', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                    <HeartHandshake className="w-4 h-4 text-rose-500 shrink-0" />
                    יש לך ילד שמאובחן עם לקויות למידה?
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    זכאות ל-2 נקודות זיכוי שנתיות (סעיף 40א) המגיעות להורים לילדים במסגרות למידה מיוחדות, אבחונים או לקויות למידה מוכרות.
                  </span>
                </div>
              </label>
            </div>

            {/* Single/Divorced Parent paying child support */}
            <div className={`p-4 rounded-xl border transition-all ${
              inputs.singleParentOrDivorcedPaysAlimony 
                ? 'bg-indigo-50/30 border-indigo-200' 
                : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.singleParentOrDivorcedPaysAlimony}
                  onChange={(e) => handleInputChange('singleParentOrDivorcedPaysAlimony', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                    <Baby className="w-4 h-4 text-indigo-500 shrink-0" />
                    הורה יחיד / גרוש שמשלם מזונות?
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    זכאות לנקודות זיכוי ממס עבור משפחה חד-הורית או בגין השתתפות בכלכלת הילדים ותשלום דמי מזונות.
                  </span>
                </div>
              </label>
            </div>

            {/* Contributions / Donations */}
            <div className="md:col-span-2 p-4 bg-slate-50/50 border border-slate-100 hover:border-slate-200 rounded-xl transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Gift className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">תרומות שנתיות למוסדות מוכרים (סעיף 46)</span>
                    <span className="text-[11px] text-slate-400 leading-tight">זכאות לזיכוי בגובה 35% מסך התרומה שעברה ₪200.</span>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden shrink-0 max-w-[150px]">
                  <span className="absolute left-3 top-2 text-slate-400 text-xs font-mono">₪</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={inputs.donationsAmount || ''}
                    onChange={(e) => handleInputChange('donationsAmount', parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 py-1.5 pl-3 pr-8 rounded-lg text-left font-mono font-bold text-sm focus:outline-none focus:border-blue-500 text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
          </motion.div>
          )}
        </div>
      </div>

      {/* Result box & conversion capture form (5 spans on wide layout) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Real-time Dynamic Estimate Display Box */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 vault-shine relative overflow-hidden flex flex-col justify-between min-h-[250px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

          <div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                חישוב בזמן אמת ע\"פ פקודת מס הכנסה
              </span>
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                <span>מאובטח 256-bit</span>
              </div>
            </div>

            <p className="text-slate-300 text-sm font-medium mb-1">החזר מס משוער עבורך:</p>
            
            {/* The giant animated counter */}
            <div className="flex items-baseline gap-2 relative z-10 py-2">
              <span className="text-5xl md:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-l from-yellow-300 via-amber-400 to-orange-400 drop-shadow-sm">
                ₪{estimatedRefund.toLocaleString()}
              </span>
              <span className="text-slate-400 text-sm">בחזר ממוצע</span>
            </div>

            <div className="mt-4 text-xs leading-relaxed text-slate-400 flex items-start gap-1.5 border-t border-slate-800 pt-4">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
              <span>הערכה זו מחושבת על פי סימולציית מדרגות המס ושאריות נקודות הזיכוי השנתיות. רואי החשבון שלנו יבצעו בדיקה קפדנית מול רשות המיסים כדי להשיג את המקסימום.</span>
            </div>
          </div>

          <div className="mt-6 relative z-10">
            {!showLeadForm ? (
              <button
                type="button"
                onClick={() => setShowLeadForm(true)}
                className="w-full py-4 px-6 bg-gradient-to-l from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-center rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                שמור תוצאה והתחל בדיקה מקיפה חינם 🚀
              </button>
            ) : (
              <p className="text-xs text-amber-400 font-semibold text-center py-2">שנה את המחוונים בכל עת, הסכום יסונכרן מעלה!</p>
            )}
          </div>
        </div>

        {/* Lead capture panel, animates open on CTA click */}
        <AnimatePresence>
          {showLeadForm && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-right"
            >
              {!leadSubmitted ? (
                <form 
                  name="tax-lead" 
                  method="POST" 
                  data-netlify="true" 
                  onSubmit={handleFormSubmit} 
                  className="space-y-4"
                >
                  <input type="hidden" name="form-name" value="tax-lead" />
                  <input type="hidden" name="estimate" value={estimatedRefund} />
                  <input type="hidden" name="isMiloimnik" value={inputs.isMiloimnik ? 'כן' : 'לא'} />
                  <input type="hidden" name="comments" value="" />
                  <input type="hidden" name="extraDetails" value={JSON.stringify(inputs)} />

                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-2">
                    <span className="font-bold text-slate-800">לקבלת ההחזר - הזן פרטים:</span>
                    <button
                      type="button"
                      onClick={() => setShowLeadForm(false)}
                      className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      בטל
                    </button>
                  </div>

                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">שם מלא:</label>
                    <input
                      type="text"
                      name="fullName"
                      className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-1 ${
                        formErrors.fullName ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder="ישראל ישראלי"
                      value={leadDetails.fullName}
                      onChange={(e) => setLeadDetails(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                    {formErrors.fullName && <p className="text-xs text-rose-500 mt-1">{formErrors.fullName}</p>}
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">טלפון נייד:</label>
                    <input
                      type="tel"
                      name="phone"
                      className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-1 text-left ${
                        formErrors.phone ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder="050-0000000"
                      value={leadDetails.phone}
                      onChange={(e) => setLeadDetails(prev => ({ ...prev, phone: e.target.value }))}
                    />
                    {formErrors.phone && <p className="text-xs text-rose-500 mt-1">{formErrors.phone}</p>}
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">אימייל לעדכון סטטוס:</label>
                    <input
                      type="email"
                      name="email"
                      className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-1 text-left ${
                        formErrors.email ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder="israel@gmail.com"
                      value={leadDetails.email}
                      onChange={(e) => setLeadDetails(prev => ({ ...prev, email: e.target.value }))}
                    />
                    {formErrors.email && <p className="text-xs text-rose-500 mt-1">{formErrors.email}</p>}
                  </div>

                  {/* Tax Year choice */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">עבור שנת מס:</label>
                      <select
                        name="taxYear"
                        value={leadDetails.taxYear}
                        onChange={(e) => setLeadDetails(prev => ({ ...prev, taxYear: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white"
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
                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                      >
                        שלח בדיקה ראשונית 🔐
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-slate-400 text-center">
                    🔒 המידע שלך מוצפן בתקן SSL מחמיר ומשמש אך ורק לבדיקת זכאות ע״י רואי חשבון מוסמכים.
                  </p>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800">הבדיקה נשלחה בהצלחה!</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      הורדנו את הנתונים שלך באומדן של <strong className="font-mono text-emerald-600">₪{estimatedRefund.toLocaleString()}</strong>. רואה חשבון יבדוק זאת מול רגולציית רשות המיסים ויחזור אליך תוך 24 שעות עם הפירוט המדויק.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-right space-y-1">
                    <p className="text-[11px] text-slate-700"><strong>שם הפונה:</strong> {leadDetails.fullName}</p>
                    <p className="text-[11px] text-slate-700"><strong>טלפון:</strong> {leadDetails.phone}</p>
                    <p className="text-[11px] text-slate-700"><strong>שנת מס מבוקשת:</strong> {leadDetails.taxYear}</p>
                    <p className="text-[11px] text-slate-700"><strong>עלות טיפול:</strong> ללא דמי פתיחת תיק! הכי זול בארץ.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLeadSubmitted(false);
                      setShowLeadForm(false);
                      setLeadDetails({ fullName: '', phone: '', email: '', taxYear: '2024' });
                    }}
                    className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    מלא טופס נוסף לבן/בת הזוג ←
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-time Detailed Breakdown (Spreadsheet / List) */}
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
          <div className="border-b border-rose-100 pb-3 flex justify-between items-center text-right">
            <span className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
              סימולציית מודל החזר המס שלך (בזמן אמת):
            </span>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded-full select-none shrink-0">
              לפי מודל הנחות
            </span>
          </div>

          {(() => {
            const calc = getCalculationBreakdown();
            return (
              <div className="space-y-3 text-right">
                {/* 1. Monthly Points count */}
                <div className="flex flex-col gap-1 border-b border-rose-50 pb-2">
                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>סה״כ נקודות זיכוי חודשיות שלך (כולל בסיס):</span>
                    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-mono">
                      {calc.total_points_monthly.toFixed(2)} נק׳
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[11px] text-slate-500 pr-2">
                    <span>• מתוכן נקודות בסיס (מיושמות אוטומטית ע״י המעסיק - ללא החזר):</span>
                    <span className="font-semibold text-slate-600 font-mono">
                      {calc.base_points.toFixed(2)} נק׳
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-indigo-600 pr-2">
                    <span className="font-medium">• נקודות זיכוי נוספות המזכות בהחזר מס:</span>
                    <span className="font-bold font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded">
                      {calc.extra_points_monthly.toFixed(2)} נק׳
                    </span>
                  </div>
                </div>

                {/* 2. Points Annual Worth (Only Extra Points yield refund) */}
                <div className="flex justify-between items-center text-xs text-slate-600 border-b border-slate-100 pb-2">
                  <span className="font-medium text-indigo-700">החזר מס שנתי משוער מנקודות הזיכוי הנוספות:</span>
                  <span className="font-bold text-indigo-600 font-mono">
                    ₪{Math.round(calc.value_from_extra_points_annual).toLocaleString()}
                  </span>
                </div>

                {/* 3. Lived in Target Locality */}
                {inputs.livedInTaxTargetArea && (
                  <div className="flex justify-between items-center text-xs text-slate-600 border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      מענק שנתי ליישוב מזכה (₪1,000 לחודש):
                    </span>
                    <span className="font-bold text-emerald-600 font-mono">
                      + ₪{calc.settlement_amount_annual.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* 4. Changed employer */}
                {inputs.changedEmployer && (
                  <div className="flex justify-between items-center text-xs text-slate-600 border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                      החזר משוער בגין מעבר בין מעסיקים:
                    </span>
                    <span className="font-bold text-blue-600 font-mono">
                      + ₪{calc.employerChangeRefund.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* 5. Pension & Hishtalmut Deposits */}
                {inputs.independentPensionDeposits && (calc.pension_hishtalmut_total > 0) && (
                  <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-2">
                    <div className="flex justify-between items-center text-xs text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                        זיכוי בגין הפקדות עצמאיות:
                      </span>
                      <span className="font-bold text-purple-600 font-mono">
                        + ₪{Math.round(calc.pension_hishtalmut_total).toLocaleString()}
                      </span>
                    </div>
                    {calc.pensionBenefit > 0 && (
                      <span className="text-[10px] text-slate-500 self-start pr-3.5">
                        • קופת פנסיה / גמל (35% זיכוי): ₪{Math.round(calc.pensionBenefit).toLocaleString()}
                      </span>
                    )}
                    {calc.hishtalmutBenefit > 0 && (
                      <span className="text-[10px] text-slate-500 self-start pr-3.5">
                        • קרן השתלמות עצמאית (20% זיכוי): ₪{Math.round(calc.hishtalmutBenefit).toLocaleString()}
                      </span>
                    )}
                  </div>
                )}

                {/* 6. Gap in working year */}
                {calc.gapRefund > 0 && (
                  <div className="flex justify-between items-center text-xs text-slate-600 border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                      החזר משוער אי-עבודה רציפה בשנה:
                    </span>
                    <span className="font-bold text-amber-600 font-mono">
                      + ₪{Math.round(calc.gapRefund).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* 7. Reserve Duty Benefit */}
                {inputs.isMiloimnik && (
                  <div className="flex justify-between items-center text-xs text-slate-600 border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-300 shrink-0"></span>
                      שירות מילואים פעיל (ללא השפעה כעת):
                    </span>
                    <span className="font-bold text-slate-400 font-mono">
                      ₪0
                    </span>
                  </div>
                )}

                {/* 8. Donations */}
                {inputs.donationsAmount > 0 && (
                  <div className="flex justify-between items-center text-xs text-slate-600 border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                      החזר מס מוכח על תרומות (סעיף 46 - 35%):
                    </span>
                    <span className="font-bold text-rose-600 font-mono">
                      + ₪{Math.round(calc.donationsRefund).toLocaleString()}
                    </span>
                  </div>
                )}

                <p className="text-[10.5px] text-slate-400 leading-normal pt-1 flex items-start gap-1 pb-1">
                  <span>ℹ️</span>
                  <span>הערת אמינות: סימולציה זו היא "לפי מודל הנחות" כללי שנועד להמחיש את זכויותייך. היא אינה מהווה ייעוץ מס או חוות דעת רשמית ואינה מחליפה את חישוב שומת המס הסופית של רואי החשבון שלנו מול רשות המיסים.</span>
                </p>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Miloim Salute Interactive Alert Popup Modal */}
      <AnimatePresence>
        {showMiloimPopup && (
          <motion.div
            key="miloim-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
          >
            <motion.div
              key="miloim-modal-content"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 text-right font-sans relative"
            >
              <button
                type="button"
                onClick={() => setShowMiloimPopup(false)}
                className="absolute left-4 top-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-1.5 rounded-full transition-all z-20 cursor-pointer"
                aria-label="סגירה"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Majestic Tribute Header Banner */}
              <div className="bg-gradient-to-l from-emerald-800 via-teal-950 to-slate-900 text-white p-6 md:p-8 relative">
                <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-3xl -mr-16 -mt-16"></div>
                
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold rounded-full border border-emerald-500/30 inline-flex items-center gap-1 mb-3">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
                  באהבה ובהצדעה למשרתי המילואים 🇮🇱
                </span>
                
                <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
                  הטבה מיוחדת שהופעלה אוטומטית!
                </h3>
                <p className="text-slate-350 text-xs md:text-sm mt-1.5 leading-relaxed">
                  השירות והמסירות שלכם שווים זהב. כמשרתי מילואים פעילים, המערכת קיזזה מיידית את עלויות השירות שלכם לקבלת החזר מס מקסימלי עם מינימום עמלות!
                </p>
              </div>

              {/* Benefits Core Details */}
              <div className="p-6 md:p-8 space-y-4 bg-slate-50/50">
                <p className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                  🎁 הטבת מילואים מופעלת: המשמעות היא חיסכון כספי ישיר של מאות ואלפי שקלים בעמלת הטיפול מול רשות המיסים!
                </p>

                <div className="space-y-3.5">
                  <div className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">13% עמלת טיפול בלבד (במקום 15%)</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 leading-normal">העמלה הנמוכה וההגיונית ביותר בישראל. כל החיסכון הכספי של מאות או אלפי שקלים יישאר ישירות בכיס שלך!</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">ערוץ Fast-Track מהיר ומלא</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 leading-normal">תיקים של לוחמים ותומכי לחימה מיושרים ישירות לעדיפות ראשונה של מנהלי התיקים ורואי החשבון המנוסים השותפים שלנו.</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">אפס שקלים דמי פתיחת משרד</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 leading-normal">הבדיקה הראשונית חינמית לחלוטין. אנו לא גובים דמי פתיחת משרד או תיק, והתשלום מתבצע רק במידה וקיבלת את הכסף מרשות המיסים!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action and Dismiss Call to Action */}
              <div className="p-6 border-t border-slate-100 flex flex-col gap-2 bg-white">
                <button
                  type="button"
                  onClick={() => setShowMiloimPopup(false)}
                  className="w-full py-3 px-5 bg-gradient-to-l from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-center text-sm rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
                >
                  המשך לחישוב עם ההטבה המוגדלת 🇮🇱
                </button>
                <p className="text-[10px] text-slate-400 text-center leading-tight">
                  תודה ושמירה על עצמכם! הטבות המילואים חלות מיידית ומסונכרנות עם שידור הנתונים.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
