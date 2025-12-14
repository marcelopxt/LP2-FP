import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

const GENRES = [
    { id: "action", name: "Ação" },
    { id: "adventure", name: "Aventura" },
    { id: "role-playing-games-rpg", name: "RPG" },
    { id: "shooter", name: "Tiro" },
    { id: "indie", name: "Indie" },
    { id: "strategy", name: "Estratégia" },
];

export default function GenreList({ selectedGenre, onSelectGenre }) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.genreList}
        >
            <TouchableOpacity
                style={[styles.chip, selectedGenre === null && styles.chipSelected]}
                onPress={() => onSelectGenre(null)}
            >
                <Text
                    style={[
                        styles.chipText,
                        selectedGenre === null && styles.chipTextSelected,
                    ]}
                >
                    TODOS
                </Text>
            </TouchableOpacity>

            {GENRES.map((genre) => (
                <TouchableOpacity
                    key={genre.id}
                    style={[
                        styles.chip,
                        selectedGenre === genre.id && styles.chipSelected,
                    ]}
                    onPress={() => onSelectGenre(genre.id)}
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
    );
}

export { GENRES };

const styles = StyleSheet.create({
    genreList: {
        flexDirection: "row",
        marginBottom: 10,
    },
    chip: {
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#009c27ff",
        marginRight: 10,
        backgroundColor: "#0a0a0a",
    },
    chipSelected: {
        backgroundColor: "#00FF9D",
        borderColor: "#00FF9D",
    },
    chipText: {
        color: "#009c27ff",
        fontFamily: "monospace",
        fontWeight: "bold",
    },
    chipTextSelected: {
        color: "#121212",
    },
});
