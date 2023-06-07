type Props = {
  text?: string;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function OpenFileButton(props: Props) {
  const { className, children, ...rest } = props;

  const classes = ["btn btn-primary", className].join(" ");

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

export default OpenFileButton;
