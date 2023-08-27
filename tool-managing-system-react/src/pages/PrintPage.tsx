import { useParams } from "react-router-dom";

import { NavBar } from "@/components/NavBar";

export default function HomePage() {
  const { punchId, date } = useParams();

  return (
    <main>
      <NavBar />
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
          <tr>
            <td>{punchId}</td>
            <td>{date}</td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
