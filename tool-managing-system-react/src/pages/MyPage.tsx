import { useState, useEffect } from "react";

import { useAuth } from "@/common/contexts/auth";
import { NavBar } from "@/common/components/NavBar";
import { request } from "@/common/utils/ajax";

import { DisplayId } from "@/pages/DisplayId";
import { DisplayAdminId } from "./DisplayAdminId";
import { Link } from "react-router-dom";

import { Dayjs } from "dayjs";
import { useLinkClickHandler } from "react-router-dom";

type Id = {
  username: string;
  userRole: string;
  notLocked: boolean;
  approved: boolean;
  notExpired: boolean;
  createdDate: string;
};

export const MyPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [idList, setIdList] = useState<Id[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [passwordSetDate, setPasswordSetDate] = useState<string>("");
  const [passwordValidDate, setPasswordValidDate] = useState<string>("");

  const { user, logout } = useAuth();

  useEffect(() => {
    const body = {
      username: user,
    };

    request
      .post(`/api/tool-managing-system/my_page`, body)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `${user} 계정의 권한 확인 중 network 에러 발생 하였습니다.`
          );
        }
        return response.json();
      })
      .then((json) => {
        console.log(json);

        if (json.admin) {
          setIsAdmin(true);
          setIdList(json.userList);
        } else {
          console.log(json);
          setUserRole(json.userRole);
          setPasswordSetDate(json.passwordSetDate);
          setPasswordValidDate(json.passwordValidUntil);
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

      {isAdmin ? (
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
              id.userRole === "ADMIN" ? (
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
      ) : (
        <table className="table table-striped table-bordered table-hover custom-table-width">
          <thead>
            <tr>
              <th>역할</th>
              <th>비밀번호 설정날짜</th>
              <th>비밀번호 유효날짜</th>
              <th>비밀번호 변경</th>
            </tr>
          </thead>
          <tbody>
            <tr key={user}>
              <td>{userRole}</td>
              <td>{passwordSetDate}</td>
              <td>{passwordValidDate}</td>
              <td>
                <Link to={`/password-change`} style={{ marginRight: "20px" }}>
                  비밀번호 변경
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};
