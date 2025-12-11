import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Header from "./src/components/Header";
import Popular from "./src/screens/Popular";
import Library from "./src/screens/Library";
import Dashboard from "./src/screens/Dashboard";

export default function App() {
  const Tab = createBottomTabNavigator();

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            header: () => <Header />,
            tabBarStyle: { paddingBottom: 5, paddingTop: 5, height: 60 },
            tabBarActiveTintColor: "blue",
            tabBarInactiveTintColor: "gray",
          }}
        >
          <Tab.Screen
            name="Popular"
            component={Popular}
            options={{ tabBarLabel: "Popular" }}
          />
          <Tab.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ tabBarLabel: "Dashboard" }}
          />
          <Tab.Screen
            name="Library"
            component={Library}
            options={{ tabBarLabel: "Library" }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
