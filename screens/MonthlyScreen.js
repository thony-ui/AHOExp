import useAuth from "../hooks/useAuth";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useTheme } from "@react-navigation/native";
import tw from "twrnc";

import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  serverTimestamp,
  query,
  setDoc,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { Box, Flex, Select } from "native-base";
import { Ionicons, AntDesign } from "@expo/vector-icons";

const MonthlyScreen = () => {
  const { user } = useAuth();

  const userId = user.providerData[0].uid;
  const navigation = useNavigation();
  const [total, setTotal] = useState(null);
  const [aim, setAim] = useState([]);
  const [category, setCategory] = useState(null);
  const categories = [
    "Housing",
    "Food",
    "Utilities",
    "Transportation",
    "Insurance",
    "Leisure",
    "All",
    "Overview",
  ];

  const totalAim = aim.filter((a) => a.data().id == userId);
  const getAim = totalAim.map((a) => parseFloat(a.data().goal));
  const subAim = aim.filter((a) => a.data().id !== userId);

  //housing

  const Housing = subAim.filter((a) => a.data().category === categories[0]);

  const priceOfHousing = Housing.map((price) => parseFloat(price.data().price));
  let housingPrices = 0;
  for (const ele of priceOfHousing) {
    housingPrices += ele;
  }

  const housingPrice = housingPrices;

  const overviewHouse = { category: categories[0], price: housingPrice };

  //food

  const Food = subAim.filter((a) => a.data().category == categories[1]);

  const Fooding = Food.map((price) => parseFloat(price.data().price));
  let FoodingPrices = 0;
  for (const ele of Fooding) {
    FoodingPrices += ele;
  }

  const FoodingPrice = FoodingPrices;
  const overviewFood = { category: categories[1], price: FoodingPrice };

  //utilities

  const Utilities = subAim.filter((a) => a.data().category == categories[2]);

  const Utiliting = Utilities.map((price) => parseFloat(price.data().price));
  let UtilityPrices = 0;
  for (const ele of Utiliting) {
    UtilityPrices += ele;
  }

  const UtilityPrice = UtilityPrices;
  const overviewUtility = { category: categories[2], price: UtilityPrice };

  //transportation

  const Transportation = subAim.filter(
    (a) => a.data().category == categories[3]
  );

  const Transporting = Transportation.map((price) =>
    parseFloat(price.data().price)
  );
  let TransportingPrices = 0;
  for (const ele of Transporting) {
    TransportingPrices += ele;
  }

  const TransportingPrice = TransportingPrices;
  const overviewTransport = {
    category: categories[3],
    price: TransportingPrice,
  };

  //insurance

  const Insurance = subAim.filter((a) => a.data().category == categories[4]);

  const Insurancing = Insurance.map((price) => parseFloat(price.data().price));
  let InsurancingPrices = 0;
  for (const ele of Insurancing) {
    InsurancingPrices += ele;
  }

  const InsurancePrice = InsurancingPrices;
  const overviewInsurance = { category: categories[4], price: InsurancePrice };

  //leisure

  const Leisure = subAim.filter((a) => a.data().category == categories[5]);

  const Leisuring = Leisure.map((price) => parseFloat(price.data().price));
  let LeisuringPrices = 0;
  for (const ele of Leisuring) {
    LeisuringPrices += ele;
  }

  const LeisuringPrice = LeisuringPrices;
  const overviewLeisure = { category: categories[5], price: LeisuringPrice };

  const overviewItems = [
    overviewHouse,
    overviewFood,
    overviewUtility,
    overviewTransport,
    overviewInsurance,
    overviewLeisure,
  ];

  const overviewTotal =
    LeisuringPrice +
    InsurancePrice +
    TransportingPrice +
    UtilityPrice +
    FoodingPrice +
    housingPrice;

  const HighestSpending = [
    LeisuringPrice,
    InsurancePrice,
    TransportingPrice,
    UtilityPrice,
    FoodingPrice,
    housingPrice,
  ];

  const highestPrice = Math.max(...HighestSpending);
  const nameOfItem = overviewItems.filter((item) => item.price == highestPrice);

  const subTotal = subAim.map((aim) => parseFloat(aim.data().price));

  let initial = 0;
  for (const ele of getAim) {
    initial += ele;
  }

  const displayInitial = initial;
  let remainder = 0;
  for (const ele of subTotal) {
    remainder += ele;
  }

  const displayRemainder = displayInitial - remainder;

  const disable = displayRemainder <= 0;

  const addTotalToDatabase = async () => {
    setTotal(null);
    await setDoc(doc(db, "users", userId, "goalFortheMonth", "goal"), {
      goal: total,
      id: userId,
      timestamp: serverTimestamp(),
    });
  };

  const incomplete = !total;

  const removeKeyboard = () => {
    Keyboard.dismiss();
  };

  const { colors } = useTheme();
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "users", userId, "goalFortheMonth"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setAim(snapshot.docs)
      ),
    [db, "goalFortheMonth"]
  );
  return (
    <SafeAreaView
      style={[tw`w-full h-full flex-1`, { backgroundColor: colors.card }]}
    >
      <ScrollView>
        <View style={tw`flex flex-row justify-between items-center mx-3 my-3`}>
          <TouchableOpacity
            style={tw`flex flex-row items-center`}
            onPress={() => navigation.navigate("Expenses")}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
            <Text style={{ color: colors.text }}>back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ModalsMonthly")}
            disabled={disable}
            style={tw`bg-blue-400 p-3 rounded-lg`}
          >
            <Text style={{ color: "white" }}>Add Expense</Text>
          </TouchableOpacity>
          <Image
            source={{
              uri: user?.photoURL,
            }}
            style={tw`w-14 h-14 rounded-full`}
          />
        </View>
        <View style={tw`flex flex-col justify-center items-center`}>
          <Text style={[tw`mt-3 text-lg mb-2`, { color: colors.text }]}>
            Enter your Monthly Goal to add Expenses
          </Text>
          <View style={tw`flex flex-row items-center`}>
            <TextInput
              value={total}
              onChangeText={(text) => setTotal(text)}
              keyboardType="numeric"
              style={[
                tw`w-50 h-9 border border-gray-400`,
                { color: colors.text },
              ]}
              placeholder="Monthly Goal"
              placeholderTextColor={colors.text}
            />
            <TouchableOpacity
              disabled={incomplete}
              onPress={addTotalToDatabase}
              style={tw`bg-blue-400 p-3 ml-3 rounded-md`}
            >
              <Text style={tw`text-white`}>Enter</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Flex
          direction="row"
          justify="space-between"
          alignItems="center"
          ml="3"
        >
          <Select
            width="150"
            accessibilityLabel="Select Categories"
            placeholder="Select Category"
            placeholderTextColor={colors.text}
            selectedValue={category}
            onValueChange={(text) => setCategory(text)}
            _selectedItem={{
              bg: "gray",
              color: colors.card,
            }}
            mt="1"
            key="Categories"
            color={colors.text}
            dropdownIcon={
              <AntDesign
                name="caretdown"
                size={15}
                color={colors.text}
                style={{ marginRight: 3 }}
              />
            }
          >
            {categories.map((category) => (
              <Select.Item key={category} label={category} value={category} />
            ))}
          </Select>
          <Flex direction="column" justify="space-between">
            {totalAim.map((item, i) => (
              <View
                style={tw`flex flex-col items-end mx-3 mt-3`}
                key={item.id + item.id + i + 1}
              >
                <TouchableWithoutFeedback onPress={removeKeyboard}>
                  <Text style={[tw`font-bold text-lg`, { color: colors.text }]}>
                    Total: ${item.data().goal}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            ))}
            <View style={tw`flex flex-col items-end mx-3`}>
              <TouchableWithoutFeedback onPress={removeKeyboard}>
                <Text
                  style={[tw`font-bold text-lg mt-1`, { color: colors.text }]}
                >
                  Remaining: ${displayRemainder}
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </Flex>
        </Flex>
        <TouchableOpacity
          style={tw`flex items-center bg-red-500 p-3 rounded-md mx-3 mt-3`}
          onPress={async () => {
            const individualDocuments = await getDocs(
              collection(db, "users", userId, "goalFortheMonth")
            );

            const arrOfIds = [];

            individualDocuments.forEach((doc) => {
              arrOfIds.push(doc.id);
            });

            for (const ele of arrOfIds) {
              await deleteDoc(doc(db, "users", userId, "goalFortheMonth", ele));
            }

            await setDoc(doc(db, "users", userId, "goalFortheMonth", "goal"), {
              goal: 0,
            });
          }}
        >
          <Text style={tw`font-bold text-white`}>Reset</Text>
        </TouchableOpacity>

        {category === categories[0] ? (
          <>
            {Housing.map((aim) => (
              <Box
                key={aim.id + aim.id}
                mx="4"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                p="3"
                my="3"
              >
                <Flex direction="column" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Date:
                  </Text>
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    {aim.data()?.timestamp ? (
                      <>
                        {new Date(
                          aim.data()?.timestamp?.seconds * 1000
                        ).toLocaleDateString()}
                      </>
                    ) : (
                      <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                        Loading...
                      </Text>
                    )}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Category
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().category}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Name of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().item}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Price of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    ${aim.data().price}
                  </Text>
                </Flex>
                <TouchableOpacity
                  style={tw`bg-red-300 rounded-md p-3 mx-3 my-3`}
                  onPress={async () => {
                    await deleteDoc(
                      doc(db, "users", userId, "goalFortheMonth", aim.id)
                    );
                  }}
                >
                  <Text style={tw`text-[18-px] text-center font-bold`}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </Box>
            ))}
          </>
        ) : category === categories[1] ? (
          <>
            {Food.map((aim) => (
              <Box
                key={aim.id + aim.id}
                mx="4"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                p="3"
                my="3"
              >
                <Flex direction="column" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Date:
                  </Text>
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    {aim.data()?.timestamp ? (
                      <>
                        {new Date(
                          aim.data()?.timestamp?.seconds * 1000
                        ).toLocaleDateString()}
                      </>
                    ) : (
                      <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                        Loading...
                      </Text>
                    )}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Category
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().category}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Name of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().item}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Price of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    ${aim.data().price}
                  </Text>
                </Flex>
                <TouchableOpacity
                  style={tw`bg-red-300 rounded-md p-3 mx-3 my-3`}
                  onPress={async () => {
                    await deleteDoc(
                      doc(db, "users", userId, "goalFortheMonth", aim.id)
                    );
                  }}
                >
                  <Text style={tw`text-[18-px] text-center font-bold`}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </Box>
            ))}
          </>
        ) : category === categories[2] ? (
          <>
            {Utilities.map((aim) => (
              <Box
                key={aim.id + aim.id}
                mx="4"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                p="3"
                my="3"
              >
                <Flex direction="column" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Date:
                  </Text>
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    {aim.data()?.timestamp ? (
                      <>
                        {new Date(
                          aim.data()?.timestamp?.seconds * 1000
                        ).toLocaleDateString()}
                      </>
                    ) : (
                      <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                        Loading...
                      </Text>
                    )}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Category
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().category}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Name of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().item}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Price of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    ${aim.data().price}
                  </Text>
                </Flex>
                <TouchableOpacity
                  style={tw`bg-red-300 rounded-md p-3 mx-3 my-3`}
                  onPress={async () => {
                    await deleteDoc(
                      doc(db, "users", userId, "goalFortheMonth", aim.id)
                    );
                  }}
                >
                  <Text style={tw`text-[18-px] text-center font-bold`}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </Box>
            ))}
          </>
        ) : category === categories[3] ? (
          <>
            {Transportation.map((aim) => (
              <Box
                key={aim.id + aim.id}
                mx="4"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                p="3"
                my="3"
              >
                <Flex direction="column" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Date:
                  </Text>
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    {aim.data()?.timestamp ? (
                      <>
                        {new Date(
                          aim.data()?.timestamp?.seconds * 1000
                        ).toLocaleDateString()}
                      </>
                    ) : (
                      <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                        Loading...
                      </Text>
                    )}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Category
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().category}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Name of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().item}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Price of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    ${aim.data().price}
                  </Text>
                </Flex>
                <TouchableOpacity
                  style={tw`bg-red-300 rounded-md p-3 mx-3 my-3`}
                  onPress={async () => {
                    await deleteDoc(
                      doc(db, "users", userId, "goalFortheMonth", aim.id)
                    );
                  }}
                >
                  <Text style={tw`text-[18-px] text-center font-bold`}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </Box>
            ))}
          </>
        ) : category === categories[4] ? (
          <>
            {Insurance.map((aim) => (
              <Box
                key={aim.id + aim.id}
                mx="4"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                p="3"
                my="3"
              >
                <Flex direction="column" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Date:
                  </Text>
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    {aim.data()?.timestamp ? (
                      <>
                        {new Date(
                          aim.data()?.timestamp?.seconds * 1000
                        ).toLocaleDateString()}
                      </>
                    ) : (
                      <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                        Loading...
                      </Text>
                    )}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Category
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().category}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Name of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().item}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Price of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    ${aim.data().price}
                  </Text>
                </Flex>
                <TouchableOpacity
                  style={tw`bg-red-300 rounded-md p-3 mx-3 my-3`}
                  onPress={async () => {
                    await deleteDoc(
                      doc(db, "users", userId, "goalFortheMonth", aim.id)
                    );
                  }}
                >
                  <Text style={tw`text-[18-px] text-center font-bold`}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </Box>
            ))}
          </>
        ) : category === categories[5] ? (
          <>
            {Leisure.map((aim) => (
              <Box
                key={aim.id + aim.id}
                mx="4"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                p="3"
                my="3"
              >
                <Flex direction="column" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Date:
                  </Text>
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    {aim.data()?.timestamp ? (
                      <>
                        {new Date(
                          aim.data()?.timestamp?.seconds * 1000
                        ).toLocaleDateString()}
                      </>
                    ) : (
                      <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                        Loading...
                      </Text>
                    )}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Category
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().category}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Name of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().item}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Price of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    ${aim.data().price}
                  </Text>
                </Flex>
                <TouchableOpacity
                  style={tw`bg-red-300 rounded-md p-3 mx-3 my-3`}
                  onPress={async () => {
                    await deleteDoc(
                      doc(db, "users", userId, "goalFortheMonth", aim.id)
                    );
                  }}
                >
                  <Text style={tw`text-[18-px] text-center font-bold`}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </Box>
            ))}
          </>
        ) : category == categories[6] ? (
          <>
            {subAim.map((aim) => (
              <Box
                key={aim.id + aim.id}
                mx="4"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                p="3"
                my="3"
              >
                <Flex direction="column" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Date:
                  </Text>
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    {aim.data()?.timestamp ? (
                      <>
                        {new Date(
                          aim.data()?.timestamp?.seconds * 1000
                        ).toLocaleDateString()}
                      </>
                    ) : (
                      <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                        Loading...
                      </Text>
                    )}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Category
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().category}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Name of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().item}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Price of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    ${aim.data().price}
                  </Text>
                </Flex>
                <TouchableOpacity
                  style={tw`bg-red-300 rounded-md p-3 mx-3 my-3`}
                  onPress={async () => {
                    await deleteDoc(
                      doc(db, "users", userId, "goalFortheMonth", aim.id)
                    );
                  }}
                >
                  <Text style={tw`text-[18-px] text-center font-bold`}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </Box>
            ))}
          </>
        ) : category == categories[7] ? (
          <Box mx="auto" mt="3" _text={{ color: colors.text, fontSize: 25 }}>
            Total Expenses
            <Flex direction="column" alignItems="center" mt="2">
              {overviewItems.map((item, index) => (
                <Flex
                  direction="row"
                  justify="space-between"
                  width="250"
                  _text={{ color: colors.text, fontSize: 15 }}
                  key={index}
                >
                  {item.category}
                  {"$" + item.price}
                </Flex>
              ))}
              <Flex
                direction="row"
                justify="space-between"
                w="250"
                _text={{ color: colors.text, fontSize: 15 }}
              >
                Total
                {"$" + overviewTotal}
              </Flex>
              <Box _text={{ color: colors.text }} mt="5">
                <Flex
                  direction="column"
                  alignItems="center"
                  _text={{ color: colors.text }}
                >
                  {overviewTotal < displayInitial
                    ? "Congratulations! You met your Target :)"
                    : "Oh no!"}
                  Category of Highest Spending:
                  {nameOfItem[0].category}
                  Price of Highest Spending:
                  {"$" + nameOfItem[0].price}
                </Flex>
              </Box>
            </Flex>
          </Box>
        ) : (
          <>
            {subAim.map((aim) => (
              <Box
                key={aim.id + aim.id}
                mx="4"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                p="3"
                my="3"
              >
                <Flex direction="column" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Date:
                  </Text>
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    {aim.data()?.timestamp ? (
                      <>
                        {new Date(
                          aim.data()?.timestamp?.seconds * 1000
                        ).toLocaleDateString()}
                      </>
                    ) : (
                      <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                        Loading...
                      </Text>
                    )}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Category
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().category}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between" mb="3">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Name of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    {aim.data().item}
                  </Text>
                </Flex>
                <Flex direction="row" justify="space-between">
                  <Text style={[tw`text-[18px]`, { color: colors.text }]}>
                    Price of Item
                  </Text>
                  <Text style={[tw`ml-5 text-[18px]`, { color: colors.text }]}>
                    ${aim.data().price}
                  </Text>
                </Flex>
                <TouchableOpacity
                  style={tw`bg-red-300 rounded-md p-3 mx-3 my-3`}
                  onPress={async () => {
                    await deleteDoc(
                      doc(db, "users", userId, "goalFortheMonth", aim.id)
                    );
                  }}
                >
                  <Text style={tw`text-[18-px] text-center font-bold`}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </Box>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MonthlyScreen;

const styles = StyleSheet.create({});
