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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (props.selectedIds.length === 0) {
      alert(`선택 된 펀치가 없습니다.`);
    } else {
      const result = confirm(`선택 된 펀치의 청소이력을 추가 하시겠습니까?`);
      if (result) {
        let targetRows: Record<string, unknown>[] = [];

        try {
          targetRows = props.selectedIds.map((id) => {
            if (props.punchRowsById[id].punchStatus === `폐기`) {
              alert(
                `폐기 상태의 펀치가 포함 되어 있습니다.
                (폐기 상태는 청소 이력을 추가 할 수 없습니다.)`
              );
              throw new Error("폐기 상태 펀치는 청소 이력 추가 불가"); // Throw an exception
            }

            return {
              punchId: id,
              punchStatus: props.punchRowsById[id].punchStatus,
              cleanTimeDate: timeAndDate,
            };
          });
        } catch (error) {
          return; // Stop the execution of the function
        }

        console.log(targetRows);

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
      <label htmlFor="cleanDateTime" className="form-label">
        청소이력 추가:
      </label>
      <div className="input-group">
        <input
          id="cleanDateTime"
          className="form-control"
          type="datetime-local"
          placeholder="청소이력"
          value={timeAndDate}
          onChange={(event) => setTimeAndDate(event.target.value)}
        />

        <button className="btn btn-outline-secondary" type="submit">
          전송
        </button>
      </div>
    </form>
  );
}
