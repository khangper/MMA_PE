// // screens/FavoriteScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function FavoriteScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from AsyncStorage whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const favoriteList =
            JSON.parse(await AsyncStorage.getItem("favorites")) || [];
          setFavorites(favoriteList);
        } catch (error) {
          console.error("Error loading favorites:", error);
        }
      };
      loadFavorites();
    }, [])
  );

  // Toggle favorite state and save it to AsyncStorage
  const toggleFavorite = async (player) => {
    const isFavorite = favorites.some((fav) => fav.id === player.id);
    const action = isFavorite ? "Remove" : "Add";

    Alert.alert(
      `${action} Favorite`,
      `Are you sure you want to ${isFavorite ? "remove" : "add"} ${
        player.playerName
      } ${isFavorite ? "from" : "to"} favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            let updatedFavorites;
            if (isFavorite) {
              // Remove player from favorites
              updatedFavorites = favorites.filter(
                (item) => item.id !== player.id
              );
            } else {
              // Add player to favorites
              updatedFavorites = [...favorites, player];
            }
            setFavorites(updatedFavorites);
            await AsyncStorage.setItem(
              "favorites",
              JSON.stringify(updatedFavorites)
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View></View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.playerRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Detail", { player: item })}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                onError={(e) =>
                  console.error("Image load error:", e.nativeEvent.error)
                }
              />
              <Text style={styles.playerName}>{item.playerName}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <Text style={styles.favoriteIcon}>
                {favorites.some((fav) => fav.id === item.id) ? "❤️" : "♡"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  favoriteIcon: {
    fontSize: 20,
    color: "red",
  },
});
