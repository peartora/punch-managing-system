import { useState } from "react";

import { useBringProductList } from "@/common/hooks/useBringProductList";
import { request } from "@/common/utils/ajax";
import { NavBar } from "@/common/components/NavBar";

import { ScrappedPunchList } from "./components/ScrappedPunchList";

export function PunchDeleteHistory() {
  const [scrappedPunchList, setScrappedPunchList] = useState([]);

  let selectedMedicine = "";

  const { medicineNameList } = useBringProductList();

  function selectMedicine(event: React.ChangeEvent<HTMLSelectElement>) {
    selectedMedicine = event.target.value;

    setScrappedPunchList([]);

    const query = new URLSearchParams();
    query.append("medicine", selectedMedicine);

    request
      .get(`/api/tool-managing-system/display-scrapped?${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `폐각 펀치 list를 불러 오는 중 error가 발생 하였습니다.`
          );
        }
        return response.json();
      })
      .then((result) => {
        console.log(`scrappedPunchList`);
        console.log(result);

        setScrappedPunchList(result);
      })
      .catch((error) => alert(error));
  }

  return (
    <>
      <NavBar />

      <div className="input-group mb-3">
        <label htmlFor="productName" className="form-label">
          제품:
        </label>
        <select
          id="productName"
          className="form-select"
          value={selectedMedicine}
          onChange={selectMedicine}
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
          <option value="All">All</option>
        </select>
      </div>
      <ScrappedPunchList
        punchList={scrappedPunchList}
        setScrappedPunchList={setScrappedPunchList}
      />
    </>
  );
}
