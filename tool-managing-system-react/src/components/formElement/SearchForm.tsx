import { useState } from "react";

import FilterController from "@/components/punch-table/FilterController";
import PunchController from "@/components/punch-table/PunchController";

function SearchForm() {
  const [params, setParams] = useState<URLSearchParams>(
    () => new URLSearchParams()
  );

  return (
    <>
      <FilterController setParams={setParams} />

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <PunchController params={params} />
    </>
  );
}

export default SearchForm;
