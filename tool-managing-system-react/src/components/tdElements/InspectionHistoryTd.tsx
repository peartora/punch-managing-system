import { useState } from "react";
import OpenFileButton from "../buttonElement/OpenFileButton";

let uniqueId = 1;

type Props = {
  latestInspectionDate: string;
};

function InspectionHistoryTd({ latestInspectionDate }: Props) {
  const [id] = useState(() => uniqueId++);

  if (latestInspectionDate === null) {
    latestInspectionDate = `검수 이력이 없습니다.`;
  }

  return (
    <td>
      {latestInspectionDate}
      <OpenFileButton data-bs-toggle="modal" data-bs-target={`#myModal${id}`}>
        이력 확인
      </OpenFileButton>

      <div id={`myModal${id}`} className="modal" tabIndex={-1}>
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
              <p>Modal body text goes here.</p>
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
