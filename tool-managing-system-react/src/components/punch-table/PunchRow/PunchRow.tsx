import PunchIdTd from "../../tdElements/PunchIdTd";
import SupplierTd from "../../tdElements/SupplierTd";
import InspectionHistoryTd from "../../tdElements/InspectionHistoryTd";
import PunchStorageLocationTd from "../../tdElements/PunchStorageLocationTd";
import ProductTd from "../../tdElements/ProductTd";
import ProductTypeTd from "../../tdElements/ProductTypeTd";
import { CleaningHistoryTd } from "../../tdElements/CleaningHistoryTd";
import { type PunchRow } from "@/common/types";
import { CheckBox } from "@/components/CheckBox";
import SpecificationTd from "../../tdElements/SpecificationTd";

import style from "./PunchRow.module.css";

import { PunchStatusSelect } from "./components/PunchStatusSelect";

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
  console.log("row");
  console.log(row);

  const punchId = row.punchId;

  let checkResult = "";

  if (row.punchStatus === "사용대기") {
    checkResult = style.orange;
  }

  return (
    <tr className={checkResult}>
      <td>
        <CheckBox
          onChange={(event) => handlerChangeForSingleBox(event, row.punchId)}
          punchId={punchId}
          checked={chekced}
        />
      </td>
      <PunchIdTd punchId={row.punchId} />
      <SupplierTd supplier={row.supplier} />
      <SpecificationTd specification={row.specification} />

      <InspectionHistoryTd
        latestInspectionDate={row.latestInspectionDate}
        inspectionFilePath={row.inspectionFilePath}
        punchId={punchId}
      />
      <td>
        <PunchStatusSelect
          punchStatus={row.punchStatus}
          count={row.totalUsageNumber}
          punchId={row.punchId}
          product={row.product}
          refetch={refetch}
        />
      </td>
      <PunchStorageLocationTd punchStorageLocation={row.punchStorageLocation} />
      <ProductTd product={row.product} />
      <ProductTypeTd productType={row.productType} />
      <CleaningHistoryTd
        latestCleaningHistory={row.latestCleaningHistory}
        punchId={row.punchId}
      />
    </tr>
  );
}
