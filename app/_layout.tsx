import AuthProvider from "@/hooks/useAuth";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  PaperProvider,
  MD3LightTheme as PaperTheme,
  MD3DarkTheme as PaperDarkTheme,
} from "react-native-paper";
import Colors from "@/constants/Colors";
import { ThemeProp } from "react-native-paper/lib/typescript/types";
import Snackbar from "@/components/Snackbar";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(app)/index",
};

const theme: ThemeProp = {
  ...PaperTheme,
  colors: {
    primary: "rgb(80, 102, 0)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(205, 240, 106)",
    onPrimaryContainer: "rgb(22, 31, 0)",
    secondary: "rgb(91, 97, 71)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(223, 230, 196)",
    onSecondaryContainer: "rgb(24, 30, 9)",
    tertiary: "rgb(57, 102, 94)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(188, 236, 226)",
    onTertiaryContainer: "rgb(0, 32, 28)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(254, 252, 244)",
    onBackground: "rgb(27, 28, 23)",
    surface: "rgb(254, 252, 244)",
    onSurface: "rgb(27, 28, 23)",
    surfaceVariant: "rgb(227, 228, 211)",
    onSurfaceVariant: "rgb(70, 72, 60)",
    outline: "rgb(118, 120, 107)",
    outlineVariant: "rgb(198, 200, 184)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(48, 49, 44)",
    inverseOnSurface: "rgb(243, 241, 233)",
    inversePrimary: "rgb(178, 211, 81)",
    elevation: {
      level0: "transparent",
      level1: "rgb(245, 245, 232)",
      level2: "rgb(240, 240, 225)",
      level3: "rgb(235, 236, 217)",
      level4: "rgb(233, 234, 215)",
      level5: "rgb(230, 231, 210)",
    },
    surfaceDisabled: "rgba(27, 28, 23, 0.12)",
    onSurfaceDisabled: "rgba(27, 28, 23, 0.38)",
    backdrop: "rgba(47, 49, 39, 0.4)",
  },
};

const darkTheme: ThemeProp = {
  ...PaperDarkTheme,
  colors: {
    primary: "rgb(178, 211, 81)",
    onPrimary: "rgb(40, 53, 0)",
    primaryContainer: "rgb(59, 77, 0)",
    onPrimaryContainer: "rgb(205, 240, 106)",
    secondary: "rgb(195, 202, 169)",
    onSecondary: "rgb(45, 51, 28)",
    secondaryContainer: "rgb(67, 73, 49)",
    onSecondaryContainer: "rgb(223, 230, 196)",
    tertiary: "rgb(161, 208, 198)",
    onTertiary: "rgb(3, 55, 49)",
    tertiaryContainer: "rgb(32, 78, 71)",
    onTertiaryContainer: "rgb(188, 236, 226)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(27, 28, 23)",
    onBackground: "rgb(228, 227, 219)",
    surface: "rgb(27, 28, 23)",
    onSurface: "rgb(228, 227, 219)",
    surfaceVariant: "rgb(70, 72, 60)",
    onSurfaceVariant: "rgb(198, 200, 184)",
    outline: "rgb(144, 146, 132)",
    outlineVariant: "rgb(70, 72, 60)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(228, 227, 219)",
    inverseOnSurface: "rgb(48, 49, 44)",
    inversePrimary: "rgb(80, 102, 0)",
    elevation: {
      level0: "transparent",
      level1: "rgb(35, 37, 26)",
      level2: "rgb(39, 43, 28)",
      level3: "rgb(44, 48, 29)",
      level4: "rgb(45, 50, 30)",
      level5: "rgb(48, 54, 31)",
    },
    surfaceDisabled: "rgba(228, 227, 219, 0.12)",
    onSurfaceDisabled: "rgba(228, 227, 219, 0.38)",
    backdrop: "rgba(47, 49, 39, 0.4)",
  },
};

const navigationDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.secondary[500],
    card: Colors.secondary[500],
    primary: Colors.primary[600],
  },
};

const navigationLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary[500],
  },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider
      value={
        colorScheme === "dark" ? navigationDarkTheme : navigationLightTheme
      }
    >
      <PaperProvider theme={colorScheme === "dark" ? darkTheme : theme}>
        <Snackbar />
        <Slot />
      </PaperProvider>
    </ThemeProvider>
  );
}
