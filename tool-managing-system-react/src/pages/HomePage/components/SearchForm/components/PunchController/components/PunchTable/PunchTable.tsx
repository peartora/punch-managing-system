import { usePunchRows } from "@/common/contexts/punch-rows-context";

import { TableHeader } from "@/common/components/TableHeader";

import { PunchRow } from "./components/PunchRow";

export function PunchTable() {
  const { rows, refetch, selection, toggle } = usePunchRows();

  console.log("rows");
  console.log(rows);

  return (
    <>
      <TableHeader />
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={9}>검색 조건에 맞는 펀치가 없습니다.</td>
          </tr>
        ) : (
          rows.map((row) => (
            <PunchRow
              key={row.punchId}
              row={row}
              refetch={refetch}
              chekced={selection[row.punchId]}
              handlerChangeForSingleBox={() => toggle(row.punchId)}
            />
          ))
        )}
      </tbody>
    </>
  );
}
