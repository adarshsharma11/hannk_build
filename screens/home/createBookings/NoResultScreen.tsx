import React, { useState } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView, View } from 'react-native';
// @ts-ignore
import GPSState from 'react-native-gps-state'
//@ts-ignore
import GetLocation from 'react-native-get-location'
import LoadingSpinner from '../../../partials/LoadingSpinner';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MenuButton from '../../../partials/MenuButton';
import MapView from 'react-native-maps';
import { AppFontBold } from '../../../constants/fonts';
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';

const DocumentScreen = () => {
  const navigation = useNavigation();
  const { i18n } = useTranslation();
  const [currentLocation, setCurrentLocation] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      if (!GPSState.isAuthorized()) {
        GPSState.requestAuthorization(GPSState.AUTHORIZED_WHENINUSE)
      }

      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          console.log(location)
          setCurrentLocation(location)
        })
        .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
        })

    }, [])
  );


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

      <Layout style={{ position: 'absolute',padding: '5%',backgroundColor: 'red', zIndex: 2, display: 'flex', flexDirection: 'row', backgroundColor: '#00000000', alignItems: 'center', justifyContent: 'center' }}>
        <MenuButton />
      </Layout>



      <Layout style={{ padding: '5%',position: 'absolute',display: 'flex', flexDirection: 'column', backgroundColor: 'white', marginTop: '15%', marginBottom: '10%' }}>
        <Text style={{ fontFamily: AppFontBold, textAlign: 'center' }} category="h5">
          {i18n.t(TRANSLATIONS_KEY.NO_RESULT_TITLE).toString()}
        </Text>
        <Text style={{ color: '#8F9BB3', textAlign: 'center', marginBottom: '50%' }} category="h6">
          {i18n.t(TRANSLATIONS_KEY.NO_RESULT_SUB_TITLE).toString()}
        </Text>
      </Layout>

      <Button
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack()
          }
        }}
        size="giant"
        style={{
          top: '80%',
          left: '10%',
          width: '80%',
          position: 'absolute',
          backgroundColor: '#41d5fb',
          borderColor: '#41d5fb',
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
        {() => <Text style={{ color: 'white', fontFamily: AppFontBold, fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.NO_RESULT_GO_BACK_BTN).toString()}</Text>}
      </Button>

    </SafeAreaView>
  );
};

export default DocumentScreen