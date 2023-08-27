import { useState } from "react";
import { request } from "@/common/Service";

type PunchListType = {
  "punch-number": string;
  reason: string;
  date: string;
  previous_status: string;
  previous_count: number;
};

type Data = {
  punchId: string;
  newStatus: string;
};

type DataForDelete = {
  punchId: string;
};

export function ScrappedPunchList({
  punchList,
  setScrappedPunchList,
}: {
  punchList: PunchListType[];
  setScrappedPunchList: any;
}) {
  const [key, setKey] = useState(() => Date.now());

  const clickHandler = function (punch: any) {
    const data: Data = {
      punchId: punch["punch-number"],
      newStatus: punch.previous_status,
    };

    request
      .post(`/api/tool-managing-system/recover`, data)
      .then((response) => {
        if (!response.ok)
          new Error(`새로운 펀치 상태 변경 중 error가 발생 하였습니다.`);
        return response.text();
      })
      .then((result) => {
        if (result === "1") {
          const dataForDelete: DataForDelete = {
            punchId: punch["punch-number"],
          };
          request
            .post(`/api/tool-managing-system/delete`, dataForDelete)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Error happened`);
              }
              return response.text();
            })
            .then((result) => {
              if (result === "1") {
                const filteredPunchList = punchList.filter(
                  (p) => p["punch-number"] !== dataForDelete["punchId"]
                );
                setScrappedPunchList(filteredPunchList);

                alert(`펀치가 복구 되었습니다.`);
              }
            });
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <table className="table table-striped table-bordered table-hover custom-table-width">
      <thead>
        <tr>
          <th>펀치 ID</th>
          <th>폐각 날짜</th>
          <th>폐각 사유</th>
          <th>폐각 전 펀치 상태</th>
          <th>폐각 펀치 복구</th>
        </tr>
      </thead>
      <tbody>
        {punchList.length > 0 ? (
          punchList.map((punch, i) => (
            <tr key={punch["punch-number"] + i}>
              <td>{punch["punch-number"]}</td>
              <td>{punch["date"]}</td>
              <td>{punch["reason"]}</td>
              <td>{punch["previous_status"]}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    clickHandler(punch);
                  }}
                >
                  복구버튼
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5}>현재, 조회된 폐각 list가 없습니다.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
