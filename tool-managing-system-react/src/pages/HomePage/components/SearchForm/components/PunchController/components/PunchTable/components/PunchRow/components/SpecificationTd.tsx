type Props = {
  specification: string;
};

export function SpecificationTd({ specification }: Props) {
  const pdfName = specification.substring(specification.lastIndexOf("\\") + 1);

  const fullPath = `/resources/pdf/specification/${pdfName}`;

  return (
    <td>
      <a href={fullPath} target="_blank">
        {pdfName}
      </a>
    </td>
  );
}
