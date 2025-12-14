import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { usePopularGames } from "../hooks/usePopularGames";
import SearchBar from "./SearchBar";
import { useLibrary } from "../contexts/LibraryContext";
import GameLibraryModal from "./GameLibraryModal";

export default function GameSearchModal({ visible, onClose }) {
    const {
        games,
        loading,
        search: confirmedSearch,
        setSearch: setConfirmedSearch,
        loadGames,
    } = usePopularGames();

    const { addToLibrary, getGameStatus, updateGame } = useLibrary();
    const [selectedGame, setSelectedGame] = useState(null);
    const [libraryModalVisible, setLibraryModalVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const displayGames = confirmedSearch.trim() === "" ? [] : games;

    const handleManualSubmit = () => {
        setConfirmedSearch(searchText);
        loadGames(true, searchText);
    };

    const handleManualClear = () => {
        setSearchText("");
        setConfirmedSearch("");
    };

    const handleAddPress = (game) => {
        setSelectedGame(game);
        setLibraryModalVisible(true);
    };

    const handleSaveLibrary = (details) => {
        const currentEntry = getGameStatus(selectedGame.id);
        if (currentEntry) {
            updateGame(selectedGame.id, details);
        } else {
            addToLibrary(selectedGame, details);
        }
        setLibraryModalVisible(false);
        onClose();
    };

    const renderItem = ({ item }) => {
        const status = getGameStatus(item.id);
        const isAdded = !!status;

        return (
            <View style={styles.listItem}>
                <Image
                    source={{
                        uri:
                            item.background_image ??
                            "https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg",
                    }}
                    style={styles.gameImage}
                />
                <View style={styles.gameInfo}>
                    <Text style={styles.gameTitle} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={styles.gameDate}>
                        {item.released?.substring(0, 4) || "N/A"}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddPress(item)}
                >
                    <Ionicons
                        name={isAdded ? "checkmark-circle" : "add-circle"}
                        size={32}
                        color={isAdded ? "#00FF9D" : "#ddd"}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalOverlay}
            >
                <TouchableOpacity style={styles.backgroundTouch} onPress={onClose} />
                <View style={styles.container}>
                    <View style={styles.handleBar} />

                    <View style={styles.header}>
                        <Text style={styles.title}>Adicionar Novo Jogo</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#888" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <SearchBar
                            search={searchText}
                            setSearch={setSearchText}
                            onSubmit={handleManualSubmit}
                            onClear={handleManualClear}
                        />
                    </View>

                    <FlatList
                        data={displayGames}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            !loading && (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>
                                        {confirmedSearch.length > 0
                                            ? "Nenhum jogo encontrado"
                                            : "Busque um jogo para adicionar"}
                                    </Text>
                                </View>
                            )
                        }
                    />

                    {loading && (
                        <BlurView intensity={30} tint="dark" style={styles.absoluteFill}>
                            <ActivityIndicator size="large" color="#00FF9D" />
                        </BlurView>
                    )}
                </View>
            </KeyboardAvoidingView>

            {selectedGame && (
                <GameLibraryModal
                    visible={libraryModalVisible}
                    onClose={() => setLibraryModalVisible(false)}
                    game={selectedGame}
                    currentEntry={getGameStatus(selectedGame.id)}
                    onSave={handleSaveLibrary}
                    onRemove={() => { }}
                />
            )}
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    backgroundTouch: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    container: {
        height: "80%",
        backgroundColor: "#1E1E1E",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
            web: {
                boxShadow: "0px -2px 3.84px rgba(0, 0, 0, 0.25)",
            },
        }),
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: "#444",
        borderRadius: 3,
        alignSelf: "center",
        marginBottom: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        color: "#fff",
        fontFamily: "monospace",
        fontWeight: "bold",
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2C2C2C",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    gameImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: "#333",
    },
    gameInfo: {
        flex: 1,
    },
    gameTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    gameDate: {
        color: "#aaa",
        fontSize: 12,
    },
    addButton: {
        padding: 5,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 50,
    },
    emptyText: {
        color: "#888",
        fontSize: 14,
        fontFamily: "monospace",
    },
    absoluteFill: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
});
