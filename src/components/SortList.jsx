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
            <Text style={styles.sortLabel}>ORDENAR:</Text>
            {[
                { id: "relevance", name: "Relevância" },
                { id: "-created", name: "Data de adição" },
                { id: "name", name: "Nome" },
                { id: "-released", name: "Lançamento" },
                { id: "-added", name: "Popularidade" },
                { id: "-rating", name: "Nota média" },
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
        color: "#038a37ff",
        fontFamily: "monospace",
        fontWeight: "bold",
        marginRight: 10,
    },
    sortChip: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#009c27ff",
        marginRight: 8,
        backgroundColor: "#0a0a0a",
    },
    sortChipSelected: {
        backgroundColor: "#005535",
        borderColor: "#005535",
    },
    sortChipText: {
        color: "#009c27ff",
        fontFamily: "monospace",
        fontSize: 12,
        fontWeight: "bold",
    },
    sortChipTextSelected: {
        color: "#00FF9D",
    },
});
