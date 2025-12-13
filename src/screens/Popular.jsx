import { View, StyleSheet } from "react-native"; 
import PopularGamesList from "../components/PopularGamesList";

export default function Popular() {
  return(
    <View style={styles.container}> 
      <PopularGamesList/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  }
});