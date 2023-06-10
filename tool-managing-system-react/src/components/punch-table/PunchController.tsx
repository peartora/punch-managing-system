import { usePunchRows } from "@/context/punch-rows-context";

import PunchTable from "./PunchTable";
import TableHeader from "./TableHeader";

export default function PunchController() {
  const { isLoading } = usePunchRows();

  if (isLoading) {
    <table className="table table-striped table-bordered table-hover">
      <TableHeader />
    </table>;
  }

  return (
    <table className="table table-striped table-bordered table-hover">
      <PunchTable />
    </table>
  );
}
