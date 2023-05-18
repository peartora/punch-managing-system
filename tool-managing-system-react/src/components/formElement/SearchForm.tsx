import { useState } from "react";



function SearchForm() {

  const [productType, setProductType] = useState("");


  return (
    <form>
      <h3>조회할 data를 입력 하세요</h3>
      <div className="row">
        {/* <div className="col">
          <label className="form-label">펀치 ID: </label>
          <input className="form-control" type="text" placeholder="펀치 ID" />
        </div> */}

        <div className="col">
          <label htmlFor="startDate" className="form-label">시작 날짜: </label>
          <input id="startDate" className="form-control" type="date" placeholder="시작 날짜" />
        </div>

        <div className="col">
          <label htmlFor="endDate" className="form-label">종료 날짜: </label>
          <input id="endDate"className="form-control" type="date" placeholder="종료 날짜" />
        </div>

        <div className="col">
          <label htmlFor="productType" className="form-label">타입: </label>
          <select
            id="productType"
            className="form-control"
            value="조회할 type을 선택 하세요"
            onChange={(event) => setProductType(event.target.value)}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>

        <div className="col">
          <label className="form-label">제조사: </label>
          <input
            className="form-control"
            type="email"
            placeholder="Enter email"
          />
        </div>

        <div className="col">
          <label className="form-label">펀치 상태: </label>
          <input className="form-control" type="email" placeholder="펀치 상태" />
        </div>

        <div className="col">
          <label className="form-label">펀치 보관위치: </label>
          <input
            className="form-control"
            type="email"
            placeholder="Enter email"
          />
        </div>

        <div className="col">
          <label className="form-label">제품: </label>
          <input
            className="form-control"
            type="email"
            placeholder="Enter email"
          />
        </div>

        <div className="col">
          <label className="form-label">제품 타입: </label>
          <input
            className="form-control"
            type="email"
            placeholder="Enter email"
          />
        </div>
      </div>
      <input type="submit" value="조회" />

    </form>
  );
}

export default SearchForm;
