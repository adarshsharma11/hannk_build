import React, { useEffect, useRef, useState } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MenuButton from '../../partials/MenuButton';
import { ScrollView } from 'react-native-gesture-handler';
import { AppFontBold, AppFontRegular } from '../../constants/fonts';
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../utils/i18n';
import { APP_BRAND_COLOR } from '../../constants/Colors';
import HTML from "react-native-render-html";
import { getAppConfig, UsePaypal } from 'hannk-mobile-common'
import { CLIENT_ID, GRCGDS_BACKEND } from 'react-native-dotenv';


const DocumentScreen = () => {
  const navigation = useNavigation();
  const { i18n } = useTranslation();
  const [terms, setTerms] = useState();

  const { getAppConfig: doGetAppConfig, getAppConfigReq } = getAppConfig(CLIENT_ID)

  useEffect(() => {
    if (getAppConfigReq.data && !getAppConfigReq.loading) {
      console.log(getAppConfigReq.data)
      setTerms(getAppConfigReq.data.termsAndConditions)
    }
  }, [getAppConfigReq.loading])

  useFocusEffect(
    React.useCallback(() => {
      doGetAppConfig({
        url: GRCGDS_BACKEND,
        headers: {
          clientId: CLIENT_ID,
        },
        params: { module_name: 'APP_CONFIG' },
      });
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Layout style={{ flex: 1, padding: '5%', backgroundColor: 'white' }}>

        <Layout style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#00000000', alignItems: 'center' }}>
          <MenuButton />
        </Layout>

        <ScrollView contentContainerStyle={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000', marginTop: '10%', marginBottom: '10%' }}>
          <Text style={{ fontFamily: AppFontRegular, marginBottom: '5%', textAlign: 'center' }} category="h3">
            {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_SCREEN_TITLE).toString()}
          </Text>

          <HTML html={terms} />

        </ScrollView>

        <Button
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
          size="giant"
          style={{
            backgroundColor: APP_BRAND_COLOR,
            borderColor: APP_BRAND_COLOR,
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
          {() => <Text style={{ fontFamily: AppFontRegular, color: 'white', fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_GO_BACK).toString()}</Text>}
        </Button>

      </Layout>
    </SafeAreaView>
  );
};

export default DocumentScreen