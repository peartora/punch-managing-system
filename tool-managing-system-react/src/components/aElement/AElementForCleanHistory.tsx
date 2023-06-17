type Props = {
  punchId: string;
  date: string;
};

export default function AElement(props: Props) {
  const encodedPunchId = encodeURIComponent(props.punchId);
  const encodedDate = encodeURIComponent(props.date);

  const path = `http://localhost:5173/#/print-label/${encodedPunchId}/${encodedDate}`;

  console.log("path");
  console.log(path);

  return (
    <a href={path} target="_blank">
      {props.date}
    </a>
  );
}
