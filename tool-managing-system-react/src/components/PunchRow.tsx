import PunchIdTd from "./tdElements/PunchIdTd";
import SupplierTd from "./tdElements/SupplierTd";
import SpecificationTd from "./tdElements/SpecificationTd";
import InspectionHistoryTd from "./tdElements/InspectionHistoryTd";
import PunchStorageLocationTd from "./tdElements/PunchStorageLocationTd";
import ProductTd from "./tdElements/ProductTd";
import ProductTypeTd from "./tdElements/ProductTypeTd";
import CleaningHistoryTd from "./tdElements/CleaningHistoryTd";
import TotalUsageNumberTd from "./tdElements/TotalUsageNumberTd";
import UsageInput from "./inputElement/UsageInput";

import { type PunchRow } from "@/common/types";
import PunchStatusSelect from "./selectElement/PunchStatusSelect";

type Props = {
  row: PunchRow;
};

function PunchRow({ row }: Props) {
  return (
    <>
      <tr>
        <PunchIdTd punchId={row.punchId} />
        <SupplierTd supplier={row.supplier} />
        <SpecificationTd specification={row.specification} />
        <InspectionHistoryTd
          latestInspectionHistory={row.latestInspectionHistory}
        />
        <td>
          <PunchStatusSelect punchStatus={row.punchStatus} />
        </td>
        <PunchStorageLocationTd
          punchStorageLocation={row.punchStorageLocation}
        />
        <ProductTd product={row.product} />
        <ProductTypeTd productType={row.productType} />
        <CleaningHistoryTd latestCleaningHistory={row.latestCleaningHistory} />
        <TotalUsageNumberTd totalUsageNumber={row.totalUsageNumber} />
        <td>
          <UsageInput />
        </td>
        <td>{row.maxUsageNumber}</td>
      </tr>
    </>
  );
}

export default PunchRow;
