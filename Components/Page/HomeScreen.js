// // Components/Page/HomeScreen.js
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   TextInput,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getPlayers } from "../utils/api";

// export default function HomeScreen({ navigation }) {
//   const [players, setPlayers] = useState([]);
//   const [filteredPlayers, setFilteredPlayers] = useState([]);
//   const [teamFilter, setTeamFilter] = useState("");

//   useEffect(() => {
//     const fetchPlayers = async () => {
//       try {
//         const response = await getPlayers();
//         // const sortedPlayers = response.data.sort((a, b) => b.id - a.id); // Sắp xếp giảm dần theo id
//         // setPlayers(sortedPlayers);
//         // setFilteredPlayers(sortedPlayers);
//         const player = response.data;
//         setFilteredPlayers(player);
//         setPlayers(player);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchPlayers();
//   }, []);

//   // Hàm lọc cầu thủ theo đội
//   const filterByTeam = (team) => {
//     setTeamFilter(team);
//     if (team) {
//       const filtered = players.filter(
//         (player) => player.team.toLowerCase() === team.toLowerCase()
//       );
//       setFilteredPlayers(filtered);
//     } else {
//       setFilteredPlayers(players);
//     }
//   };

//   // Hàm thêm cầu thủ vào danh sách yêu thích và lưu vào AsyncStorage
//   const addToFavorites = async (player) => {
//     try {
//       const favoriteList =
//         JSON.parse(await AsyncStorage.getItem("favorites")) || [];
//       await AsyncStorage.setItem(
//         "favorites",
//         JSON.stringify([...favoriteList, player])
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Hàm tính tuổi từ năm sinh (YoB)
//   const calculateAge = (yearOfBirth) => {
//     const currentYear = new Date().getFullYear();
//     return currentYear - yearOfBirth;
//   };

//   return (
//     <View style={styles.container}>
//       {/* Ô nhập để lọc theo đội */}
//       <TextInput
//         style={styles.input}
//         placeholder="Nhập tên đội để lọc..."
//         value={teamFilter}
//         onChangeText={(text) => filterByTeam(text)}
//       />

//       {/* Danh sách cầu thủ */}
//       <FlatList
//         data={setFilteredPlayers}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.playerRow}>
//             <TouchableOpacity
//               onPress={() => navigation.navigate("Detail", { player: item })}
//             >
//               <Image source={{ uri: item.image }} style={styles.image} />
//               <Text style={styles.playerName}>
//                 {item.playerName} {item.isCaptain && "(Captain)"}
//               </Text>
//               <Text style={styles.position}>Position: {item.position}</Text>
//               <Text style={styles.age}>Age: {calculateAge(item.YoB)}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => addToFavorites(item)}>
//               <Text style={styles.favoriteIcon}>❤️</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// useEffect(() => {
//   const fetchPlayers = async () => {
//     try {
//       const response = await getPlayers();
//       const players = response.data;

//       // Lọc danh sách chỉ lấy các đội trưởng (isCaptain = true)
//       const captains = players.filter((player) => player.isCaptain);

//       // Cập nhật state chỉ với các đội trưởng
//       setPlayers(captains);
//       setFilteredPlayers(captains);

//       // Lấy danh sách các đội duy nhất từ các đội trưởng
//       const uniqueTeams = [...new Set(captains.map((p) => p.team))];
//       setTeams(uniqueTeams);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   fetchPlayers();
// }, []);

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f0f0f0",
//     padding: 10,
//   },
//   input: {
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//   },
//   playerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   image: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
//   },
//   playerName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   position: {
//     fontSize: 14,
//     color: "#666",
//   },
//   age: {
//     fontSize: 14,
//     color: "#666",
//   },
//   favoriteIcon: {
//     fontSize: 20,
//     color: "red",
//   },
// });
// Components/Page/HomeScreen.js
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
import { getPlayers } from "../utils/api";

export default function HomeScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null); // Đội được chọn
  const [teams, setTeams] = useState([]); // Danh sách các đội

  // Tạo ref cho FlatList
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await getPlayers();
        const player = response.data;
        setPlayers(player);
        setFilteredPlayers(player);

        // Lấy danh sách các đội duy nhất từ danh sách cầu thủ
        const uniqueTeams = [...new Set(player.map((p) => p.team))];
        setTeams(uniqueTeams);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlayers();
  }, []);

  // Hàm lọc cầu thủ theo đội
  const filterByTeam = (team) => {
    setSelectedTeam(team); // Cập nhật đội được chọn
    if (team) {
      const filtered = players.filter(
        (player) => player.team.toLowerCase() === team.toLowerCase()
      );
      setFilteredPlayers(filtered);
    } else {
      setFilteredPlayers(players); // Hiển thị toàn bộ cầu thủ nếu không có bộ lọc
    }

    // Cuộn FlatList về đầu trang mỗi khi bộ lọc thay đổi
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  // Hàm thêm cầu thủ vào danh sách yêu thích và lưu vào AsyncStorage
  const addToFavorites = async (player) => {
    try {
      const favoriteList =
        JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      await AsyncStorage.setItem(
        "favorites",
        JSON.stringify([...favoriteList, player])
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Hàm tính tuổi từ năm sinh (YoB)
  const calculateAge = (yearOfBirth) => {
    const currentYear = new Date().getFullYear();
    return currentYear - yearOfBirth;
  };

  return (
    <View style={styles.container}>
      {/* Danh sách các đội để lọc */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.teamContainer}
      >
        <TouchableOpacity
          onPress={() => filterByTeam(null)}
          style={[styles.teamButton, !selectedTeam && styles.selectedTeam]}
        >
          <Text style={styles.teamText}>All Teams</Text>
        </TouchableOpacity>
        {teams.map((team) => (
          <TouchableOpacity
            key={team}
            onPress={() => filterByTeam(team)}
            style={[
              styles.teamButton,
              selectedTeam === team && styles.selectedTeam,
            ]}
          >
            <Text style={styles.teamText}>{team}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Danh sách cầu thủ */}
      <FlatList
        ref={flatListRef} // Thêm ref cho FlatList
        data={filteredPlayers} // Hiển thị danh sách đã lọc
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.playerRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Detail", { player: item })}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.playerName}>
                {item.playerName} {item.isCaptain && "(Captain)"}
              </Text>
              <Text style={styles.position}>Position: {item.position}</Text>
              <Text style={styles.age}>Age: {calculateAge(item.YoB)}</Text>
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
  teamContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  teamButton: {
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
  selectedTeam: {
    backgroundColor: "#4CAF50", // Màu xanh lá nổi bật khi được chọn
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  teamText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    textAlign: "center", // Căn giữa văn bản theo chiều ngang
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
  position: {
    fontSize: 14,
    color: "#666",
  },
  age: {
    fontSize: 14,
    color: "#666",
  },
  favoriteIcon: {
    fontSize: 20,
    color: "red",
  },
});
