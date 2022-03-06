import { StyleSheet} from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Expenses from './Expenses';


const CompiledHomeScreen = () => {

   
    const Tab = createBottomTabNavigator()
  return (
  
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'home'
                : 'home-outline';
            } else if (route.name === 'Expenses') {
              iconName = focused ? "ios-settings" : "ios-settings-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={30} color={color} />
            ;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          headerShown:false,
          tabBarStyle : {height: 90}
        })}

      
      >
               
            <Tab.Group>
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name = "Expenses"component={Expenses} />
            </Tab.Group>

            
       
      
          
            
      </Tab.Navigator>
    
   
  )
}

export default CompiledHomeScreen

const styles = StyleSheet.create({})