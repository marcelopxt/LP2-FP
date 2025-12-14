import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Header from "./src/components/Header";
import Popular from "./src/screens/Popular";
import Library from "./src/screens/Library";
import Dashboard from "./src/screens/Dashboard";
import { LibraryProvider } from "./src/dao/LibraryContext";

export default function App() {
  const Tab = createBottomTabNavigator();

  return (
    <LibraryProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              header: () => <Header />,
              tabBarStyle: {
                backgroundColor: "#121212",
                borderTopWidth: 1,
                borderTopColor: "#00FF9D",
                height: 60,
                paddingBottom: 8,
                paddingTop: 8,
              },
              tabBarActiveTintColor: "#00FF9D",
              tabBarInactiveTintColor: "#005535",
              tabBarLabelStyle: {
                fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
                fontSize: 10,
                fontWeight: "bold",
              },
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === "Popular") {
                  iconName = focused ? "globe" : "globe-outline";
                } else if (route.name === "Dashboard") {
                  iconName = focused ? "stats-chart" : "stats-chart-outline";
                } else if (route.name === "Library") {
                  iconName = focused ? "save" : "save-outline";
                }

                return <Ionicons name={iconName} size={24} color={color} />;
              },
            })}
          >
            <Tab.Screen
              name="Popular"
              component={Popular}
              options={{ tabBarLabel: "NET.SEARCH" }}
            />
            <Tab.Screen
              name="Dashboard"
              component={Dashboard}
              options={{ tabBarLabel: "SYS.DATA" }}
            />
            <Tab.Screen
              name="Library"
              component={Library}
              options={{ tabBarLabel: "MEM.CARD" }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
      </View>
    </LibraryProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
});
