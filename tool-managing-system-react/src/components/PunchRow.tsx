import { ChangeEvent } from "react";

import PunchIdTd from "./tdElements/PunchIdTd";
import SupplierTd from "./tdElements/SupplierTd";
import SpecificationTd from "./tdElements/SpecificationTd";
import InspectionHistoryTd from "./tdElements/InspectionHistoryTd";
import PunchStorageLocationTd from "./tdElements/PunchStorageLocationTd";
import ProductTd from "./tdElements/ProductTd";
import ProductTypeTd from "./tdElements/ProductTypeTd";
import CleaningHistoryTd from "./tdElements/CleaningHistoryTd";
import TotalUsageNumberTd from "./tdElements/TotalUsageNumberTd";

import { type PunchRow } from "@/common/types";
import PunchStatusSelect from "./selectElement/PunchStatusSelect";
import CheckBox from "./checkBox/CheckBox";

type Props = {
  row: PunchRow;
  selected: boolean;
  handlerChangeForSingleBox: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

function PunchRow({ row, selected, handlerChangeForSingleBox }: Props) {
  const punchId = row.punchId;

  // console.log(selected);

  return (
    <tr>
      <td>
        <CheckBox
          onChange={(event) => handlerChangeForSingleBox}
          punchId={punchId}
          checked={selected}
        />
      </td>
      <PunchIdTd punchId={row.punchId} />
      <SupplierTd supplier={row.supplier} />
      <SpecificationTd specification={row.specification} />
      <InspectionHistoryTd
        latestInspectionHistory={row.latestInspectionHistory}
      />
      <td>
        <PunchStatusSelect
          punchStatus={row.punchStatus}
          punchId={row.punchId}
        />
      </td>
      <PunchStorageLocationTd punchStorageLocation={row.punchStorageLocation} />
      <ProductTd product={row.product} />
      <ProductTypeTd productType={row.productType} />
      <CleaningHistoryTd latestCleaningHistory={row.latestCleaningHistory} />
      <TotalUsageNumberTd totalUsageNumber={row.totalUsageNumber} />
      <td>{row.maxUsageNumber}</td>
    </tr>
  );
}

export default PunchRow;
