import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles, COLOURS } from './styles';
import type { AuthStackParam } from './types';
import { MenuButton } from './components/MenuButton';
import {
  getToken,
  deleteSpaces,
  showAlert,
} from '@aculab-com/react-native-aculab-client';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DEV_CONSTANTS } from '../devConstants.dev';

type Props = NativeStackNavigationProp<AuthStackParam, 'AcuMobCom'>;

export const RegisterScreen = () => {
  const [webRTCAccessKey, setWebRTCAccessKey] = useState(
    DEV_CONSTANTS.webRTCAccessKey,
  );
  const [apiAccessKey, setApiAccessKey] = useState(DEV_CONSTANTS.apiAccessKey);
  const [cloudRegionId, setCloudRegionId] = useState(
    DEV_CONSTANTS.cloudRegionId,
  );
  const [cloudUsername, setCloudUsername] = useState(
    DEV_CONSTANTS.cloudUsername,
  );
  const [logLevel, setLogLevel] = useState(DEV_CONSTANTS.logLevel);
  const [registerClientId, setRegisterClientId] = useState(
    DEV_CONSTANTS.registerClientId,
  );
  const [webRTCToken, setWebRTCToken] = useState('None');
  const navigation = useNavigation<Props>();

  const getWebRTCToken = async () => {
    let token = await getToken({
      registerClientId: registerClientId,
      tokenLifeTime: 3600,
      enableIncomingCall: true,
      callClientRange: '*',
      cloudRegionId: cloudRegionId,
      cloudUsername: cloudUsername,
      apiAccessKey: apiAccessKey,
    });
    if (token !== 'undefined') {
      setWebRTCToken(token);
    } else {
      showAlert(
        '',
        'Credential are incorrect: Check API Access Key, Cloud Region ID, Cloud Username and Register Client ID',
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.registerContainer]}>
        <Text style={styles.basicText}>Web RTC Access Key</Text>
        <TextInput
          style={styles.input}
          autoCapitalize={'none'}
          placeholder={'example: heh0zprmk7okgtl90dx0i9xoa'}
          placeholderTextColor={COLOURS.INPUT_PLACEHOLDER}
          onChangeText={text => setWebRTCAccessKey(deleteSpaces(text))}
          value={webRTCAccessKey}
        />
        <Text style={styles.basicText}>API Access Key</Text>
        <TextInput
          style={styles.input}
          autoCapitalize={'none'}
          placeholder={'example: RIBnMDn8Vgeel8JwPmnwFQ'}
          placeholderTextColor={COLOURS.INPUT_PLACEHOLDER}
          onChangeText={text => setApiAccessKey(deleteSpaces(text))}
          value={apiAccessKey}
        />
        <Text style={styles.basicText}>Cloud Region ID</Text>
        <TextInput
          style={styles.input}
          autoCapitalize={'none'}
          placeholder={'example: 0-2-0'}
          placeholderTextColor={COLOURS.INPUT_PLACEHOLDER}
          onChangeText={text => setCloudRegionId(deleteSpaces(text))}
          value={cloudRegionId}
        />
        <Text style={styles.basicText}>Cloud Username</Text>
        <TextInput
          style={styles.input}
          autoCapitalize={'none'}
          placeholder={'example: anna.new@aculab.com'}
          placeholderTextColor={COLOURS.INPUT_PLACEHOLDER}
          onChangeText={text => setCloudUsername(deleteSpaces(text))}
          value={cloudUsername}
        />
        <Text style={styles.basicText}>Log Level</Text>
        <TextInput
          style={styles.input}
          autoCapitalize={'none'}
          placeholder={'example: 2'}
          placeholderTextColor={COLOURS.INPUT_PLACEHOLDER}
          onChangeText={text => setLogLevel(deleteSpaces(text))}
          value={logLevel}
        />
        <Text style={styles.basicText}>Register Client ID</Text>
        <TextInput
          style={styles.input}
          autoCapitalize={'none'}
          placeholder={'example: anna123'}
          placeholderTextColor={COLOURS.INPUT_PLACEHOLDER}
          onChangeText={text => setRegisterClientId(deleteSpaces(text))}
          value={registerClientId}
        />
        <Text style={styles.basicText}>Token: {webRTCToken}</Text>
        {webRTCToken === 'None' ? (
          <MenuButton title={'Get Token'} onPress={() => getWebRTCToken()} />
        ) : (
          <MenuButton
            title={'Register'}
            onPress={() => {
              navigation.navigate('AcuMobCom', {
                webRTCAccessKey: webRTCAccessKey,
                cloudRegionId: cloudRegionId,
                logLevel: logLevel,
                registerClientId: registerClientId,
                webRTCToken: webRTCToken,
              });
              setWebRTCToken('None');
            }}
          />
        )}
      </View>
    </ScrollView>
  );
};
