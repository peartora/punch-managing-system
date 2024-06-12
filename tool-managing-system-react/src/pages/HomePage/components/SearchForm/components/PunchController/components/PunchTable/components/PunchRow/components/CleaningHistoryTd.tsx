import { useState } from "react";

import dayjs from "dayjs";

import { getCleanHistory } from "@/common/actions/punch/getCleanHistory";

let _uniqueId = 1;

type Props = {
  punchId: string;
  latestCleaningHistory: string;
};

export function CleaningHistoryTd({ latestCleaningHistory, punchId }: Props) {
  const [uniqueId] = useState(() => _uniqueId++);
  const [cleanHistory, setCleanHistory] = useState<object[]>([]);

  const clickHandler = async function () {
    const query = new URLSearchParams();
    query.append("punchId", punchId);

    let output;

    try {
      output = await getCleanHistory();
    } catch (error) {
      alert(`${error.message}`);
      return;
    }

    const dateArray: object[] = output.map((item) => {
      return {
        date: dayjs(item["when-cleaned"]).format("YYYY년 MM월 DD일 HH시 mm분"),
        username: item["username"],
        batch: item["batch"],
        comment: item["comment"],
      };
    });

    console.log("dateArray");
    console.log(dateArray);

    setCleanHistory([...dateArray]);
  };

  return (
    <td>
      {latestCleaningHistory}
      <button
        data-bs-toggle="modal"
        data-bs-target={`#myModalForClean-${uniqueId}`}
        onClick={clickHandler}
      >
        이력 확인
      </button>

      <div id={`myModalForClean-${uniqueId}`} className="modal" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">청소 이력</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ul>
                {cleanHistory
                  .slice()
                  .reverse()
                  .map((history: any) => (
                    <li key={history.date}>
                      청소시간: {history.date}, 담당자: {history.username},
                      배치정보: {history.batch}, 기타: {history.comment}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </td>
  );
}
