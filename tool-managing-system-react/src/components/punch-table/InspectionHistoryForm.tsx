import { useState } from "react";
import { request } from "@/common/Service";
import { type PunchRow as PunchRowType } from "@/common/types";

type Props = {
  selectedIds: Array<string>;
  punchRowsById: Record<string, PunchRowType>;
  refetch: () => void;
};

export default function InspectionHistoryForm(props: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handlerSubmitForPdfUpload = async (event) => {
    event.preventDefault();

    if (props.selectedIds.length === 0) {
      alert(`선택 된 펀치가 없습니다.`);
    } else {
      const result = confirm(`선택 된 펀치의 검수이력을 추가 하시겠습니까?`);

      if (result) {
        const formData = new FormData();

        if (selectedFile) {
          formData.append("inspectionResultPdfFile", selectedFile);
        }

        try {
          for (const id of props.selectedIds) {
            if (
              props.punchRowsById[id].punchStatus !== "사용대기" &&
              props.punchRowsById[id].punchStatus !== "사용불가"
            ) {
              alert(
                `검수이력은 사용대기 혹은 사용불가 상태의 펀치만 가능 합니다.`
              );
              throw new Error("Check failed"); // Throw an exception
            }

            formData.append("punchId", id);
          }

          await request.post(
            `/api/tool-managing-system/updateInspectionResult`,
            formData
          );

          const targetRows = props.selectedIds.map((id) => ({
            punchId: id,
            newStatus: "사용가능",
          }));

          const statusUpdateRequestBody = {
            rows: targetRows,
          };

          await request.post(
            `/api/tool-managing-system/updateStatus`,
            statusUpdateRequestBody
          );

          const usageNumberResetRows = props.selectedIds.map((id) => ({
            punchId: id,
            totalUsageNumber: 0,
          }));

          const usageNumberResetRequestBody = {
            rows: usageNumberResetRows,
          };

          await request.post(
            `/api/tool-managing-system/updateUsageNumber`,
            usageNumberResetRequestBody
          );

          setSelectedFile(null);
          props.refetch();
          alert(`사용가능 상태로 변경 되었습니다.`);
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  return (
    <form onSubmit={(event) => handlerSubmitForPdfUpload(event)}>
      <div className="input-group mb-3">
        <label htmlFor="uploadInspectionHistory" className="form-label">
          검수이력 pdf 파일을 업로드 하세요:
        </label>
      </div>
      <div className="input-group mb-3">
        <input
          id="inspectionHistory"
          className="form-control"
          type="file"
          accept=".pdf"
          placeholder="검수 결과"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;
            if (files && files.length > 0) {
              setSelectedFile(files[0] as File);
            }
          }}
        />
        <input type="submit" value="전송" />
      </div>
    </form>
  );
}
