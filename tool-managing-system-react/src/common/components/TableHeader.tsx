import { CheckBox } from "@/common/components/CheckBox";
import { usePunchRows } from "@/common/contexts/punch-rows-context";

export function TableHeader() {
  const { selectedIds, isAllSelected, toggleAll } = usePunchRows();

  return (
    <thead>
      <tr>
        <th>
          <CheckBox
            onChange={toggleAll}
            punchId="none"
            checked={isAllSelected}
            indeterminate={!isAllSelected && selectedIds.length > 0}
          />
        </th>
        <th>Id</th>
        <th>제조사</th>
        <th>규격</th>
        <th>최신 검수이력</th>
        <th>펀치상태</th>
        <th>제품</th>
        <th>제품 type</th>
        <th>최근 청소이력</th>
      </tr>
    </thead>
  );
}
