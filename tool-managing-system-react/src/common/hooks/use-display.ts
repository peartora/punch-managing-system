import { useEffect } from "react";
import { request } from "@/common/Service";

export default function useDisplay() {
  let rows;

  useEffect(() => {
    request
      .get(`/api/tool-managing-system/display`)
      .then((response) => {
        if (!response.ok) {
          console.error(response.statusText);
          throw new Error(`Punch 리스트 로딩 중 error가 발생 하였습니다.`);
        }
        return response.json();
      })
      .then((response) => {
        rows = response;
        // setRows(response);
      })
      .catch((error) => console.error(error));
  }, []);

  return rows;
}
