import React from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { usePopularGames } from "../hooks/usePopularGames";
import GameCard from "./GameCard";
import SearchBar from "./SearchBar";
import GenreList, { GENRES } from "./GenreList";
import SortList from "./SortList";

export default function PopularGamesList() {
  const {
    games,
    loading,
    hasMore,
    search,
    setSearch,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    page,
    handleSearchSubmit,
    handleLoadMore,
    handleClearSearch,
  } = usePopularGames();

  const { width } = useWindowDimensions();
  const numColumns = width > 1100 ? 4 : width > 700 ? 3 : 1;
  const gap = 12;
  const availableWidth = width - 20 * 2 - gap * (numColumns - 1);
  const cardWidth = availableWidth / numColumns;

  const getRatingColor = (score) => {
    if (score >= 75) return "#6c3";
    if (score >= 50) return "#fc3";
    return "#f00";
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <SearchBar
          search={search}
          setSearch={setSearch}
          onSubmit={handleSearchSubmit}
          onClear={handleClearSearch}
        />
        <GenreList
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />
        <SortList sortBy={sortBy} onSortChange={setSortBy} />
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
                  onPress={handleClearSearch}
                >
                  <Text style={styles.clearButtonText}>CLEAR FILTERS</Text>
                </TouchableOpacity>
              </View>
            )
          }
          renderItem={({ item }) => (
            <GameCard
              game={item}
              cardWidth={cardWidth}
              getRatingColor={getRatingColor}
            />
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
