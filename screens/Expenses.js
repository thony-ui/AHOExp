import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
  } from "react-native";
import React from 'react'
import { useNavigation, useTheme } from "@react-navigation/native";
import tw from 'twrnc'


const Expenses = () => {
    const navigation = useNavigation();
    const {colors} = useTheme()
  return (
    <SafeAreaView style={[tw`w-full h-full justify-center`, {backgroundColor:colors.card}]}>
        <Text style={[tw`text-3xl text-center`, {color:colors.text}]}>Track your Expenses</Text>

        <View style={tw`flex justify-center items-center mt-15`}>
      <TouchableOpacity style={tw`bg-blue-400 p-3 rounded-md mb-10`} onPress = {()=>navigation.navigate('Weekly')}>
        <Text style={tw`text-white`}>Weekly Expenses</Text>
      </TouchableOpacity>

      <TouchableOpacity style={tw`bg-blue-400 p-3 rounded-md`} onPress = {()=>navigation.navigate('MonthlyScreen')}>
          <Text style={tw`text-white`}>Monthly Expenses</Text>
      </TouchableOpacity>
      </View>

    
    </SafeAreaView>
  )
}

export default Expenses

const styles = StyleSheet.create({})