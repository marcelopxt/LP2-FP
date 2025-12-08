import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Header from './src/components/Header';
import Footer from './src/components/Footer';
import { SafeAreaView } from 'react-native-web';
import Home from './src/screens/Home';

export default function App() {
  return (
    <SafeAreaView style={styles.area}>
      <Header/> 
      <View style={styles.conteudo}>
        <Home></Home>
      </View>
      <Footer/> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    flex: 1,
    width: '100%',
    backgroundColor: '#bebebeff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
