import { usePunchRows } from "@/context/punch-rows-context";

import TableHeader from "./TableHeader";
import PunchRow from "./PunchRow";

function PunchTable() {
  const { rows, refetch, selection, toggle } = usePunchRows();

  console.log("rows");
  console.log(rows);

  return (
    <>
      <thead>
        <TableHeader />
      </thead>
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

export default PunchTable;
