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

  const handlerSubmitForPdfUpload = (event) => {
    event.preventDefault();

    if (props.selectedIds.length === 0) {
      alert(`선택 된 펀치가 없습니다.`);
    } else {
      const result = confirm(`선택 된 펀치의 검수이력을 추가 하시겠습니까?`);

      if (result) {
        const formData = new FormData();

        if (selectedFile)
          formData.append("inspectionResultPdfFile", selectedFile);

        try {
          props.selectedIds.forEach((id) => {
            if (props.punchRowsById[id].punchStatus !== "사용불가") {
              alert(`사용불가 상태가 아닌 펀치가 있습니다.`);
              throw new Error("Check failed"); // Throw an exception
            }

            formData.append("punchId", id);
          });

          request
            .post(`/api/tool-managing-system/updateInspectionResult`, formData)
            .then((response) => {
              if (!response.ok)
                throw new Error(`file 핸들링 중 error 발생 하였습니다.`);

              const targetRows = props.selectedIds.map((id) => {
                return {
                  punchId: id,
                  newStatus: "사용가능",
                };
              });
              const requestBody = {
                rows: targetRows,
              };

              request
                .post(`/api/tool-managing-system/updateStatus`, requestBody)
                .then((response) => {
                  if (!response.ok)
                    throw new Error(`상태 변경 중 error 발생 하였습니다.`);

                  props.refetch();
                  alert(`사용가능 상태로 변경 되었습니다.`);
                });
            })
            .catch((error) => console.error(error));
        } catch (error) {
          return;
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
