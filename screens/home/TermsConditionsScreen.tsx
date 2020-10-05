import React, { useRef } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MenuButton from '../../partials/MenuButton';
import { ScrollView } from 'react-native-gesture-handler';
import { AppFontBold, AppFontRegular } from '../../constants/fonts';
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../utils/i18n';

const DocumentScreen = () => {
  const navigation = useNavigation();
  const { i18n } = useTranslation();

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

          <Text style={{ fontFamily: AppFontRegular, marginBottom: '5%', textAlign: 'left' }} category="h5">
            {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_1).toString()}
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >1.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_1_2).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >1.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">

            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >1.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_1_3).toString()}
            </Text>
          </View>

          <Text style={{ fontFamily: AppFontRegular, marginBottom: '5%', marginTop: '5%', textAlign: 'left' }} category="h5">
            {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_2).toString()}
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >1.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_2_1).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >1.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_2_2).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >2.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_2_3).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >3.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_2_4).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >4.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_2_5).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >5.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_2_6).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >6.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_2_7).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >6.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_2_8).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >6.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_2_8_a).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >6.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_2_8_b).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >6.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_2_8_c).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >6.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_2_8_d).toString()}
            </Text>
          </View>

          <Text style={{ fontFamily: AppFontRegular, marginBottom: '5%', marginTop: '5%', textAlign: 'left' }} category="h5">
            {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_3).toString()}
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >1.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_3_1).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >1.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_3_2).toString()}
            </Text>
          </View>

          <Text style={{ fontFamily: AppFontRegular, marginBottom: '5%', marginTop: '5%', textAlign: 'left' }} category="h5">
            {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_4).toString()}
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >1.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_4_1).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >2.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_4_2).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >3.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_4_3).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >4.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_4_4).toString()}
            </Text>
          </View>

          <Text style={{ fontFamily: AppFontRegular, marginBottom: '5%', marginTop: '5%', textAlign: 'left' }} category="h5">
            {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_5).toString()}
          </Text>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >1.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_5_1).toString()}
            </Text>
          </View>

          <Text style={{ fontFamily: AppFontRegular, marginBottom: '5%', marginTop: '5%', textAlign: 'left' }} category="h5">
            {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_6).toString()}
          </Text>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >1.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_6_1).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >2.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_6_2).toString()}
            </Text>
          </View>

          <Text style={{ fontFamily: AppFontRegular, marginBottom: '5%', marginTop: '5%', textAlign: 'left' }} category="h5">
            {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_7).toString()}
          </Text>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >1.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_7_1).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >2.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_7_2).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >3.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_7_3).toString()}
            </Text>
          </View>

          <Text style={{ fontFamily: AppFontRegular, marginBottom: '5%', marginTop: '5%', textAlign: 'left' }} category="h5">
            {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_8).toString()}
          </Text>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >1.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_8_1).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >2.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_8_2).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >3.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_8_3).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >4.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_8_4).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >5.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_8_5).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >6.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_8_6).toString()}
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: AppFontRegular, marginRight: '1%' }} category="h6" >7.</Text>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'left' }} category="h6">
              {i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_8_7).toString()}
            </Text>
          </View>

        </ScrollView>

        <Button
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
          size="giant"
          style={{
            backgroundColor: '#41d5fb',
            borderColor: '#41d5fb',
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
          {() => <Text style={{ fontFamily: AppFontRegular, color: 'white', fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.TERMS_AND_CONDITIONS_GO_BACK).toString()}</Text>}
        </Button>

      </Layout>
    </SafeAreaView>
  );
};

export default DocumentScreen