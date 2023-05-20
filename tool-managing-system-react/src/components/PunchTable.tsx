import { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import PunchRow from "./PunchRow";
import { request } from "@/common/service";
import { type PunchRow as PunchRowType } from "@/common/types";
import Button from "./buttonElement/MyButton";

function PunchTable() {
  const [rows, setRows] = useState<Array<PunchRowType>>([]);
  const [checked, setChecked] = useState(false);
  const [usageNumber, setUsageNumber] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    request
      .get(`/api/tool-managing-system/display`)
      .then((response) => {
        if (!response.ok) {
          console.error(response.statusText);
          throw new Error(`Punch 리스트 로딩 중 error가 발생 하였습니다.`);
        }
        return response.json();
      })
      .then((response) => {
        setRows(response);
      })
      .catch((error) => console.error(error));
  }, []);

  function handlerChangeForAllCheckBox(event: any) {
    setChecked((checked) => {
      const changedChecked = !checked;

      const newRows: PunchRow[] = rows.map((row) => ({
        ...row,
        isSelected: changedChecked,
      }));
      setRows(newRows);
      return changedChecked;
    });
  }

  function handlerChangeForSingleCheckBox(event: any, punchId: string) {
    const newStatus = event.target.checked;

    setChecked(false);

    const newRows: PunchRow[] = rows.map((row) => {
      if (row.punchId === punchId) {
        return {
          ...row,
          isSelected: newStatus,
        };
      }
      return row;
    });
    setRows(newRows);
  }

  function handlerClickForCleanHistory() {
    // 청소이력 추가를 위한 버튼.
    const targetRows: Record<string, unknown>[] = rows
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
        console.log(response);

        if (!response.ok)
          throw new Error(`청소이력을 추가 하는 중 Error 발생 하였습니다.`);

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          throw new Error(`Response was not in JSON format.`);
        }
      })
      .then((result) => {
        alert("I`m here");
        setRows(result);
      })
      .catch((error) => console.error(error));
  }

  function handlerSubmitForUsageNumber() {
    const targetRows: Record<string, unknown>[] = rows
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
      .then((result) => setRows(result))
      .catch((error) => console.error(error));
  }

  function handlerSubmitForPdfUpload() {
    const formData = new FormData();
    if (selectedFile) formData.append("inspectionResultPdfFile", selectedFile);

    const targetRows: void[] = rows
      .filter((row) => row.isSelected === true)
      .map((row) => {
        const punchId = row.punchId;
        formData.append("punchId", punchId);
      });

    request.post(`/api/tool-managing-system/updateInspectionResult`, formData);
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
          selected={checked}
          handlerChange={(event) => handlerChangeForAllCheckBox(event)}
        />
      </thead>
      <tbody>
        {rows.map((row) => {
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
