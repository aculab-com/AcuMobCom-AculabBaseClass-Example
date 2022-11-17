import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { styles, COLOURS } from './styles';
import { MediaStream, RTCView } from 'react-native-webrtc';
import {
  turnOnSpeaker,
  deleteSpaces,
  AculabBaseClass,
} from 'react-native-aculab-client';
import { MenuButton } from './components/MenuButton';
import { KeypadButton } from './components/KeypadButton';
import { CallButton } from './components/CallButton';
import { RoundButton } from './components/RoundButton';
import { useNavigation } from '@react-navigation/native';

const MainCallButtons = (aculabBaseClass: typeof AculabBaseClass) => {
  const [speakerOn, setSpeakerOn] = useState(false);

  useEffect(() => {
    turnOnSpeaker(speakerOn);
  }, [speakerOn]);

  return (
    <View style={styles.callButtonsContainer}>
      <CallButton
        title={'Hang up'}
        colour={COLOURS.RED}
        onPress={() => aculabBaseClass.stopCall()}
      />
      <CallButton
        title={'Speaker'}
        colour={COLOURS.SPEAKER_BUTTON}
        onPress={() => {
          setSpeakerOn(!speakerOn);
        }}
      />
    </View>
  );
};

const ButtonsIncoming = (aculabBaseClass: typeof AculabBaseClass) => {
  return (
    <View style={styles.callButtonsContainer}>
      <CallButton
        title={'Reject'}
        colour={COLOURS.RED}
        onPress={() => aculabBaseClass.reject()}
      />
      <CallButton
        title={'Accept'}
        colour={COLOURS.GREEN}
        onPress={() => aculabBaseClass.answer()}
      />
    </View>
  );
};

const RegisterButton = (aculabBaseClass: typeof AculabBaseClass) => {
  const navigation = useNavigation();
  return (
    <View style={styles.registrationButton}>
      <RoundButton
        iconName={'cog-outline'}
        onPress={() => {
          navigation.goBack();
          aculabBaseClass.unregister();
        }}
      />
    </View>
  );
};

type AcuMobFunctionComponent = {
  webRTCToken: string;
  webRTCAccessKey: string;
  cloudRegionId: string;
  registerClientId: string;
  logLevel: string;
};

