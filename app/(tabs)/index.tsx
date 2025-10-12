import OrderCreate from "@/src/screens/OrderCreate";
import React from "react";
import { StatusBar, View } from "react-native";

const App = () => {
  return (
    <View style={{ flex: 1}}>
      <StatusBar barStyle="light-content" />
      <OrderCreate />
    </View>
  );
};

export default App;