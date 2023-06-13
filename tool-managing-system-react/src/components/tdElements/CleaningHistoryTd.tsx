import { useState } from "react";
import { request } from "@/common/Service";
import OpenFileButton from "../buttonElement/OpenFileButton";
import AElementForCleanHistory from "../aElement/AElementForCleanHistory";

let _uniqueId = 1;

type Props = {
  punchId: string;
  latestCleaningHistory: string;
};

function CleaningHistoryTd({ latestCleaningHistory, punchId }: Props) {
  console.log("punchId");
  console.log(punchId);

  const [uniqueId] = useState(() => _uniqueId++);
  const [cleanHistory, setCleanHistory] = useState<object[]>([]);

  const clickHandler = function () {
    const query = new URLSearchParams();
    query.append("punchId", punchId);

    request
      .get(`/api/tool-managing-system/getCleanHistory?${query}`)
      .then((response) => {
        if (!response.ok)
          throw new Error(
            `${punchId}의 청소이력을 로딩하는 중 error 발생 하였습니다.`
          );
        return response.json();
      })
      .then(
        (response: Array<{ punchId: string[]; "when-cleaned": string[] }>) => {
          const dateArray: object[] = response.map((r) => {
            return {
              punchId: r.punchId,
              date: `${r["when-cleaned"][0]}년 ${r["when-cleaned"][1]}월 ${r["when-cleaned"][2]}일 ${r["when-cleaned"][3]}시 ${r["when-cleaned"][4]}분`,
            };
          });

          console.log("dateArray");
          console.log(dateArray);

          setCleanHistory([...dateArray]);
        }
      )
      .catch((error) => console.error(error));
  };

  return (
    <td>
      {latestCleaningHistory}
      <OpenFileButton
        data-bs-toggle="modal"
        data-bs-target={`#myModal-${uniqueId}`}
        onClick={clickHandler}
      >
        이력 확인
      </OpenFileButton>

      <div id={`myModal-${uniqueId}`} className="modal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
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
                  .map((history: any, i) => (
                    <li key={i}>
                      <AElementForCleanHistory
                        punchId={history.punchId}
                        date={history.date}
                      />
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
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </td>
  );
}

export default CleaningHistoryTd;
