import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './SignIn';
import SignUp from './SignUp';
import MyActivity from './MyActivity';
import MapsScreen from './MapsScreen';
import {UserProvider} from '../context/UserContext'

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <UserProvider>    
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
          <Stack.Screen name="My Activity" component={MyActivity} options={{ headerShown: false }} />
          <Stack.Screen name="Maps" component={MapsScreen} />
          <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>

  );
}

export default AppNavigator;
