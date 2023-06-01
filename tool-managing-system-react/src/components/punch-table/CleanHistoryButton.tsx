import { useState } from "react";
import { request } from "@/common/Service";
import { type PunchRow as PunchRowType } from "@/common/types";

type Props = {
  selectedIds: Array<string>;
  punchRowsById: Record<string, PunchRowType>;
  refetch: () => void;
};

export default function CleanHistoryButton(props: Props) {
  const [timeAndDate, setTimeAndDate] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (props.selectedIds.length === 0) {
      alert(`선택 된 펀치가 없습니다.`);
    } else {
      const result = confirm(`선택 된 펀치의 청소이력을 추가 하시겠습니까?`);
      if (result) {
        const targetRows: Record<string, unknown>[] = props.selectedIds.map(
          (id) => {
            return {
              punchId: id,
              cleanTimeDate: timeAndDate,
            };
          }
        );

        const requestBody = {
          rows: targetRows,
        };

        request
          .post(`/api/tool-managing-system/addCleanHistory`, requestBody)
          .then((response) => {
            if (!response.ok)
              throw new Error(`청소이력을 추가 하는 중 Error 발생 하였습니다.`);

            props.refetch();
            setTimeAndDate("");
            alert(`결과 반영 되었습니다.`);
          })
          .catch((error) => console.error(error));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        <div>
          <label htmlFor="cleanDateTime" className="form-label">
            청소이력 추가:
          </label>
        </div>
        <div>
          <input
            id="cleanDateTime"
            className="form-control"
            type="datetime-local"
            placeholder="청소이력"
            value={timeAndDate}
            onChange={(event) => setTimeAndDate(event.target.value)}
          />
        </div>
      </div>

      <input type="submit" value="전송" />
    </form>
  );
}
