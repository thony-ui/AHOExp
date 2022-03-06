import useAuth from "../hooks/useAuth";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useTheme } from "@react-navigation/native";
import tw from "twrnc";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Select} from "native-base";

const Modal = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const userId = user.providerData[0].uid;
  const [value, setValue] = useState(null);
  const [field, setField] = useState("");
  const [category, setCategory] = useState("");

  const categories = ['Housing','Food','Utilities','Transportation','Insurance','Leisure']

  const incomplete = !value || !field || !category;

  const addToDataBase = async () => {
    navigation.navigate("Weekly");
    await addDoc(collection(db, "users", userId, "goalFortheWeek"), {
      item: field,
      price: value,
      category: category,
      timestamp: serverTimestamp(),
    });
  };

  const { colors } = useTheme();
  

  return (
    <SafeAreaView style={tw`w-full h-full`}>
      <ScrollView>
        <TouchableOpacity
          style={[
            tw`flex flex-row items-center mx-3 my-3`,
            { color: colors.text },
          ]}
          onPress={() => navigation.navigate("Weekly")}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
          <Text style={{ color: colors.text }}>back</Text>
        </TouchableOpacity>
        <View style={tw`flex w-full h-full items-center`}>
          <Text
            style={[tw`text-center mt-50 text-2xl`, { color: colors.text }]}
          >
            Add expenses
          </Text>
          <View style={tw`flex items-center justify-center`}>
            <Text style={tw`text-red-500 mt-4 mb-3`}>
              Step 1: Enter the Category of Expense
            </Text>
            <Select
              width="200"
              accessibilityLabel="Select Categories"
              placeholder="Select Category"
              placeholderTextColor = {colors.text}
              selectedValue={category}
              onValueChange={(text) => setCategory(text)}
              _selectedItem={{
                bg: "gray",
                color: colors.card,
              }}
              mt="1"
              key="Categories"
              color={colors.text}
              dropdownIcon = {<AntDesign name="caretdown" size={15} color={colors.text} style={{marginRight:3}} />}
            >
              {categories.map((category)=>(
                <Select.Item key={category} label={category} value={category} />
              ))}
            </Select>
            <Text style={tw`text-red-500 mt-4 mb-3`}>
              Step 2: Enter what you spent on
            </Text>
            <TextInput
              value={field}
              onChangeText={(text) => setField(text)}
              placeholder="Enter the item you bought"
              style={[tw`h-9 border-gray-400`, { color: colors.text }]}
              placeholderTextColor={colors.text}
            />

            <Text style={tw`text-red-500 mt-4 mb-3`}>
              Step 3: Enter the amount of your Spending
            </Text>
            <TextInput
              value={value}
              onChangeText={(text) => setValue(text)}
              keyboardType="numeric"
              placeholder="Enter the amount you spent"
              style={[tw`h-9 border-gray-400 mb-4`, { color: colors.text }]}
              placeholderTextColor={colors.text}
            />
          </View>

          <TouchableOpacity
            style={tw`flex items-center rounded-md bg-red-400 mx-4`}
            onPress={addToDataBase}
            disabled={incomplete}
          >
            <Text style={tw`p-3`}>Enter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Modal;
