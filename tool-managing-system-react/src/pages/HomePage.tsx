import FilterablePunchTable from "@/components/FilterablePunchTable";
import NavBar from "@/components/NavBar";
import SearchForm from "@/components/formElement/SearchForm";

export default function HomePage() {
  return (
    <main>
      <NavBar />
      <br />
      <br />
      <FilterablePunchTable />
    </main>
  );
}
