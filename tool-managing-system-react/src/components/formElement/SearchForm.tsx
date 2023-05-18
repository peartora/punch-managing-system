import { useState } from "react";
import { useBringProductList } from "@/common/CustomHooks";
import { request } from "./../../common/Service";
import { formatDate } from "./../../common/Service";

type Data = {
  startDate: Date;
  endDate: Date;
  punchType: string;
  supplier: string;
  punchStatus: string;
  storageLocation: string;
  product: string;
  productType: string;
};

function SearchForm() {

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [punchType, setPunchType] = useState("");
  const [supplier, setSupplier] = useState("");
  const [punchStatus, setPunchStatus] = useState("");
  const [storageLocation, setStorageLocation] = useState("");
  const [product, setProduct] = useState("");
  const [productType, setProductType] = useState("");

  function handlerSubmit() {
    const data: Data = {
      startDate: startDate,
      endDate: endDate,
      punchType: punchType,
      supplier: supplier,
      punchStatus: punchStatus,
      storageLocation: storageLocation,
      product: product,
      productType: productType
    };

    const params = new URLSearchParams();

    for (let key in data) {
      const value = data[key as keyof Data];

      if ((key == "punchType") || (key == "punchStatus") || (key == "product") || (key == "productType")) {
        if (value == "All") {
          continue;
        } 
      }
      else {
        if (value == "") {
          continue;
        }
      }

      if (value instanceof Date) {
        const formatedValue = formatDate(value);
        params.append(key, formatedValue);
      } else {
        params.append(key, value.toString());
      }
    }

    alert(params.toString());

    request.get(`/api/tool-managing-system/display?${params.toString()}`)
    .then((response) => {
      if (!response.ok)
        throw new Error(`펀치 조회중 error가 발생 하였습니다.`);
      return response.text();
    })
    .then((result) => alert(result))
    .catch((error) => console.error(error));
  }

  const productList = useBringProductList();

  return (
    <form onSubmit={handlerSubmit}>
      <h3>조회할 data를 입력 하세요</h3>
      <div className="row">
        <div className="col">
          <label htmlFor="startDate" className="form-label">시작 날짜: </label>
          <input id="startDate" className="form-control" type="date" placeholder="시작 날짜" onChange={event => {
            const dateValue = new Date(event.target.value);
            setStartDate(dateValue);
            }} required/>
        </div>

        <div className="col">
          <label htmlFor="endDate" className="form-label">종료 날짜: </label>
          <input id="endDate"className="form-control" type="date" placeholder="종료 날짜" onChange={event => {
            const dateValue = new Date(event.target.value);
            setEndDate(dateValue);
            }} required/>
        </div>

        <div className="col">
          <label htmlFor="productType" className="form-label">펀치 타입: </label>
          <select
            required 
            id="productType"
            className="form-control"
            value={punchType}
            onChange={(event) => setPunchType(event.target.value)}
          >
            <option value="" disabled>아래 list 에서 선택 하세요.</option>
            <option value="상부">상부</option>
            <option value="하부">하부</option>
            <option value="다이">다이</option>
            <option value="All">All</option>
          </select>
        </div>

        <div className="col">
          <label className="form-label">제조사: </label>
          <input
            className="form-control"
            type="text"
            placeholder="제조사"
            onChange={event => setSupplier(event.target.value)}
          />
        </div>

        <div className="col">
          <label htmlFor="punchStatus" className="form-label">펀치 상태: </label>
          <select
            required
            id="punchStatus"
            className="form-control"
            value={punchStatus}
            onChange={(event) => setPunchStatus(event.target.value)}
          >
            <option value="" disabled>아래 list 에서 선택 하세요.</option>
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
            onChange={(event) => setStorageLocation(event.target.value)}
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
            value={product}
            onChange={(event) => setProduct(event.target.value)}
          >
            <option value="" disabled>아래 list 에서 선택 하세요.</option>
            {productList.map((productName) => {
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
          <label htmlFor="productType" className="form-label">제품 타입: </label>
          <select
            required 
            id="productType"
            className="form-control"
            value={productType}
            onChange={(event) => setProductType(event.target.value)}
          >
            <option value="" disabled>아래 list 에서 선택 하세요.</option>
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

export default SearchForm;
