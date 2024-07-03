const PUNCH_STATUS = ["사용대기", "사용가능", "사용중", "폐기"] as const;
export type PunchStatus = (typeof PUNCH_STATUS)[number];

export type PunchRow = {
  punchId: string;
  supplier: Record<string, string>;
  specification: string;
  latestInspectionDate: string;
  inspectionFilePath: string;
  punchStatus: PunchStatus;
  storageLocation: string;
  medicineType: string;
  medicine: Record<string, string>;
  punchPosition: string;
  latestCleaningHistory: string;
  totalUsageNumber: number;
  usageNumber: number;
  maxUsageNumber: number;
  canUse: string;
};

export type Data = {
  punchId: string;
  date: string;
  punchPosition: string;
  supplier: string;
  medicine: string;
  medicineType: string;
};

export type Reponse = {
  count: number;
  message: string;
};

export type FormData = {
  startDate: string | Date;
  endDate: string | Date;
  punchPosition: string;
  supplier: string;
  status: string;
  medicine: string;
  medicineType: string;
};
