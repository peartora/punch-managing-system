import { z } from "zod";
export type UseFetchReturn<I = undefined, T = unknown, E = unknown> = (
  | {
      status: "loading";
      isLoading: true;
      isError: false;
      isSuccess: false;
      data: undefined;
      error: undefined;
    }
  | {
      status: "error";
      isLoading: false;
      isError: true;
      isSuccess: false;
      data: undefined;
      error: E;
    }
  | {
      status: "success";
      isLoading: false;
      isError: false;
      isSuccess: true;
      data: T;
      error: undefined;
    }
) & {
  refetch: (input: I) => void;
};

export type FetchStatus = UseFetchReturn["status"];

const PUNCH_STATUS = [
  "사용대기",
  "사용가능",
  "사용중",
  "사용불가",
  "폐기",
] as const;
export const PunchStatus = z.enum(PUNCH_STATUS);
export type PunchStatus = z.infer<typeof PunchStatus>;

export const PunchRow = z.object({
  punchId: z.string(),
  supplier: z.string(),
  specification: z.string(),
  latestInspectionDate: z.string(),
  punchStatus: PunchStatus,
  punchStorageLocation: z.string(),
  product: z.string(),
  productType: z.string(),
  latestCleaningHistory: z.string(),
  totalUsageNumber: z.number(),
  maxUsageNumber: z.number(),
  isSelected: z.boolean(),
  canUse: z.string(),
});
export type PunchRow = z.infer<typeof PunchRow>;

// export type Data = {
//   number: string;
//   date: string;
//   type: string;
//   manufacturer: string;
//   specification: string;
//   status: string;
//   location: string;
//   product: string;
//   productType: string;
// };
