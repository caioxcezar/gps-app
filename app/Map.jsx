import { useEffect, useState } from "react";
import React, { Dimensions, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Card, TextInput } from "react-native-paper";
import { getCurrentLocation, searchAddress } from "../modules/location";
import { Button } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const map = () => {
  const [txtStart, setTxtStart] = useState("");
  const [txtEnd, setTxtEnd] = useState("");
  const [searchField, setSearchField] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState({});
  const [showRoute, setShowRoute] = useState(false);

  useEffect(() => {
    getCurrentLocation().then(setLocation);
  }, []);

  const setRegion = (result) => {
    try {
      const { width, height } = Dimensions.get("window");
      const ASPECT_RATIO = width / height;

      const lat = Number(result.lat);
      const lng = Number(result.lon);
      const northeastLat = Number(result.boundingbox[1]);
      const southwestLat = Number(result.boundingbox[0]);
      const latDelta = northeastLat - southwestLat;
      const lngDelta = latDelta * ASPECT_RATIO;

      setLocation({
        latitude: lat,
        longitude: lng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      });
      setSearchResults([]);

      switch (searchField) {
        case "txtStart":
          setTxtStart(result.display_name);
          setMarkers({
            ...markers,
            initial: {
              latitude: lat,
              longitude: lng,
            },
          });
          break;
        case "txtEnd":
          setTxtEnd(result.display_name);
          setMarkers({
            ...markers,
            end: {
              latitude: lat,
              longitude: lng,
            },
          });
          break;
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.message || error,
      });
    }
  };

  const traceRoute = () => {
    let valid = Object.keys(markers).length > 1;
    if (valid) return setShowRoute(true);
    Toast.show({ text1: "Please, provide at least 2 valid locations" });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={txtStart}
        onChangeText={setTxtStart}
        mode="outlined"
        style={styles.textLocation}
        label="Initial Location"
        right={
          <TextInput.Icon
            icon="crosshairs-gps"
            onPress={async () => {
              if (txtStart.length < 10)
                return Toast.show({
                  type: "error",
                  text1: "Text have to contain at least 10 characters",
                });
              const results = await searchAddress(txtStart);
              setSearchField("txtStart");
              setSearchResults(results);
            }}
          />
        }
      />
      <TextInput
        value={txtEnd}
        onChangeText={setTxtEnd}
        mode="outlined"
        style={styles.textDestination}
        label="Destination"
        right={
          <TextInput.Icon
            icon="crosshairs-gps"
            onPress={async () => {
              if (txtStart.length < 10)
                return Toast.show({
                  type: "error",
                  text1: "Text have to contain at least 10 characters",
                });
              const results = await searchAddress(txtEnd);
              setSearchField("txtEnd");
              setSearchResults(results);
            }}
          />
        }
      />
      <View style={styles.searchResults}>
        <ScrollView>
          {searchResults.map((result) => (
            <Card
              key={result.place_id}
              style={styles.card}
              onPress={() => setRegion(result)}
            >
              <Card.Title title={result.display_name} />
            </Card>
          ))}
        </ScrollView>
      </View>
      <Button mode="contained" style={styles.button} onPress={traceRoute}>
        Trace Route
      </Button>
      <MapView style={styles.map} region={location}>
        {Object.keys(markers).map((l) => (
          <Marker
            key={l}
            style={styles.map}
            title={`Location: ${l}`}
            coordinate={{
              latitude: markers[l].latitude,
              longitude: markers[l].longitude,
            }}
          />
        ))}
        {showRoute && (
          <Polyline
            coordinates={[markers.initial, markers.end]}
            strokeColor="#000"
            strokeColors={["#7F0000"]}
            strokeWidth={6}
          />
        )}
      </MapView>
    </View>
  );
};

export default map;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  textLocation: { marginTop: 5, marginHorizontal: 5 },
  textDestination: { marginVertical: 5, marginHorizontal: 5 },
  searchResults: { maxHeight: Dimensions.get("window").height * 0.5 },
  card: { marginHorizontal: 5, marginBottom: 5 },
  button: { marginBottom: 5, marginHorizontal: 5 },
});
