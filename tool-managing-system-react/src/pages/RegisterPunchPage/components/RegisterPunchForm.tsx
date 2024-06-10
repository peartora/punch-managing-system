import { useState } from "react";

import { useBringMedicineList } from "@/common/hooks/useBringMedicineList";
import { useBringSupplierList } from "@/common/hooks/useBringSupplierList";

import { Data } from "@/common/types";
import { Reponse } from "@/common/types";

import { registerPunch } from "@/common/actions/punch/registerPunch";

const options = ["상부", "하부", "다이"];
const productTypeoptions = ["BB", "B", "D"];

export function RegisterPunchForm() {
  const [startNumber, setStartNumber] = useState<number>(0);
  const [endNumber, setEndNumber] = useState<number>(0);
  const [registerDate, setRegisterDate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [punchType, setPunchType] = useState("");
  const [supplier, setSupplier] = useState("");
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");

  const { medicineNameList } = useBringMedicineList();
  const { supplierList } = useBringSupplierList();

  async function handleSubmit(event: any) {
    event.preventDefault();

    const punchIdArrays: Data[] = []; // 빈 배열로 초기화

    if (Number(endNumber) - Number(startNumber) >= 0) {
      for (let i = Number(startNumber); i <= Number(endNumber); i++) {
        const punchId = generatePunchId(
          i,
          registerDate,
          productName,
          punchType
        );

        const data: Data = {
          punchId: punchId,
          date: registerDate,
          punchPosition: punchType,
          supplier: supplier,
          medicine: productName,
          medicineType: productType,
        };

        punchIdArrays.push(data);
      }
    } else {
      alert(`시작 번호는 마지막 번호 보다 작아야 합니다.`);
      return;
    }

    let output;

    try {
      output = await registerPunch(punchIdArrays);
    } catch (error) {
      alert(`${error.message}`);
      return;
    }

    alert(`${output}개의 펀치가 등록 되었습니다.`);
  }

  function generatePunchId(
    number: number,
    registerDate: string,
    productName: string,
    punchType: string
  ) {
    return `${number}-${registerDate}-${productName}-${punchType}`;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        <label htmlFor="startNumber" className="form-label">
          시작 번호:
        </label>
        <input
          id="startNumber"
          className="form-control"
          type="number"
          placeholder="시작 번호"
          value={startNumber}
          onChange={(event) => setStartNumber(Number(event.target.value))}
          required
        />
      </div>

      <div className="input-group mb-3">
        <label htmlFor="endNumber" className="form-label">
          마지막 번호:
        </label>
        <input
          id="endNumber"
          className="form-control"
          type="number"
          placeholder="마지막 번호"
          value={endNumber}
          onChange={(event) => setEndNumber(Number(event.target.value))}
          required
        />
      </div>

      <div className="input-group mb-3">
        <label htmlFor="registerDate" className="form-label">
          등록날짜:
        </label>
        <input
          id="registerDate"
          className="form-control"
          type="date"
          placeholder="등록날짜"
          value={registerDate}
          onChange={(event) => setRegisterDate(event.target.value)}
          required
        />
      </div>

      <div className="input-group mb-3">
        <label htmlFor="punchPosition" className="form-label">
          펀치타입:
        </label>
        <select
          id="punchPosition"
          className="form-select"
          value={punchType}
          onChange={(event) => setPunchType(event.target.value)}
          required
        >
          <option value="" disabled>
            아래 list 에서 선택 하세요.
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group mb-3">
        <label htmlFor="supplier" className="form-label">
          업체:
        </label>
        <select
          id="supplier"
          className="form-select"
          value={supplier}
          onChange={(event) => setSupplier(event.target.value)}
          required
        >
          <option value="" disabled>
            아래 list 에서 선택 하세요.
          </option>
          {supplierList.map((supplier) => {
            console.log(supplier);
            return (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            );
          })}
        </select>
      </div>

      <div className="input-group mb-3">
        <label htmlFor="productName" className="form-label">
          제품:
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
        <label htmlFor="productType" className="form-label">
          제품타입:
        </label>
        <select
          id="productType"
          className="form-select"
          value={productType}
          onChange={(event) => setProductType(event.target.value)}
          required
        >
          <option value="" disabled>
            아래 list 에서 선택 하세요.
          </option>
          {productTypeoptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <input type="submit" value="펀치등록" />
    </form>
  );
}
