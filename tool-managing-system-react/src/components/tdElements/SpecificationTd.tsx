type Props = {
  specification: string;
};

function SpecificationTd({ specification }: Props) {
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

export default SpecificationTd;

// type Props = {
//   path: string;
//   date?: string;
// };

// export default function AElement(props: Props) {
//   const { path } = props;
//   const pdfName = path.substring(path.lastIndexOf("\\") + 1);
//   const fullPath = `/resources/pdf/inspection/${pdfName}`;

//   return (
//     <a href={fullPath} target="_blank">
//       {props.date}
//     </a>
//   );
// }
