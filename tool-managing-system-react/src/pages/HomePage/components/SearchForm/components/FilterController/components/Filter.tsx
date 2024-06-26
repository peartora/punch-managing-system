import { useState } from "react";
import { FormData } from "@/common/types";
import dayjs from "dayjs";

type Props = {
  setParams: (params: URLSearchParams) => void;
  medicineNameList: Array<string>;
  supplierList: Array<string>;
};

export function Filter(props: Props) {
  const [formData, setFormData] = useState<FormData>({
    startDate: "",
    endDate: "",
    punchPosition: "",
    supplier: "",
    status: "",
    medicine: "",
    medicineType: "",
  });

  function handlerSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newParams: URLSearchParams = new URLSearchParams();

    for (const key in formData) {
      const value = formData[key as keyof FormData];

      //   console.log(`value`);
      //   console.log(value);
      //   console.log(typeof value);

      //   if (key == "startDate") {
      //     if (value == "") {
      //       const formatedValue = dayjs("1990-01-01").format("YYYY-MM-DD");
      //       newParams.append(key, formatedValue);
      //       continue;
      //     }
      //   }

      //   if (key == "endDate") {
      //     if (value == "") {
      //       const formatedValue = dayjs("2099-12-31").format("YYYY-MM-DD");
      //       newParams.append(key, formatedValue);
      //       continue;
      //     }
      //   }

      if (value != null && typeof value === "string" && value.length > 0) {
        newParams.append(key, value.toString());
      }
    }

    console.log(`filter component`);
    console.log(`newParams`, newParams);

    props.setParams(newParams);
  }

  return (
    <form onSubmit={handlerSubmit}>
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
              const startDate = event.currentTarget.valueAsDate ?? "";
              setFormData((prevState) => ({
                ...prevState,
                startDate,
              }));
            }} // setFormData가 실제 실행 될 때는 event 객체가 소멸 했을지 남아 있을지 보장 되지 않음.
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
              const endDate = event.currentTarget.valueAsDate ?? "";
              setFormData((prevState) => ({
                ...prevState,
                endDate,
              }));
            }}
          />
        </div>

        <div className="col">
          <label htmlFor="punchPosition" className="form-label">
            펀치 타입:{" "}
          </label>
          <select
            // required
            id="punchPosition"
            className="form-select"
            value={formData.punchPosition}
            onChange={(event) => {
              setFormData((prevState) => ({
                ...prevState,
                punchPosition: event.target.value,
              }));
            }}
          >
            <option value="">선택 하세요.</option>
            <option value="상부">상부</option>
            <option value="하부">하부</option>
            <option value="다이">다이</option>
            {/* <option value="All">All</option> */}
          </select>
        </div>

        <div className="col">
          <label htmlFor="supplier" className="form-label">
            업체:
          </label>
          <select
            // required
            id="supplier"
            className="form-select"
            value={formData["supplier"]}
            onChange={(event) => {
              setFormData((prevState) => ({
                ...prevState,
                supplier: event.target.value,
              }));
            }}
          >
            <option value="">선택 하세요.</option>
            {props.supplierList.map((supplierName) => {
              return (
                <option key={supplierName} value={supplierName}>
                  {supplierName}
                </option>
              );
            })}
            {/* <option value="All">All</option> */}
          </select>
        </div>

        <div className="col">
          <label htmlFor="punchStatus" className="form-label">
            펀치 상태:{" "}
          </label>
          <select
            // required
            id="punchStatus"
            className="form-select"
            value={formData.status}
            onChange={(event) => {
              setFormData((prevState) => ({
                ...prevState,
                status: event.target.value,
              }));
            }}
          >
            <option value="">선택 하세요.</option>
            <option value="사용대기">사용대기</option>
            <option value="사용가능">사용가능</option>
            <option value="사용중">사용중</option>
            {/* <option value="All">All</option> */}
          </select>
        </div>

        <div className="col">
          <label htmlFor="medicine" className="form-label">
            제품:
          </label>
          <select
            // required
            id="medicine"
            className="form-select"
            value={formData["medicine"]}
            onChange={(event) => {
              setFormData((prevState) => ({
                ...prevState,
                medicine: event.target.value,
              }));
            }}
          >
            <option value="">선택 하세요.</option>
            {props.medicineNameList.map((medicineName) => {
              return (
                <option key={medicineName} value={medicineName}>
                  {medicineName}
                </option>
              );
            })}
            {/* <option value="All">All</option> */}
          </select>
        </div>

        <div className="col">
          <label htmlFor="medicineType" className="form-label">
            제품 타입:{" "}
          </label>
          <select
            // required
            id="medicineType"
            className="form-select"
            value={formData.medicineType}
            onChange={(event) => {
              setFormData((prevState) => ({
                ...prevState,
                medicineType: event.target.value,
              }));
            }}
          >
            <option value="">선택 하세요.</option>
            <option value="BB">BB</option>
            <option value="B">B</option>
            <option value="D">D</option>
            {/* <option value="All">All</option> */}
          </select>
        </div>
      </div>

      <input type="submit" value="조회" />
    </form>
  );
}
