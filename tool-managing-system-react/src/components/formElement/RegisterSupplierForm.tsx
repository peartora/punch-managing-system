import { useState } from "react";
import { request } from "./../../common/Service";

function RegisterSupplierForm() {
  const [supplier, setSupplier] = useState(``);

  function handleSubmit() {
    const body = {
      supplier: supplier,
    };

    request
      .post(`/api/tool-managing-system/addSupplier`, body)
      .then((response) => {
        if (!response.ok)
          throw new Error(`업체명 등록 중 error가 발생 하였습니다.`);
        return response.text();
      })
      .then((result) => {
        alert(`${result}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        <label htmlFor="supplierName" className="form-label">
          등록할 업체 명:
        </label>
        <input
          id="supplierName"
          className="form-control"
          type="text"
          placeholder="업체명"
          value={supplier}
          onChange={(event) => setSupplier(event.target.value)}
        />
      </div>

      <input type="submit" value="펀치등록" />
    </form>
  );
}

export default RegisterSupplierForm;
