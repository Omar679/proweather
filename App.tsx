import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import ForecastItem from "./src/components/ForecastItem";
import LottieView from "lottie-react-native";

//find unsplash image api based on location
//

// const URL = `https://api.openweathermap.org/data/2.5/weather?lat=9.0563&lon=7.4985&appid=06e589b836f503e4b924fc8a24058d03&units=metric`;
const BASE_URL = `https://api.openweathermap.org/data/2.5`;
const OPEN_WEATHER_API_KEY = process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY;

type MainWather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
};
type Weather = {
  name: string;
  main: MainWather;
  weather: [
    {
      main: string;
    }
  ];
};
export type WeatherForcast = {
  main: MainWather;
  dt: number;
};

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState("");
  const [weather, setWeather] = useState<Weather>();
  const [forecast, setForecast] = useState<WeatherForcast[]>();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  useEffect(() => {
    if (location) {
      fetchData();
      fetchForcast();
    }
  }, [location]);

  const fetchData = async () => {
    if (!location) {
      return;
    }

    const result = await fetch(
      `${BASE_URL}/weather/?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
    );
    const data = await result.json();
    setWeather(data);
  };
  const fetchForcast = async () => {
    if (!location) {
      return;
    }
    // https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=06e589b836f503e4b924fc8a24058d03
    const result = await fetch(
      `${BASE_URL}/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
    );
    const data = await result.json();
    setForecast(data.list);
    // console.log(JSON.stringify(data, null, 2));
  };

  if (!weather) {
    return <ActivityIndicator />;
  }

  const imageBacground =
    "https://plus.unsplash.com/premium_photo-1669809948017-518b5d800d73?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <ImageBackground source={{ uri: imageBacground }} style={styles.container}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0,0,0.7)",
        }}
      />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <LottieView
          source={
            weather.weather[0].main == "Rain"
              ? require("./assets/lottie/rain1.json")
              : require("./assets/lottie/sunny.json")
          }
          autoPlay
          style={{ width: 200, aspectRatio: 1 }}
        />
        <Text style={styles.location}>{weather.name}</Text>
        <Text style={styles.temp}>{Math.round(weather.main.temp)}°</Text>
        <Text style={styles.location}>{weather.weather[0].main}</Text>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ height: 200, flexGrow: 0, marginBottom: 40 }}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 10 }}
        data={forecast}
        renderItem={({ item }) => <ForecastItem forecastData={item} />}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  location: { fontSize: 30, color: "lightgray" },
  temp: { fontSize: 150, color: "white" },
});
