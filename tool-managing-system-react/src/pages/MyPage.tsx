import { useState, useEffect } from "react";

import { useAuth } from "@/common/contexts/auth";
import { NavBar } from "@/common/components/NavBar";

import { DisplayId } from "@/pages/DisplayId";
import { DisplayAdminId } from "./DisplayAdminId";
import { Link } from "react-router-dom";

import { createMyPage } from "@/common/actions/user/myPage";
import { MyPageInput, MyPageOutput } from "@/common/actions/user/myPage";

import { User, useFetchUserList } from "@/common/hooks/useFetchUserList";

export const MyPage = () => {
  console.log("=====MyPage Component called=====");

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const { user, logout } = useAuth();

  console.log("before effect");

  const { userList, refetchForUserList } = useFetchUserList(user);

  console.log("after effect");

  console.log("user: ", user);
  console.log("userList: ", userList);
  console.log("isAdmin: ", isAdmin);

  const fetchData = async (body: MyPageInput) => {
    try {
      const output = await createMyPage(body);

      if (output.success.data.userRole === "ADMIN") {
        setIsAdmin(true);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    console.log(`effect called in MyPage`);

    const body: MyPageInput = {
      username: user,
    };

    fetchData(body);
  }, [user]);

  if (userList.length == 0) {
    console.log(`userList == empty array`);
    return <div>...Loading</div>;
  }

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
                  refetchForUserList={refetchForUserList}
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
              <td>{userList.userRole}</td>
              <td>{userList.passwordSetDate}</td>
              <td>{userList.passwordValidDate}</td>
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
