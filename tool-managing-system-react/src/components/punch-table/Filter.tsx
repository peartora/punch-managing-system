import { useState } from "react";
import { formatDate } from "@/common/Service";

type Props = {
  setParams: (params: URLSearchParams) => void;
  productList: Array<string>;
  supplierList: Array<string>;
};

type FormData = {
  startDate: Date;
  endDate: Date;
  type: string;
  manufacturer: string;
  status: string;
  storageLocation: string;
  "p.product": string;
  ptype: string;
};

export default function Filter(props: Props) {
  const [formData, setFormData] = useState<FormData>({
    startDate: new Date(),
    endDate: new Date(),
    type: "",
    manufacturer: "",
    status: "",
    storageLocation: "",
    "p.product": "",
    ptype: "",
  });

  function handlerSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newParams: URLSearchParams = new URLSearchParams();

    for (const key in formData) {
      const value = formData[key as keyof FormData];

      if (
        key == "type" ||
        key == "manufacturer" ||
        key == "status" ||
        key == "p.product" ||
        key == "ptype"
      ) {
        if (value == "All") {
          continue;
        }
      } else {
        if (value == "") {
          continue;
        }
      }

      if (value instanceof Date) {
        const formatedValue = formatDate(value);
        newParams.append(key, formatedValue);
      } else {
        newParams.append(key, value.toString());
      }
    }

    props.setParams(newParams);

    console.log(`searchForm`);
  }

  return (
    <form onSubmit={handlerSubmit}>
      <h3>조회할 data를 입력 하세요</h3>
      <div className="row">
        <div className="col">
          <label htmlFor="startDate" className="form-label">
            시작 날짜:{" "}
          </label>
          <input
            id="startDate"
            className="form-control"
            type="date"
            placeholder="시작 날짜"
            onChange={(event) => {
              const dateValue = new Date(event.target.value);
              setFormData((prevState) => ({
                ...prevState,
                startDate: dateValue,
              }));
            }}
            required
          />
        </div>

        <div className="col">
          <label htmlFor="endDate" className="form-label">
            종료 날짜:{" "}
          </label>
          <input
            id="endDate"
            className="form-control"
            type="date"
            placeholder="종료 날짜"
            onChange={(event) => {
              const dateValue = new Date(event.target.value);
              setFormData((prevState) => ({
                ...prevState,
                endDate: dateValue,
              }));
            }}
            required
          />
        </div>

        <div className="col">
          <label htmlFor="productType" className="form-label">
            펀치 타입:{" "}
          </label>
          <select
            required
            id="productType"
            className="form-control"
            value={formData.type}
            onChange={(event) => {
              setFormData((prevState) => ({
                ...prevState,
                type: event.target.value,
              }));
            }}
          >
            <option value="" disabled>
              아래 list 에서 선택 하세요.
            </option>
            <option value="상부">상부</option>
            <option value="하부">하부</option>
            <option value="다이">다이</option>
            <option value="All">All</option>
          </select>
        </div>

        {/* <div className="col">
          <label className="form-label">제조사: </label>
          <input
            className="form-control"
            type="text"
            placeholder="제조사"
            onChange={(event) => {
              setFormData((prevState) => ({
                ...prevState,
                supplier: event.target.value,
              }));
            }}
          />
        </div> */}

        <div className="col">
          <label htmlFor="supplier" className="form-label">
            업체:
          </label>
          <select
            required
            id="supplier"
            className="form-control"
            value={formData["manufacturer"]}
            onChange={(event) => {
              setFormData((prevState) => ({
                ...prevState,
                manufacturer: event.target.value,
              }));
            }}
          >
            <option value="" disabled>
              아래 list 에서 선택 하세요.
            </option>
            {props.supplierList.map((supplierName) => {
              return (
                <option key={supplierName} value={supplierName}>
                  {supplierName}
                </option>
              );
            })}
            <option value="All">All</option>
          </select>
        </div>

        <div className="col">
          <label htmlFor="punchStatus" className="form-label">
            펀치 상태:{" "}
          </label>
          <select
            required
            id="punchStatus"
            className="form-control"
            value={formData.status}
            onChange={(event) => {
              setFormData((prevState) => ({
                ...prevState,
                status: event.target.value,
              }));
            }}
          >
            <option value="" disabled>
              아래 list 에서 선택 하세요.
            </option>
            <option value="사용대기">사용대기</option>
            <option value="사용가능">사용가능</option>
            <option value="사용중">사용중</option>
            <option value="사용불가">사용불가</option>
            <option value="폐기">폐기</option>
            <option value="All">All</option>
          </select>
        </div>

        <div className="col">
          <label className="form-label">펀치 보관위치: </label>
          <input
            className="form-control"
            type="text"
            placeholder="펀치 보관위치"
            onChange={(event) => {
              setFormData((prevState) => ({
                ...prevState,
                storageLocation: event.target.value,
              }));
            }}
          />
        </div>

        <div className="col">
          <label htmlFor="productName" className="form-label">
            제품:
          </label>
          <select
            required
            id="productName"
            className="form-control"
            value={formData["p.product"]}
            onChange={(event) => {
              setFormData((prevState) => ({
                ...prevState,
                "p.product": event.target.value,
              }));
            }}
          >
            <option value="" disabled>
              아래 list 에서 선택 하세요.
            </option>
            {props.productList.map((productName) => {
              return (
                <option key={productName} value={productName}>
                  {productName}
                </option>
              );
            })}
            <option value="All">All</option>
          </select>
        </div>

        <div className="col">
          <label htmlFor="productType" className="form-label">
            제품 타입:{" "}
          </label>
          <select
            required
            id="productType"
            className="form-control"
            value={formData.ptype}
            onChange={(event) => {
              setFormData((prevState) => ({
                ...prevState,
                ptype: event.target.value,
              }));
            }}
          >
            <option value="" disabled>
              아래 list 에서 선택 하세요.
            </option>
            <option value="AA">AA</option>
            <option value="BB">BB</option>
            <option value="CC">CC</option>
            <option value="All">All</option>
          </select>
        </div>
      </div>
      <input type="submit" value="조회" />
    </form>
  );
}
