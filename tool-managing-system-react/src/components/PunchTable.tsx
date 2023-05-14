import { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import PunchRow from "./PunchRow";
import { request } from "@/common/Service";
import { type PunchRow as PunchRowType } from "@/common/types";
import Button from "./buttonElement/Button";

// type rows = {
//   punchId: string;
//   date: Date;
// };

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
    // button을 위한, callback 함수
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

  return (
    <>
      <thead>
        <tr>
          <th>
            <Button text="청소이력 추가" handlerClick={handlerClick} />
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
