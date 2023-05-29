import { useEffect, useMemo, useState } from "react";
import TableHeader from "./TableHeader";
import { type PunchRow as PunchRowType } from "@/common/types";
import PunchRow from "./PunchRow";
import InspectionHistoryForm from "./InspectionHistoryForm";
import UsagetimeUpdate from "./UsagetimeUpdate";
import PunchStatusChangeForm from "./PunchStatusChangeForm";
import CleanHistoryButton from "@/components/punch-table/CleanHistoryButton";

type PunchTableProps = {
  rows: Array<PunchRowType>;
  refetch: () => void;
};

function PunchTable(props: PunchTableProps) {
  console.log(`펀치 table`);

  console.log(typeof props.refetch);

  // normalization
  const punchRowsById = useMemo<Record<string, PunchRowType>>(
    () =>
      props.rows.reduce((acc, row) => {
        acc[row.punchId] = row;
        return acc;
      }, {} as Record<string, PunchRowType>),
    [props.rows]
  );

  const [selection, setSelection] = useState<Record<string, boolean>>(() =>
    props.rows.reduce((acc, row) => {
      acc[row.punchId] = false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  // 밖에서 rows 변경됨 따라 다 selection 준비, anti pattern!, key 통해서 버리고 다시만들어야한다.
  useEffect(() => {
    const newSelection = props.rows.reduce((acc, row) => {
      acc[row.punchId] = false;
      return acc;
    }, {} as Record<string, boolean>);
    setSelection(newSelection);
  }, [props.rows]);

  const selectedIds = Object.entries(selection)
    .filter(([key, value]) => value)
    .map(([key, value]) => key);

  const isAllSelected = props.rows.length === selectedIds.length;

  const toggleAll = () => {
    const nextSelection = props.rows.reduce((acc, row) => {
      acc[row.punchId] = !isAllSelected;
      return acc;
    }, {} as Record<string, boolean>);
    setSelection(nextSelection);
  };

  const toggleId = (id: string) => {
    const nextSelection = {
      ...selection,
      [id]: !selection[id],
    };
    setSelection(nextSelection);
  };

  return (
    <>
      <thead>
        <tr>
          <th>
            <CleanHistoryButton
              selectedIds={selectedIds}
              punchRowsById={punchRowsById}
              refetch={props.refetch}
            />
          </th>
          <th>
            <UsagetimeUpdate
              selectedIds={selectedIds}
              punchRowsById={punchRowsById}
              refetch={props.refetch}
            />
          </th>
          <th>
            <InspectionHistoryForm
              selectedIds={selectedIds}
              punchRowsById={punchRowsById}
              refetch={props.refetch}
            />
          </th>
          <th>
            <PunchStatusChangeForm
              selectedIds={selectedIds}
              refetch={props.refetch}
            />
          </th>
        </tr>
        <TableHeader
          totalCount={props.rows.length}
          selectedCount={selectedIds.length}
          handlerChange={toggleAll}
        />
      </thead>
      <tbody>
        {props.rows.map((row) => (
          <PunchRow
            key={row.punchId}
            row={row}
            refetch={props.refetch}
            chekced={selection[row.punchId]}
            handlerChangeForSingleBox={() => toggleId(row.punchId)}
          />
        ))}
      </tbody>
    </>
  );
}

export default PunchTable;
