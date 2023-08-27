import { request } from "@/common/utils/ajax";
import { usePunchRows } from "@/common/contexts/punch-rows-context";

const options = ["사용가능", "사용중"] as const;

export function PunchStatusChangeForm() {
  const { selectedIds, punchRowsById, refetch } = usePunchRows();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedIds.length === 0) {
      e.target.value = `선택 하세요.`;
      alert(`선택 된 펀치가 없습니다.`);
    } else {
      const newStatus = e.target.value;

      const result = confirm(
        `선택 된 펀치의 상태를 ${newStatus} 상태로 변경 하시겠습니까?`
      );

      if (result) {
        for (const id of selectedIds) {
          if (
            punchRowsById[id].punchStatus === "사용대기" ||
            punchRowsById[id].punchStatus === "폐기"
          ) {
            e.target.value = `선택 하세요.`;
            alert(
              `사용대기, 폐기 상태의 펀치는 해당 기능으로 상태 변경 할 수 없습니다.
                (해당 되지 않는 펀치도 상태변경 되지 않습니다.)`
            );
            return;
          } else if (
            punchRowsById[id].punchStatus === "사용가능" &&
            newStatus === "사용가능"
          ) {
            e.target.value = `선택 하세요.`;
            alert(
              `사용가능 상태의 펀치는 사용가능 상태로 변경 될 수 없습니다.
                (해당 되지 않는 펀치도 상태변경 되지 않습니다.)`
            );
            return;
          } else if (
            punchRowsById[id].punchStatus === "사용중" &&
            newStatus === "사용중"
          ) {
            e.target.value = `선택 하세요.`;
            alert(
              `사용중 상태의 펀치는 사용중 상태로 변경 될 수 없습니다.
                (해당 되지 않는 펀치도 상태변경 되지 않습니다.)`
            );
            return;
          }
        }

        const targetRows: Record<string, unknown>[] = selectedIds.map((id) => {
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
              throw new Error(`펀치 상태 변경 중 error가 발생 하였습니다.`);
            refetch();
            e.target.value = `선택 하세요.`;
            alert(`상태 변경 되었습니다.`);
          })
          .catch((error) => console.error(error));
      }
    }
  };

  return (
    <>
      <div className="col-3">
        <label htmlFor="punchStatusSelect" className="form-label">
          펀치상태 변경(폐각은 여기서 진행 할 수 없습니다.):
        </label>
        <select
          value="선택 하세요."
          id="punchStatusSelect"
          className="form-select"
          onChange={handleChange}
        >
          <option value="선택 하세요." disabled>
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
      </div>
    </>
  );
}
