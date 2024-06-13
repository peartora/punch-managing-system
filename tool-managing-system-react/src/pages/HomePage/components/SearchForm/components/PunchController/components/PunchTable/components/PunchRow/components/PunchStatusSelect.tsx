import { type PunchStatus } from "@/common/types";
import { request } from "@/common/utils/ajax";

import { scrapPunch } from "@/common/actions/punch/scrapPunch";
import { updatePunchStatus } from "@/common/actions/punch/updatePunchStatus";

type Props = {
  punchStatus: PunchStatus;
  punchId: string;
  product: string;
  count: number;
  refetch: () => void;
};

type Data = {
  punchId: string;
  newStatus: string;
};

type DataForDelete = {
  punchId: string;
  product: string;
  previousStatus: string;
  reason: string;
};

const options = ["사용대기", "사용가능", "사용중", "폐기"] as const;

export function PunchStatusSelect({
  punchStatus,
  punchId,
  product,
  refetch,
}: Props) {
  const results = options.map((option) => {
    const disabledOption = (
      <option key={option} value={option} disabled>
        {option}
      </option>
    );
    const enabledOption = (
      <option key={option} value={option}>
        {option}
      </option>
    );

    if (punchStatus === "사용대기" || punchStatus === "폐기") {
      return disabledOption;
    } else if (punchStatus === "사용가능") {
      if (option === "사용대기" || option === "사용가능") {
        return disabledOption;
      } else {
        return enabledOption;
      }
    } else if (punchStatus === "사용중") {
      if (option === "사용대기" || option === "사용중") {
        return disabledOption;
      } else {
        return enabledOption;
      }
    } else {
      throw Error(`확인 되지 않은 Punch 상태 입니다.`);
    }
  });

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;

    if (newStatus === "폐기") {
      const result = confirm(`펀치 Id: ${punchId}의 폐각을 진행 하시겠습니까?`);

      if (!result) {
        alert(`${punchId}의 폐각진행이 취소 되었습니다.`);
        return;
      }

      const reason = window.prompt("폐각 사유를 입력 하세요.");

      if (reason == null || reason == "") {
        alert(`폐각 사유를 입력 하세요.`);
        return;
      }

      const dataForDelete: DataForDelete = {
        punchId,
        product,
        previousStatus: punchStatus,
        reason,
      };

      let output;

      try {
        output = await scrapPunch(dataForDelete);
      } catch (error) {
        alert(`${error.message}`);
        return;
      }

      alert(`${output} 펀치가 폐기 상태가 되었습니다.`);
      refetch();
    } else {
      const result = confirm(`펀치 Id: ${punchId}의 상태를 변경 하시겠습니까?`);

      if (!result) {
        alert(`상태 변경이 취소 되었습니다.`);
        return;
      }

      const data: Data[] = [
        {
          punchId,
          newStatus,
        },
      ];

      let output;

      try {
        output = await updatePunchStatus(data);
      } catch (error) {
        alert(`${error.message}`);
        return;
      }

      alert(`${punchId}의 상태가 ${newStatus} 상태로 변경 되었습니다.`);
      refetch();
    }
  }

  return (
    <select className="form-select" value={punchStatus} onChange={handleChange}>
      {results}
    </select>
  );
}
