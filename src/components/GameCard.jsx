import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GameCard({ game, cardWidth, getRatingColor }) {
    return (
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
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add-circle" size={32} color="#00FF9D" />
                </TouchableOpacity>
            </View>
        </View>
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
