const PUNCH_STATUS = [
  "사용대기",
  "사용가능",
  "사용중",
  "사용불가",
  "폐기",
] as const;
export type PunchStatus = (typeof PUNCH_STATUS)[number];

export type PunchRow = {
  punchId: string;
  supplier: string;
  specification: string;
  latestInspectionDate: string;
  punchStatus: PunchStatus;
  punchType: string;
  punchStorageLocation: string;
  product: string;
  productType: string;
  latestCleaningHistory: string;
  totalUsageNumber: number;
  usageNumber: number;
  maxUsageNumber: number;
  canUse: string;
};

export type Data = {
  number: string;
  date: string;
  type: string;
  manufacturer: string;
  specification: string;
  status: string;
  location: string;
  product: string;
  productType: string;
};
