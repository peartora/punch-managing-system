import { useState } from "react";

import dayjs from "dayjs";

import { request } from "@/common/Service";
import { usePunchRows } from "@/common/contexts/punch-rows-context";
import { useAuth } from "@/common/auth";

export function CleanHistoryButton() {
  const { user } = useAuth<true>();

  const { punchRowsById, selectedIds, refetch } = usePunchRows();

  const [timeAndDate, setTimeAndDate] = useState(() =>
    dayjs().format("YYYY-MM-DDTHH:mm")
  );
  const [comment, setComment] = useState("");
  const [batch, setBatch] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedIds.length !== 0) {
      if (timeAndDate !== "" && timeAndDate !== null) {
        const result = confirm(`선택 된 펀치의 청소이력을 추가 하시겠습니까?`);
        if (result) {
          let targetRows: Record<string, unknown>[] = [];

          try {
            targetRows = selectedIds.map((id) => {
              if (punchRowsById[id].punchStatus === `폐기`) {
                alert(
                  `폐기 상태의 펀치가 포함 되어 있습니다.
                (폐기 상태는 청소 이력을 추가 할 수 없습니다.)`
                );
                throw new Error("폐기 상태 펀치는 청소 이력 추가 불가"); // Throw an exception
              }

              return {
                punchId: id,
                punchStatus: punchRowsById[id].punchStatus,
                cleanTimeDate: timeAndDate,
                batch: batch,
                comment: comment,
                username: user,
              };
            });
          } catch (error) {
            return; // Stop the execution of the function
          }

          const requestBody = {
            rows: targetRows,
          };

          request
            .post(`/api/tool-managing-system/addCleanHistory`, requestBody)
            .then((response) => {
              if (!response.ok)
                throw new Error(
                  `청소이력을 추가 하는 중 Error 발생 하였습니다.`
                );

              refetch();
              setTimeAndDate(() => dayjs().format("YYYY-MM-DDTHH:mm"));
              setComment("");
              setBatch("");
              alert(`결과 반영 되었습니다.`);
            })
            .catch((error) => console.error(error));
        }
      } else {
        alert(`시간 정보가 입력 되지 않았습니다.`);
      }
    } else {
      alert(`선택 된 펀치가 없습니다.`);
    }
  };

  return (
    <form className="col-3" onSubmit={handleSubmit}>
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
      </div>

      <label htmlFor="batch" className="form-label">
        배치 정보 입력:
      </label>
      <div className="input-group">
        <input
          id="batch"
          className="form-control"
          type="text"
          placeholder="배치 정보를 입력 하세요"
          value={batch}
          onChange={(event) => setBatch(event.target.value)}
        />
      </div>

      <label htmlFor="comment" className="form-label">
        코멘트(필요시) 추가:
      </label>
      <div className="input-group">
        <input
          id="comment"
          className="form-control"
          type="text"
          placeholder="코멘트가 있으면 입력 하세요"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </div>

      <button className="btn btn-outline-secondary" type="submit">
        전송
      </button>
    </form>
  );
}
