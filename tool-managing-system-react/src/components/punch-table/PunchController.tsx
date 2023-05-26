import { useDisplay } from "@/common/hooks";
import PunchTable from "./PunchTable";
import TableHeader from "./TableHeader";

type Props = {
  params: URLSearchParams;
};

export default function PunchController(props: Props) {
  const { rows, refetch, isLoading } = useDisplay(props.params);

  if (isLoading) {
    <table className="table table-striped table-bordered table-hover">
      <TableHeader totalCount={0} selectedCount={0} />
    </table>;
  }

  return (
    <table className="table table-striped table-bordered table-hover">
      <PunchTable rows={rows} refetch={refetch} />
    </table>
  );
}
