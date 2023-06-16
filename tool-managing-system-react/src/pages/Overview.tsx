import NavBar from "@/components/NavBar";
import { useDisplay } from "@/common/hooks";

const OverViewList = () => {
  const { rows } = useDisplay();
  return (
    <div>
      <ol>
        {rows.map((m) => {
          return <li key={m.punchId}>{m.punchId}</li>;
        })}
      </ol>
    </div>
  );
};

export default function Overview() {
  return (
    <div>
      <NavBar />
      <OverViewList />
    </div>
  );
}
