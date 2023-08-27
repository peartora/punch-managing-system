import { useState } from "react";

import FilterController from "@/components/punch-table/FilterController";
import PunchController from "@/components/punch-table/PunchController";
import { PunchRowsProvider } from "@/context/punch-rows-context";

export function SearchForm() {
  const [params, setParams] = useState<URLSearchParams>(
    () => new URLSearchParams()
  );

  return (
    <>
      <FilterController setParams={setParams} />

      <br />
      <br />
      <br />

      <PunchRowsProvider params={params}>
        <PunchController />
      </PunchRowsProvider>
    </>
  );
}
