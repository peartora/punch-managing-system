import { useRef, useState } from "react";

import { request } from "@/common/Service";
import { usePunchRows } from "@/common/contexts/punch-rows-context";

export function InspectionHistoryForm() {
  const { selectedIds, punchRowsById, refetch } = usePunchRows();

  const formRef = useRef<HTMLFormElement>(
    undefined as unknown as HTMLFormElement
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handlerSubmitForPdfUpload = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (selectedIds.length !== 0) {
      if (selectedFile !== null) {
        const result = confirm(`선택 된 펀치의 검수이력을 추가 하시겠습니까?`);

        if (result) {
          const formData = new FormData();

          if (selectedFile) {
            formData.append("inspectionResultPdfFile", selectedFile);
          }

          try {
            for (const id of selectedIds) {
              if (punchRowsById[id].punchStatus !== "사용대기") {
                alert(`검수이력은 사용대기 상태의 펀치만 가능 합니다.`);
                throw new Error("Check failed"); // Throw an exception
              }

              formData.append("punchId", id);
            }

            await request.post(
              `/api/tool-managing-system/updateInspectionResult`,
              formData
            );

            const targetRows = selectedIds.map((id) => ({
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

            const usageNumberResetRows = selectedIds.map((id) => ({
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
            formRef.current.reset();
            refetch();
            alert(`사용가능 상태로 변경 되었습니다.`);
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        alert(`검수이력 파일이 선택 되지 않았습니다.`);
      }
    } else {
      alert(`선택된 펀치가 없습니다.`);
    }
  };

  return (
    <form className="col-3" ref={formRef} onSubmit={handlerSubmitForPdfUpload}>
      <label htmlFor="inspectionHistory" className="form-label">
        검수이력 파일(pdf) 업로드:
      </label>
      <div className="input-group">
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
        <button className="btn btn-outline-secondary" type="submit">
          전송
        </button>
      </div>
    </form>
  );
}
