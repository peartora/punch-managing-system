import { useState, useEffect } from "react";

import { useAuth } from "@/common/contexts/auth";
import { NavBar } from "@/common/components/NavBar";

import { DisplayId } from "@/pages/DisplayId";
import { DisplayAdminId } from "./DisplayAdminId";
import { Link } from "react-router-dom";

import { createMyPage } from "@/common/actions/user/myPage";
import { MyPageInput, MyPageOutput } from "@/common/actions/user/myPage";

import { User, useFetchUserList } from "@/common/hooks/useFetchUserList";
import { BusinessError } from "@/common/error";

export const MyPage = () => {
  console.log("==========MyPage Component called==========");

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const { user, logout } = useAuth();

  console.log("before custom hook");

  const { userList, refetchForUserList } = useFetchUserList(user);

  console.log("after custom hook");

  console.log("user: ", user);
  console.log("userList: ", userList);
  console.log("isAdmin: ", isAdmin);

  const fetchData = async (body: MyPageInput) => {
    console.log("fetchData called in MyPage.tsx");

    try {
      console.log("before createMyPage async function called");

      const { userRole } = await createMyPage(body);

      // await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log(
        "%c after createMyPage async function called",
        "background: #eeeeee; color: #ff0000"
      );

      if (userRole === "ADMIN") {
        setIsAdmin(true);
      }
    } catch (error) {
      let isHandled = false;
      if (error instanceof BusinessError) {
        if (error.code === "USER_IS_NOT_EXIST") {
          isHandled = true;
          alert("user가 존재 하지 않습니다.");
        }
      }

      if (!isHandled) {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    console.log(`=====effect called in MyPage=====`);

    const body: MyPageInput = {
      username: user,
    };

    fetchData(body);

    return () => {
      console.log("cleanup in MyPage called");
    };
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
