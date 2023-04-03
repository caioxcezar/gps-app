import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import Toast from 'react-native-toast-message';

export default function Layout() {
  return (
    <PaperProvider>
      <Stack
        initialRouteName="home"
        screenOptions={{
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Toast />
    </PaperProvider>
  );
}
