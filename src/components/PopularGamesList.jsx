import { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getPopularGames } from "../services/api";
import { BlurView } from "expo-blur";

const GENRES = [
  { id: "action", name: "Action" },
  { id: "adventure", name: "Adventure" },
  { id: "role-playing-games-rpg", name: "RPG" },
  { id: "shooter", name: "Shooter" },
  { id: "indie", name: "Indie" },
  { id: "strategy", name: "Strategy" },
];

export default function PopularGamesList() {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortBy, setSortBy] = useState("-metacritic");
  const { width } = useWindowDimensions();
  const numColumns = width > 1100 ? 4 : width > 700 ? 3 : 1;
  const gap = 12;
  const availableWidth = width - 20 * 2 - gap * (numColumns - 1);
  const cardWidth = availableWidth / numColumns;

  async function loadGames(isNewSearch = false, searchOverride = undefined) {
    if (loading) return;
    if (!isNewSearch && !hasMore) return;

    setLoading(true);

    const currentPage = isNewSearch ? 1 : page;
    const querySearch = searchOverride !== undefined ? searchOverride : search;

    const result = await getPopularGames({
      page: currentPage,
      search: querySearch,
      genre: selectedGenre,
      ordering: sortBy,
    });

    if (isNewSearch) {
      setHasMore(true);
    }

    if (result.length === 0) {
      setHasMore(false);
    }

    if (currentPage === 1) {
      setGames(result);
    } else {
      setGames((prevGames) => [...prevGames, ...result]);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (page > 1) loadGames();
  }, [page]);

  useEffect(() => {
    setPage(1);
    loadGames(true);
  }, [selectedGenre, sortBy]);

  const handleSearchSubmit = () => {
    setPage(1);
    loadGames(true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const getRatingColor = (score) => {
    if (score >= 75) return "#6c3";
    if (score >= 50) return "#fc3";
    return "#f00";
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#00FF9D"
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={styles.input}
            placeholder="SEARCH_GAMES..."
            placeholderTextColor="#005535"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearch("");
                loadGames(true, "");
              }}
            >
              <Ionicons name="close" size={20} color="#00FF9D" />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.genreList}
        >
          <TouchableOpacity
            style={[styles.chip, selectedGenre === null && styles.chipSelected]}
            onPress={() => setSelectedGenre(null)}
          >
            <Text
              style={[
                styles.chipText,
                selectedGenre === null && styles.chipTextSelected,
              ]}
            >
              ALL
            </Text>
          </TouchableOpacity>

          {GENRES.map((genre) => (
            <TouchableOpacity
              key={genre.id}
              style={[
                styles.chip,
                selectedGenre === genre.id && styles.chipSelected,
              ]}
              onPress={() => setSelectedGenre(genre.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedGenre === genre.id && styles.chipTextSelected,
                ]}
              >
                {genre.name.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sortList}
          contentContainerStyle={styles.sortListContent}
        >
          <Text style={styles.sortLabel}>SORT BY:</Text>
          {[
            { id: "-metacritic", name: "TOP RATED" },
            { id: "-released", name: "NEWEST" },
            { id: "name", name: "NAME" },
            { id: "-rating", name: "USER RATING" },
          ].map((sort) => (
            <TouchableOpacity
              key={sort.id}
              style={[
                styles.sortChip,
                sortBy === sort.id && styles.sortChipSelected,
              ]}
              onPress={() => setSortBy(sort.id)}
            >
              <Text
                style={[
                  styles.sortChipText,
                  sortBy === sort.id && styles.sortChipTextSelected,
                ]}
              >
                {sort.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {(search.length > 0 || selectedGenre) && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>
            {search.length > 0 && selectedGenre
              ? `Results for "${search}" in ${GENRES.find((g) => g.id === selectedGenre)?.name
              }`
              : search.length > 0
                ? `Results for "${search}"`
                : `Genre: ${GENRES.find((g) => g.id === selectedGenre)?.name}`}
          </Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <FlatList
          style={styles.scrolllist}
          key={numColumns}
          data={games}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={[
            styles.listContent,
            games.length === 0 && styles.emptyListContent,
          ]}
          columnWrapperStyle={numColumns > 1 ? { gap: gap } : null}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading &&
            hasMore &&
            page > 1 && <ActivityIndicator size="large" color="#00FF9D" />
          }
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="game-controller-outline"
                  size={64}
                  color="#005535"
                />
                <Text style={styles.emptyText}>No games found</Text>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    setSearch("");
                    loadGames(true, "");
                  }}
                >
                  <Text style={styles.clearButtonText}>CLEAR FILTERS</Text>
                </TouchableOpacity>
              </View>
            )
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { width: cardWidth }]}>
              <Image
                source={{
                  uri:
                    item.background_image ??
                    "https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg",
                }}
                style={styles.cover}
              />
              {item.metacritic && (
                <View
                  style={[
                    styles.badge,
                    { borderColor: getRatingColor(item.metacritic) },
                  ]}
                >
                  <Text
                    style={[
                      styles.score,
                      { color: getRatingColor(item.metacritic) },
                    ]}
                  >
                    {item.metacritic}
                  </Text>
                </View>
              )}
              <View style={styles.cardFooter}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.name}
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                >
                  <Ionicons name="add-circle" size={32} color="#00FF9D" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {loading && page === 1 && (
          <BlurView intensity={50} tint="dark" style={styles.absoluteFill}>
            <ActivityIndicator size="large" color="#00FF9D" />
          </BlurView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  filterContainer: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: "#121212",
    borderBottomWidth: 1,
    borderBottomColor: "#005535",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    borderWidth: 1,
    borderColor: "#00FF9D",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: "#00FF9D",
    fontFamily: "monospace",
    fontSize: 16,
  },
  genreList: {
    flexDirection: "row",
    marginBottom: 10,
  },
  sortList: {
    flexDirection: "row",
  },
  sortListContent: {
    alignItems: "center",
  },
  sortLabel: {
    color: "#005535",
    fontFamily: "monospace",
    fontWeight: "bold",
    marginRight: 10,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#005535",
    marginRight: 8,
    backgroundColor: "#0a0a0a",
  },
  sortChipSelected: {
    backgroundColor: "#005535",
    borderColor: "#005535",
  },
  sortChipText: {
    color: "#005535",
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "bold",
  },
  sortChipTextSelected: {
    color: "#00FF9D",
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#005535",
    marginRight: 10,
    backgroundColor: "#0a0a0a",
  },
  chipSelected: {
    backgroundColor: "#00FF9D",
    borderColor: "#00FF9D",
  },
  chipText: {
    color: "#005535",
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  chipTextSelected: {
    color: "#121212",
  },
  feedbackContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: "#0a0a0a",
  },
  feedbackText: {
    color: "#00FF9D",
    fontFamily: "monospace",
    fontSize: 12,
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    color: "#005535",
    fontSize: 18,
    fontFamily: "monospace",
    marginTop: 10,
    marginBottom: 20,
  },
  clearButton: {
    backgroundColor: "#005535",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#00FF9D",
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    borderWidth: 1,
    borderColor: "#333",
  },
  cover: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  cardFooter: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#E0E0E0",
    fontSize: 14,
    fontFamily: "monospace",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  score: {
    fontSize: 10,
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  addButton: {
    padding: 4,
  },
  absoluteFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});