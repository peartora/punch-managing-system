import { useState } from "react";

import { useBringProductList } from "@/common/hooks/useBringProductList";
import { request } from "@/common/utils/ajax";

export function ModifyProductForm() {
  const [productName, setProductName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { medicineNameList, isLoading } = useBringProductList();

  function handleSubmit(event: any) {
    event.preventDefault();

    if (selectedFile === null) {
      alert(`변경 할 정보가 없습니다.`);
    } else {
      const formData = new FormData();
      formData.append("product", productName);
      if (selectedFile) formData.append("specificationFile", selectedFile);

      request
        .post(`/api/tool-managing-system/updateBatchInfor`, formData)
        .then((response) => {
          if (!response.ok)
            throw new Error(`제품 정보 변경 중 error가 발생 하였습니다.`);
          return response.text();
        })
        .then((result) => {
          if (result === "1") {
            alert(`${productName}의 정보가 변경 되었습니다.`);
          } else {
            alert(
              `${productName}의 정보가 변경 되지 않았습니다. 관리자에게 문의 하십시오.`
            );
          }
        })
        .catch((error) => console.error(error));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        <label htmlFor="productName" className="form-label">
          변경하고자 하는 제품을 선택 하세요:
        </label>
        <select
          id="productName"
          className="form-select"
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
          required
        >
          <option value="" disabled>
            아래 list 에서 선택 하세요.
          </option>
          {medicineNameList.map((medicineName) => {
            return (
              <option key={medicineName} value={medicineName}>
                {medicineName}
              </option>
            );
          })}
        </select>
      </div>

      <div className="input-group mb-3">
        <label htmlFor="specification" className="form-label">
          새로운 specification(pdf file)을 선택 하세요 :
        </label>
        <input
          id="specification"
          className="form-control"
          type="file"
          accept=".pdf"
          placeholder="specification"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;
            if (files && files.length > 0) {
              setSelectedFile(files[0] as File);
            }
          }}
        />
      </div>

      <input type="submit" value="제품정보 변경" />
    </form>
  );
}
