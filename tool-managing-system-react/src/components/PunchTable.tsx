import { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import PunchRow from "./PunchRow";
import { request } from "@/common/Service";
import { type PunchRow as PunchRowType } from "@/common/types";

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
    setChecked((checked) => !checked);

    const changedChecked = !checked;

    const newRows: PunchRow[] = rows.map((row) => {
      return {
        ...row,
        isSelected: changedChecked,
      };
    });

    setRows(newRows);
  }

  console.log(`rows`);
  console.log(rows);

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

  return (
    <>
      <thead>
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
