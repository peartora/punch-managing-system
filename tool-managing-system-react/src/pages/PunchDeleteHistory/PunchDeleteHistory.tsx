import { useState } from "react";

import { useBringMedicineList } from "@/common/hooks/useBringMedicineList";
import { getDeleteHistory } from "@/common/actions/punch/getDeleteHistory";
import { NavBar } from "@/common/components/NavBar";

import { ScrappedPunchList } from "./components/ScrappedPunchList";

export function PunchDeleteHistory() {
  const [scrappedPunchList, setScrappedPunchList] = useState([]);

  let selectedMedicine = "";

  const { medicineNameList } = useBringMedicineList();

  async function selectMedicine(event: React.ChangeEvent<HTMLSelectElement>) {
    selectedMedicine = event.target.value;

    setScrappedPunchList([]);

    const query = new URLSearchParams();
    query.append("medicineName", selectedMedicine);

    let output;

    try {
      output = await getDeleteHistory(query);
    } catch (error) {
      alert(`${selectedMedicine}에 등록된 펀치 중 삭제 내역은 없습니다.`);
      return;
    }

    setScrappedPunchList(output);
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
