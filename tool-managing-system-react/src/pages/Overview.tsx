import NavBar from "@/components/NavBar";
import { useDisplay } from "@/common/hooks";

type ProductInformation = {
  [key: string]: number;
};

const OverViewList = () => {
  const { rows } = useDisplay();

  let results: Array<ProductInformation> = [];

  results = rows.map((r) => {
    const productName = r.product;
    const punchType = r.punchType;
    const keyName = `${productName}.${punchType}`;

    if (results.length === 0) {
      return {
        [keyName]: 1,
      };
    } else {
      results.forEach((r) => {
        if (keyName in r) {
          console.log("YES");
          r[keyName] = r[keyName] + 1;
        } else {
          r[keyName] = 1;
        }
      });
    }
  }) as ProductInformation[];

  console.log("results");
  console.log(results);

  return (
    <table
      className="table table-striped table-bordered table-hover custom-table-width"
      style={{ width: "100%" }}
    >
      <thead>
        <tr>
          <th>제품명</th>
          <th>상부 펀치 개수</th>
          <th>하부 펀치 개수</th>
          <th>다이 펀치 개수</th>
        </tr>
      </thead>
      <tbody></tbody>
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
