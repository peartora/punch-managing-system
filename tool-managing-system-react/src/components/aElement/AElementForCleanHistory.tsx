type Props = {
  punchId: string;
  date: string;
};

export default function AElement(props: Props) {
  const path = `http://localhost:8080/resources/pdf/`;

  return (
    <a href={path} target="_blank">
      {props.date}
    </a>
  );
}
