type Props = {
  text: string;
};

function MyButton({ text }: Props) {
  return (
    <button type="button" className="btn btn-primary">
      {text}
    </button>
  );
}

export default MyButton;
