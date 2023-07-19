import { useState } from "react";

import { useAuth } from "@/common/auth";

export const LoginPage = () => {
  const { login } = useAuth();

  const [username, setUserName] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    login(username);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          id:{" "}
          <input
            name="username"
            type="text"
            value={username}
            required
            onChange={(event) => setUserName(event.target.value)}
          />
        </div>
        <div>
          <button type="submit">로그인</button>
        </div>
      </form>
    </div>
  );
};
