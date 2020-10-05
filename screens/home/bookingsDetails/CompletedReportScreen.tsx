import React, { useEffect, useState, useRef } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import LoadingSpinner from '../../../partials/LoadingSpinner';
import { SafeAreaView, ScrollView, Image, TextInput, View, Platform } from 'react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import useAxios, { makeUseAxios } from 'axios-hooks'
import { useCarDetailState } from './detailsState';
import MenuButton from '../../../partials/MenuButton';
import { AppFontBold, AppFontRegular } from '../../../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';
import { useGlobalState } from '../../../state';

const useSimpleAxios = makeUseAxios({})

const DocumentScreen = ({ navigation, route }) => {
  const { i18n } = useTranslation();
  const [details] = useCarDetailState("details");
  const [isAllowing, setIsAllowing] = useCarDetailState("isAllowing");
  const [token] = useGlobalState("token")

  const [postReq, post] = useSimpleAxios({
    url: `http://grcgds.com/mobileapp/index.php`,
    method: 'POST',
    headers: { Auth: `Bearer ${token}` },
  }, { manual: true })

  const [sendFileReq, sendFile] = useAxios({
    url: `http://grcgds.com/mobileapp/index.php`,
    method: 'POST',
    validateStatus: () => true,
    onUploadProgress: (e) => {
      var percentCompleted = Math.round((e.loaded * 100) / e.total)
    }
  }, { manual: true })

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView keyboardShouldPersistTaps={"handled"} contentContainerStyle={{ flexGrow: 1, display: 'flex', backgroundColor: '#f7f9fc' }}>
        <Layout style={{ flex: 1, padding: '5%', backgroundColor: 'white' }}>
          <MenuButton />

          <Layout style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000', marginTop: '10%', marginBottom: '10%' }}>
            <Text style={{ fontFamily: AppFontBold, marginBottom: '10%', textAlign: 'center' }} category="h3">
              {i18n.t(TRANSLATIONS_KEY.SIGN_OUR_AGREEMEN).toString()}
            </Text>

            <View>
              <Image
                style={{ borderWidth: 1, borderColor: '#41d5fb', height: '65%', resizeMode: 'contain' }}
                source={{ uri: route?.params?.signImagePath }}
              />
            </View>


          </Layout>


          <Button
            disabled={postReq.loading}
            accessoryRight={postReq.loading ? LoadingSpinner : undefined}
            onPress={() => {
              const splittedString = route?.params.pathName.split('.')
              const data = new FormData();

              data.append("module_name", "SIGNATURE_UPLOAD");
              data.append("resNumber", details?.registratioNumber);
              data.append("file", {
                name: `signature.${splittedString[splittedString.length - 1]}`,
                type: `image/${splittedString[splittedString.length - 1]}`,
                uri: (Platform.OS === 'android') ? `file://${route?.params.pathName}` : route?.params.pathName.replace('file://', '')
              });

              sendFile({data})
              .then((r) => {
                const data = {
                  module_name: "GENERATE_PDF",
                  image_format: splittedString[splittedString.length - 1],
                  ...details
                }
                post({ data })
              })
              .then(r => navigation.navigate("Home", details))
              .then(err => console.log(err))
              setIsAllowing(false)
            }}
            size="giant"
            style={{
              backgroundColor: postReq.loading == false ? '#41d5fb' : '#e4e9f2',
              borderColor: postReq.loading == false ? '#41d5fb' : '#e4e9f2',
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
            {() => <Text style={{ color: 'white', fontFamily: AppFontBold, fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.COMPLETE_WORD).toString()}</Text>}
          </Button>

        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DocumentScreen