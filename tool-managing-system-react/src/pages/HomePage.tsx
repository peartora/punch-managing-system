import FilterablePunchTable from "@/components/FilterablePunchTable";
import NavBar from "@/components/NavBar";
import SearchForm from "@/components/form-element/SearchForm";

export default function HomePage() {
  return (
    <main>
      <NavBar />
      <br />
      <br />

      <SearchForm />
      <br />
      <br />
      <br />

      <FilterablePunchTable />
    </main>
  );
}
