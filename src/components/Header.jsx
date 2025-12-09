import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"; 
export default function Header() {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.leftContainer}
         onPress={()=>{ navigation.navigate('Home') }}>
        <Text style={styles.logoText}>Logo</Text>
        </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Title Here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 25,
  },
  leftContainer: {
    zIndex: 1,
  },
  logoText: {
    fontWeight: 'bold',
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 25,
    bottom: 0,
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: -1,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '600',
  }
});