import { useState } from "react";
import { request } from "./../../common/Service";

function RegisterProductForm() {
  const [productName, setProductName] = useState("");
  const [batchSize, setBatchSize] = useState("");
  const [inspectionSize, setInspectionSize] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const query = new URLSearchParams();
  query.append("product", productName);

  function handleSubmit() {
    request
      .get(`/api/tool-managing-system/duplicateProduct?${query}`)
      .then((response) => {
        if (!response.ok)
          throw new Error(`동일 제품 확인 중 error가 발생 하였습니다.`);
        return response.text();
      })
      .then((response) => {
        if (response === "0") {
          const formData = new FormData();
          formData.append("product", productName);
          formData.append("batchSize", batchSize);
          formData.append("inspectionSize", inspectionSize);
          if (selectedFile) formData.append("specificationFile", selectedFile);

          request
            .post(`/api/tool-managing-system/addProduct`, formData)
            .then((response) => {
              if (!response.ok)
                throw new Error(`제품명 등록 중 error가 발생 하였습니다.`);
              return response.text();
            })
            .then((result) => alert(result))
            .catch((error) => console.error(error));
        } else {
          throw new Error(`${productName}은 이미 등록 된 제품 입니다.`);
        }
      })
      .catch((error) => alert(error));
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
        />
      </div>

      <div className="input-group mb-3">
        <label htmlFor="batchSize" className="form-label">
          등록할 batch-size를 입력 하세요 :
        </label>
        <input
          id="batchSize"
          className="form-control"
          type="number"
          placeholder="batch-size"
          value={batchSize}
          onChange={(event) => setBatchSize(event.target.value)}
        />
      </div>

      <div className="input-group mb-3">
        <label htmlFor="inspectionSize" className="form-label">
          등록할 inspection-size를 입력 하세요 :
        </label>
        <input
          id="inspectionSize"
          className="form-control"
          type="number"
          placeholder="inspection-size"
          value={inspectionSize}
          onChange={(event) => setInspectionSize(event.target.value)}
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
        />
      </div>

      <input type="submit" value="제품등록" />
    </form>
  );
}

export default RegisterProductForm;
