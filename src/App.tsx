import 'react-native-gesture-handler';
import React from 'react';
import { View, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { styles, COLOURS } from './styles';
import AcuMobFunctionComponent from './AcuMobFunctionComponent';
import { RegisterScreen } from './RegisterScreen';
import type { AcuMobComParam } from './types';

const Stack = createNativeStackNavigator();

function AcuMobComScreen({ route }: any) {
  const {
    webRTCAccessKey,
    cloudRegionId,
    logLevel,
    registerClientId,
    webRTCToken,
  } = route.params as AcuMobComParam;
  return (
    <View style={styles.container}>
      <AcuMobFunctionComponent
        webRTCAccessKey={webRTCAccessKey}
        cloudRegionId={cloudRegionId}
        logLevel={logLevel}
        registerClientId={registerClientId}
        webRTCToken={webRTCToken}
      />
    </View>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: 'Registration',
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: COLOURS.BACKGROUND },
        }}
        name="Register"
        component={RegisterScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="AcuMobCom"
        component={AcuMobComScreen}
      />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <AppStack />
    </NavigationContainer>
  );
};

export default App;
