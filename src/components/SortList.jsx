import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function SortList({ sortBy, onSortChange }) {
    return (
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
                    onPress={() => onSortChange(sort.id)}
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
    );
}

const styles = StyleSheet.create({
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
});
