import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({
  navigation,
  fetchData, // Hàm để lấy dữ liệu từ API
  renderItemDetails, // Component hiển thị chi tiết từng item
  filterByKey, // Key để lọc theo thuộc tính (ví dụ: "team")
  titleKey, // Key cho tên hoặc tiêu đề (ví dụ: "playerName")
  favoriteKey, // Key để đánh dấu mục yêu thích (ví dụ: "isCaptain")
}) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filters, setFilters] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await fetchData();
        setItems(data);
        setFilteredItems(data);

        // Lấy các giá trị duy nhất của filterKey (ví dụ: "team")
        const uniqueFilters = [
          ...new Set(data.map((item) => item[filterByKey])),
        ];
        setFilters(uniqueFilters);
      } catch (error) {
        console.error(error);
      }
    };
    fetchItems();
  }, [fetchData]);

  // Hàm lọc item theo giá trị filter
  const filterItems = (filter) => {
    setSelectedFilter(filter);
    if (filter) {
      const filtered = items.filter((item) => item[filterByKey] === filter);
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  // Hàm thêm item vào danh sách yêu thích và lưu vào AsyncStorage
  const addToFavorites = async (item) => {
    try {
      const favoriteList =
        JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      await AsyncStorage.setItem(
        "favorites",
        JSON.stringify([...favoriteList, item])
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Thanh lọc theo thuộc tính (ví dụ: đội) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        <TouchableOpacity
          onPress={() => filterItems(null)}
          style={[
            styles.filterButton,
            !selectedFilter && styles.selectedFilter,
          ]}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => filterItems(filter)}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.selectedFilter,
            ]}
          >
            <Text style={styles.filterText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Danh sách các item */}
      <FlatList
        ref={flatListRef}
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Detail", { item })}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.itemTitle}>{item[titleKey]}</Text>
              {renderItemDetails(item)}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => addToFavorites(item)}>
              <Text style={styles.favoriteIcon}>❤️</Text>
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
  filterContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  filterButton: {
    width: 100,
    height: 50,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedFilter: {
    backgroundColor: "#4CAF50",
  },
  filterText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
  },
  itemRow: {
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
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  favoriteIcon: {
    fontSize: 20,
    color: "red",
  },
});

// const removeDuplicates = async () => {
//     try {
//       // Retrieve the data from AsyncStorage
//       const favoriteList =
//         JSON.parse(await AsyncStorage.getItem("favorites")) || [];

//       // Remove duplicates by using a Set with a unique key (like 'id')
//       const uniqueFavorites = favoriteList.filter(
//         (item, index, self) => index === self.findIndex((t) => t.id === item.id) // Replace 'id' with the unique key of your objects
//       );

//       // Save the updated array back to AsyncStorage
//       await AsyncStorage.setItem("favorites", JSON.stringify(uniqueFavorites));

//       Alert.alert("Success", "Duplicates have been removed from favorites.");
//     } catch (error) {
//       console.error("Error removing duplicates from AsyncStorage:", error);
//       Alert.alert("Error", "An error occurred while removing duplicates.");
//     }
//   };

// useEffect(() => {
//     const fetchPlayers = async () => {
//       try {
//         const response = await getPlayers();
//         const players = response.data;

//         // Lọc danh sách chỉ lấy các đội trưởng (isCaptain = true)
//         const captains = players.filter((player) => player.isCaptain);

//         // Cập nhật state chỉ với các đội trưởng
//         setPlayers(captains);
//         setFilteredPlayers(captains);

//         // Lấy danh sách các đội duy nhất từ các đội trưởng
//         const uniqueTeams = [...new Set(captains.map((p) => p.team))];
//         setTeams(uniqueTeams);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchPlayers();
//   }, []);
