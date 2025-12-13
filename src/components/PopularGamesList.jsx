import { useEffect, useState } from "react";
import { 
  FlatList, 
  Text, 
  View, 
  Image, 
  StyleSheet, 
  useWindowDimensions, 
  TouchableOpacity,
  ActivityIndicator 
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import { getPopularGames } from "../services/api";
import { saveGame } from "../services/storage";

export default function Popular() {
  const [games, setGames] = useState([]);
  const { width } = useWindowDimensions();
  const numColumns = width > 1100 ? 4 : width > 700 ? 3 : 1;
  const gap = 12; 
  const availableWidth = width - (20 * 2) - (gap * (numColumns - 1));
  const cardWidth = availableWidth / numColumns;

  useEffect(() => {
    async function getData() {
      const result = await getPopularGames();
      setGames(result);
    }
    getData();
  }, []);

  const handleAddGame = async (game) => {
   
  };
  const getRatingColor = (score) => {
    if (score >= 75) return "#6c3"; // Green
    if (score >= 50) return "#fc3"; // Yellow
    return "#f00"; // Red
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.scrolllist}
        key={numColumns}
        data={games}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={numColumns > 1 ? { gap: gap } : null}
        
        renderItem={({ item }) => (
          <View style={[styles.card, { width: cardWidth }]}>
            
            {/* Game Cover */}
            <Image 
              source={{ uri: item.background_image ??  'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg'}} 
              style={styles.cover} 
            />

            {/* Score Badge (Top Right) */}
            {item.metacritic && (
              <View style={[styles.badge, { borderColor: getRatingColor(item.metacritic) }]}>
                <Text style={[styles.score, { color: getRatingColor(item.metacritic) }]}>
                  {item.metacritic}
                </Text>
              </View>
            )}

            {/* Card Footer */}
            <View style={styles.cardFooter}>
              <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
              
              <TouchableOpacity 
                onPress={() => handleAddGame(item)}
                style={styles.addButton}
              >
                <Ionicons name="add-circle" size={32} color="#7000FF" />
              </TouchableOpacity>
            </View>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  listContent: {
    padding: 20,
    gap: 12, // Vertical gap
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS/Web
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cover: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  cardFooter: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between', // Push title left, button right
    alignItems: 'center',
  },
  title: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1, // Allow text to take space
    marginRight: 8,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  score: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  addButton: {
    // Increases touch area
    padding: 2,
  },
  scrolllist:{
    flex: 1
  }
});