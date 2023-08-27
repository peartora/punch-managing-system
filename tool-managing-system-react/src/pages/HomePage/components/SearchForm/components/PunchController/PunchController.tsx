import { usePunchRows } from "@/context/punch-rows-context";

import { TableHeader } from "@/components/TableHeader";

import { CleanHistoryButton } from "./components/CleanHistoryButton";
import { InspectionHistoryForm } from "./components/InspectionHistoryForm";
import { PunchStatusChangeForm } from "./components/PunchStatusChangeForm";
import { PunchTable } from "./components/PunchTable";

export function PunchController() {
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
