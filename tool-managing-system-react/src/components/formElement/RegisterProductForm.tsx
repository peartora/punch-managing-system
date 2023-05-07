import { useState } from "react";
import { request } from "./../../common/Service";

function RegisterProductForm() {
  const [productName, setProductName] = useState("");
  const [batchSize, setBatchSize] = useState("");
  const [inspectionSize, setInspectionSize] = useState("");

  function handleSubmit() {
    request.post(`/api/tool-managing-system/addProduct`, {
      product: productName,
      batchSize,
      inspectionSize,
    });
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

      <input type="submit" value="제품등록" />
    </form>
  );
}

export default RegisterProductForm;
