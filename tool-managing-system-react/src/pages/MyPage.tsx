import { useState, useEffect } from "react";

import { useAuth } from "@/common/contexts/auth";
import { NavBar } from "@/common/components/NavBar";
import { request } from "@/common/utils/ajax";

import { DisplayId } from "@/pages/DisplayId";
import { DisplayAdminId } from "./DisplayAdminId";

type Id = {
  username: string;
  role: string;
  is_locked: boolean;
  is_approved: boolean;
};

export const MyPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [idList, setIdList] = useState<Id[]>([]);

  const { user, logout } = useAuth();

  useEffect(() => {
    const body = {
      username: user,
    };

    request
      .post(`/api/tool-managing-system/authority`, body)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `${user} 계정의 권한 확인 중 network 에러 발생 하였습니다.`
          );
        }
        return response.text();
      })
      .then((result) => {
        if (result === "ADMIN") {
          setIsAdmin(true);

          request
            .get(`/api/tool-managing-system/idList`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `id 목록을 가져 오는 중 network error 발생 하였습니다.`
                );
              }
              return response.json();
            })
            .then((result) => {
              console.log("result");
              console.log(result);

              setIdList(result);
            })
            .catch((error) => console.error(error));
        } else {
          setIsAdmin(false);
        }
      })
      .catch((error) => console.error(error));
  }, [user]);

  return (
    <div>
      <NavBar />
      <h3>{user} id로 로그인 되었습니다.</h3>
      <div style={{ marginTop: "30px", marginBottom: "30px" }}>
        <button type="button" onClick={logout}>
          로그아웃
        </button>
      </div>

      {isAdmin && (
        <table className="table table-striped table-bordered table-hover custom-table-width">
          <thead>
            <tr>
              <th>계정</th>
              <th>역할</th>
              <th>활성화 상태</th>
              <th>활성화 처리</th>
              <th>승인 상태</th>
              <th>승인 처리</th>
              <th>계정 삭제</th>
            </tr>
          </thead>
          <tbody>
            {idList.map((id: Id) =>
              id.role === "admin" ? (
                <DisplayAdminId key={id.username} id={id} />
              ) : (
                <DisplayId
                  key={id.username}
                  id={id}
                  idList={idList}
                  setIdList={setIdList}
                />
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
