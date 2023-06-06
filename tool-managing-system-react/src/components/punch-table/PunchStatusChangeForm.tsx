import { request } from "@/common/Service";
import { type PunchRow as PunchRowType } from "@/common/types";

type Props = {
  selectedIds: Array<string>;
  punchRowsById: Record<string, PunchRowType>;
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
            if (
              props.punchRowsById[id].punchStatus === "사용대기" ||
              props.punchRowsById[id].punchStatus === "사용불가" ||
              props.punchRowsById[id].punchStatus === "폐기"
            ) {
              alert(
                `사용대기, 사용불가, 폐기 상태의 펀치는 해당 기능으로 상태 변경 할 수 없습니다.
                (해당 되지 않는 펀치도 상태변경 되지 않습니다.)`
              );
              return {};
            } else if (
              props.punchRowsById[id].punchStatus === "사용가능" &&
              (newStatus === "사용대기" || newStatus === "사용가능")
            ) {
              alert(
                `사용가능 상태의 펀치는 사용대기 혹은 사용가능 상태로 변경 될 수 없습니다.
                (해당 되지 않는 펀치도 상태변경 되지 않습니다.)`
              );
              return {};
            } else if (
              props.punchRowsById[id].punchStatus === "사용중" &&
              (newStatus === "사용대기" || newStatus === "사용중")
            ) {
              alert(
                `사용중 상태의 펀치는 사용대기 혹은 사용중 상태로 변경 될 수 없습니다.
                (해당 되지 않는 펀치도 상태변경 되지 않습니다.)`
              );
              return {};
            }

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
