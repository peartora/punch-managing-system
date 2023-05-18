import { useState } from "react";
import { useBringProductList } from "@/common/CustomHooks";
import { request } from "./../../common/Service";

function ModifyProductForm() {

  const [productName, setProductName] = useState("");
  const [batchSize, setBatchSize] = useState("");
  const [inspectionSize, setInspectionSize] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const productList = useBringProductList();

  function handleSubmit() {
    const formData = new FormData();
          formData.append("product", productName);
          formData.append("batchSize", batchSize);
          formData.append("inspectionSize", inspectionSize);
          if (selectedFile) formData.append("specificationFile", selectedFile);

          request
            .post(`/api/tool-managing-system/updateBatchInfor`, formData)
            .then((response) => {
              if (!response.ok)
                throw new Error(`제품 정보 변경 중 error가 발생 하였습니다.`);
              return response.text();
            })
            .then((result) => alert(result))
            .catch((error) => console.error(error));
      } 
    
  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        <label htmlFor="productName" className="form-label">
          변경하고자 하는 제품을 선택 하세요:
        </label>
        <select
          id="productName"
          className="form-control"
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
        >
          {productList.map((productName) => {
            return (
              <option key={productName} value={productName}>
                {productName}
              </option>
            );
          })}
        </select>
      </div>

      <div className="input-group mb-3">
        <label htmlFor="batchSize" className="form-label">
          새로운 batch-size를 입력 하세요 :
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
        새로운 inspection-size를 입력 하세요 :
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
        새로운 specification(pdf file)을 선택 하세요 :
        </label>
        <input
          id="specification"
          className="form-control"
          type="file"
          accept=".pdf"
          placeholder="specification"
          onChange={
            (event: React.ChangeEvent<HTMLInputElement>) => {
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

export default ModifyProductForm;
