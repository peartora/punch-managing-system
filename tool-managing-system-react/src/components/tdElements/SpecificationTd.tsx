type Props = {
  specification: string;
};

function SpecificationTd({ specification }: Props) {
  console.log("specification");
  console.log(specification);

  // const pdfName = specification.substring(specification.lastIndexOf("\\") + 1);
  // const fullPath = `http://localhost:8080/resources/pdf/${pdfName}`;

  return (
    <td>
      <a href={specification}>{specification}</a>
    </td>
  );
}

export default SpecificationTd;
