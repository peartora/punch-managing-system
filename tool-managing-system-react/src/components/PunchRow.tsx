import PunchIdTd from "./td-elements/PunchIdTd";
import SupplierTd from "./td-elements/SupplierTd";
import InspectionHistoryTd from "./td-elements/InspectionHistoryTd";
import PunchStorageLocationTd from "./td-elements/PunchStorageLocationTd";
import ProductTd from "./td-elements/ProductTd";
import ProductTypeTd from "./td-elements/ProductTypeTd";
import CleaningHistoryTd from "./td-elements/CleaningHistoryTd";
import TotalUsageNumberTd from "./td-elements/TotalUsageNumberTd";
import OpenFileButton from "./button-element/OpenFileButton";
import { type PunchRow } from "@/common/types";
import PunchStatusSelect from "./select-element/PunchStatusSelect";
import CheckBox from "./check-box/CheckBox";
import "@/css/punchRow.css";

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
