import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function SpecificationTd({ children }: Props) {
  return <td>{children}</td>;
}

export default SpecificationTd;
