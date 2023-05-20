import React, { useCallback, useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import Colors from "../config/colors.js";
import AppIntroSlider from "react-native-app-intro-slider";
import { Button } from "react-native-elements";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const OnboardingScreen = ({ navigation }) => {
  const [showRealApp, setShowRealApp] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(true);
  const slides = [
    {
      key: 1,
      title: "Welcome",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: require("../assets/onboarding_1.png"),
    },
    {
      key: 2,
      title: "Track Your Progress",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: require("../assets/onboarding_2.png"),
    },
    {
      key: 3,
      title: "Achievements",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
      image: require("../assets/onboarding_3.png"),
    },
  ];

  const [fontsLoaded] = useFonts({
    Rubik: require("../assets/fonts/rubik.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const renderItem = ({ item }) => {
    if (!fontsLoaded) {
      return null; // or render a loading spinner
    }
    return (
      <View style={styles.container} onLayout={onLayoutRootView}>
        <Text style={styles.title}>{item.title}</Text>
        <Image style={styles.image} source={item.image} />
        <Text style={styles.desc}>{item.text}</Text>
        {item.key == 3 && (
          <Button
            onPress={() => navigation.navigate("LoginScreen")}
            title="Get Started"
            buttonStyle={{
              backgroundColor: Colors.buttonColor,
              borderRadius: 30,
              height: 50,
            }}
            containerStyle={{
              width: "90%",
              borderRadius: 30,
              marginHorizontal: 50,
              marginVertical: 10,
              position: "absolute",
              top: 600,
            }}
            titleStyle={{ fontWeight: "bold", fontSize: 20 }}
          />
        )}
      </View>
    );
  };

  const _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={styles.text}>Next</Text>
      </View>
    );
  };
  const _renderSkipButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={styles.skipButton}>Skip</Text>
      </View>
    );
  };

  if (showRealApp) {
    return <App />;
  } else {
    return (
      <AppIntroSlider
        renderItem={renderItem}
        data={slides}
        showSkipButton={showSkipButton}
        showDoneButton={false}
        activeDotStyle={{ backgroundColor: Colors.white, width: 30 }}
        renderNextButton={_renderNextButton}
        renderSkipButton={_renderSkipButton}
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "80%",
    height: "50%",
    objectFit: "contain",
    alignSelf: "center",
    position: "absolute",
    top: 0,
  },
  text: {
    color: Colors.textColor,
    fontWeight: "900",
    fontSize: 15,
  },
  desc: {
    fontWeight: "900",
    fontSize: 20,
    textAlign: "center",
    position: "absolute",
    top: 450,
    color: Colors.white,
    width: 360,
  },
  title: {
    color: Colors.textColor,
    fontWeight: "heavy",
    fontSize: 40,
    position: "absolute",
    top: 360,
    alignSelf: "center",
    fontFamily: "Rubik",
  },
  skipButton: {
    color: Colors.white,
    fontWeight: "900",
    fontSize: 15,
  },
  getStartedBtn: {
    width: 210,
    height: 50,
    backgroundColor: Colors.buttonColor,
    position: "absolute",
    top: 600,
  },
});

export default OnboardingScreen;
