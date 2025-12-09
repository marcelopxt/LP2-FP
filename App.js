import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Header from "./src/components/Header";
import Home from "./src/screens/Home";
import Edit from "./src/screens/Edit";
import Show from "./src/screens/Show";
import Create from "./src/screens/Create";

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
            name="Home"
            component={Home}
            options={{ tabBarLabel: "Início" }}
          />
          <Tab.Screen
            name="Create"
            component={Create}
            options={{ tabBarLabel: "Cadastrar" }}
          />
          <Tab.Screen
            name="Show"
            component={Show}
            options={{ tabBarLabel: "Visualizar" }}
          />
          <Tab.Screen
            name="Edit"
            component={Edit}
            options={{ tabBarLabel: "Editar" }}
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
