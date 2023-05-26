import CheckBox from "@/components/checkBox/CheckBox";

type Props = {
  handlerChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  totalCount: number;
  selectedCount: number;
};

function TableHeader(props: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.handlerChange?.(event);
  };

  return (
    <tr>
      <th>
        <CheckBox
          onChange={handleChange}
          punchId="none"
          checked={props.totalCount === props.selectedCount}
          indeterminate={
            props.totalCount !== props.selectedCount && props.selectedCount > 0
          }
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
