import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
    const [library, setLibrary] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLibrary();
    }, []);

    const loadLibrary = async () => {
        try {
            const storedLibrary = await AsyncStorage.getItem('@game_library');
            if (storedLibrary) {
                setLibrary(JSON.parse(storedLibrary));
            }
        } catch (error) {
            console.error('Failed to load library:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveLibrary = async (newLibrary) => {
        try {
            await AsyncStorage.setItem('@game_library', JSON.stringify(newLibrary));
            setLibrary(newLibrary);
        } catch (error) {
            console.error('Failed to save library:', error);
        }
    };

    const addToLibrary = async (game, details) => {
        const newEntry = {
            game,
            ...details,
            dateAdded: new Date().toISOString(),
        };
        const newLibrary = [...library, newEntry];
        await saveLibrary(newLibrary);
    };

    const updateGame = async (gameId, details) => {
        const newLibrary = library.map((entry) =>
            entry.game.id === gameId ? { ...entry, ...details } : entry
        );
        await saveLibrary(newLibrary);
    };

    const removeFromLibrary = async (gameId) => {
        const newLibrary = library.filter((entry) => entry.game.id !== gameId);
        await saveLibrary(newLibrary);
    };

    const getGameStatus = (gameId) => {
        return library.find((entry) => entry.game.id === gameId);
    };

    return (
        <LibraryContext.Provider
            value={{
                library,
                loading,
                addToLibrary,
                updateGame,
                removeFromLibrary,
                getGameStatus,
            }}
        >
            {children}
        </LibraryContext.Provider>
    );
};

export const useLibrary = () => useContext(LibraryContext);
