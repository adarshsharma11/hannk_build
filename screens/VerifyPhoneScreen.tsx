import React, { useRef, useState } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, Alert, BackHandler } from 'react-native';
import useAxios from 'axios-hooks'
import { useGlobalState, dispatchGlobalState } from '../state';
import { axiosInstance } from '../utils/AxiosBootstrap';
import { GRCGDS_BACKEND } from 'react-native-dotenv';
import LoadingSpinner from '../partials/LoadingSpinner';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { AppFontBold, AppFontRegular } from '../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../utils/i18n';

const DocumentScreen = () => {
  const [profile] = useGlobalState('profile');
  const { i18n } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();

  const [{ data, loading }, doVerify] = useAxios({
    url: `${GRCGDS_BACKEND}`,
    method: 'POST'
  }, { manual: true })

  const inputs = [
    useRef<TextInput | null>(null),
    useRef<TextInput | null>(null),
    useRef<TextInput | null>(null),
    useRef<TextInput | null>(null)
  ]

  const [idxFocusInput, setIdxFocusInput] = useState<number>(-1);
  const [pin, setPin] = useState<Array<number>>([-1, -1, -1, -1]);
  const [error , setError] = useState<string | null>(null);
  const [counter, setCounter] = useState(30);

  const onInput = ({ nativeEvent: { key }, ...e }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {

    setPin(p => {
      if (key === 'Backspace') {
        //@ts-ignore
        let lastElemet = p.findIndex(i => i == -1);
        if (lastElemet == -1) lastElemet = p.length
        p[lastElemet - 1] = -1
        const nextInput = inputs[lastElemet - 2]
        if (nextInput && nextInput.current) nextInput.current?.focus()

        return [...p]
      }

      if (!RegExp(`[0-9]`).test(key)) return p

      const firstNull = p.indexOf(-1)
      if (firstNull !== -1) {
        p[firstNull] = parseInt(key)
        const nextInput = inputs[firstNull + 1]
        if (nextInput) nextInput.current?.focus()
      }
      return [...p]
    })
  }

  const backAction = () => {
    route?.params?.onUnbackpress()
    return true
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [])
  );



  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Layout style={{ flex: 1, padding: '5%', backgroundColor: 'white' }}>

        <Layout style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000' }}>
        <Text style={{ textAlign: 'left' }} category="h3">{i18n.t(TRANSLATIONS_KEY.OPT_SCREEN_TITLE).toString()}</Text>
        <Text category="s1"> {i18n.t(TRANSLATIONS_KEY.OPT_SCREEN_SUB_TITLE).toString()} </Text>
          <Text style={{ color: '#41d5fb' }}>({profile?.mobilecode}) {profile?.mobilenumber}</Text>
        </Layout>


        <Layout style={{ display: 'flex', flexDirection: 'row', height: '20%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#00000000', marginTop: '15%' }}>
          <TextInput onBlur={() => { setIdxFocusInput(-1) }} onFocus={() => { setIdxFocusInput(0) }} ref={ref => inputs[0].current = ref} value={pin[0] !== -1 ? pin[0].toString() : ''} onKeyPress={(e) => { onInput(e) }} maxLength={1} style={{ textAlign: 'center', fontFamily: AppFontBold, borderColor: idxFocusInput == 0 ? '#41D5FB' : '#2f378c', borderWidth: 1, backgroundColor: 'white', borderRadius: 30, fontSize: 34, height: 80, width: '20%', color: '#000000' }} />
          <TextInput onBlur={() => { setIdxFocusInput(-1) }} onFocus={() => { setIdxFocusInput(1) }} ref={ref => inputs[1].current = ref} value={pin[1] !== -1 ? pin[1].toString() : ''} onKeyPress={(e) => { onInput(e) }} maxLength={1} style={{ textAlign: 'center', fontFamily: AppFontBold, borderColor: idxFocusInput == 1 ? '#41D5FB' : '#2f378c', borderWidth: 1, backgroundColor: 'white', borderRadius: 30, fontSize: 34, height: 80, width: '20%', color: '#000000' }} />
          <TextInput onBlur={() => { setIdxFocusInput(-1) }} onFocus={() => { setIdxFocusInput(2) }} ref={ref => inputs[2].current = ref} value={pin[2] !== -1 ? pin[2].toString() : ''} onKeyPress={(e) => { onInput(e) }} maxLength={1} style={{ textAlign: 'center', fontFamily: AppFontBold, borderColor: idxFocusInput == 2 ? '#41D5FB' : '#2f378c', borderWidth: 1, backgroundColor: 'white', borderRadius: 30, fontSize: 34, height: 80, width: '20%', color: '#000000' }} />
          <TextInput onBlur={() => { setIdxFocusInput(-1) }} onFocus={() => { setIdxFocusInput(3) }} ref={ref => inputs[3].current = ref} value={pin[3] !== -1 ? pin[3].toString() : ''} onKeyPress={(e) => { onInput(e) }} maxLength={1} style={{ textAlign: 'center', fontFamily: AppFontBold, borderColor: idxFocusInput == 3 ? '#41D5FB' : '#2f378c', borderWidth: 1, backgroundColor: 'white', borderRadius: 30, fontSize: 34, height: 80, width: '20%', color: '#000000' }} />
        </Layout>
        {error && <Text style={{ color: 'red'}}>{error}</Text>}

        <Button
          onPress={() => {
            if (pin.some(i => i == -1 )) {
              setError("Code is required")
              return
            } else {
              setError(null)
            }
            if (profile && profile.vphone != 1) {
              console.log('calling VERIFY')
              doVerify({
                url: GRCGDS_BACKEND,
                data: {
                  "module_name": "VERIFY",
                  "code": parseInt(pin.join(""))
                }
              })
              .then(() => {
                dispatchGlobalState({ type: 'profile', state: {...profile, vphone: 1 } })
                if (profile.vemail == 0) {
                  navigation.navigate('SuccessEmail')
                } else if (profile.vemail == 1){
                  if (route?.params?.onSuccess) {
                    route.params.onSuccess(navigation)
                  } else {
                    console.log('going home', profile.vphone)
                    console.log('routes', navigation.dangerouslyGetState().routes)
                    navigation.navigate('Home')
                  }
                } else {
                  dispatchGlobalState({ type: 'logout' })
                }
              })
              return
            }

            if (profile && profile.twoauth != 0) {
              console.log('calling VERIFY_OPT')

              doVerify({
                url: GRCGDS_BACKEND,
                data: {
                  "module_name": "VERIFY_OPT",
                  "code": parseInt(pin.join(""))
                }
              })
              .then((res) => {
                dispatchGlobalState({ type: 'token', state: res.data.token })
                dispatchGlobalState({ type: 'profile', state: res.data })
                if (res.data.vphone != 1) navigation.navigate('Opt')
                if (res.data.vemail != 1) navigation.navigate('VerifyEmail')
                if (res.data.vphone == 1 && res.data.vemail == 1) navigation.navigate('Home')
              })
            }
            
              
          }}
          size="giant"
          disabled={loading}
          accessoryRight={loading ? LoadingSpinner : undefined}
          style={{
            marginTop: '15%',
            backgroundColor: loading == false ? '#41d5fb' : '#e4e9f2',
            borderColor: loading == false ? '#41d5fb' : '#e4e9f2',
            marginBottom: '15%',
            borderRadius: 10,
            shadowColor: '#41d5fb',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.51,
            shadowRadius: 13.16,
            elevation: 10,
          }}>
          {() => <Text style={{ color: 'white', fontFamily: AppFontBold, fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.VERIFY_WORD).toString()}</Text>}
        </Button>
        <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00000000' }}>
        <Text style={{ textAlign: 'center' }}>
          {i18n.t(TRANSLATIONS_KEY.OPT_DID_NOT_RECEIVE).toString()}
        </Text>
          <Text
            onPress={() => {
              if (!profile) return
              if (counter != 30) return

              const timer = setInterval(() => {
                setCounter(p => {
                  const v = p-1
                  if (v == 0){
                    clearInterval(timer)
                    return 30
                  }
                  return v
                })
              }, 1000);
              
              if (profile && profile.vphone != 1) {
                console.log('calling RESEND_VERIFY')
                doVerify({ data: {
                  "module_name": "RESEND_VERIFY",
                  "id": profile.id
                }})
                .then(() => {
                  setPin([-1, -1, -1, -1])
                })
                return
              }

              if (profile && profile.twoauth != 0) {
                console.log('calling RESEND_VERIFY_OPT')

                doVerify({
                  url: GRCGDS_BACKEND,
                  data: {
                    "module_name": "RESEND_VERIFY_OPT",
                    "id": profile.id
                  }
                })
                .then(() => {
                  setPin([-1, -1, -1, -1])
                })
              }

            }}
            style={{ color: counter == 30 ? '#41d5fb':'#41d5fb80' }}>{i18n.t(TRANSLATIONS_KEY.OPT_RESEND).toString()}</Text>
        </Layout>

        {counter != 30 && (<Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00000000', marginTop: '5%' }}>
        <Text >{i18n.t(TRANSLATIONS_KEY.WAIT_WORD).toString()} {counter} {i18n.t(TRANSLATIONS_KEY.OPT_WAIT_SMS).toString()} </Text>
        </Layout>)}

        <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00000000', marginTop: '5%' }}>
          <Text
            onPress={() => {
              if (route?.params?.onLater) {
                route.params.onLater()
              } else {
                navigation.navigate('Login')
              }
            }}
            style={{ color: '#41d5fb' }}>{i18n.t(TRANSLATIONS_KEY.OPT_LATER).toString()}</Text>
        </Layout>

      </Layout>
    </SafeAreaView>
  );
};

export default DocumentScreen