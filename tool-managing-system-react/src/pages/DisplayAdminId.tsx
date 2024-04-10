type Id = {
  username: string;
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
      <td>{id.username}</td>
      <td>{id.userRole}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
  );
}
