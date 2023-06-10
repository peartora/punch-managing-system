import { useState } from "react";
import { request } from "@/common/Service";
import { usePunchRows } from "@/context/punch-rows-context";

export default function UsagetimeUpdate() {
  const { selectedIds, punchRowsById, refetch } = usePunchRows();

  const [usageNumber, setUsageNumber] = useState(0);

  function handlerSubmitForUsageNumber(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (selectedIds.length === 0) {
      alert(`선택된 펀치가 없습니다.`);
    } else {
      const result = confirm(
        `선택 된 펀치의 금일 사용 횟수를 반영 하시겠습니까?`
      );

      if (result) {
        let targetRows: Record<string, unknown>[];

        try {
          targetRows = selectedIds.map((id) => {
            if (punchRowsById[id].punchStatus != `사용중`) {
              alert(`사용중 상태가 아닌 펀치가 있습니다.`);
              throw new Error("Check failed"); // Throw an exception
            }

            const row = punchRowsById[id];
            const totalUsageNumber = row.totalUsageNumber + usageNumber;

            return {
              punchId: id,
              totalUsageNumber: totalUsageNumber,
            };
          });
        } catch (error) {
          return; // Stop the execution of the function
        }

        const requestBody = {
          rows: targetRows,
        };

        request
          .post(`/api/tool-managing-system/updateUsageNumber`, requestBody)
          .then((response) => {
            if (!response.ok)
              throw new Error(
                `금일 사용 횟 수 update 중 error가 발생 하였습니다.`
              );
            setUsageNumber(0);
            alert(`결과 반영 되었습니다.`);
            refetch();
          })
          .catch((error) => console.error(error));
      }
    }
  }

  return (
    <form className="col-3" onSubmit={handlerSubmitForUsageNumber}>
      <label htmlFor="usageNumber" className="form-label">
        금일 사용 횟수를 입력하세요:
      </label>
      <div className="input-group">
        <input
          id="usageNumber"
          className="form-control"
          type="number"
          placeholder="사용 횟 수"
          value={usageNumber}
          onChange={(event) => {
            setUsageNumber(parseInt(event.target.value));
          }}
        />
        <button className="btn btn-outline-secondary" type="submit">
          정송
        </button>
      </div>
    </form>
  );
}
