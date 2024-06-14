import { useAuth } from "@/common/contexts/auth";

import { request } from "@/common/utils/ajax";

type PunchListType = {
  punch: string;
  reason: string;
  date: string;
  previousPunchStatus: string;
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
  const userObject = useAuth();
  const username = userObject["user"];

  const clickHandler = function (punch: any) {
    const body = {
      username,
      punch: punch["punch"],
      newStatus: punch["previousPunchStatus"],
    };
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
            <tr key={punch["punch"] + i}>
              <td>{punch["punch"]}</td>
              <td>{punch["date"]}</td>
              <td>{punch["reason"]}</td>
              <td>{punch["previousPunchStatus"]}</td>
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
