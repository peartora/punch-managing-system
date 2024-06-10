import { useState } from "react";

import { PunchRowsProvider } from "@/common/contexts/punch-rows-context";

import { FilterController } from "./components/FilterController";
import { PunchController } from "./components/PunchController";

export function SearchForm() {
  const [params, setParams] = useState<URLSearchParams>(
    () => new URLSearchParams()
  );

  console.log(`in SearchForm`);
  console.log(`${params}`);

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
