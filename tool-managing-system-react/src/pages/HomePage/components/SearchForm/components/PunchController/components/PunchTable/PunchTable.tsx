import { usePunchRows } from "@/context/punch-rows-context";

import { TableHeader } from "@/components/TableHeader";

import { PunchRow } from "./components/PunchRow";

export function PunchTable() {
  const { rows, refetch, selection, toggle } = usePunchRows();

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
