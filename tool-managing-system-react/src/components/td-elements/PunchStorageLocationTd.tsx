type Props = {
  punchStorageLocation: string;
};

function PunchStorageLocationTd({ punchStorageLocation }: Props) {
  return <td>{punchStorageLocation}</td>;
}

export default PunchStorageLocationTd;
