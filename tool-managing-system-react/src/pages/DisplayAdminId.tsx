type Id = {
  username: string;
  role: string;
  is_locked: boolean;
  is_approved: boolean;
};

type IdProps = {
  id: Id;
};

export function DisplayAdminId({ id }: IdProps) {
  return (
    <tr>
      <td>{id.username}</td>
      <td>{id.role}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
  );
}
