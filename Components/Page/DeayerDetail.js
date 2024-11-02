// Components/Page/DetailScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DetailScreen({ route }) {
  const { player } = route.params || {};
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if the player is already a favorite
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const favoriteList =
        JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      const isFav = favoriteList.some((fav) => fav.id === player.id);
      setIsFavorite(isFav);
    };
    checkFavoriteStatus();
  }, [player.id]);

  // Toggle favorite status
  const toggleFavorite = async () => {
    try {
      const favoriteList =
        JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favoriteList.filter(
          (fav) => fav.id !== player.id
        );
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify(updatedFavorites)
        );
        setIsFavorite(false);
        Alert.alert(
          "Removed from Favorites",
          `${player.playerName} has been removed.`
        );
      } else {
        // Add to favorites
        favoriteList.push(player);
        await AsyncStorage.setItem("favorites", JSON.stringify(favoriteList));
        setIsFavorite(true);
        Alert.alert(
          "Added to Favorites",
          `${player.playerName} has been added.`
        );
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  if (!player) {
    return (
      <View style={styles.container}>
        <Text>No player data available</Text>
      </View>
    );
  }

  // Calculate age from year of birth (YoB)
  const calculateAge = (yearOfBirth) => {
    const currentYear = new Date().getFullYear();
    return currentYear - yearOfBirth;
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: player.image }} style={styles.image} />
      <Text style={styles.playerName}>{player.playerName}</Text>
      <Text style={styles.position}>Position: {player.position}</Text>
      <Text style={styles.age}>Age: {calculateAge(player.YoB)}</Text>
      <Text style={styles.minutesPlayed}>
        Minutes Played: {player.MinutesPlayed}
      </Text>
      <Text style={styles.team}>Team: {player.team}</Text>
      <Text style={styles.passingAccuracy}>
        Passing Accuracy: {(player.PassingAccuracy * 100).toFixed(2)}%
      </Text>
      <Text style={styles.isCaptain}>
        {player.isCaptain ? "Captain" : "Player"}
      </Text>
      <TouchableOpacity
        onPress={toggleFavorite}
        style={[
          styles.favoriteButton,
          { backgroundColor: isFavorite ? "#FFCCCC" : "#CCCCFF" },
        ]}
      >
        <Text
          style={[styles.favoriteText, { color: isFavorite ? "red" : "blue" }]}
        >
          {isFavorite ? "❤️ Remove from Favorites" : "♡ Add to Favorites"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  playerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  position: {
    fontSize: 16,
    color: "#666",
  },
  age: {
    fontSize: 16,
    color: "#666",
  },
  minutesPlayed: {
    fontSize: 16,
    color: "#666",
  },
  team: {
    fontSize: 16,
    color: "#666",
  },
  passingAccuracy: {
    fontSize: 16,
    color: "#666",
  },
  isCaptain: {
    fontSize: 16,
    color: "blue",
    fontWeight: "bold",
  },
  favoriteButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
  },
  favoriteText: {
    fontSize: 16,
  },
});
