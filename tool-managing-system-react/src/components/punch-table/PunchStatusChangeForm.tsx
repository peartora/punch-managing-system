import { request } from "@/common/Service";
import { usePunchRows } from "@/context/punch-rows-context";

const options = ["사용대기", "사용가능", "사용중", "사용불가", "폐기"] as const;

export default function PunchStatusChangeForm() {
  const { selectedIds, punchRowsById, refetch } = usePunchRows();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedIds.length === 0) {
      alert(`선택 된 펀치가 없습니다.`);
    } else {
      const newStatus = e.target.value;

      const result = confirm(
        `선택 된 펀치의 상태를 ${newStatus} 상태로 변경 하시겠습니까?`
      );

      if (result) {
        const targetRows: Record<string, unknown>[] = selectedIds.map((id) => {
          if (
            punchRowsById[id].punchStatus === "사용대기" ||
            punchRowsById[id].punchStatus === "사용불가" ||
            punchRowsById[id].punchStatus === "폐기"
          ) {
            alert(
              `사용대기, 사용불가, 폐기 상태의 펀치는 해당 기능으로 상태 변경 할 수 없습니다.
                (해당 되지 않는 펀치도 상태변경 되지 않습니다.)`
            );
            return {};
          } else if (
            punchRowsById[id].punchStatus === "사용가능" &&
            (newStatus === "사용대기" || newStatus === "사용가능")
          ) {
            alert(
              `사용가능 상태의 펀치는 사용대기 혹은 사용가능 상태로 변경 될 수 없습니다.
                (해당 되지 않는 펀치도 상태변경 되지 않습니다.)`
            );
            return {};
          } else if (
            punchRowsById[id].punchStatus === "사용중" &&
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
        });

        const requestBody = {
          rows: targetRows,
        };

        request
          .post(`/api/tool-managing-system/updateStatus`, requestBody)
          .then((response) => {
            if (!response.ok)
              throw new Error(`펀치 상태 변화 중 error가 발생 하였습니다.`);

            refetch();
            alert(`상태 변경 되었습니다.`);
          })
          .catch((error) => console.error(error));
      }
    }
  };

  return (
    <select className="form-select" defaultValue="" onChange={handleChange}>
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
