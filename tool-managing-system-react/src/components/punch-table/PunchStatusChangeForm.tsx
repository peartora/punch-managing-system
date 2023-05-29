import { request } from "@/common/Service";

type Props = {
  selectedIds: Array<string>;
  refetch: () => void;
};

export default function PunchStatusChangeForm(props: Props) {
  const options: Array<string> = [
    "사용대기",
    "사용가능",
    "사용중",
    "사용불가",
    "폐기",
  ];

  const handleChange = (e) => {
    if (props.selectedIds.length === 0) {
      alert(`선택 된 펀치가 없습니다.`);
    } else {
      const newStatus = e.target.value;

      const result = confirm(
        `선택 된 펀치의 상태를 ${newStatus} 상태로 변경 하시겠습니까?`
      );

      if (result) {
        const targetRows: Record<string, unknown>[] = props.selectedIds.map(
          (id) => {
            return {
              punchId: id,
              newStatus: newStatus,
            };
          }
        );

        const requestBody = {
          rows: targetRows,
        };

        request
          .post(`/api/tool-managing-system/updateStatus`, requestBody)
          .then((response) => {
            if (!response.ok)
              throw new Error(`펀치 상태 변화 중 error가 발생 하였습니다.`);

            props.refetch();
            alert(`상태 변경 되었습니다.`);
          })
          .catch((error) => console.error(error));
      }
    }
  };

  return (
    <select onChange={(e) => handleChange(e)}>
      <option value="" disabled selected>
        선택 하세요.
      </option>
      {options.map((o) => {
        return (
          <option key={o} value={o}>
            {o}
          </option>
        );
      })}
    </select>
  );
}
