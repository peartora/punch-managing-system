import { usePunchRows } from "@/common/contexts/punch-rows-context";

import { TableHeader } from "@/common/components/TableHeader";

import { CleanHistoryButton } from "./components/CleanHistoryButton";
import { InspectionHistoryForm } from "./components/InspectionHistoryForm";
import { PunchStatusChangeForm } from "./components/PunchStatusChangeForm";
import { PunchTable } from "./components/PunchTable";

export function PunchController() {
  const { isLoading } = usePunchRows();

  console.log("isLoading");
  console.log(isLoading);

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
