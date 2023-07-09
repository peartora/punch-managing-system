import { useState } from "react";
import { request } from "@/common/Service";
import OpenFileButton from "../buttonElement/OpenFileButton";
import AElementForCleanHistory from "../aElement/AElementForCleanHistory";

import dayjs from "dayjs";

let _uniqueId = 1;

type Props = {
  punchId: string;
  latestCleaningHistory: string;
};

function CleaningHistoryTd({ latestCleaningHistory, punchId }: Props) {
  const [uniqueId] = useState(() => _uniqueId++);
  const [cleanHistory, setCleanHistory] = useState<object[]>([]);

  const clickHandler = function () {
    const query = new URLSearchParams();
    query.append("punchId", punchId);

    request
      .get(`/api/tool-managing-system/getCleanHistory?${query.toString()}`)
      .then((response) => {
        console.log("response");
        console.log(response);

        if (!response.ok)
          throw new Error(
            `${punchId}의 청소이력을 로딩하는 중 error 발생 하였습니다.`
          );
        return response.json();
      })
      .then((response: Array<{ "when-cleaned": string }>) => {
        const dateArray: object[] = response.map((item) => {
          return {
            date: dayjs(item["when-cleaned"]).format(
              "YYYY년 MM월 DD일 HH시 mm분"
            ),
          };
        });

        console.log("dateArray");
        console.log(dateArray);

        setCleanHistory([...dateArray]);
      })
      .catch((error) => console.error(error));
  };

  return (
    <td>
      {latestCleaningHistory}
      <OpenFileButton
        data-bs-toggle="modal"
        data-bs-target={`#myModalForClean-${uniqueId}`}
        onClick={clickHandler}
      >
        이력 확인
      </OpenFileButton>

      <div id={`myModalForClean-${uniqueId}`} className="modal" tabIndex={-1}>
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
                  .map((history: any) => (
                    <li key={history.date}>{history.date}</li>
                    // <li key={history.date}>
                    // <AElementForCleanHistory
                    //   punchId={punchId}
                    //   date={history.date}
                    // />
                    // </li>
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
