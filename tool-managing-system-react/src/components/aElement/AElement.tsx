type Props = {
  path: string;
  date: string;
};

export default function AElement(props: Props) {
  return <a href={props.path}>{props.date}</a>;
}
