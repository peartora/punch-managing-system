import { useState } from "react";

import dayjs from "dayjs";

import { request } from "@/common/utils/ajax";

let _uniqueId = 1;

type Props = {
  punchId: string;
  latestCleaningHistory: string;
};

export function CleaningHistoryTd({ latestCleaningHistory, punchId }: Props) {
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
      .then(
        (
          response: Array<{
            "when-cleaned": string;
            username: string;
            batch: string;
            comment: string;
          }>
        ) => {
          const dateArray: object[] = response.map((item) => {
            return {
              date: dayjs(item["when-cleaned"]).format(
                "YYYY년 MM월 DD일 HH시 mm분"
              ),
              username: item["username"],
              batch: item["batch"],
              comment: item["comment"],
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
            </div>
          </div>
        </div>
      </div>
    </td>
  );
}
