import { BusinessError } from "./../../error";
import { request } from "./../../utils/ajax";

type ResetPasswordInput = {
  username: string;
  password: string;
  passwordConfirmation?: string;
};

type ResetPasswordOutput = {
  username: string;
};




const resetPassword = async (body: ResetPasswordInput) => {
  let output: ResetPasswordOutput;

  try {
    output = await request.post(`/api/tool-managing-system/resetPassword`, body)
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "")
    }
  }
}











request
        .post(`/api/tool-managing-system/resetPassword`, body)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `${resetId} 계정의 잠금상태 초기화 중 error 발생 하였습니다.`
            );
          }
          return response.json();
        })
        .then((json) => {
          console.log("json");
          console.log(json);

          if (json.passwordReset) {
            alert(`초기화 되었습니다.`);
            setNotLocked(true);
          } else if (!json.passwordLongEnough) {
            alert(`입력된 비밀번호의 길이가 6자리 미만 입니다.`);
          } else if (!json.passwordSameWithCurrentPassword) {
            alert(`입력된 비밀번호가 현재 비밀번호와 동일 합니다.`);
          }
        })
        .catch((error) => console.error(error));
    } else {
      alert(`password의 길이는 최소 6자리 이상 입니다.`);
    }
