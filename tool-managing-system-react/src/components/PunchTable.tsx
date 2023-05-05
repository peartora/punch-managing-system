import { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import PunchRow from "./PunchRow";
import { request } from "@/common/Service";
import { type PunchRow as PunchRowType } from "@/common/types";

function PunchTable() {
  const [rows, setRows] = useState<Array<PunchRowType>>([]);

  useEffect(() => {
    const query = new URLSearchParams();
    query.append("status", "사용중");

    request
      .get(`/api/tool-managing-system/display?${query}`)
      .then((response) => {
        if (!response.ok) {
          console.error(response.statusText);
          throw new Error(`Punch 리스트 로딩 중 error가 발생 하였습니다.`);
        }
        return response.json();
      })
      .then((response) => setRows(response))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <thead>
        <TableHeader />
      </thead>
      <tbody>
        {rows.map((row) => {
          return <PunchRow key={row.punchId} row={row} />;
        })}
      </tbody>
    </>
  );
}

export default PunchTable;
