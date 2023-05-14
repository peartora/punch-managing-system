import { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import PunchRow from "./PunchRow";
import { request } from "@/common/Service";
import { type PunchRow as PunchRowType } from "@/common/types";
import Button from "./buttonElement/Button";

type Props = {
  handlerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function PunchTable() {
  const [rows, setRows] = useState<Array<PunchRowType>>([]);
  const [checked, setChecked] = useState(false);

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

  function handlerClick() {
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

  function handlerChangeForUsageNumber(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const usageNumber = event.target.value;

    const targetRows: Record<string, unknown>[] = rows
      .filter((row) => row.isSelected === true)
      .map((row) => ({
        punchId: row.punchId,
        usageNumber: usageNumber,
      }));

    const requestBody = {
      rows: targetRows,
    };

    request.post(`/api/tool-managing-system/updateUsageNumber`, requestBody);
  }

  return (
    <>
      <thead>
        <tr>
          <th>
            <Button text="청소이력 추가" handlerClick={handlerClick} />
          </th>
          <th>
            <label htmlFor="usageNumber" className="form-label">
              금일 사용 횟수를 입력하세요:
            </label>
            <input
              id="usageNumber"
              className="form-control"
              value="0"
              type="number"
              placeholder="usage number"
              onChange={(event) => handlerChangeForUsageNumber(event)}
            />
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
