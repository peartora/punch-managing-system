import NavBar from "@/components/NavBar";
import { useDisplay } from "@/common/hooks";

const OverViewList = () => {
  const { rows } = useDisplay();

  const result: any = [];
  let countForIndex = 0;
  let keys: string[] = [];

  rows.forEach((r) => {
    // 1-2023-07-09-가네진-상부
    const punchId = r.punchId;
    const keyArray: string[] = punchId.split("-");
    const registerDate = `${keyArray[1]}-${keyArray[2]}-${keyArray[3]}`;
    const key = `${keyArray[4]}-${registerDate}`;

    const punchType = r.punchType;

    if (keys.indexOf(key) === -1) {
      console.log("key");
      console.log(key);

      keys = [...keys, key];

      console.log("keys");
      console.log(keys);
    }

    if (result.length === 0) {
      if (punchType === "상부") {
        result[0] = {
          [key]: { 등록날짜: registerDate, 상부: 1, 하부: 0, 다이: 0 },
        };
      } else if (punchType === "하부") {
        result[0] = {
          [key]: { 등록날짜: registerDate, 상부: 0, 하부: 1, 다이: 0 },
        };
      } else {
        result[0] = {
          [key]: { 등록날짜: registerDate, 상부: 0, 하부: 0, 다이: 1 },
        };
      }
      countForIndex++;
    } else {
      result.forEach((resultObject: any, i: number) => {
        if (key in resultObject) {
          if (punchType === "상부") {
            result[i][key]["상부"]++;
          } else if (punchType === "하부") {
            result[i][key]["하부"]++;
          } else {
            result[i][key]["다이"]++;
          }
        } else {
          if (keys.length > result.length) {
            const newObject = {
              등록날짜: registerDate,
              상부: 0,
              하부: 0,
              다이: 0,
            };
            if (punchType === "상부") {
              newObject["상부"] = 1;
            } else if (punchType === "하부") {
              newObject["하부"] = 1;
            } else {
              newObject["다이"] = 1;
            }

            result[countForIndex] = { [key]: newObject };
            countForIndex++;
          } else {
            return;
          }
        }
      });
    }
  });

  return (
    <table
      className="table table-striped table-bordered table-hover custom-table-width"
      style={{ width: "100%" }}
    >
      <thead>
        <tr>
          <th>제품</th>
          <th>펀치 등록날짜</th>
          <th>상부 펀치 등록 개수</th>
          <th>하부 펀치 등록 개수</th>
          <th>다이 펀치 등록 개수</th>
        </tr>
      </thead>
      <tbody>
        {result.map((r: any) => {
          const products = Object.keys(r);
          const productName = products[0];

          return (
            <tr key={`${productName}-${r[productName]["등록날짜"]}`}>
              <td>{productName}</td>
              <td>{r[productName]["등록날짜"]}</td>
              <td>{r[productName]["상부"]}</td>
              <td>{r[productName]["하부"]}</td>
              <td>{r[productName]["다이"]}</td>
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
