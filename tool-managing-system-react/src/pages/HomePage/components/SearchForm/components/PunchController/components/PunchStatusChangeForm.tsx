import { request } from "@/common/utils/ajax";
import { usePunchRows } from "@/common/contexts/punch-rows-context";

import { updatePunchStatus } from "@/common/actions/punch/updatePunchStatus";

const options = ["사용가능", "사용중"] as const;

export function PunchStatusChangeForm() {
  const { selectedIds, punchRowsById, refetch } = usePunchRows();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedIds.length === 0) {
      e.target.value = `선택 하세요.`;
      alert(`선택 된 펀치가 없습니다.`);
      return;
    }

    const newStatus = e.target.value;

    const result = confirm(
      `펀치의 상태를 ${newStatus} 상태로 변경 하시겠습니까?`
    );

    if (result) {
      for (const id of selectedIds) {
        if (
          punchRowsById[id].punchStatus === "사용대기" ||
          punchRowsById[id].punchStatus === "폐기"
        ) {
          e.target.value = `선택 하세요.`;
          alert(
            `사용대기, 폐기상태의 펀치는 상태 변경 할 수 없습니다.
            (해당 되지 않는 펀치도 상태변경 되지 않습니다.)`
          );
          return;
        } else if (
          punchRowsById[id].punchStatus === "사용가능" &&
          newStatus === "사용가능"
        ) {
          e.target.value = `선택 하세요.`;
          alert(
            `현 상태와 동일한 상태로는 변경 되지 않습니다.
            (해당 되지 않는 펀치도 상태변경 되지 않습니다.)`
          );
          return;
        } else if (
          punchRowsById[id].punchStatus === "사용중" &&
          newStatus === "사용중"
        ) {
          e.target.value = `선택 하세요.`;
          alert(
            `현 상태와 동일한 상태로는 변경 되지 않습니다.
            (해당 되지 않는 펀치도 상태변경 되지 않습니다.)`
          );
          return;
        }
      }

      const requestBody: Record<string, unknown>[] = selectedIds.map((id) => ({
        punchId: id,
        newStatus: newStatus,
      }));

      let output;

      try {
        output = await updatePunchStatus(requestBody);
      } catch (error) {
        alert(`${error.message}`);
        return;
      }

      refetch();
      alert(`${output}개 펀치의 상태가 ${newStatus}(으)로 변경 되었습니다.`);
    }
  };

  return (
    <>
      <div className="col-3">
        <label htmlFor="punchStatusSelect" className="form-label">
          펀치상태 변경(펀치 폐기는 여기서 진행 할 수 없습니다.):
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
