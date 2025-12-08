import { StyleSheet, Text } from "react-native";
import { View } from "react-native-web";

export default function Footer() {
  return (
    <>
      <View style={styles.container}>
        <Text> Desenvolvido por Marcelo Peixoto </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 25,
    paddingTop: 25
  },
});
