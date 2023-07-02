type Props = {
  specification: string;
};

function SpecificationTd({ specification }: Props) {
  const pdfName = specification.substring(specification.lastIndexOf("\\") + 1);

  console.log("pdfName");
  console.log(pdfName);

  const fullPath = `http://localhost:7070/resources/pdf/specification/${pdfName}`;

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
//   const fullPath = `http://localhost:8080/resources/pdf/inspection/${pdfName}`;

//   return (
//     <a href={fullPath} target="_blank">
//       {props.date}
//     </a>
//   );
// }
