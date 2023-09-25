import { snackbarAtom } from "@/stores/ui";
import { useAtom } from "jotai";
import React from "react";
import { Snackbar as PaperSnackbar, Portal } from "react-native-paper";

type Props = {};

export default function Snackbar({}: Props) {
  const [snackbar, setSnackbar] = useAtom(snackbarAtom);

  const onDismissSnackBar = () => setSnackbar({ visible: false });

  return (
    <Portal>
      <PaperSnackbar
        visible={snackbar.visible}
        onDismiss={onDismissSnackBar}
        duration={snackbar.duration || 3000}
        action={{
          label: "Tamam",
          onPress: onDismissSnackBar,
        }}
      >
        {snackbar.message}
      </PaperSnackbar>
    </Portal>
  );
}
