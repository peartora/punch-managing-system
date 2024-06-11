import { useState } from "react";

import dayjs from "dayjs";

import { usePunchRows } from "@/common/contexts/punch-rows-context";
import { useAuth } from "@/common/contexts/auth";

import { addCleanHistory } from "@/common/actions/punch/addCleanHistory";

export function CleanHistoryButton() {
  const { user } = useAuth<true>();
  const { punchRowsById, selectedIds, refetch } = usePunchRows();

  const [timeAndDate, setTimeAndDate] = useState(() =>
    dayjs().format("YYYY-MM-DDTHH:mm")
  );
  const [comment, setComment] = useState("");
  const [batch, setBatch] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedIds.length === 0) {
      alert(`선택 된 펀치가 없습니다.`);
      return;
    }

    const result = confirm(`선택 된 펀치의 청소이력을 추가 하시겠습니까?`);

    if (!result) {
      alert(`청소 이력 등록이 취소 되었습니다.`);
      return;
    }

    const targetRows = selectedIds.map((id) => {
      if (punchRowsById[id].punchStatus === `폐기`) {
        alert(`폐기 상태의 펀치는 청소이력을 등록 할 수 없습니다.`);
        return;
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

    let output;

    try {
      output = await addCleanHistory(targetRows);
    } catch (error) {
      alert(`${error.message}`);
      return;
    }

    alert(`${output}개의 펀치에 청소이력이 등록 되었습니다.`);

    setComment("");
    setBatch("");
    refetch();

    console.log("output");
    console.log(output);
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
