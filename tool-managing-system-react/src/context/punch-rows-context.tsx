import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { PunchRow } from "@/common/types";
import { useDisplay } from "@/common/hooks";

type PunchRowsContextValue = {
  isLoading: boolean;
  rows: ReadonlyArray<PunchRow>;
  punchRowsById: Record<string, PunchRow>;
  refetch: () => void;

  selection: Record<string, boolean>;
  isAllSelected: boolean;
  selectedIds: ReadonlyArray<string>;
  toggleAll: () => void;
  toggle: (id: string) => void;
};

const PunchRowsContext = createContext<PunchRowsContextValue>(
  undefined as unknown as PunchRowsContextValue
);

// eslint-disable-next-line react-refresh/only-export-components
export const usePunchRows = () => {
  const value = useContext(PunchRowsContext);
  if (value == null) {
    throw new Error("반드시 PunchRowsContext 아래서 사용해야 합니다.");
  }

  return value;
};

export const PunchRowsProvider = (props: {
  children: ReactNode;
  params?: URLSearchParams;
}) => {
  const { rows, refetch, isLoading } = useDisplay(props.params);

  const punchRowsById = useMemo<Record<string, PunchRow>>(
    () =>
      rows.reduce((acc, row) => {
        acc[row.punchId] = row;
        return acc;
      }, {} as Record<string, PunchRow>),
    [rows]
  );

  const [selection, setSelection] = useState<Record<string, boolean>>(() =>
    rows.reduce((acc, row) => {
      acc[row.punchId] = false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  useEffect(() => {
    const newSelection = rows.reduce((acc, row) => {
      acc[row.punchId] = false;
      return acc;
    }, {} as Record<string, boolean>);
    setSelection(newSelection);
  }, [rows]);

  const selectedIds = Object.entries(selection)
    .filter(([, value]) => value)
    .map(([key]) => key);

  const isAllSelected = rows.length === selectedIds.length;

  const toggleAll = useCallback(() => {
    const nextSelection = rows.reduce((acc, row) => {
      acc[row.punchId] = !isAllSelected;
      return acc;
    }, {} as Record<string, boolean>);
    setSelection(nextSelection);
  }, [isAllSelected, rows]);

  const toggle = useCallback(
    (id: string) => {
      const nextSelection = {
        ...selection,
        [id]: !selection[id],
      };
      setSelection(nextSelection);
    },
    [selection]
  );

  const value = useMemo<PunchRowsContextValue>(
    () => ({
      isLoading,
      rows,
      punchRowsById,
      refetch,
      selection,
      isAllSelected,
      selectedIds,
      toggle,
      toggleAll,
    }),
    [
      isAllSelected,
      isLoading,
      punchRowsById,
      refetch,
      rows,
      selectedIds,
      selection,
      toggle,
      toggleAll,
    ]
  );

  return (
    <PunchRowsContext.Provider value={value}>
      {props.children}
    </PunchRowsContext.Provider>
  );
};
