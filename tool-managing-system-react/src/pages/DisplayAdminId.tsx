type User = {
  username: string;
  userRole: string;
  notLocked: boolean;
  approved: boolean;
};

type IdProps = {
  user: User;
};

export function DisplayAdminId({ user }: IdProps) {
  return (
    <tr>
      <td>{user.username}</td>
      <td>{user.userRole}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
  );
}

// 구현은 어쩔 수 없음, 하지만 호출부는 깨끗 해야 함.
