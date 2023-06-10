import CheckBox from "@/components/checkBox/CheckBox";
import { usePunchRows } from "@/context/punch-rows-context";

function TableHeader() {
  const { selectedIds, isAllSelected, toggleAll } = usePunchRows();

  return (
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
      <th>검수이력</th>
      <th>펀치상태</th>
      <th>보관위치</th>
      <th>제품</th>
      <th>제품 type</th>
      <th>최근 청소이력</th>
      <th>누적사용 횟 수</th>
      <th>최대사용 횟 수</th>
    </tr>
  );
}

export default TableHeader;
