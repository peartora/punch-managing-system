type PunchListType = {
  "punch-number": string;
  reason: string;
  date: string;
};

function ScrappedPunchList({ punchList }: { punchList: PunchListType[] }) {
  return (
    <table className="table table-striped table-bordered table-hover custom-table-width">
      <thead>
        <tr>
          <th>펀치 ID</th>
          <th>폐각 날짜</th>
          <th>폐각 사유</th>
        </tr>
      </thead>
      <tbody>
        {punchList.map((punch, i) => (
          <tr key={punch["punch-number"] + i}>
            <td>{punch["punch-number"]}</td>
            <td>{punch["date"]}</td>
            <td>{punch["reason"]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ScrappedPunchList;
