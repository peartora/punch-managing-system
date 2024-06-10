import { useState } from "react";

import { addSupplier } from "@/common/actions/supplier/addSupplier";

export function RegisterSupplierForm() {
  const [supplier, setSupplier] = useState(``);

  const handleSubmit = async function (event: any) {
    event.preventDefault();

    const body = {
      supplier,
    };

    let output;

    try {
      output = await addSupplier(body);
    } catch (error) {
      alert(`${error.message}`);
      return;
    }

    alert(`업체: ${output}가 등록 되었습니다.`);
  };

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
