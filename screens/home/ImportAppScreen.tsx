import React, { useEffect, useState } from 'react';
import { Layout, Button, Text, Input } from '@ui-kitten/components';
import { SafeAreaView, TouchableOpacity, FlatList, View, Alert } from 'react-native';
import useAxios from 'axios-hooks'
import { GRCGDS_BACKEND } from 'react-native-dotenv'
import { TRANSLATIONS_KEY } from '../../utils/i18n';

import LoadingSpinner from '../../partials/LoadingSpinner';
import { AppFontBold, AppFontRegular } from '../../constants/fonts';
import MenuButton from '../../partials/MenuButton';
import { useTranslation } from 'react-i18next';
import HannkSuggestionInput from '../../partials/HannkSuggestionInput';
import { APP_BRAND_COLOR } from '../../constants/Colors';

const ImportAppScreen = () => {
  const { i18n } = useTranslation();
  const [firstname, setFirstname] = useState("")
  const [secondname, setSecondname] = useState("")
  const [email, setEmail] = useState("")
  const [resNumber, setResNumber] = useState("")

  const [{ data = [], loading, error }, getKeys] = useAxios({
    url: `${GRCGDS_BACKEND}?module_name=GET_SUPPORTED_APPS`,
  })
  
  const [importBookingReq, doImportBookingReq] = useAxios({
    url: `${GRCGDS_BACKEND}`,
  })

  const screenIsLoading = () => {
    return loading || importBookingReq.loading
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ backgroundColor: 'white', flexGrow: 1, padding: '5%' }}>
        <View>
          <MenuButton />
          <Text style={{ fontFamily: AppFontRegular, marginBottom: '5%', textAlign: 'center' }} category="h3">
            {i18n.t(TRANSLATIONS_KEY.IMPORTAPPS_SCREEN_TITLE).toString()}
          </Text>
        </View>
        <HannkSuggestionInput options={data.map((o: any) => ({ id: o.grcgdsId, label: o.name }))} />
        <Input
            value={firstname}
            label='First Name'
            placeholder='First Name'
            onChangeText={nextValue => setFirstname(nextValue)}
        />
        <Input
            value={secondname}
            label='Second Name'
            placeholder='Second Name'
            onChangeText={nextValue => setSecondname(nextValue)}
        />
        <Input
            value={email}
            label='Email'
            placeholder='Email'
            onChangeText={nextValue => setEmail(nextValue)}
        />
        <Input
            value={resNumber}
            label='Reservation Number'
            placeholder='Reservation Number'
            onChangeText={nextValue => setResNumber(nextValue)}
        />
        <Button
          disabled={screenIsLoading()}
          onPress={(e) => {
            //RC0921693
            const data = {
              "resNumber": resNumber,
	            "module_name": "IMPORT_BOOKING"
            }
            doImportBookingReq({ data })
            .then(() => Alert.alert("Imported", "Your booking was imported"))
          }}
          size="giant"
          style={{
            marginTop: 'auto',
            backgroundColor: loading == false ? APP_BRAND_COLOR : `${APP_BRAND_COLOR}50`,
            borderColor: loading == false ? APP_BRAND_COLOR : `${APP_BRAND_COLOR}50`,
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
          {() => <Text style={{ fontFamily: AppFontBold, color: loading ? "#ACB1C0" : 'white', fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.IMPORTAPPS_SCREEN_BTN).toString()}</Text>}
        </Button>
      </Layout>
    </SafeAreaView>
  );
};

export default ImportAppScreen