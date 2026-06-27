export interface CalculatorState {
  averageSalary: number; // monthly gross in NIS
  monthsWorked: number;  // out of 12
  isMiloimnik: boolean;
  miloimDays: number;
  newChildren: number;    // children born/adopted in tax year
  hasUnemployment: boolean;
  unemploymentMonths: number;
  changedEmployer: boolean;
  donationsAmount: number; // donations in NIS
  livedInTaxTargetArea: boolean; // lived or moved to a tax-beneficiary community
  dischargedSoldier: boolean;    // discharged from army in last 3 years
  finishedDegree: boolean;       // finished academic degree in last 2 years
  independentPensionDeposits: boolean; // made independent deposits to pension / keren hishtalmut
  pensionDepositAmount: number;        // pensions amount
  pensionPeriod: 'monthly' | 'annual'; // pension frequency
  hishtalmutDepositAmount: number;     // hishtalmut amount
  hishtalmutPeriod: 'monthly' | 'annual'; // hishtalmut frequency
  childWithLearningDisabilities: boolean; // has a child diagnosed with learning disabilities / special education
  singleParentOrDivorcedPaysAlimony: boolean; // single/divorced parent paying child support/alimony
  newImmigrantOrReturningResident: boolean; // immigrant or returning resident
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'idle' | 'uploading' | 'completed' | 'failed';
  progress: number;
  base64?: string;
  rawFile?: File;
}

export interface LeadDetails {
  fullName: string;
  phone: string;
  email: string;
  taxYear: string;
  comments?: string;
}

export type ActivePage = 'home' | 'calculator' | 'advanced' | 'miloimnikim' | 'pricing';
