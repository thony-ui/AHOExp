import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView, 
  Image
} from "react-native";
import React from "react";
import useAuth from "../hooks/useAuth";
import tw from "twrnc";

const Login = () => {
  const { signInWithGoogle, loading } = useAuth();


  return (
    <SafeAreaView style={tw`w-full h-full bg-white flex justify-center relative`}>
      <Image source={require('./AHOexpenses-logos_transparent.png')} style={tw`w-110 h-100 flex flex-row justify-center`}/>
      <TouchableOpacity onPress = {signInWithGoogle} style={tw`bg-blue-500 p-3 mx-20 rounded-lg`}>
        <Text style={tw`text-center text-white`}>Sign In & Start</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({});
