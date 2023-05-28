import { request } from "@/common/Service";
import Button from "@/components/buttonElement/MyButton";
import { type PunchRow as PunchRowType } from "@/common/types";

type Props = {
  selectedIds: Array<string>;
  punchRowsById: Record<string, PunchRowType>;
  refetch: () => void;
};

export default function CleanHistoryButton(props: Props) {
  const handlerClickForCleanHistory = () => {
    if (props.selectedIds.length === 0) {
      alert(`선택 된 펀치가 없습니다.`);
    } else {
      const result = confirm(`선택 된 펀치의 청소이력을 추가 하시겠습니까?`);
      if (result) {
        const targetRows: Record<string, unknown>[] = props.selectedIds.map(
          (id) => {
            return {
              punchId: id,
            };
          }
        );

        const requestBody = {
          rows: targetRows,
        };

        request
          .post(`/api/tool-managing-system/addCleanHistory`, requestBody)
          .then((response) => {
            if (!response.ok)
              throw new Error(`청소이력을 추가 하는 중 Error 발생 하였습니다.`);

            props.refetch();
            alert(`결과 반영 되었습니다.`);
          })
          .catch((error) => console.error(error));
      }
    }
  };

  return (
    <Button text="청소이력 추가" handlerClick={handlerClickForCleanHistory} />
  );
}
