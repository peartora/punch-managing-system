import { useLayoutEffect, useRef } from "react";

type Prop = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  punchId: string;
  checked: boolean;
  indeterminate?: boolean;
};

function CheckBox({ onChange, punchId, checked, indeterminate }: Prop) {
  const ref = useRef<HTMLInputElement>(
    undefined as unknown as HTMLInputElement
  );

  useLayoutEffect(() => {
    if (indeterminate) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      id={punchId}
      className="form-check-input buttonForSelection"
      type="checkbox"
      onChange={onChange}
      checked={checked}
    ></input>
  );
}

export default CheckBox;
