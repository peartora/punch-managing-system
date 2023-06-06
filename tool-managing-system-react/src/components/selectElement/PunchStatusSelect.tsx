import { type PunchStatus } from "@/common/types";
import { request } from "./../../common/Service";

type Props = {
  punchStatus: PunchStatus;
  punchId: string;
  refetch: () => void;
};

type Data = {
  punchId: string;
  newStatus: string;
};

function PunchStatusSelect({ punchStatus, punchId, refetch }: Props) {
  // console.log(punchId);

  const options = ["사용대기", "사용가능", "사용중", "사용불가", "폐기"];

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

  function handleChange(e: any) {
    const newStatus = e.target.value;

    const data: Data = {
      punchId: punchId,
      newStatus: newStatus,
    };

    console.log("data");
    console.log(data);

    request
      .post(`/api/tool-managing-system/updateStatus`, data)
      .then((response) => {
        if (!response.ok)
          new Error(`새로운 펀치 상태 변경 중 error가 발생 하였습니다.`);
        refetch();
      })
      .catch((error) => console.error(error));
  }

  return (
    <select value={punchStatus} onChange={(e) => handleChange(e)}>
      {results}
    </select>
  );
}

export default PunchStatusSelect;
