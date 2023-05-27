import { useState } from "react";
import { request } from "@/common/Service";
import { type PunchRow as PunchRowType } from "@/common/types";

type Props = {
  selectedIds: Array<string>;
  punchRowsById: Record<string, PunchRowType>;
  refetch: () => void;
};

export default function UsagetimeUpdate(props: Props) {
  const [usageNumber, setUsageNumber] = useState(0);

  function handlerSubmitForUsageNumber() {
    const targetRows: Record<string, unknown>[] = props.selectedIds.map(
      (id) => {
        const row = props.punchRowsById[id];
        const totalUsageNumber = row.totalUsageNumber + usageNumber;

        return {
          punchId: id,
          totalUsageNumber: totalUsageNumber,
        };
      }
    );

    const requestBody = {
      rows: targetRows,
    };

    request
      .post(`/api/tool-managing-system/updateUsageNumber`, requestBody)
      .then((response) => {
        if (!response.ok)
          throw new Error(`금일 사용 횟 수 update 중 error가 발생 하였습니다.`);
        return response.json();
      })
      .then((result) => {
        props.refetch();
        alert(`${result}`);
      })
      .catch((error) => console.error(error));
  }

  return (
    <form onSubmit={handlerSubmitForUsageNumber}>
      <div className="input-group mb-3">
        <label htmlFor="usageNumber" className="form-label">
          금일 사용 횟수를 입력하세요:
        </label>
      </div>
      <div className="input-group mb-3">
        <input
          id="usageNumber"
          className="form-control"
          type="number"
          placeholder="사용 횟 수"
          onChange={(event) => setUsageNumber(parseInt(event.target.value))}
        />
      </div>
    </form>
  );
}
