import NavBar from "@/components/NavBar";
import { useDisplay } from "@/common/hooks";

import "@/css/Overview.css";

const OverViewList = () => {
  const { rows } = useDisplay();

  let result: any = [];
  let countForIndex = 0;
  let keys: string[] = [];

  console.log("result before even for each state");
  console.log(result);

  rows.forEach((r) => {

    console.log("result just after foreach state");
    console.log(result);

    const product = r.product;
    const punchType = r.punchType;

    if (keys.indexOf(product) === -1) {
      keys = [...keys, product];
    }


    console.log("result before if state");
    console.log(result);

    if (result.length === 0) {
      if (punchType === "상부") {
        result[0] = {[product]: {"상부": 1, "하부": 0, "다이": 0,}};
      } else if (punchType === "하부") {
        result[0] = {[product]: {"상부": 0, "하부": 1, "다이": 0,}};
      } else {
        result[0] = {[product]: {"상부": 0, "하부": 0, "다이": 1,}};
      }
      countForIndex++;
    } else {
      result.forEach((resultObject: any, i: number) => {
        if (product in resultObject) {
          console.log("product값이 존재 합니다.");
          if (punchType === "상부") {
            result[i][product]["상부"]++;          
          } else if (punchType === "하부") {
            result[i][product]["하부"]++;
          } else {
            result[i][product]["다이"]++;
          }
        } else {
          console.log("product값이 존재 하지 않습니다.");

          if (keys.length > result.length) {
            const newObject = { "상부": 0, "하부": 0, "다이": 0 };
            if (punchType === "상부") {
              newObject["상부"] = 1;
            } else if (punchType === "하부") {
              newObject["하부"] = 1;
            } else {
              newObject["다이"] = 1;
            }
      
            result[countForIndex] = { [product]: newObject };
            countForIndex++;
          } else {
            return;
          }
        }
      })
    }
  });

  console.log("result");
  console.log(result);

  return (
    <table
      className="table table-striped table-bordered table-hover custom-table-width"
      style={{ width: "100%" }}
    >
      <thead>
        <tr>
          <th>제품</th>
          <th>상부 펀치 등록 개수</th>
          <th>하부 펀치 등록 개수</th>
          <th>다이 펀치 등록 개수</th>
        </tr>
      </thead>
      <tbody>
      {result.map((r: any, i: number) => {

        const products = Object.keys(r);
        const productName = products[0];

        return (
          <tr key={productName}>
            <td>{productName}</td>
            <td>{r[productName]["상부"]}</td>
            <td>{r[productName]["하부"]}</td>
            <td>{r[productName]["다이"]}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
  );
}

export default function Overview() {
  return (
    <div>
      <NavBar />
      <OverViewList />
    </div>
  );
}
