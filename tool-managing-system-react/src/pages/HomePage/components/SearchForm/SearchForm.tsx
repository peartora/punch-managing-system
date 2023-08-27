import { useState } from "react";

import FilterController from "@/components/punch-table/FilterController";
import { PunchRowsProvider } from "@/context/punch-rows-context";

import { PunchController } from "./components/PunchController";

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
