import { useState, useEffect } from "react";
import { getPopularGames } from "../services/api";

export function usePopularGames() {
    const [games, setGames] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [sortBy, setSortBy] = useState("relevance");

    async function loadGames(isNewSearch = false, searchOverride = undefined) {
        if (loading) return;
        if (!isNewSearch && !hasMore) return;

        setLoading(true);

        const currentPage = isNewSearch ? 1 : page;
        const querySearch = searchOverride !== undefined ? searchOverride : search;

        const result = await getPopularGames({
            page: currentPage,
            search: querySearch,
            genre: selectedGenre,
            ordering: sortBy === "relevance" ? null : sortBy,
        });

        if (isNewSearch) {
            setHasMore(true);
        }

        if (result.length === 0) {
            setHasMore(false);
        }

        if (currentPage === 1) {
            setGames(result);
        } else {
            setGames((prevGames) => [...prevGames, ...result]);
        }

        setLoading(false);
    }

    useEffect(() => {
        if (page > 1) loadGames();
    }, [page]);

    useEffect(() => {
        setPage(1);
        loadGames(true);
    }, [selectedGenre, sortBy]);

    const handleSearchSubmit = () => {
        setPage(1);
        loadGames(true);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handleClearSearch = () => {
        setSearch("");
        loadGames(true, "");
    };

    return {
        games,
        loading,
        hasMore,
        search,
        setSearch,
        selectedGenre,
        setSelectedGenre,
        sortBy,
        setSortBy,
        page,
        loadGames,
        handleSearchSubmit,
        handleLoadMore,
        handleClearSearch,
    };
}
