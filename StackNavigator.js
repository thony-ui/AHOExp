import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from '@react-navigation/stack'
import Login from "./screens/Login";
import useAuth from "./hooks/useAuth";
import CompiledHomeScreen from "./screens/CompiledHomeScreen";
import Modal from "./screens/Modal";
import Weekly from "./screens/Weekly";
import MonthlyScreen from "./screens/MonthlyScreen";
import ModalsMonthly from "./screens/ModalsMonthly";




const StackNavigator = () => {



 
  const { user } = useAuth();
  const Stack = createStackNavigator();
  

  return (
    
   
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
          

      
      >
        {user ? (
          <>
            
            <Stack.Group>
              <Stack.Screen name="CompiledHomeScreen" component={CompiledHomeScreen} />
              <Stack.Screen name="Weekly" component={Weekly} />
              <Stack.Screen name="MonthlyScreen" component={MonthlyScreen} />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="Modal" component={Modal} />
            <Stack.Screen name="ModalsMonthly" component={ModalsMonthly} />
            </Stack.Group>
          </>
        ) : (
          
            <Stack.Screen name = 'Login' component={Login} />
         
         
        )}
      </Stack.Navigator>
   
   
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
