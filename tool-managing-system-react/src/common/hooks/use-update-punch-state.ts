import { useEffect } from "react";
import { request } from "@/common/service";

export default function useUpdatePuncState(targetState: string, formData: any) {
  useEffect(() => {
    request
      .post(`/api/tool-managing-system/updateMultiplePunchStatus`, formData)
      .then((response) => {
        if (!response.ok)
          throw new Error(`펀치 상태 변경중 error가 발생 하였습니다.`);
        return response.text();
      })
      .then();
  });
}
