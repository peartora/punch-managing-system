import { request } from "@/common/Service";
import { type PunchRow as PunchRowType } from "@/common/types";

type Props = {
  selectedIds: Array<string>;
  punchRowsById: Record<string, PunchRowType>;
  refetch: () => void;
};

export default function UsagetimeUpdate(props: Props) {
  let usageNumber = 0;

  function handlerSubmitForUsageNumber(event) {
    event.preventDefault();

    if (props.selectedIds.length === 0) {
      alert(`선택된 펀치가 없습니다.`);
    } else {
      const result = confirm(
        `선택 된 펀치의 금일 사용 횟수를 반영 하시겠습니까?`
      );

      if (result) {
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
              throw new Error(
                `금일 사용 횟 수 update 중 error가 발생 하였습니다.`
              );
            alert(`결과 반영 되었습니다.`);
            props.refetch();
          })
          .catch((error) => console.error(error));
      }
    }
  }

  return (
    <form onSubmit={(event) => handlerSubmitForUsageNumber(event)}>
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
          onChange={(event) => {
            usageNumber = parseInt(event.target.value);
          }}
        />
      </div>
    </form>
  );
}
