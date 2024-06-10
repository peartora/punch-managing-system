import { type PunchRow } from "@/common/types";
import { CheckBox } from "@/common/components/CheckBox";

import style from "./PunchRow.module.css";

import { PunchStatusSelect } from "./components/PunchStatusSelect";
import { CleaningHistoryTd } from "./components/CleaningHistoryTd";
import { InspectionHistoryTd } from "./components/InspectionHistoryTd";
import { SpecificationTd } from "./components/SpecificationTd";

type Props = {
  row: PunchRow;
  chekced: boolean;
  handlerChangeForSingleBox: (
    event: React.ChangeEvent<HTMLInputElement>,
    punchId: string
  ) => void;
  refetch: () => void;
};

export function PunchRow({
  row,
  chekced,
  handlerChangeForSingleBox,
  refetch,
}: Props) {
  console.log("PunchRow");
  console.log(row);

  let checkResult = "";

  if (row.punchStatus === "사용대기") {
    checkResult = style.orange;
  }

  return (
    <tr className={checkResult}>
      <td>
        <CheckBox
          onChange={(event) => handlerChangeForSingleBox(event, row.punchId)}
          punchId={row.punchId}
          checked={chekced}
        />
      </td>
      <td>{row.punchId}</td>
      <td>{row.supplier.supplier}</td>
      <SpecificationTd specification={row.specification} />

      <InspectionHistoryTd
        latestInspectionDate={row.latestInspectionDate}
        inspectionFilePath={row.inspectionFilePath}
        punchId={row.punchId}
      />
      <td>
        <PunchStatusSelect
          punchStatus={row.punchStatus}
          count={row.totalUsageNumber}
          punchId={row.punchId}
          product={row.medicine.medicine}
          refetch={refetch}
        />
      </td>
      <td>{row.medicine.medicine}</td>
      <td>{row.medicineType}</td>
      <CleaningHistoryTd
        latestCleaningHistory={row.latestCleaningHistory}
        punchId={row.punchId}
      />
    </tr>
  );
}
