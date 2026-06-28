import { CalculatorState } from './types';

export function formatCalculatorStateToHebrew(state: CalculatorState | any): string {
  if (!state) return "לא הוזנו פרטים נוספים";

  const lines: string[] = [];

  const avgSalary = state.averageSalary || state.monthlySalary || 0;
  lines.push(`• הכנסה חודשית ממוצעת: ₪${avgSalary.toLocaleString()}`);
  
  const months = state.monthsWorked !== undefined ? state.monthsWorked : 12;
  lines.push(`• חודשי עבודה בשנה: ${months} מתוך 12`);
  
  lines.push(`• שירות מילואים פעיל: ${state.isMiloimnik ? `כן (${state.miloimDays || 0} ימים)` : 'לא'}`);
  
  if (state.newChildren > 0) {
    lines.push(`• ילדים שנולדו או אומצו במהלך השנה: ${state.newChildren}`);
  } else {
    lines.push(`• ילדים שנולדו או אומצו במהלך השנה: לא`);
  }
  
  lines.push(`• קבלת דמי אבטלה: ${state.hasUnemployment ? `כן (${state.unemploymentMonths || 0} חודשים)` : 'לא'}`);
  
  lines.push(`• החלפת מעסיקים ללא תיאום מס: ${state.changedEmployer ? 'כן' : 'לא'}`);
  
  lines.push(`• תרומות למוסדות מוכרים (סעיף 46): ₪${(state.donationsAmount || 0).toLocaleString()}`);
  
  lines.push(`• מגורים ביישוב מוטב מס: ${state.livedInTaxTargetArea ? 'כן' : 'לא'}`);
  
  lines.push(`• חייל משוחרר / שירות לאומי (3 שנים אחרונות): ${state.dischargedSoldier ? 'כן' : 'לא'}`);
  
  lines.push(`• סיום תואר אקדמי / מקצועי (שנתיים אחרונות): ${state.finishedDegree ? 'כן' : 'לא'}`);
  
  if (state.independentPensionDeposits) {
    lines.push(`• ביצע הפקדות עצמאיות לקופות גמל / פנסיה / השתלמות: כן`);
    if (state.pensionDepositAmount > 0) {
      lines.push(`  - סכום הפקדה לפנסיה: ₪${state.pensionDepositAmount.toLocaleString()} (${state.pensionPeriod === 'monthly' ? 'חודשי' : 'שנתי'})`);
    }
    if (state.hishtalmutDepositAmount > 0) {
      lines.push(`  - סכום הפקדה לקרן השתלמות: ₪${state.hishtalmutDepositAmount.toLocaleString()} (${state.hishtalmutPeriod === 'monthly' ? 'חודשי' : 'שנתי'})`);
    }
  } else {
    lines.push(`• ביצע הפקדות עצמאיות לקופות גמל / פנסיה / השתלמות: לא`);
  }
  
  lines.push(`• הורה לילד בחינוך מיוחד / לקות למידה: ${state.childWithLearningDisabilities ? 'כן' : 'לא'}`);
  
  lines.push(`• הורה יחיד / גרוש המשלם דמי מזונות: ${state.singleParentOrDivorcedPaysAlimony ? 'כן' : 'לא'}`);
  
  lines.push(`• עולה חדש / תושב חוזר ותיק: ${state.newImmigrantOrReturningResident ? 'כן' : 'לא'}`);

  return lines.join('\n\n');
}
