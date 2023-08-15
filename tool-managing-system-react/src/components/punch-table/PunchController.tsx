import { usePunchRows } from "@/context/punch-rows-context";

import PunchTable from "./PunchTable";
import TableHeader from "./TableHeader";
import CleanHistoryButton from "./CleanHistoryButton";
import InspectionHistoryForm from "./InspectionHistoryForm";
import PunchStatusChangeForm from "./PunchStatusChangeForm";

export default function PunchController() {
  const { isLoading } = usePunchRows();

  if (isLoading) {
    return (
      <table className="table table-striped table-bordered table-hover">
        <TableHeader />
      </table>
    );
  }

  return (
    <div>
      <div className="row">
        <CleanHistoryButton />
        <InspectionHistoryForm />
        <PunchStatusChangeForm />
      </div>

      <br />
      <br />
      <br />

      <table className="table table-striped table-bordered table-hover">
        <PunchTable />
      </table>
    </div>
  );
}
