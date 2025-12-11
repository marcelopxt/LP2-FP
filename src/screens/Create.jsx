import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Create() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    async function salvarDados() {
        try {
            const pessoa = {
                id: Date.now().toString(),
                name: name,
                email: email
            }
            const response = await AsyncStorage.getItem('@pessoas');
            const dadosAnteriores = response ? JSON.parse(response) : [];
            const dados = [...dadosAnteriores, pessoa];
            await AsyncStorage.setItem("@pessoas", JSON.stringify(dados));
            alert("Cadastro realizado!");
            console.log(dados);
            setName('');
            setEmail('');
        } catch (error) {
            console.log("Erro ao salvar:", error);
            alert("Ops, erro ao salvar.");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}> Register </Text>
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TouchableOpacity style={styles.button} onPress={salvarDados}>
                <Text style={styles.textbutton}>Save</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        gap: 15,
        alignItems: 'center',
        marginTop: 250,
        fontSize: 26,
    },
    input: {
        backgroundColor: "#c5c1c1ff",
        fontSize: 14,
        width: 290,
        height: 45,
        padding: 5,
        borderRadius: 5
    },
    button: {
        borderRadius: 20,
        marginTop: 15,
        backgroundColor: "#2d4783ff",
        width: 160,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textbutton: {
        fontSize: 20,
        color: "#FFF",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        margin: 20
    },
});