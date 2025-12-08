import { StyleSheet } from "react-native";
import { Text } from "react-native";
import { View } from "react-native-web";

export default function Header() {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.logo}>Logo</Text>
        <Text style={styles.title}> Title Here </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    paddingBottom: 25,
  },
  logo:{
    fontSize: 30
  },
  title:{
    fontSize: 40
  }
});
