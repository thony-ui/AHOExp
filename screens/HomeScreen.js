import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { Switch } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import {
  Box,
  Center,
  Flex,
  ZStack,
  Image,
  Button,
} from "native-base";
import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import useAuth from "../hooks/useAuth";
import { EventRegister } from "react-native-event-listeners";

const HomeScreen = () => {
  const { user, logout } = useAuth();

  const [darkMode, setDarkMode] = useState(true);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    EventRegister.emit("changeThemeEvent", darkMode);
  };

  const userId = user?.providerData[0]?.uid;
  const [text, setText] = useState("");
  const [goal, setGoal] = useState([]);
  const [qod, setQod] = useState([]);
  const [check, setCheck] = useState(false);

  const categories = ['inspire','management','sports','life','funny','love','art','students']

  const quotes = async () => {
    const index = Math.floor(Math.random() * categories.length)
    await fetch(`https://quotes.rest/qod?category=${categories[index]}`)
      .then((res) => res.json())
      .then((data) => setQod(data.contents.quotes))
      .catch((error) => console.log(error));

    setCheck(true);
  };

  const submitGoal = async () => {
    if (text.trim() == "" || goal.length > 2) return;
    setText("");
    await addDoc(collection(db, "users", userId, "GoalsForTheDay"), {
      goal: text,
      id: userId,
    });
  };

  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", userId, "GoalsForTheDay"),
        (snapshot) => setGoal(snapshot.docs)
      ),
    [db, "GoalsForTheDay"]
  );

  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: colors.card }}>
      <ScrollView>
        <Box mx="2" my="2">
          <Flex direction="row" justify="space-between" align="center">
            <TouchableOpacity style={tw`w-25`} onPress={logout}>
              <Image
                source={{
                  uri: user?.photoURL,
                }}
                alt="image"
                size={50}
                borderRadius={100}
              />
            </TouchableOpacity>

            <TextInput
              style={[tw`w-57 h-10`, { color: colors.text }]}
              onChangeText={(text) => setText(text)}
              value={text}
              placeholder="Enter your 2 Goals for the day!"
              placeholderTextColor={colors.text}
            />
          </Flex>
        </Box>
        <Flex direction="row" justify="space-between" mx="2" my="3">
          <Flex direction="column" space={3}>
            <Switch
              value={darkMode}
              onValueChange={toggleDark}
              style={tw`mb-2`}
            />
            {darkMode ? (
              <Ionicons name="sunny" size={24} color="#F9D71C" />
            ) : (
             
              <Ionicons name="moon" size={24} color="white" />
            )}
          </Flex>
          <Button
            shadow={2}
            width="100"
            height="10"
            onPress={submitGoal}
            bg="emerald.300"
            _text={{
              color: "black",
            }}
          >
            Enter
          </Button>
        </Flex>

        <Box mx="auto" mt="10">
          <Box>
            <ZStack mt="3" ml={-50}>
              <Box bg="primary.700" size="200" rounded="lg" shadow={3} p="3">
                <Flex direction="row" justify="space-between">
                  <Center
                    borderRadius={100}
                    size={100}
                    bg="white"
                    _text={{
                      fontWeight: "bold",
                      fontSize: "lg",
                    }}
                  >
                    AHO
                  </Center>
                </Flex>
              </Box>

              <Box
                bg="primary.500"
                mt="20"
                ml="5"
                size="200"
                rounded="lg"
                shadow={5}
                p="2"
              >
                <Text style={tw`text-lg`}>Welcome {user?.displayName}</Text>
              </Box>
              <Box
                bg="primary.300"
                mt="40"
                ml="10"
                size="200"
                rounded="lg"
                shadow={7}
                p="3"
                _text={{
                  fontSize: "md",
                  fontWeight: "medium",
                  color: "black",
                  letterSpacing: "lg",
                  fontStyle: "italic",
                }}
              >
                2 Goals for Today
                {goal.map((g, i) => (
                  <View
                    key={g.id}
                    style={tw`flex flex-row mb-2 items-center w-30 pr-1`}
                  >
                    <Text>{i + 1}. </Text>
                    <Text>{g.data().goal} </Text>
                    <TouchableOpacity
                      style={tw`bg-green-100 rounded-lg ml-1`}
                      onPress={async () =>
                        await deleteDoc(
                          doc(db, "users", userId, "GoalsForTheDay", g.id)
                        )
                      }
                    >
                      <Text style={tw`p-1`}>Done</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </Box>
            </ZStack>
          </Box>
        </Box>

        <Box mt="400" mx="3" bg={colors.card} mb="40">
          <TouchableOpacity style={tw`p-2 rounded-lg mx-5`} onPress={quotes}>
            <Text
              style={[
                tw`font-bold italic text-lg text-center`,
                { color: colors.text },
              ]}
            >
              Click for quote of the day
            </Text>
          </TouchableOpacity>
          <Box
            mx="auto"
            _text={{
              fontWeight: "medium",
              color: colors.text,
            }}
          >
            {qod[0]?.quote}
            <Box mt="3" _text={{ color: colors.text }}>
              {check && (
                <>
                <Text style={{ color: colors.text }}>
                  Author: {qod[0].author}
                </Text>
                <Text style={{ color: colors.text }}>
                  Title: {qod[0].title}
                </Text>
                </>
              )}
              {check && (
                <Text style={{ color: colors.text }}>
                  CopyRight: TheySaidSoQuotes
                </Text>
              )}
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
