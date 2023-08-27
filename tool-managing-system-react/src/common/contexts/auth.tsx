import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

const CURRENT_USER_KEY = "tool-managing-system-current-user";

type AuthContextValue<LOGIN extends boolean = false> = (LOGIN extends true
  ? { user: string }
  : { user?: string }) & {
  login: (user: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue>(
  undefined as unknown as AuthContextValue
);

export const useAuth = <LOGIN extends boolean = false>() => {
  const value = useContext(AuthContext) as AuthContextValue<LOGIN>;
  if (value == null) {
    throw new Error("useAuth는 반드시 AuthProvider 아래서 사용해야합니다.");
  }

  return value;
};

export const AuthProvider = (props: {
  afterLoginComponent: ReactNode;
  beforeLoginComponent: ReactNode;
}) => {
  const [user, setUser] = useState<string | undefined>(() => {
    const currentUser = sessionStorage.getItem(CURRENT_USER_KEY);
    if (currentUser) {
      return currentUser;
    } else {
      return undefined;
    }
  });

  const login = useCallback((user: string) => {
    sessionStorage.setItem(CURRENT_USER_KEY, user);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(CURRENT_USER_KEY);
    setUser(undefined);
  }, []);

  const value: AuthContextValue = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {user ? props.afterLoginComponent : props.beforeLoginComponent}
    </AuthContext.Provider>
  );
};
