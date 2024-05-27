type Id = {
  userId: string;
  userRole: string;
  notLocked: boolean;
  approved: boolean;
};

type IdProps = {
  id: Id;
};

export function DisplayAdminId({ id }: IdProps) {
  return (
    <tr>
      <td>{id.userId}</td>
      <td>{id.userRole}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
  );
}

// 구현은 어쩔 수 없음, 하지만 호출부는 깨끗 해야 함.
