
import { StyleSheet} from "react-native";
import React, { useState, useEffect } from "react";
import StackNavigator from "./StackNavigator";
import { AuthProvider } from "./hooks/useAuth";
import { NativeBaseProvider } from "native-base";
import { EventRegister } from "react-native-event-listeners";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const [darkApp, setDarkApp] = useState(false);
  const toggleTheme = darkApp ? DarkTheme : DefaultTheme;

  useEffect(() => {
    const eventListener = EventRegister.addEventListener(
      "changeThemeEvent",
      (data) => {
        setDarkApp(data);
      }
    );
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer theme={toggleTheme}>
        <NativeBaseProvider>
          <StackNavigator />
        </NativeBaseProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
