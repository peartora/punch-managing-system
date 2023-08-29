/* eslint-disable react-refresh/only-export-components */

import { useMemo, useState, memo, ComponentType, ComponentProps } from "react";

const memo = <T extends ComponentType<any>>(Component: T) => {
  return (props: ComponentProps<T>) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const memoizedElement = useMemo(() => <Component {...props} />, [...props]);

    return memoizedElement;
  };
};

const Child = (props: { name: string }) => {
  return <div>name: {props.name}</div>;
};

const MemoizedChild = memo(Child);

const Parent = () => {
  const [state, setState] = useState(0);
  const rerender = () => setState(state + 1);

  const name = "kim";

  return (
    <div>
      <button onClick={rerender}>Rerender!</button>
      <MemoizedChild name={name} />
    </div>
  );
};

const Parent2 = () => {
  const [state, setState] = useState(0);
  const rerender = () => setState(state + 1);

  const name = "kim";

  const memoizedChild = useMemo(() => <Child name={name} />, [name]);

  return (
    <div>
      <button onClick={rerender}>Rerender!</button>
      {memoizedChild}
    </div>
  );
};
