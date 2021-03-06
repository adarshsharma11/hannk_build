import React, { useRef, useEffect } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, Alert } from 'react-native';
import useAxios from 'axios-hooks'
import { useGlobalState, dispatchGlobalState } from '../../../state';
import { GRCGDS_BACKEND } from 'react-native-dotenv';
import LoadingSpinner from '../../../partials/LoadingSpinner';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { AppFontBold, AppFontRegular } from '../../../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';
import { APP_BRAND_COLOR } from '../../../constants/Colors';

const DocumentScreen = () => {
  const { i18n } = useTranslation();

  const [profile] = useGlobalState('profile');
  const navigation = useNavigation();
  const route = useRoute();

  const [idxFocusInput, setIdxFocusInput] = React.useState<number>(-1);
  const [pin, setPin] = React.useState<Array<number>>([-1, -1, -1, -1]);
  const [error , setError] = React.useState<string | null>(null);
  const [counter, setCounter] = React.useState(30);

  const [codeReq, callAPI] = useAxios({
    url: GRCGDS_BACKEND,
    method: 'POST'
  }, {manual: true})

  console.log(route.params.registratioNumber)

  useEffect(() => {
    if (route.params.reservationStatus == 'Cancelled') return
    callAPI({
      data: {module_name: 'SEND_CANCEL_CODE'}
    })
    .then(() => {
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
      Alert.alert('A cancel code has been sent to you phone')
    })
  },[route.params.registratioNumber])

  useFocusEffect(
    React.useCallback(() => {
      return () => setPin([-1, -1, -1, -1])
    }, [])
  );


  const inputs = [
    useRef<TextInput | null>(null),
    useRef<TextInput | null>(null),
    useRef<TextInput | null>(null),
    useRef<TextInput | null>(null)
  ]

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

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Layout style={{ flex: 1, padding: '5%', backgroundColor: 'white' }}>

        <Layout style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000' }}>
          <Text style={{ textAlign: 'left' }} category="h3">{i18n.t(TRANSLATIONS_KEY.OPT_SCREEN_TITLE).toString()}</Text>
          <Text category="s1"> {i18n.t(TRANSLATIONS_KEY.OPT_SCREEN_SUB_TITLE).toString()} </Text>
          <Text style={{ color: APP_BRAND_COLOR }}>({profile?.mobilecode}) {profile?.mobilenumber}</Text>
        </Layout>


        <Layout style={{ display: 'flex', flexDirection: 'row', height: '20%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#00000000', marginTop: '15%' }}>
          <TextInput onBlur={() => { setIdxFocusInput(-1) }} onFocus={() => { setIdxFocusInput(0) }} ref={ref => inputs[0].current = ref} value={pin[0] !== -1 ? pin[0].toString() : ''} onKeyPress={(e) => { onInput(e) }} maxLength={1} style={{ textAlign: 'center', fontFamily: AppFontBold, borderColor: idxFocusInput == 0 ? APP_BRAND_COLOR : '#2f378c', borderWidth: 1, backgroundColor: 'white', borderRadius: 30, fontSize: 34, height: 80, width: '20%' }} />
          <TextInput onBlur={() => { setIdxFocusInput(-1) }} onFocus={() => { setIdxFocusInput(1) }} ref={ref => inputs[1].current = ref} value={pin[1] !== -1 ? pin[1].toString() : ''} onKeyPress={(e) => { onInput(e) }} maxLength={1} style={{ textAlign: 'center', fontFamily: AppFontBold, borderColor: idxFocusInput == 1 ? APP_BRAND_COLOR : '#2f378c', borderWidth: 1, backgroundColor: 'white', borderRadius: 30, fontSize: 34, height: 80, width: '20%' }} />
          <TextInput onBlur={() => { setIdxFocusInput(-1) }} onFocus={() => { setIdxFocusInput(2) }} ref={ref => inputs[2].current = ref} value={pin[2] !== -1 ? pin[2].toString() : ''} onKeyPress={(e) => { onInput(e) }} maxLength={1} style={{ textAlign: 'center', fontFamily: AppFontBold, borderColor: idxFocusInput == 2 ? APP_BRAND_COLOR : '#2f378c', borderWidth: 1, backgroundColor: 'white', borderRadius: 30, fontSize: 34, height: 80, width: '20%' }} />
          <TextInput onBlur={() => { setIdxFocusInput(-1) }} onFocus={() => { setIdxFocusInput(3) }} ref={ref => inputs[3].current = ref} value={pin[3] !== -1 ? pin[3].toString() : ''} onKeyPress={(e) => { onInput(e) }} maxLength={1} style={{ textAlign: 'center', fontFamily: AppFontBold, borderColor: idxFocusInput == 3 ? APP_BRAND_COLOR : '#2f378c', borderWidth: 1, backgroundColor: 'white', borderRadius: 30, fontSize: 34, height: 80, width: '20%' }} />
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
            callAPI({
              data: {
                module_name: 'VERIFY_CANCEL_CODE',
                code: pin.join(''),
                bookingId: route.params.registratioNumber
              }
            })

            .then((r) => {
              console.log(r.data)
                if (r.data.includes('Errors')) {
                  Alert.alert('Error', 'Reservation Not Found')
                  return;
                }

                navigation.navigate("MyBookings")
            })

          }}
          size="giant"
          disabled={codeReq.loading}
          accessoryRight={codeReq.loading ? LoadingSpinner : undefined}
          style={{
            marginTop: '15%',
            backgroundColor: codeReq.loading == false ? APP_BRAND_COLOR : `${APP_BRAND_COLOR}50`,
            borderColor: codeReq.loading == false ? APP_BRAND_COLOR : `${APP_BRAND_COLOR}50`,
            marginBottom: '15%',
            borderRadius: 10,
            shadowColor: APP_BRAND_COLOR,
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
          <Text style={{ textAlign: 'center' }}>{i18n.t(TRANSLATIONS_KEY.OPT_DID_NOT_RECEIVE).toString()} </Text>
          <Text
            onPress={() => {
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
              callAPI({
                data: {module_name: 'SEND_CANCEL_CODE'}
              })
              .then((r) => {
                Alert.alert('Code Sended', 'A cancel code has been sended to you')
              })
            }}
            style={{ color: counter == 30 ? APP_BRAND_COLOR: `${APP_BRAND_COLOR}80` }}>{i18n.t(TRANSLATIONS_KEY.OPT_RESEND).toString()}</Text>
        </Layout>

        {counter != 30 && (<Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00000000', marginTop: '5%' }}>
          <Text >{i18n.t(TRANSLATIONS_KEY.WAIT_WORD).toString()} {counter} {i18n.t(TRANSLATIONS_KEY.OPT_WAIT_SMS).toString()} </Text>
        </Layout>)}

        <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00000000', marginTop: '5%' }}>
          <Text
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack()
              }
            }}
            style={{ color: APP_BRAND_COLOR }}>{i18n.t(TRANSLATIONS_KEY.OPT_LATER).toString()}</Text>
        </Layout>

      </Layout>
    </SafeAreaView>
  );
};

export default DocumentScreen