import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SearchBar({ search, setSearch, onSubmit, onClear }) {
    return (
        <View style={styles.searchBar}>
            <Ionicons
                name="search"
                size={20}
                color="#00FF9D"
                style={{ marginRight: 10 }}
            />
            <TextInput
                style={styles.input}
                placeholder="BUSCAR_JOGOS..."
                placeholderTextColor="#005535"
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={onSubmit}
                returnKeyType="search"
            />
            {search.length > 0 && (
                <TouchableOpacity onPress={onClear}>
                    <Ionicons name="close" size={20} color="#00FF9D" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
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
});
