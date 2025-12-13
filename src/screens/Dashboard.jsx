import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useLibrary } from "../contexts/LibraryContext";
import {
  PieChart,
  BarChart,
  LineChart,
  ProgressChart,
} from "react-native-chart-kit";

export default function Dashboard() {
  const { library, loading } = useLibrary();
  const { width: windowWidth } = useWindowDimensions();
  const isLargeScreen = windowWidth > 800;
  const padding = 20;
  const gap = 20;
  const contentWidth = windowWidth - padding * 2;
  const columnCount = isLargeScreen ? 2 : 1;
  const safeWidth = contentWidth - (isLargeScreen ? 25 : 0);
  const cardWidth = (safeWidth - gap * (columnCount - 1)) / columnCount;
  const chartWidth = cardWidth - 32;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00FF9D" />
      </View>
    );
  }

  if (library.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Add games to your library to see stats!
        </Text>
      </View>
    );
  }

  const statusCounts = library.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  const totalGames = library.length;
  const completedGames = statusCounts["played"] || 0;
  const completionRate = totalGames > 0 ? completedGames / totalGames : 0;

  const pieData = [
    {
      name: "Played",
      population: statusCounts["played"] || 0,
      color: "#6c3",
      legendFontColor: "#bbb",
      legendFontSize: 12,
    },
    {
      name: "Playing",
      population: statusCounts["playing"] || 0,
      color: "#fc3",
      legendFontColor: "#bbb",
      legendFontSize: 12,
    },
    {
      name: "Backlog",
      population: statusCounts["backlog"] || 0,
      color: "#00FF9D",
      legendFontColor: "#bbb",
      legendFontSize: 12,
    },
    {
      name: "Dropped",
      population: statusCounts["dropped"] || 0,
      color: "#f00",
      legendFontColor: "#bbb",
      legendFontSize: 12,
    },
  ].filter((item) => item.population > 0);

  const ratingBuckets = [0, 0, 0, 0, 0];
  library.forEach(
    (item) => ratingBuckets[Math.min(Math.floor((item.rating || 0) / 2), 4)]++
  );
  const ratingData = {
    labels: ["0-2", "2-4", "4-6", "6-8", "8-10"],
    datasets: [{ data: ratingBuckets }],
  };

  const platformCounts = {};
  library.forEach((item) =>
    item.game.parent_platforms?.forEach(
      (p) =>
        (platformCounts[p.platform.name] =
          (platformCounts[p.platform.name] || 0) + 1)
    )
  );
  const sortedPlatforms = Object.entries(platformCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const platformData = {
    labels: sortedPlatforms.map((p) => p[0].substring(0, 10)),
    datasets: [{ data: sortedPlatforms.map((p) => p[1]) }],
  };

  const genreCounts = {};
  library.forEach((item) =>
    item.game.genres?.forEach(
      (g) => (genreCounts[g.name] = (genreCounts[g.name] || 0) + 1)
    )
  );
  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const genreData = {
    labels: sortedGenres.map((g) => g[0].substring(0, 10)),
    datasets: [{ data: sortedGenres.map((g) => g[1]) }],
  };

  const decades = {};
  library.forEach((item) => {
    if (item.game.released)
      decades[Math.floor(parseInt(item.game.released) / 10) * 10] =
        (decades[Math.floor(parseInt(item.game.released) / 10) * 10] || 0) + 1;
  });
  const sortedDecades = Object.keys(decades).sort();
  const decadeData = {
    labels: sortedDecades.map((d) => `${d}s`),
    datasets: [{ data: sortedDecades.map((d) => decades[d]) }],
  };

  const metaSum = { played: [], playing: [], backlog: [], dropped: [] };
  library.forEach((i) => {
    if (i.game.metacritic) metaSum[i.status]?.push(i.game.metacritic);
  });
  const metaData = {
    labels: ["Played", "Playing", "Backlog", "Dropped"],
    datasets: [
      {
        data: ["played", "playing", "backlog", "dropped"].map((s) =>
          metaSum[s].length
            ? metaSum[s].reduce((a, b) => a + b, 0) / metaSum[s].length
            : 0
        ),
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#1E1E1E",
    backgroundGradientTo: "#1E1E1E",
    color: (opacity = 1) => `rgba(0, 255, 157, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(180, 180, 180, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    decimalPlaces: 0,
    propsForLabels: { fontSize: 10 },
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Analytics</Text>
      <View
        style={[
          styles.grid,
          {
            flexDirection: isLargeScreen ? "row" : "column",
            flexWrap: "wrap",
            gap,
          },
        ]}
      >
        <View
          style={[
            styles.card,
            { width: attributeWidth(isLargeScreen, cardWidth, "half") },
          ]}
        >
          <Text style={styles.cardTitle}>Stats Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ProgressChart
                data={{ labels: ["Done"], data: [completionRate] }}
                width={80}
                height={80}
                strokeWidth={10}
                radius={30}
                chartConfig={{
                  ...chartConfig,
                  color: (o) => `rgba(102, 204, 51, ${o})`,
                }}
                hideLegend={true}
              />
              <Text style={styles.statLabel}>Completion</Text>
            </View>
            <View style={styles.statTextContainer}>
              <Text style={styles.bigNumber}>{totalGames}</Text>
              <Text style={styles.subText}>Total Games</Text>
            </View>
            <View style={styles.statTextContainer}>
              <Text style={[styles.bigNumber, { color: "#fc3" }]}>
                {statusCounts["playing"] || 0}
              </Text>
              <Text style={styles.subText}>Playing</Text>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.card,
            { width: attributeWidth(isLargeScreen, cardWidth, "half") },
          ]}
        >
          <Text style={styles.cardTitle}>Library Status</Text>
          <PieChart
            data={pieData}
            width={chartWidth}
            height={200}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"0"}
            center={[10, 0]}
            absolute
          />
        </View>
        <View style={[styles.card, { width: cardWidth }]}>
          <Text style={styles.cardTitle}>Your Ratings</Text>
          <BarChart
            data={ratingData}
            width={chartWidth}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            fromZero
            showValuesOnTopOfBars
            withInnerLines={false}
          />
        </View>
        <View style={[styles.card, { width: cardWidth }]}>
          <Text style={styles.cardTitle}>Top Genres</Text>
          {sortedGenres.length > 0 ? (
            <BarChart
              data={genreData}
              width={chartWidth}
              height={240}
              yAxisLabel=""
              chartConfig={{ ...chartConfig, barPercentage: 0.6 }}
              verticalLabelRotation={30}
              fromZero
              showValuesOnTopOfBars
              withInnerLines={false}
            />
          ) : (
            <Text style={styles.noData}>No data</Text>
          )}
        </View>
        <View style={[styles.card, { width: cardWidth }]}>
          <Text style={styles.cardTitle}>Platforms</Text>
          {sortedPlatforms.length > 0 ? (
            <BarChart
              data={platformData}
              width={chartWidth}
              height={240}
              yAxisLabel=""
              chartConfig={{ ...chartConfig, barPercentage: 0.6 }}
              verticalLabelRotation={30}
              fromZero
              showValuesOnTopOfBars
              withInnerLines={false}
            />
          ) : (
            <Text style={styles.noData}>No data</Text>
          )}
        </View>
        <View style={[styles.card, { width: cardWidth }]}>
          <Text style={styles.cardTitle}>Collection by Era</Text>
          <LineChart
            data={decadeData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            withInnerLines={false}
          />
        </View>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function attributeWidth(isLarge, cardWidth, type) {
  if (!isLarge) return "100%";
  return cardWidth;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  content: { padding: 20 },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    color: "#fff",
    fontFamily: "monospace",
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 0,
  },
  cardTitle: {
    color: "#888",
    fontSize: 13,
    fontFamily: "monospace",
    fontWeight: "bold",
    marginBottom: 15,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 150,
  },
  statItem: {
    alignItems: "center",
  },
  statTextContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  bigNumber: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  subText: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "monospace",
  },
  statLabel: {
    color: "#666",
    fontSize: 10,
    marginTop: 4,
    fontFamily: "monospace",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    fontFamily: "monospace",
  },
  noData: {
    color: "#444",
    fontStyle: "italic",
    marginTop: 20,
    alignSelf: "center",
  },
});
