import * as Location from "expo-location";
import Toast from "react-native-toast-message";

const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted")
    Toast.show({
      type: "success",
      text1: "Request sent successfully!",
    });

  const { coords } = await Location.getCurrentPositionAsync({});
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    latitudeDelta: 3,
    longitudeDelta: 3,
  };
};

const searchAddress = async (address) => {
  const res = await fetch(`https://nominatim.openstreetmap.org/?addressdetails=1&q=${address}&format=json&limit=5`);
  const json = await res.json();
  return json;
};

export { getCurrentLocation, searchAddress };
