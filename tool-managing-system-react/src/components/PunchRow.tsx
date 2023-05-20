import PunchIdTd from "./tdElements/PunchIdTd";
import SupplierTd from "./tdElements/SupplierTd";
import InspectionHistoryTd from "./tdElements/InspectionHistoryTd";
import PunchStorageLocationTd from "./tdElements/PunchStorageLocationTd";
import ProductTd from "./tdElements/ProductTd";
import ProductTypeTd from "./tdElements/ProductTypeTd";
import CleaningHistoryTd from "./tdElements/CleaningHistoryTd";
import TotalUsageNumberTd from "./tdElements/TotalUsageNumberTd";
import OpenFileButton from "./buttonElement/OpenFileButton";
import { type PunchRow } from "@/common/types";
import PunchStatusSelect from "./selectElement/PunchStatusSelect";
import CheckBox from "./checkBox/CheckBox";
import "./../css/punchRow.css";

type Props = {
  row: PunchRow;
  handlerChangeForSingleBox: (
    event: React.ChangeEvent<HTMLInputElement>,
    punchId: string
  ) => void;
  className: string;
};

function PunchRow({ row, handlerChangeForSingleBox, className }: Props) {
  const punchId = row.punchId;

  function handlerClick() {
    const filePath = row.specification;
    const fileUrl = `file://${filePath}`;
    window.open(fileUrl);
  }

  return (
    <tr className={className}>
      <td>
        <CheckBox
          onChange={(event) => handlerChangeForSingleBox(event, row.punchId)}
          punchId={punchId}
          checked={row["isSelected"]}
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
