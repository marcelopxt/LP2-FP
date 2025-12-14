import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const STATUS_OPTIONS = [
    { id: "played", label: "Concluído", icon: "checkmark-circle", color: "#6c3" },
    { id: "playing", label: "Jogando", icon: "game-controller", color: "#fc3" },
    { id: "backlog", label: "Para Jogar", icon: "list", color: "#00FF9D" },
    { id: "dropped", label: "Abandonado", icon: "close-circle", color: "#f00" },
];

export default function GameLibraryModal({
    visible,
    onClose,
    game,
    currentEntry,
    onSave,
    onRemove,
}) {
    const [status, setStatus] = useState("played");
    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");

    useEffect(() => {
        if (visible) {
            if (currentEntry) {
                setStatus(currentEntry.status || "played");
                setRating(currentEntry.rating ? currentEntry.rating.toString() : "");
                setComment(currentEntry.comment || "");
            } else {
                setStatus("played");
                setRating("");
                setComment("");
            }
        }
    }, [visible, currentEntry]);

    const handleSave = () => {
        const score = parseFloat(rating);
        if (!status) return;

        onSave({
            status,
            rating: isNaN(score) ? null : score,
            comment,
        });
        onClose();
    };

    const handleRemove = () => {
        onRemove();
        onClose();
    };

    if (!game) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <BlurView intensity={90} tint="dark" style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title} numberOfLines={1}>
                            {currentEntry ? "Editar Entrada" : "Adicionar à Biblioteca"}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#E0E0E0" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body}>
                        <Text style={styles.gameTitle}>{game.name}</Text>

                        <Text style={styles.label}>Status</Text>
                        <View style={styles.statusContainer}>
                            {STATUS_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.statusOption,
                                        status === option.id && { borderColor: option.color, backgroundColor: option.color + '20' },
                                    ]}
                                    onPress={() => setStatus(option.id)}
                                >
                                    <Ionicons
                                        name={option.icon}
                                        size={20}
                                        color={status === option.id ? option.color : "#555"}
                                    />
                                    <Text
                                        style={[
                                            styles.statusLabel,
                                            status === option.id && { color: option.color },
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Nota (0-10)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 8.5"
                            placeholderTextColor="#555"
                            keyboardType="decimal-pad"
                            value={rating}
                            onChangeText={setRating}
                            maxLength={4}
                        />

                        <Text style={styles.label}>Comentário</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="O que você acha deste jogo?"
                            placeholderTextColor="#555"
                            multiline
                            value={comment}
                            onChangeText={setComment}
                        />
                    </ScrollView>

                    <View style={styles.footer}>
                        {currentEntry && (
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={handleRemove}
                            >
                                <Ionicons name="trash-outline" size={20} color="#f00" />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>SALVAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    content: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#1E1E1E",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#333",
        overflow: "hidden",
        maxHeight: "80%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    title: {
        fontSize: 18,
        fontFamily: "monospace",
        fontWeight: "bold",
        color: "#00FF9D",
        flex: 1,
    },
    gameTitle: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 20,
        fontWeight: "bold",
    },
    body: {
        padding: 16,
    },
    label: {
        color: "#aaa",
        fontSize: 14,
        fontFamily: "monospace",
        marginBottom: 8,
        marginTop: 10,
    },
    statusContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    statusOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#333",
        gap: 6,
    },
    statusLabel: {
        color: "#555",
        fontSize: 12,
        fontWeight: "bold",
    },
    input: {
        backgroundColor: "#121212",
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 8,
        padding: 12,
        color: "#fff",
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#333",
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    removeButton: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#f00",
        alignItems: "center",
        justifyContent: "center",
    },
    saveButton: {
        backgroundColor: "#005535",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    saveButtonText: {
        color: "#00FF9D",
        fontWeight: "bold",
        fontFamily: "monospace",
    },
});
