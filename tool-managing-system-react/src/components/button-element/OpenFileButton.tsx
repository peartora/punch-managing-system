type Props = {
  text: string,
  onClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
};

function OpenFileButton({ text, onClick }: Props) {
  return <button className="btn btn-primary" onClick={onClick}>{text}</button>
}

export default OpenFileButton;