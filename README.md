# AcuMobCom component Example (Demo)

This Example demonstrates use of the Aculab package AcuMobCom from [react-native-aculab-client](https://www.npmjs.com/package/react-native-aculab-client). It allows you to make calls to Aculab cloud services from iOS and Android platforms and to send dtmf. It Also supports peer-to-peer video/audio calls.

---

## Installation

### 1. Clone the repository

### 2. Install node_modules

In the root folder run

``` node
npm install
```

### 3. Install pods for ios

``` node
npx pod-install
```

OR install pods directly from ios folder using

``` node
pod install
```

### 4. Manually add DTMF method for android

Open node_modules/react-native-webrtc/android/src/main/java/com/oney/WebRTCModule/WebRTCModule.java and into the class WebRTCModule add the method bellow.

**If you skip this step, Android platform will throw an error when the method sendDtmf is called.**

``` java
@ReactMethod
public void peerConnectionSendDTMF(String tone, int duration, int interToneGap, int objectID) {
    PeerConnection pc = getPeerConnection(objectID);
    RtpSender sender = pc.getSenders().get(0);

    if (sender != null) {
        DtmfSender dtmfSender = sender.dtmf();
        dtmfSender.insertDtmf(tone, duration, interToneGap); // Timers are in ms
    }
}
```

### 5. Edit parameters given to AcuMob in devConstants.dev.ts file to fit your own cloud account

You can change default registration credentials in the devConstants.dev.ts.
This step is not required but it makes testing easier, however you can always edit these props in the registration screen via UI in the Example application.

[AcuMobCom props](https://github.com/aculab-com/AcuMobCom-Example/blob/main/devConstants.dev.ts)

```typescript
const webRTCAccessKey: string = '';
const apiAccessKey: string = '';
const cloudRegionId: string = '';
const cloudUsername: string = '';
const logLevel: string = '';
const registerClientId: string = '';
}
```

Now you're good to go.

---

#### Note that and apiAccessKey should not ever be displayed and should be treated as sensitive data. In the Demo app they are displayed only to assist developer testing. You should not display this sensitive information in your application

## License

MIT

Copyright (c) 2022 Aculab

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
