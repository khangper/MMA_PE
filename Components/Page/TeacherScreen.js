import React from "react";
import HomeScreen from "../Page/HomePE";
import { fetchTeachers } from "../utils/api";
import { Text } from "react-native";

const renderTeacherDetails = (player, calculateAge) => (
  <>
    {/* <Text>Students: {teacher.students}</Text>
    <Text>Courses: {teacher.courses}</Text>
    <Text>Category: {teacher.category}</Text> */}
    <Text>Name: {player.playerName}</Text>
    <Text>Age: {calculateAge(player.YoB)}</Text>
  </>
);

export default function TeacherScreen({ navigation }) {
  const calculateAge = (yearOfBirth) => {
    const currentYear = new Date().getFullYear();
    return currentYear - yearOfBirth;
  };
  return (
    <HomeScreen
      navigation={navigation}
      fetchData={fetchTeachers}
      renderItemDetails={(item) => renderTeacherDetails(item, calculateAge)}
      filterByKey="team"
      titleKey="name"
    />
  );
}
