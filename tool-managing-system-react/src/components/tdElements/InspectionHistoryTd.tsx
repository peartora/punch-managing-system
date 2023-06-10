import { useState } from "react";
import { request } from "@/common/Service";
import OpenFileButton from "../buttonElement/OpenFileButton";
import AElement from "../aElement/AElement";

let _uniqueId = 1;

type Props = {
  latestInspectionDate: string;
  punchId: string;
};

function InspectionHistoryTd({ latestInspectionDate, punchId }: Props) {
  const [uniqueId] = useState(() => _uniqueId++);

  if (latestInspectionDate === null) {
    latestInspectionDate = `검수 이력이 없습니다.`;
  }

  const [inspectionHistory, setInspectionHistory] = useState<object[]>([]);

  const clickHandler = function () {
    const query = new URLSearchParams();
    query.append("punchId", punchId);

    request
      .get(`/api/tool-managing-system/getInspectionHistory?${query}`)
      .then((response) => {
        if (!response.ok)
          throw new Error(
            `${punchId}의 검수이력을 로딩하는 중 error 발생 하였습니다.`
          );
        return response.json();
      })
      .then(
        (
          response: Array<{ "when-inspected": string[]; "file-path": string[] }>
        ) => {
          const dateArray: object[] = response.map((r) => {
            return {
              date: `${r["when-inspected"][0]}년 ${r["when-inspected"][1]}월 ${r["when-inspected"][2]}일 ${r["when-inspected"][3]}시 ${r["when-inspected"][4]}분`,
              path: r["file-path"],
            };
          });

          setInspectionHistory([...dateArray]);
        }
      )
      .catch((error) => console.error(error));
  };

  return (
    <td>
      {latestInspectionDate}
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
                {inspectionHistory
                  .slice()
                  .reverse()
                  .map((history: any, i) => (
                    <li key={i}>
                      <AElement path={history.path} date={history.date} /> //
                      새탭에서 여는방법
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

export default InspectionHistoryTd;
