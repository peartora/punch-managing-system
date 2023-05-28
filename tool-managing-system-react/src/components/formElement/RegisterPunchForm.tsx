import { useState } from "react";
import { useBringProductList } from "@/common/hooks";
import { request } from "./../../common/Service";

const options = ["상부", "하부", "다이"];
const productTypeoptions = ["AA", "BB", "CC"];

type Data = {
  number: string;
  date: string;
  type: string;
  manufacturer: string;
  status: string;
  location: string;
  product: string;
  productType: string;
};

function RegisterPunchForm() {
  const [startNumber, setStartNumber] = useState("");
  const [endNumber, setEndNumber] = useState("");
  const [registerDate, setRegisterDate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [punchType, setPunchType] = useState("");
  const [supplier, setSupplier] = useState("");
  const [storageLocation, setStorageLocation] = useState("");
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");

  const { productList, isLoading } = useBringProductList();

  function handleSubmit() {
    for (let i = Number(startNumber); i <= Number(endNumber); i++) {
      const punchId = generatePunchId(i, registerDate, productName);

      const query = new URLSearchParams();
      query.append("punchId", punchId);

      console.log(punchId);

      request
        .get(`/api/tool-managing-system/duplicate?${query}`)
        .then((response) => {
          if (!response.ok)
            new Error(`${punchId} 중복 확인 중 error 발생 하였습니다.`);
          return response.text();
        })
        .then((result) => {
          console.log(result);

          if (result === "0") {
            const data: Data = {
              number: punchId,
              date: registerDate,
              type: punchType,
              manufacturer: supplier,
              status: `사용대기`,
              location: storageLocation,
              product: productName,
              productType: productType,
            };

            request
              .post(`/api/tool-managing-system/register`, data)
              .then((response) => {
                if (!response.ok)
                  throw new Error(`펀치 id 등록중 error가 발생 하였습니다.`);
                return response.text();
              })
              .then((result) => {
                alert(result);
              })
              .catch((error) => alert(error));
          } else {
            alert(`중복 된 punchId가 존재 합니다.`);
          }
        });
    }
  }

  function generatePunchId(
    number: number,
    registerDate: string,
    productName: string
  ) {
    return `${number}-${registerDate}-${productName}`;
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
          type="text"
          placeholder="시작 번호"
          value={startNumber}
          onChange={(event) => setStartNumber(event.target.value)}
        />
      </div>

      <div className="input-group mb-3">
        <label htmlFor="endNumber" className="form-label">
          마지막 번호:
        </label>
        <input
          id="endNumber"
          className="form-control"
          type="text"
          placeholder="마지막 번호"
          value={endNumber}
          onChange={(event) => setEndNumber(event.target.value)}
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
        />
      </div>

      <div className="input-group mb-3">
        <label htmlFor="punchType" className="form-label">
          펀치타입:
        </label>
        <select
          id="punchType"
          className="form-control"
          value={punchType}
          onChange={(event) => setPunchType(event.target.value)}
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
          제조사:
        </label>
        <input
          id="supplier"
          className="form-control"
          type="text"
          placeholder="제조사"
          value={supplier}
          onChange={(event) => setSupplier(event.target.value)}
        />
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
        />
      </div>

      <div className="input-group mb-3">
        <label htmlFor="productName" className="form-label">
          제품:
        </label>
        <select
          id="productName"
          className="form-control"
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
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
          className="form-control"
          value={productType}
          onChange={(event) => setProductType(event.target.value)}
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

export default RegisterPunchForm;
