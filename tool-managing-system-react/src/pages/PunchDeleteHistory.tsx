import { useBringProductList } from "@/common/hooks";

function PunchDeleteHistory() {
  //   let product = "";
  //   const result: any = [];

  //   const { productList } = useBringProductList();

  //   function changeHandler(event: React.ChangeEvent<HTMLSelectElement>) {
  //     if (event !== undefined) {
  //       product = event.target.value;
  //     }
  //   }

  //   if (productList) {
  //     return (
  //       <div className="input-group mb-3">
  //         <label htmlFor="productName" className="form-label">
  //           제품:
  //         </label>
  //         <select
  //           id="productName"
  //           className="form-select"
  //           value={product}
  //           onChange={changeHandler}
  //           required
  //         >
  //           <option value="" disabled>
  //             아래 list 에서 선택 하세요.
  //           </option>
  //           {productList.map((productName) => {
  //             return (
  //               <option key={productName} value={productName}>
  //                 {productName}
  //               </option>
  //             );
  //           })}
  //         </select>
  //       </div>
  //     );
  //   }

  return (
    <table>
      <thead>
        <tr>
          <th>펀치 ID</th>
          <th>폐각 날짜</th>
          <th>폐각 사유</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>2</td>
          <td>3</td>
        </tr>
      </tbody>
    </table>
  );
}

export default PunchDeleteHistory;
