type Prop = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  punchId: string;
  checked: boolean;
};

function CheckBox({ onChange, punchId, checked }: Prop) {
  return (
    <input
      id={punchId}
      className="buttonForSelection"
      type="checkbox"
      onChange={onChange}
      checked={checked}
    ></input>
  );
}

export default CheckBox;
