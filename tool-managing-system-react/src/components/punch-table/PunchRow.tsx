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
import OpenFileButton from "../buttonElement/OpenFileButton";
import { type PunchRow } from "@/common/types";
import PunchStatusSelect from "../selectElement/PunchStatusSelect";
import CheckBox from "../checkBox/CheckBox";
import "@/css/punchRow.css";

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

  console.log(typeof refetch);

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
    alert(`useEffect runs!`);

    if (row.canUse === "초과") {
      const data: Data = {
        punchId: punchId,
        newStatus: `사용불가`,
      };

      request
        .post(`/api/tool-managing-system/updateStatus`, data)
        .then((response) => {
          alert(`펀치로우 사이드 이팩트 진입`);

          if (!response.ok)
            throw new Error(`상태 변경 중 error가 발생 하였습니다.`);
          refetch();
          alert(`사용불가 상태 변경 되었습니다.`);
        })
        .catch((error) => console.error(error));
    }
  }, [row.canUse]);

  function handlerClick() {
    const filePath = row.specification;
    const fileUrl = `file://${filePath}`;
    window.open(fileUrl);
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
      <td>
        <OpenFileButton
          text="규격문서 확인"
          onClick={handlerClick}
        ></OpenFileButton>
      </td>

      <InspectionHistoryTd latestInspectionDate={row.latestInspectionDate} />
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
