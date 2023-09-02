import { useState, useEffect } from "react";

import { useAuth } from "@/common/contexts/auth";
import { NavBar } from "@/common/components/NavBar";
import { request } from "@/common/utils/ajax";

export const MyPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [lockedIdList, setLockedIdList] = useState([]);

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
        if (result === "admin") {
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
              setLockedIdList(result);
            })
            .catch((error) => console.error(error));
        } else {
          setIsAdmin(false);
        }
      })
      .catch((error) => console.error(error));
  }, [user]);

  const changeHandler = function (e: React.ChangeEvent<HTMLSelectElement>) {
    const resetId = e.target.value;

    const body = {
      username: resetId,
      isLocked: false,
      trialCount: 0,
    };

    request
      .post(`/api/tool-managing-system/resetId`, body)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `${resetId} 계정의 잠금상태 초기화 중 error 발생 하였습니다.`
          );
        }
        return response.text();
      })
      .then((result) => {
        if (result === "OK") {
          const changedLockedIdList = lockedIdList.filter(
            (id) => id !== resetId
          );
          setLockedIdList(changedLockedIdList);
          alert(`${resetId} 계정의 잠금상태가 초기화 되었습니다.`);
        } else {
          alert(
            `${resetId} 계정의 잠금상태 초기화 중 error가 발생 하였습니다.`
          );
        }
      })
      .catch((error) => console.error(error));
  };

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
        <div>
          <h3>admin 권한 계정으로 login 되었습니다.</h3>
          <select
            className="form-select"
            onChange={changeHandler}
            value=""
            required
          >
            <option value="" disabled>
              비밀번호를 초기화 할 계정을 선택 하세요.
            </option>
            {lockedIdList.map((id) => {
              return (
                <option key={id} value={id}>
                  {id}
                </option>
              );
            })}
          </select>
        </div>
      )}
    </div>
  );
};
