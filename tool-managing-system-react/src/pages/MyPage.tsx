import { useState, useEffect } from "react";

import { useAuth } from "@/common/contexts/auth";
import { NavBar } from "@/common/components/NavBar";

import { DisplayId } from "@/pages/DisplayId";
import { DisplayAdminId } from "./DisplayAdminId";
import { Link } from "react-router-dom";

import { createMyPage } from "@/common/actions/user/myPage";
import { MyPageInput, MyPageOutput } from "@/common/actions/user/myPage";
import { useFetchUserList } from "@/common/hooks/useFetchUserList";

type User = {
  username: string;
  userRole: string;
  notLocked: boolean;
  approved: boolean;
  notExpired: boolean;
  createdDate: string;
};

export const MyPage = async () => {
  console.log("MyPage called");

  const [isAdmin, setIsAdmin] = useState(false);
  // const [idList, setIdList] = useState<Id[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [passwordSetDate, setPasswordSetDate] = useState<string>("");
  const [passwordValidDate, setPasswordValidDate] = useState<string>("");

  const { user, logout } = useAuth();

  const { userList, userRefetch } = await useFetchUserList();

  console.log("userList in MyPage component");
  console.log(userList);

  const fetchData = async (body: MyPageInput) => {
    console.log("async called");

    try {
      const output = await createMyPage(body);

      console.log("output in my page");
      console.log(output);

      if (output.success.data.admin) {
        setIsAdmin(true);
        // setIdList(output.success.data.userList);
        // console.log(idList);
      } else {
        setUserRole(output.success.data.userRole);
        setPasswordSetDate(output.success.data.passwordSetDate);
        setPasswordValidDate(output.success.data.passwordValidUntil);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    console.log("Effect called");

    const body: MyPageInput = {
      username: user,
    };

    fetchData(body);
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
            {userList.map((user: User) =>
              user.userRole === "ADMIN" ? (
                <DisplayAdminId key={user.username} user={user} />
              ) : (
                <DisplayId
                  key={user.username}
                  user={user}
                  userList={userList}
                  userRefetch={userRefetch}
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
