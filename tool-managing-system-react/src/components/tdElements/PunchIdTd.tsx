type Props = {
  punchId: string;
};

function PunchIdTd({ punchId }: Props) {
  return <td>{punchId}</td>;
}

export default PunchIdTd;
