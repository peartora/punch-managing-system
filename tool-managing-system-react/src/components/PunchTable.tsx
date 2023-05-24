import { useState } from "react";
import { useDisplay } from "@/common/CustomHooks";
import TableHeader from "./TableHeader";
import PunchRow from "./PunchRow";
import { request } from "@/common/Service";
import { type PunchRow as PunchRowType } from "@/common/types";
import { URLSearchParams } from "url";
import Button from "./buttonElement/MyButton";

type PunchTableProps = {
  params: URLSearchParams;
};

function PunchTable({ params }: PunchTableProps) {
  const [selectedRows, setSelectedRows] = useState<Array<PunchRowType>>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [usageNumber, setUsageNumber] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [triggerEffect, setTriggerEffect] = useState(false);

  const rows = useDisplay(params, triggerEffect);

  function handlerChangeForAllCheckBox() {
    setIsChecked((prevChecked) => !prevChecked);

    const updatedIsChecked = !isChecked;

    const newlySelectedRows: PunchRow[] = (
      selectedRows.length > 0 ? selectedRows : rows
    ).map((row) => ({
      ...row,
      isSelected: updatedIsChecked,
    }));
    setSelectedRows(newlySelectedRows);
  }

  function handlerChangeForSingleCheckBox(
    event: React.ChangeEvent<HTMLInputElement>,
    punchId: string
  ) {
    const newStatus = event.target.checked;

    const newlySelectedRows: PunchRow[] = (
      selectedRows.length > 0 ? selectedRows : rows
    ).map((row) => {
      if (row.punchId === punchId) {
        return {
          ...row,
          isSelected: newStatus,
        };
      }
      return row;
    });
    setSelectedRows(newlySelectedRows);
  }

  function handlerClickForCleanHistory() {
    // 청소이력 추가를 위한 버튼.
    const targetRows: Record<string, unknown>[] = selectedRows
      .filter((row) => row.isSelected === true)
      .map((row) => ({
        punchId: row.punchId,
      }));

    const requestBody = {
      rows: targetRows,
    };

    request
      .post(`/api/tool-managing-system/addCleanHistory`, requestBody)
      .then((response) => {
        if (!response.ok)
          throw new Error(`청소이력을 추가 하는 중 Error 발생 하였습니다.`);
      })
      .then((result) => {
        setTriggerEffect(!triggerEffect);
        alert(`${result}`);
      })
      .catch((error) => console.error(error));
  }

  function handlerSubmitForUsageNumber() {
    const targetRows: Record<string, unknown>[] = selectedRows
      .filter((row) => row.isSelected === true)
      .map((row) => {
        const totalUsageNumber = row.totalUsageNumber + usageNumber;

        return {
          punchId: row.punchId,
          totalUsageNumber: totalUsageNumber,
        };
      });

    const requestBody = {
      rows: targetRows,
    };

    request
      .post(`/api/tool-managing-system/updateUsageNumber`, requestBody)
      .then((response) => {
        if (!response.ok)
          throw new Error(`금일 사용 횟 수 update 중 error가 발생 하였습니다.`);
        return response.json();
      })
      .then((result) => {
        setTriggerEffect(!triggerEffect);
        alert(`${result}`);
      })
      .catch((error) => console.error(error));
  }

  function handlerSubmitForPdfUpload() {
    const formData = new FormData();
    if (selectedFile) formData.append("inspectionResultPdfFile", selectedFile);

    selectedRows
      .filter((row) => row.isSelected === true)
      .map((row) => {
        const punchId = row.punchId;
        formData.append("punchId", punchId);
      });

    request
      .post(`/api/tool-managing-system/updateInspectionResult`, formData)
      .then((response) => {
        if (!response.ok)
          throw new Error(`file 핸들링 중 error 발생 하였습니다.`);
        return response.json();
      })
      .then((result) => {
        setTriggerEffect(!triggerEffect);
        alert(`${result}`);
      })
      .catch((error) => console.error(error));
  }

  return (
    <>
      <thead>
        <tr>
          <th>
            <Button
              text="청소이력 추가"
              handlerClick={handlerClickForCleanHistory}
            />
          </th>
          <th>
            <form onSubmit={handlerSubmitForUsageNumber}>
              <div className="input-group mb-3">
                <label htmlFor="usageNumber" className="form-label">
                  금일 사용 횟수를 입력하세요:
                </label>
              </div>
              <div className="input-group mb-3">
                <input
                  id="usageNumber"
                  className="form-control"
                  type="number"
                  placeholder="사용 횟 수"
                  onChange={(event) =>
                    setUsageNumber(parseInt(event.target.value))
                  }
                />
              </div>
            </form>
          </th>
          <th>
            <form onSubmit={handlerSubmitForPdfUpload}>
              <div className="input-group mb-3">
                <label htmlFor="uploadInspectionHistory" className="form-label">
                  검수이력 pdf 파일을 업로드 하세요:
                </label>
              </div>
              <div className="input-group mb-3">
                <input
                  id="inspectionHistory"
                  className="form-control"
                  type="file"
                  accept=".pdf"
                  placeholder="검수 결과"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const files = event.target.files;
                    if (files && files.length > 0) {
                      setSelectedFile(files[0] as File);
                    }
                  }}
                />

                <input type="submit" value="전송" />
              </div>
            </form>
          </th>
        </tr>
        <TableHeader
          selected={isChecked}
          handlerChange={handlerChangeForAllCheckBox}
        />
      </thead>
      <tbody>
        {(selectedRows.length > 0 ? selectedRows : rows).map((row) => {
          console.log(row);
          let checkResult = "";

          if (row.canUse === "초과") checkResult = "red";
          if (row.canUse === "금일중만료") checkResult = "orange";
          if (row.canUse === "양호") checkResult = "white";

          return (
            <PunchRow
              key={row.punchId}
              row={row}
              handlerChangeForSingleBox={(event) =>
                handlerChangeForSingleCheckBox(event, row.punchId)
              }
              className={checkResult}
            />
          );
        })}
      </tbody>
    </>
  );
}

export default PunchTable;
