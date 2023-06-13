import { useState } from "react";
import { request } from "./../../common/Service";

function RegisterSupplierForm() {
  const [supplier, setSupplier] = useState(``);

  function handleSubmit() {
    const query = new URLSearchParams();
    query.append("supplier", supplier);

    request
      .get(`/api/tool-managing-system/duplicateSupplier?${query}`)
      .then((response) => {
        if (!response.ok)
          throw new Error(
            `${supplier} 업체명 중복 확인 중 error가 발생 하였습니다.`
          );
        return response.text();
      })
      .then((returnValue) => {
        if (returnValue === "0") {
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
            .then(() => {
              alert(`등록 되었습니다.`);
              setSupplier("");
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          alert(`해당 업체명은 중복 되어 등록 될 수 없습니다.`);
        }
      })
      .catch((error) => console.error(error));
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
          required
        />
      </div>

      <input type="submit" value="업체등록" />
    </form>
  );
}

export default RegisterSupplierForm;
