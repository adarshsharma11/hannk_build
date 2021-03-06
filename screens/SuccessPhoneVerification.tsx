import React from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native';
import useAxios from 'axios-hooks'
import { useGlobalState } from '../state';
import { GRCGDS_BACKEND } from 'react-native-dotenv';
import LoadingSpinner from '../partials/LoadingSpinner';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../partials/BackButton';
import { AppFontBold } from '../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../utils/i18n';
import { APP_BRAND_COLOR } from '../constants/Colors';

const DocumentScreen = () => {
  const [profile] = useGlobalState('profile');
  const { i18n } = useTranslation();
  const navigation = useNavigation();

  const [{ data, loading, error }, doVerify] = useAxios({
    url: `${GRCGDS_BACKEND}`,
    method: 'POST'
  }, { manual: true })


  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Layout style={{ flex: 1, padding: '5%', backgroundColor: 'white' }}>

        <Layout style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#00000000', alignItems: 'center' }}>
          <BackButton />

          <Text style={{ marginLeft: '2%', textAlign: 'left' }} category="h3">
            {i18n.t(TRANSLATIONS_KEY.LOGIN_WORD).toString()}
          </Text>
        </Layout>

        <Layout style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000', marginTop: '15%', marginBottom: '10%' }}>
          <Text style={{ marginBottom: '10%', textAlign: 'center' }} category="h3">
            {i18n.t(TRANSLATIONS_KEY.SUCCESS_VERIFY_PHONE_MSG).toString()}
          </Text>

          <Text style={{ textAlign: 'center', marginBottom: '30%' }} category="h5">
            {i18n.t(TRANSLATIONS_KEY.SUCCESS_VERIFY_PHONE_INFO, { email: profile?.emailaddress }).toString()}
          </Text>
        </Layout>

        <Button
          onPress={() => {
            navigation.navigate('Login')
          }}
          size="giant"
          disabled={loading}
          accessoryRight={loading ? LoadingSpinner : undefined}
          style={{
            backgroundColor: loading == false ? APP_BRAND_COLOR : `${APP_BRAND_COLOR}50`,
            borderColor: loading == false ? APP_BRAND_COLOR : `${APP_BRAND_COLOR}50`,
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
          {() => <Text style={{ color: 'white', fontFamily: AppFontBold, fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.CONTINUE_WORD).toString()}</Text>}
        </Button>

      </Layout>
    </SafeAreaView>
  );
};

export default DocumentScreen