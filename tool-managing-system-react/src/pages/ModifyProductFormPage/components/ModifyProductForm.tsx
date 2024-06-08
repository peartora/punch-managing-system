import { useState } from "react";

import { useBringMedicineList } from "@/common/hooks/useBringMedicineList";

import { updateSpecification } from "@/common/actions/medicine/updateSpecification";

export function ModifyProductForm() {
  const [productName, setProductName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { medicineNameList, isLoading } = useBringMedicineList();

  async function handleSubmit(event: any) {
    event.preventDefault();

    if (productName === null || productName === "") {
      alert("제품명이 누락 되었습니다.");
      return;
    }

    if (selectedFile === null) {
      alert("사양서 파일이 누락 되었습니다.");
      return;
    }

    const formData = new FormData();
    formData.append("medicine", productName);
    formData.append("specificationFile", selectedFile as File);

    let output;

    try {
      output = await updateSpecification(formData);
    } catch (error) {
      alert(`${error.message}`);
      return;
    }

    alert(`${output}의 사양서가 변경 되었습니다.`);
  }

  if (medicineNameList.length === 0 && !isLoading) {
    return <div>제품이 없습니다.</div>;
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
