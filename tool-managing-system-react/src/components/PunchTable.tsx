import { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import PunchRow from "./PunchRow";
import { request } from "@/common/Service";
import { type PunchRow as PunchRowType } from "@/common/types";
import Button from "./buttonElement/Button";

function PunchTable() {
  const [rows, setRows] = useState<Array<PunchRowType>>([]);
  const [checked, setChecked] = useState(false);
  const [usageNumber, setUsageNumber] = useState(0);

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

    request.post(`/api/tool-managing-system/addCleanHistory`, requestBody);
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

    console.log("haha");
    request.post(`/api/tool-managing-system/updateUsageNumber`, requestBody);
  }

  function handlerSubmitForPdfUpload(event: any) {
    const selectedFile = event.target.files[0];

    const formData = new FormData();
    formData.append("file", selectedFile);

    const targetRows: void[] = rows
      .filter((row) => row.isSelected === true)
      .map((row) => {
        const punchId = row.punchId;
        formData.append("punchId", punchId);
      });

    request.post(`/api/tool-managing-system/uploadFile`, formData);
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
            <form onSubmit={(event) => handlerSubmitForPdfUpload(event)}>
              <div className="input-group mb-3">
                <label htmlFor="uploadInspectionHistory" className="form-label">
                  검수이력 pdf 파일을 업로드 하세요:
                </label>
              </div>
              <div className="input-group mb-3">
                <input
                  id="uploadInspectionHistory"
                  className="form-control"
                  type="file"
                  placeholder="검수이력 file"
                />
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

          return (
            <PunchRow
              key={row.punchId}
              row={row}
              handlerChangeForSingleBox={(event) =>
                handlerChangeForSingleCheckBox(event, row.punchId)
              }
            />
          );
        })}
      </tbody>
    </>
  );
}

export default PunchTable;
