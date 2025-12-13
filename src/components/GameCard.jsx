import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLibrary } from "../contexts/LibraryContext";
import GameLibraryModal from "./GameLibraryModal";

export default function GameCard({ game, cardWidth, getRatingColor }) {
    const { getGameStatus, addToLibrary, updateGame, removeFromLibrary } =
        useLibrary();
    const [modalVisible, setModalVisible] = useState(false);

    const libraryEntry = getGameStatus(game.id);
    const isInLibrary = !!libraryEntry;

    const handleSaveLibrary = (details) => {
        if (isInLibrary) {
            updateGame(game.id, details);
        } else {
            addToLibrary(game, details);
        }
    };

    const handleRemoveLibrary = () => {
        removeFromLibrary(game.id);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "played":
                return "checkmark-circle";
            case "playing":
                return "game-controller";
            case "backlog":
                return "list";
            case "dropped":
                return "close-circle";
            default:
                return "add-circle";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "played":
                return "#6c3";
            case "playing":
                return "#fc3";
            case "backlog":
                return "#00FF9D";
            case "dropped":
                return "#f00";
            default:
                return "#00FF9D";
        }
    };

    return (
        <>
            <View style={[styles.card, { width: cardWidth }]}>
                <Image
                    source={{
                        uri:
                            game.background_image ??
                            "https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg",
                    }}
                    style={styles.cover}
                />
                {game.metacritic && (
                    <View
                        style={[
                            styles.badge,
                            { borderColor: getRatingColor(game.metacritic) },
                        ]}
                    >
                        <Text
                            style={[styles.score, { color: getRatingColor(game.metacritic) }]}
                        >
                            {game.metacritic}
                        </Text>
                    </View>
                )}
                <View style={styles.cardFooter}>
                    <Text style={styles.title} numberOfLines={1}>
                        {game.name}
                    </Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons
                            name={isInLibrary ? getStatusIcon(libraryEntry.status) : "add-circle"}
                            size={32}
                            color={
                                isInLibrary ? getStatusColor(libraryEntry.status) : "#00FF9D"
                            }
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <GameLibraryModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                game={game}
                currentEntry={libraryEntry}
                onSave={handleSaveLibrary}
                onRemove={handleRemoveLibrary}
            />
        </>
    );
}

const styles = StyleSheet.create({
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
});
