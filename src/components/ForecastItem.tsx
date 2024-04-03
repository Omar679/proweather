import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { WeatherForcast } from "../../App";
import dayjs from "dayjs";
import { BlurView } from 'expo-blur';


const ForecastItem = ({ forecastData }: { forecastData: WeatherForcast }) => {
  return (
    <BlurView intensity={70} style={styles.container}>
        
      <Text style={styles.temp}>{Math.round(forecastData.main.temp)}°</Text>
      <Text style={styles.date}>
        {dayjs(forecastData.dt * 1000).format("ddd ha")}
      </Text>
    </BlurView>
  );
};

export default ForecastItem;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "ghostwhite",
    padding: 10,
    aspectRatio: 9 / 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow:'hidden',
    borderColor:'gainsboro',
    borderWidth:StyleSheet.hairlineWidth
  },
  temp: {
    fontSize: 35,
    color: "white",
  },
  date: {
    fontWeight: "bold",
    color: "white",marginVertical:10
  },
});
