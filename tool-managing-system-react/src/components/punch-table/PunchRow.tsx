import { useEffect } from "react";
import { request } from "@/common/Service";
import PunchIdTd from "../tdElements/PunchIdTd";
import SupplierTd from "../tdElements/SupplierTd";
import InspectionHistoryTd from "../tdElements/InspectionHistoryTd";
import PunchStorageLocationTd from "../tdElements/PunchStorageLocationTd";
import ProductTd from "../tdElements/ProductTd";
import ProductTypeTd from "../tdElements/ProductTypeTd";
import CleaningHistoryTd from "../tdElements/CleaningHistoryTd";
import TotalUsageNumberTd from "../tdElements/TotalUsageNumberTd";
import { type PunchRow } from "@/common/types";
import PunchStatusSelect from "../selectElement/PunchStatusSelect";
import CheckBox from "../checkBox/CheckBox";
import "@/css/punchRow.css";
import SpecificationTd from "../tdElements/SpecificationTd";

type Props = {
  row: PunchRow;
  chekced: boolean;
  handlerChangeForSingleBox: (
    event: React.ChangeEvent<HTMLInputElement>,
    punchId: string
  ) => void;
  refetch: () => void;
};

type Data = {
  punchId: string;
  newStatus: string;
};

function PunchRow({ row, chekced, handlerChangeForSingleBox, refetch }: Props) {
  const punchId = row.punchId;

  let checkResult = "";
  switch (row.canUse) {
    case "초과":
      checkResult = "red";
      break;
    case "금일중만료":
      checkResult = "orange";
      break;
    case "양호":
      checkResult = "white";
      break;
  }

  useEffect(() => {
    if (row.canUse === "초과") {
      if (row.punchStatus === "사용불가" || row.punchStatus === "폐기") {
        return;
      }

      const data: Data = {
        punchId: punchId,
        newStatus: `사용불가`,
      };

      request
        .post(`/api/tool-managing-system/updateStatus`, data)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`상태 변경 중 error가 발생 하였습니다.`);
          }
          refetch();
        })
        .catch((error) => console.error(error));
    }
  }, [punchId, refetch, row.canUse, row.punchStatus]);

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
      <TotalUsageNumberTd totalUsageNumber={row.totalUsageNumber} />
      <td>{row.maxUsageNumber}</td>
    </tr>
  );
}

export default PunchRow;
