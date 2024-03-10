import { useState } from "react";

import { useBringProductList } from "@/common/hooks/useBringProductList";
import { useBringSupplierList } from "@/common/hooks/useBringSupplierList";
import { request } from "@/common/utils/ajax";

import { Data } from "@/common/types";
import { Reponse } from "@/common/types";

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
  const [storageLocation, setStorageLocation] = useState("");
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");

  const { productList } = useBringProductList();
  const { supplierList } = useBringSupplierList();

  async function handleSubmit(event: any) {
    event.preventDefault();

    const punchIdArrays: Data[] = []; // 빈 배열로 초기화
    let count = 0;

    if (Number(endNumber) - Number(startNumber) >= 0) {
      for (let i = Number(startNumber); i <= Number(endNumber); i++) {
        const punchId = generatePunchId(
          i,
          registerDate,
          productName,
          punchType
        );
        const query = new URLSearchParams();
        query.append("punchId", punchId);

        try {
          const response = await request.get(
            `/api/tool-managing-system/duplicate?${query}`
          );
          if (!response.ok)
            throw new Error(`${punchId} 중복 확인 중 error 발생 하였습니다.`);
          const result = await response.text();

          if (result === "0") {
            const data: Data = {
              punchId: punchId,
              date: registerDate,
              punchPosition: punchType,
              supplier: supplier,
              storageLocation: storageLocation,
              medicine: productName,
              medicineType: productType,
            };

            punchIdArrays.push(data);
          } else {
            count++;
            alert(`중복 된 punchId가 존재 합니다.`);
          }
        } catch (error) {
          console.error(error);
          alert("오류가 발생했습니다.");
          return;
        }
      }
    } else {
      alert(`시작 번호는 마지막 번호 보다 작아야 합니다.`);
      return;
    }

    if (count === 0) {
      console.log(punchIdArrays);

      try {
        const response = await request.post(
          `/api/tool-managing-system/register`,
          punchIdArrays
        );

        if (!response.ok) {
          console.log(response);
          throw new Error(`펀치 id 등록중 error가 발생 하였습니다.`);
        }

        const result: Reponse = await response.json();

        console.log(`result`);
        console.log(`${result}`);

        if (result.count === punchIdArrays.length) {
          alert(`펀치 ${result.count}개가 성공적으로 등록되었습니다.`);
        } else if (result.count == 0) {
          alert(`펀치 등록에 실패 하였습니다.`);
        }
      } catch (error) {
        console.error(error);
        alert("오류가 발생했습니다.");
      }
    }
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
            return (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            );
          })}
        </select>
      </div>

      <div className="input-group mb-3">
        <label htmlFor="storageLocation" className="form-label">
          보관위치:
        </label>
        <input
          id="storageLocation"
          className="form-control"
          type="text"
          placeholder="보관위치"
          value={storageLocation}
          onChange={(event) => setStorageLocation(event.target.value)}
          required
        />
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
