import { type PunchStatus } from "@/common/types";
import { request } from "./../../common/Service";

type Props = {
  punchStatus: PunchStatus;
  punchId: string;
  product: string;
  refetch: () => void;
};

type Data = {
  punchId: string;
  newStatus: string;
};

type DataForDelete = {
  punchId: string;
  product: string;
  reason: string | null;
};

const options = ["사용대기", "사용가능", "사용중", "사용불가", "폐기"] as const;

function PunchStatusSelect({ punchStatus, punchId, product, refetch }: Props) {
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
    } else if (punchStatus === "사용불가") {
      if (
        option === "사용대기" ||
        option === "사용가능" ||
        option === "사용중" ||
        option === "사용불가"
      ) {
        return disabledOption;
      } else {
        return enabledOption;
      }
    } else {
      throw Error(`확인 되지 않은 Punch 상태 입니다.`);
    }
  });

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();

    const newStatus = e.target.value;

    if (newStatus === "폐기") {
      const reason = window.prompt("폐기 사유를 입력 하세요");

      if (reason) {
        const dataForDelete: DataForDelete = {
          punchId: punchId,
          product: product,
          reason: reason,
        };

        request
          .post(`/api/tool-managing-system/updateStatus/scrap`, dataForDelete)
          .then((response) => {
            if (!response.ok)
              throw new Error(`상태 변경 중 에러가 발생 했습니다.`);
          })
          .then(() => alert(`상태 변경 되었습니다.`))
          .catch((error) => alert(error));
      } else {
        alert(`사유를 입력 해야 합니다.`);
        return;
      }
    } else {
      const data: Data = {
        punchId: punchId,
        newStatus: newStatus,
      };

      request
        .post(`/api/tool-managing-system/updateStatus`, data)
        .then((response) => {
          if (!response.ok)
            new Error(`새로운 펀치 상태 변경 중 error가 발생 하였습니다.`);
          alert(`상태 변경 되었습니다.`);
        })
        .catch((error) => console.error(error));
    }
    refetch();
  }

  return (
    <select className="form-select" value={punchStatus} onChange={handleChange}>
      {results}
    </select>
  );
}

export default PunchStatusSelect;
