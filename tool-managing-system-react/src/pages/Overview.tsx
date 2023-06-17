import NavBar from "@/components/NavBar";
import { useDisplay } from "@/common/hooks";

const OverViewList = () => {
  const { rows } = useDisplay();

  let currentPunchId = "";
  let countForCurrentPunchId = 0;

  const newRows = rows
    .map((r, index) => {
      const parts = r.punchId.split("-");
      parts.pop();
      const updatedPunchId = parts.join("-");

      if (currentPunchId === "" || currentPunchId === null) {
        currentPunchId = updatedPunchId;
        countForCurrentPunchId++;
      } else {
        if (updatedPunchId === currentPunchId) {
          countForCurrentPunchId++;

          if (index + 1 === rows.length) {
            return {
              newPunchId: currentPunchId,
              count: countForCurrentPunchId,
            };
          }
        } else {
          const punchIdForReturn = currentPunchId;
          currentPunchId = updatedPunchId;

          const countForReturn = countForCurrentPunchId;
          countForCurrentPunchId = 1;

          return {
            newPunchId: punchIdForReturn,
            count: countForReturn,
          };
        }
      }
    })
    .filter((nr) => nr !== undefined);

  return (
    <table
      className="table table-striped table-bordered table-hover custom-table-width"
      style={{ width: "100%" }}
    >
      <thead>
        <tr>
          <th>펀치 대표 id</th>
          <th>등록 개수</th>
        </tr>
      </thead>
      <tbody>
        {newRows.map((nr, index) => {
          let checkResult = "";

          if (nr?.count !== 3) {
            checkResult = "초과";
          }

          return (
            <tr key={index}>
              <td>{nr?.newPunchId}</td>
              <td>{nr?.count}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default function Overview() {
  return (
    <div>
      <NavBar />
      <OverViewList />
    </div>
  );
}
