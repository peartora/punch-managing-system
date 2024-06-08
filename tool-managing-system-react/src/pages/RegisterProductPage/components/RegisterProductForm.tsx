import { useState } from "react";

import { addMedicine } from "@/common/actions/medicine/addMedicine";

export function RegisterProductForm() {
  const [productName, setProductName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      output = await addMedicine(formData);
    } catch (error) {
      alert(`${error.message}`);
      return;
    }

    alert(`제품: ${output}이(가) 등록 되었습니다.`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        <label htmlFor="productName" className="form-label">
          등록할 제품명을 입력 하세요 :
        </label>
        <input
          id="productName"
          className="form-control"
          type="text"
          placeholder="제품명"
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
          required
        />
      </div>

      <div className="input-group mb-3">
        <label htmlFor="specification" className="form-label">
          등록할 specification(pdf file)을 선택 하세요 :
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
          required
        />
      </div>

      <input type="submit" value="제품등록" />
    </form>
  );
}
