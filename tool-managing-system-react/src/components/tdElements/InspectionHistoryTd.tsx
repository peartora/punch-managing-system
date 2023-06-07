import { useState } from "react";
import { request } from "@/common/Service";
import OpenFileButton from "../buttonElement/OpenFileButton";

type Props = {
  latestInspectionDate: string;
  punchId: string;
};

function InspectionHistoryTd({ latestInspectionDate, punchId }: Props) {
  if (latestInspectionDate === null) {
    latestInspectionDate = `검수 이력이 없습니다.`;
  }

  console.log(punchId);

  let inspectionHistory: any = [];

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
      .then((response) => {
        inspectionHistory = response;
        console.log("response");
        console.log(response);
      })
      .catch((error) => console.error(error));
  };

  return (
    <td>
      {latestInspectionDate}
      <OpenFileButton
        data-bs-toggle="modal"
        data-bs-target={`#myModal`}
        onClick={clickHandler}
      >
        이력 확인
      </OpenFileButton>

      <div id={`myModal`} className="modal" tabIndex={-1}>
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
                {inspectionHistory.map((iObject: any) => {
                  return (
                    <li key={iObject["punch-number"]}>
                      {iObject["punch-number"]}
                    </li>
                  );
                })}
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
