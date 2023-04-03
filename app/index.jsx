import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Page() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Home" }} />
      <View style={styles.main}>
        <Text style={styles.title}>Hello World</Text>
        <Text style={styles.subtitle}>
          This application was created to learn about maps and location.
        </Text>
        <Link href={"/Map"}>
          <Button mode="contained">Go to Map</Button>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
