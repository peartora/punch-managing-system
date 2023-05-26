import { useEffect, useMemo, useState } from "react";
import TableHeader from "./TableHeader";
import { request } from "@/common/Service";
import { type PunchRow as PunchRowType } from "@/common/types";
import Button from "@/components/buttonElement/MyButton";
import PunchRow from "./PunchRow";
import InspectionHistoryForm from "./InspectionHistoryForm";

type PunchTableProps = {
  rows: Array<PunchRowType>;
  refetch: () => void;
};

function PunchTable(props: PunchTableProps) {
  // normalization
  const punchRowsById = useMemo<Record<string, PunchRowType>>(
    () =>
      props.rows.reduce((acc, row) => {
        acc[row.punchId] = row;
        return acc;
      }, {} as Record<string, PunchRowType>),
    [props.rows]
  );

  const [usageNumber, setUsageNumber] = useState(0);

  /**
  {
    1: false,
    2: true,
    3: true
  } normalization
   */

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

  function handlerClickForCleanHistory() {
    // 청소이력 추가를 위한 버튼.
    const targetRows = selectedIds.map((id) => ({
      punchId: id,
    }));

    const requestBody = {
      rows: targetRows,
    };

    request
      .post(`/api/tool-managing-system/addCleanHistory`, requestBody)
      .then((response) => {
        if (!response.ok)
          throw new Error(`청소이력을 추가 하는 중 Error 발생 하였습니다.`);
      })
      .then(() => {
        props.refetch();
        // alert(`${result}`);
      })
      .catch((error) => console.error(error));
  }

  function handlerSubmitForUsageNumber() {
    const targetRows: Record<string, unknown>[] = selectedIds.map((id) => {
      const row = punchRowsById[id];
      const totalUsageNumber = row.totalUsageNumber + usageNumber;

      return {
        punchId: id,
        totalUsageNumber: totalUsageNumber,
      };
    });

    const requestBody = {
      rows: targetRows,
    };

    request
      .post(`/api/tool-managing-system/updateUsageNumber`, requestBody)
      .then((response) => {
        if (!response.ok)
          throw new Error(`금일 사용 횟 수 update 중 error가 발생 하였습니다.`);
        return response.json();
      })
      .then((result) => {
        props.refetch();
        alert(`${result}`);
      })
      .catch((error) => console.error(error));
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
            <InspectionHistoryForm
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
            chekced={selection[row.punchId]}
            handlerChangeForSingleBox={() => toggleId(row.punchId)}
          />
        ))}
      </tbody>
    </>
  );
}

export default PunchTable;
