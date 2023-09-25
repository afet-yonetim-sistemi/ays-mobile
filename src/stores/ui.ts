import { atom } from "jotai";

// this is the atom that will hold the state of the UI such as snackbar, modal, etc

export type SnackbarAtomType = {
  visible: boolean;
  message?: string;
  severity?: "success" | "error" | "warning" | "info";
  duration?: number;
};
export const snackbarAtom = atom<SnackbarAtomType>({
  visible: false,
  message: "",
  severity: "success",
  duration: 3000,
});
