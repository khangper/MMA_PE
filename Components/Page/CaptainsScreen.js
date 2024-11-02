import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPlayers } from "../utils/api";

export default function CaptainsScreen({ navigation }) {
  const [captains, setCaptains] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const calculateAge = (yearOfBirth) => {
    const currentYear = new Date().getFullYear();
    return currentYear - yearOfBirth;
  };

  useEffect(() => {
    const fetchCaptains = async () => {
      try {
        const response = await getPlayers();
        console.log(response.data); // Kiểm tra dữ liệu trả về

        // Lọc những cầu thủ là đội trưởng và trên 34 tuổi
        const filteredCaptains = response.data
          .filter((player) => player.isCaptain && calculateAge(player.YoB) > 34)
          .sort((a, b) => a.MinutesPlayed - b.MinutesPlayed);
        setCaptains(filteredCaptains);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCaptains();
  }, []);

  useEffect(() => {
    // Load danh sách yêu thích từ AsyncStorage khi màn hình được mount
    const loadFavorites = async () => {
      const favoriteList =
        JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      setFavorites(favoriteList);
    };
    loadFavorites();
  }, []);

  const toggleFavorite = async (player) => {
    try {
      let updatedFavorites = [...favorites];
      const index = updatedFavorites.findIndex((item) => item.id === player.id);

      if (index !== -1) {
        // Nếu cầu thủ đã có trong danh sách yêu thích, hỏi xác nhận để xóa
        Alert.alert(
          "Remove Favorite",
          `Are you sure you want to remove ${player.playerName} from favorites?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Yes",
              onPress: async () => {
                updatedFavorites.splice(index, 1);
                setFavorites(updatedFavorites);
                await AsyncStorage.setItem(
                  "favorites",
                  JSON.stringify(updatedFavorites)
                );
              },
            },
          ]
        );
      } else {
        // Nếu cầu thủ chưa có trong danh sách yêu thích, thêm vào danh sách
        Alert.alert(
          "Add Favorite",
          `Do you want to add ${player.playerName} to favorites?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Yes",
              onPress: async () => {
                updatedFavorites.push(player);
                setFavorites(updatedFavorites);
                await AsyncStorage.setItem(
                  "favorites",
                  JSON.stringify(updatedFavorites)
                );
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={captains}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.playerRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Detail", { player: item })}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.playerName}>{item.playerName}</Text>
              <Text>Minutes Played: {item.MinutesPlayed}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <Text style={styles.favoriteIcon}>
                {favorites.find((fav) => fav.id === item.id) ? "❤️" : "♡"}
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
