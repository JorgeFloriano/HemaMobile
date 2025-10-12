import LoginScreen from "@/src/screens/Login";
import React from "react";
import { StatusBar, View } from "react-native";

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <LoginScreen
        onLogin={(username, password) => console.log(username, password)}
      />
    </View>
  );
};

export default App;