const AcuMobFunctionComponent = (props: AcuMobFunctionComponent) => {
  let registerClientId = props.registerClientId;
  const [outboundCall, setOutboundCall] = useState(false);
  const [inboundCall, setInboundCall] = useState(false);
  const [webRTCState, setWebRTCState] = useState('idle');
  const [calling, setCalling] = useState('');
  const [client, setClient] = useState(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteVideoMuted, setRemoteVideoMuted] = useState(false);
  const [localVideoMuted, setLocalVideoMuted] = useState(false);
  const [localMicMuted, setLocalMicMuted] = useState(false);

  const registerClient = async () => {
    let newClient = await AculabBaseClass.register(
      props.cloudRegionId,
      props.webRTCAccessKey,
      registerClientId,
      props.logLevel,
      props.webRTCToken,
    );
    if (newClient) {
      AculabBaseClass._client = newClient;
      setClient(newClient);
    }
  };

  if (!client) {
    registerClient();
  }

  try {
    AculabBaseClass.onDisconnected = function () {
      setLocalStream(null);
      setRemoteStream(null);
      setOutboundCall(false);
      setInboundCall(false);
      setWebRTCState('idle');
      setCalling('');
    };
    AculabBaseClass.onRinging = function () {
      setWebRTCState('ringing');
    };
    AculabBaseClass.onGotMedia = function () {
      setWebRTCState('gotMedia');
    };
    AculabBaseClass.onConnected = function (obj) {
      setWebRTCState('connected');
      setLocalStream(AculabBaseClass.getLocalStream());
      setRemoteStream(obj.call._remote_stream);
    };
    AculabBaseClass.onIncomingCall = function () {
      setCalling('client');
      setWebRTCState('incomingCall');
      setInboundCall(true);
    };
    AculabBaseClass.onLocalVideoMute = function () {
      setLocalVideoMuted(true);
    };
    AculabBaseClass.onLocalVideoUnmute = function () {
      setLocalVideoMuted(false);
    };
    AculabBaseClass.onRemoteVideoMute = function () {
      setRemoteVideoMuted(true);
    };
    AculabBaseClass.onRemoteVideoUnmute = function () {
      setRemoteVideoMuted(false);
    };
  } catch (err: any) {
    console.error('[ AculabBaseClass ]', err);
  }

  const CallHeadComponent = (): any => {
    return (
      <View style={styles.row}>
        <View style={styles.callHead}>
          <Text style={styles.basicText}>
            Aculab - AcuMobFunctionComponent Example
          </Text>
          {client ? (
            <View>
              <Text style={styles.basicText}>
                Registered as {registerClientId}
              </Text>
              <Text style={styles.basicText}>WebRTC State: {webRTCState}</Text>
              <Text style={styles.basicText}>
                Outbound Call: {String(outboundCall)}
              </Text>
              <Text style={styles.basicText}>
                Inbound Call: {String(inboundCall)}
              </Text>
            </View>
          ) : (
            <Text style={styles.warningText}>
              Please Use Correct Registration Credentials
            </Text>
          )}
        </View>
        {webRTCState === 'idle' ? (
          <RegisterButton {...AculabBaseClass} />
        ) : (
          <View />
        )}
      </View>
    );
  };

  const CallDisplayHandler = () => {
    switch (calling) {
      case 'client':
        return <DisplayClientCall />;
      case 'service':
        return <DialKeypad />;
      default:
        if (inboundCall) {
          // incoming call display
          return (
            <View style={styles.center}>
              <Text style={styles.callingText}>Incoming Call</Text>
              <Text style={styles.callingText}>
                {AculabBaseClass._incomingCallClientId}
              </Text>
            </View>
          );
        } else {
          // idle display
          return (
            <ScrollView>
              <CallOutComponent />
            </ScrollView>
          );
        }
    }
  };

  const DialKeypad = () => {
    return (
      <View style={styles.dialKeypad}>
        {webRTCState === 'calling' || webRTCState === 'ringing' ? (
          <View>
            <Text style={styles.callingText}>
              Calling {AculabBaseClass._callServiceName}
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.callingText}>
              Service {AculabBaseClass._callServiceName}
            </Text>
          </View>
        )}
        <View>
          <View style={styles.callButtonsContainer}>
            <KeypadButton
              title={'1'}
              onPress={() => AculabBaseClass.sendDtmf('1')}
            />
            <KeypadButton
              title={'2'}
              onPress={() => AculabBaseClass.sendDtmf('2')}
            />
            <KeypadButton
              title={'3'}
              onPress={() => AculabBaseClass.sendDtmf('3')}
            />
          </View>
          <View style={styles.callButtonsContainer}>
            <KeypadButton
              title={'4'}
              onPress={() => AculabBaseClass.sendDtmf('4')}
            />
            <KeypadButton
              title={'5'}
              onPress={() => AculabBaseClass.sendDtmf('5')}
            />
            <KeypadButton
              title={'6'}
              onPress={() => AculabBaseClass.sendDtmf('6')}
            />
          </View>
          <View style={styles.callButtonsContainer}>
            <KeypadButton
              title={'7'}
              onPress={() => AculabBaseClass.sendDtmf('7')}
            />
            <KeypadButton
              title={'8'}
              onPress={() => AculabBaseClass.sendDtmf('8')}
            />
            <KeypadButton
              title={'9'}
              onPress={() => AculabBaseClass.sendDtmf('9')}
            />
          </View>
          <View style={styles.callButtonsContainer}>
            <KeypadButton
              title={'*'}
              onPress={() => AculabBaseClass.sendDtmf('*')}
            />
            <KeypadButton
              title={'0'}
              onPress={() => AculabBaseClass.sendDtmf('0')}
            />
            <KeypadButton
              title={'#'}
              onPress={() => AculabBaseClass.sendDtmf('#')}
            />
          </View>
        </View>
      </View>
    );
  };

  const DisplayClientCall = () => {
    if (outboundCall && webRTCState !== 'connected') {
      return (
        <View style={styles.center}>
          <Text style={styles.callingText}>
            Calling {AculabBaseClass._callClientName}
          </Text>
        </View>
      );
    } else if (inboundCall && webRTCState !== 'connected') {
      return (
        <View style={styles.center}>
          <Text style={styles.callingText}>
            Calling {AculabBaseClass._incomingCallClientId}
          </Text>
        </View>
      );
    } else {
      if (remoteStream && localStream) {
        switch (true) {
          case localVideoMuted && !remoteVideoMuted:
            return (
              <View style={styles.vidview}>
                <RTCView
                  // @ts-ignore
                  streamURL={remoteStream.toURL()}
                  style={styles.rtcview}
                />
              </View>
            );
          case !localVideoMuted && remoteVideoMuted:
            return (
              <View style={styles.vidview}>
                <Image
                  source={require('./media/video_placeholder.png')}
                  style={styles.videoPlaceholder}
                />
                <View style={styles.videoPlaceholder}>
                  <Text style={styles.basicText}>NO VIDEO</Text>
                </View>
                <View style={styles.rtc}>
                  <RTCView
                    // @ts-ignore
                    streamURL={localStream.toURL()}
                    style={styles.rtcselfview}
                  />
                </View>
              </View>
            );
          case localVideoMuted && remoteVideoMuted:
            return (
              <View>
                <Image
                  source={require('./media/video_placeholder.png')}
                  style={styles.videoPlaceholder}
                />
                <View style={styles.videoPlaceholder}>
                  <Text style={styles.basicText}>NO VIDEO</Text>
                </View>
              </View>
            );
          default:
            return (
              <View style={styles.vidview}>
                <RTCView
                  // @ts-ignore
                  streamURL={remoteStream.toURL()}
                  style={styles.rtcview}
                />
                <View style={styles.rtc}>
                  <RTCView
                    // @ts-ignore
                    streamURL={localStream.toURL()}
                    style={styles.rtcselfview}
                  />
                </View>
              </View>
            );
        }
      } else {
        return <View />;
      }
    }
  };

  const CallOutComponent = () => {
    const [serviceName, setServiceName] = useState(
      AculabBaseClass._callServiceName,
    );
    const [clientName, setClientName] = useState(
      AculabBaseClass._callClientName,
    );
    return (
      <View style={styles.inputContainer}>
        <View>
          <Text style={styles.basicText}>Service Name</Text>
          <TextInput
            style={styles.input}
            placeholder={'example: --15993377'}
            placeholderTextColor={COLOURS.INPUT_PLACEHOLDER}
            onChangeText={text => setServiceName(deleteSpaces(text))}
            value={serviceName}
            keyboardType={'ascii-capable'}
          />
          <MenuButton
            title={'Call Service'}
            onPress={() => {
              if (serviceName.length > 0) {
                setCalling('service');
                setOutboundCall(true);
                AculabBaseClass._activeCall =
                  AculabBaseClass.callService(serviceName);
              }
            }}
          />
        </View>
        <View>
          <Text style={styles.basicText}>Client ID</Text>
          <TextInput
            style={styles.input}
            placeholder={'example: anna123'}
            placeholderTextColor={COLOURS.INPUT_PLACEHOLDER}
            onChangeText={setClientName}
            value={clientName}
          />
          <MenuButton
            title={'Call Client'}
            onPress={() => {
              if (clientName.length > 0) {
                setCalling('client');
                setOutboundCall(true);
                AculabBaseClass._activeCall =
                  AculabBaseClass.callClient(clientName);
              }
            }}
          />
        </View>
      </View>
    );
  };

  const CallButtonsHandler = () => {
    if (inboundCall && webRTCState === 'incomingCall') {
      //incoming call
      return <ButtonsIncoming {...AculabBaseClass} />;
    } else if (inboundCall || outboundCall) {
      if (calling === 'client' && webRTCState === 'connected') {
        // client call connected
        return (
          <View>
            <ClientCallButtons />
            <MainCallButtons {...AculabBaseClass} />
          </View>
        );
      } else {
        // client call not connected or service call
        return <MainCallButtons {...AculabBaseClass} />;
      }
    } else {
      // idle state
      return <View />;
    }
  };

  const ClientCallButtons = () => {
    var videoIcon: string = '';
    var audioIcon: string = '';
    if (!AculabBaseClass._camera) {
      videoIcon = 'eye-off-outline';
    } else {
      videoIcon = 'eye-outline';
    }
    if (!AculabBaseClass._mic) {
      audioIcon = 'mic-off-outline';
    } else {
      audioIcon = 'mic-outline';
    }
    return (
      <View style={styles.callButtonsContainer}>
        <RoundButton
          iconName={'camera-reverse-outline'}
          onPress={() => AculabBaseClass.swapCam()}
        />
        <RoundButton
          iconName={videoIcon}
          onPress={() => {
            AculabBaseClass._camera = !AculabBaseClass._camera;
            setLocalVideoMuted(!localVideoMuted);
            AculabBaseClass.mute();
          }}
        />
        <RoundButton
          iconName={audioIcon}
          onPress={() => {
            AculabBaseClass._mic = !AculabBaseClass._mic;
            setLocalMicMuted(!localMicMuted);
            AculabBaseClass.mute();
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.height100}>
      <CallHeadComponent />
      <View>
        <CallDisplayHandler />
      </View>
      <View style={styles.bottom}>
        <CallButtonsHandler />
      </View>
    </SafeAreaView>
  );
};

export default AcuMobFunctionComponent;
