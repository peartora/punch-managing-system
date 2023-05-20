type Props = {
  text: string;
  handlerClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    // punchId: string
  ) => void;
};

function MyButton({ text, handlerClick }: Props) {
  return (
    <button type="button" className="btn btn-primary" onClick={handlerClick}>
      {text}
    </button>
  );
}

export default MyButton;
