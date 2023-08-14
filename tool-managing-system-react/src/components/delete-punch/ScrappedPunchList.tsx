import { request } from "@/common/Service";
// import { usePunchRows } from "@/context/punch-rows-context";

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

function ScrappedPunchList({ punchList }: { punchList: PunchListType[] }) {
  // const { refetch } = usePunchRows();

  const clickHandler = function (punch: any) {
    console.log("punch");
    console.log(punch);

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
          alert(`heee`);

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
                alert(`삭제성공`)!;
              }
            });
        }
      })
      .catch((error) => console.error(error));

    refetch();
  };

  return (
    <table className="table table-striped table-bordered table-hover custom-table-width">
      <thead>
        <tr>
          <th>펀치 ID</th>
          <th>폐각 날짜</th>
          <th>폐각 사유</th>
          <th>폐각 전 펀치 상태</th>
          <th>폐각 전 누적 사용 횟수</th>
          <th>폐각 펀치 복구</th>
        </tr>
      </thead>
      <tbody>
        {punchList.map((punch, i) => (
          <tr key={punch["punch-number"] + i}>
            <td>{punch["punch-number"]}</td>
            <td>{punch["date"]}</td>
            <td>{punch["reason"]}</td>
            <td>{punch["previous_status"]}</td>
            <td>{punch["previous_count"]}</td>
            <td>
              <button
                onClick={() => {
                  clickHandler(punch);
                }}
              >
                복구버튼
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ScrappedPunchList;