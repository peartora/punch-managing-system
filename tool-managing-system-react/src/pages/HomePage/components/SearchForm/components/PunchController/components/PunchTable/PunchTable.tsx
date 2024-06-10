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
        {rows.map((row) => (
          <PunchRow
            key={row.punchId}
            row={row}
            refetch={refetch}
            chekced={selection[row.punchId]}
            handlerChangeForSingleBox={() => toggle(row.punchId)}
          />
        ))}
      </tbody>
    </>
  );
}
