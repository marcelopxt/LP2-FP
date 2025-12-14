import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View, Platform, StatusBar } from "react-native"; 
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>SAVE_POINT_SYSTEM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 90,
    flexDirection: 'row',
    alignItems: 'flex-end', 
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#00FF9D',
  },
  leftContainer: {
    zIndex: 1,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 15,
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: -1,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00FF9D',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
    textTransform: 'uppercase',
  }
});