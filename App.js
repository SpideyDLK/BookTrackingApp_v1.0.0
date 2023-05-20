import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import OnboardingScreen from "./app/screens/OnboardingScreen";
import LoginScreen from "./app/screens/LoginScreen";
import SignUpScreen from "./app/screens/SignUpScreen";

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="OnboardingScreen"
          component={OnboardingScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="LoginScreen"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="SignUpScreen"
          component={SignUpScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
