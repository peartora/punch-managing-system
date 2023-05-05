import { type PunchStatus } from "@/common/types";

type Props = {
  punchStatus: PunchStatus;
};

function PunchStatusSelect({ punchStatus }: Props) {
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

  return (
    <select value={punchStatus} onChange={() => alert("바뀌었다!")}>
      {results}
    </select>
  );
}

export default PunchStatusSelect;
