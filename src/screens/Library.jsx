import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    useWindowDimensions,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLibrary } from "../contexts/LibraryContext";
import GameCard from "../components/GameCard";
import GameSearchModal from "../components/GameSearchModal";
import { BlurView } from "expo-blur";

export default function Library() {
    const { library, loading } = useLibrary();
    const [isSearchModalVisible, setSearchModalVisible] = useState(false);
    const { width } = useWindowDimensions();

    const numColumns = width > 1100 ? 5 : width > 800 ? 4 : width > 600 ? 3 : 2;
    const gap = 12;
    const padding = 20;
    const availableWidth = width - padding * 2 - gap * (numColumns - 1);
    const cardWidth = availableWidth / numColumns;

    const getRatingColor = (score) => {
        if (score >= 75) return "#6c3";
        if (score >= 50) return "#fc3";
        return "#f00";
    };

    const EmptyLibrary = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="library-outline" size={80} color="#005535" />
            <Text style={styles.emptyTitle}>Your library is empty</Text>
            <Text style={styles.emptySubtitle}>
                Tap the + button to add games!
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={library}
                key={numColumns}
                keyExtractor={(item) => item.game.id.toString()}
                numColumns={numColumns}
                contentContainerStyle={[
                    styles.listContent,
                    library.length === 0 && styles.emptyListContent,
                ]}
                columnWrapperStyle={numColumns > 1 ? { gap: gap } : null}
                ListEmptyComponent={!loading && <EmptyLibrary />}
                renderItem={({ item }) => (
                    <GameCard
                        game={item.game}
                        cardWidth={cardWidth}
                        getRatingColor={getRatingColor}
                    />
                )}
            />
            {loading && (
                <BlurView intensity={50} tint="dark" style={styles.absoluteFill}>
                    <Text style={{ color: "#00FF9D" }}>Loading Library...</Text>
                </BlurView>
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setSearchModalVisible(true)}
            >
                <Ionicons name="add" size={30} color="#121212" />
            </TouchableOpacity>

            <GameSearchModal
                visible={isSearchModalVisible}
                onClose={() => setSearchModalVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    listContent: {
        padding: 20,
        gap: 12,
        paddingBottom: 80,
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
    emptyTitle: {
        color: "#00FF9D",
        fontSize: 20,
        fontFamily: "monospace",
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 8,
    },
    emptySubtitle: {
        color: "#005535",
        fontSize: 14,
        fontFamily: "monospace",
        textAlign: "center",
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
    fab: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#00FF9D",
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});