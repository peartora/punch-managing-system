import { usePunchRows } from "@/context/punch-rows-context";

import CleanHistoryButton from "@/components/punch-table/CleanHistoryButton";

import TableHeader from "./TableHeader";
import PunchRow from "./PunchRow";
import InspectionHistoryForm from "./InspectionHistoryForm";
import UsagetimeUpdate from "./UsagetimeUpdate";
import PunchStatusChangeForm from "./PunchStatusChangeForm";

function PunchTable() {
  const { rows, refetch, selection, toggle } = usePunchRows();

  return (
    <>
      <thead>
        <tr>
          <th>
            <CleanHistoryButton />
          </th>
          <th>
            <UsagetimeUpdate />
          </th>
          <th>
            <InspectionHistoryForm />
          </th>
          <th>
            <PunchStatusChangeForm />
          </th>
        </tr>
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
