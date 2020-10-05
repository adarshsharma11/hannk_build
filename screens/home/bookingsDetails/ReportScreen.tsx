import React, { useEffect, useState } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, ScrollView, Image, TextInput, View, Platform } from 'react-native';
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';
import * as Progress from 'react-native-progress';
import useAxios from 'axios-hooks'
import { TouchableOpacity } from 'react-native-gesture-handler';
import MenuButton from '../../../partials/MenuButton';
import { AppFontBold, AppFontRegular } from '../../../constants/fonts'
import { GRCGDS_BACKEND } from 'react-native-dotenv';
import LoadingSpinner from '../../../partials/LoadingSpinner';
import { useCarDetailState } from './detailsState';
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';
import { useRoute } from '@react-navigation/native';

const imageArr = []

imageArr[0] = require('../../../image/car-1.jpg')
imageArr[1] = require('../../../image/car-2.jpg')
imageArr[2] = require('../../../image/car-3.jpg')
imageArr[3] = require('../../../image/car-4.jpg')
imageArr[4] = require('../../../image/car-5.jpg')
imageArr[5] = require('../../../image/car-6.jpg')
imageArr[6] = require('../../../image/car-7.jpg')
imageArr[7] = require('../../../image/car-8.jpg')

const DocumentScreen = ({ navigation }) => {
  const { i18n } = useTranslation();
  const { params } = useRoute<any>();
  const maxPhotosAmount = 8
  const [pictures, setPictures] = useState<{ [k: number]: ImagePickerResponse }>({});
  const [currentPicktureIndex, setCurrentPicktureIndex] = useState(0);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [details] = useCarDetailState("details");


  const [postReq, post] = useAxios({
    url: `http://grcgds.com/mobileapp/index.php`,
    method: 'POST',
    onUploadProgress: (e) => {
      console.log(e)
      var percentCompleted = Math.round((e.loaded * 100) / e.total)
      console.log("percentCompleted", percentCompleted)
      setUploadPercent(percentCompleted);
    }
  }, { manual: true })

  const options = {
    title: 'Select Avatar',
    maxWidth: 1000,
    maxHeight: 1000,
    compressImageQuality: 0.6,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps={"handled"} contentContainerStyle={{ flexGrow: 1, display: 'flex', backgroundColor: '#f7f9fc' }}>
        {postReq.loading && (
          <View style={{ backgroundColor: 'rgba(255,255,255,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 4 }}>
            <Progress.Circle
              showsText={true}
              textStyle={{ color: "#41d5fb" }}
              color={"#41d5fb"}
              size={100}
              progress={uploadPercent / 100}
              indeterminate={uploadPercent == 0}
              formatText={() => {
                return `${uploadPercent}%`
              }}
            />
          </View>
        )}
        <View style={{ backgroundColor: '#f7f9fc' }}>
          <View style={{ position: 'absolute', padding: '5%', zIndex: 2, justifyContent: 'center', alignItems: 'center' }}>
            <MenuButton />
          </View>
          <View style={{ display: 'flex', alignItems: 'center' }}>
            {imageArr[currentPicktureIndex] && <Image source={imageArr[currentPicktureIndex]} style={{ height: 250, margin: 0, padding: 0, resizeMode: 'contain' }} />}
          </View>

          <Layout style={{ marginTop: '-10%', padding: '5%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000000' }}>
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: '10%', }}>
              {Array(maxPhotosAmount).fill(1).map((_, idx) => {
                return (
                  <View style={{ marginLeft: '2%', borderWidth: 1, borderColor: pictures[idx] ? '#41d5fb' : 'white', backgroundColor: pictures[idx] ? 'white' : '#41d5fb', width: 40, height: 40, borderRadius: 40 / 2, display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                    <Text style={{ color: 'white', textAlign: 'center', fontFamily: AppFontBold, fontSize: 20 }}>
                      {!pictures[idx] ? idx + 1 : <MaterialIcons style={{ color: pictures[idx] ? '#41d5fb' : "white" }} size={24} name="check" />}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text style={{ fontFamily: AppFontRegular, textAlign: 'center', marginTop: '15%', }} category="h5">
              {i18n.t(TRANSLATIONS_KEY.COLLECT_INSTRUCTION,{ INDEX: currentPicktureIndex + 1 }).toString()}
            </Text>
            <View style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => {
                ImagePicker.launchCamera(options, (response) => {
                  //console.log('Response = ', response);

                  if (response.didCancel) {
                    console.log('User cancelled image picker');
                  } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                  } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                  } else {
                    const j = { [currentPicktureIndex]: response }
                    setPictures({ ...pictures, ...j })
                  }
                });
              }}>
                <View style={{ marginTop: '10%', backgroundColor: '#41d5fb', width: 100, height: 100, borderRadius: 100 / 2, display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                  <MaterialIcons style={{ color: 'white', alignSelf: 'center' }} size={50} name="camera-alt" />
                </View>
              </TouchableOpacity>
            </View>
            <Button
              disabled={!pictures[currentPicktureIndex]}
              onPress={(e) => {
                const data = new FormData();

                data.append("module_name", "SAVE_DAMAGE_IMAGES");
                data.append("resNumber", details.registratioNumber);

                data.append("files[]", {
                  name: `${currentPicktureIndex + 1}-${pictures[currentPicktureIndex].fileName}`,
                  uri: Platform.OS === 'android' ? pictures[currentPicktureIndex].uri : pictures[currentPicktureIndex].uri.replace('file://', ''),
                  type: pictures[currentPicktureIndex].type,
                });

                post({ data })
                .then((r) => {
                  setUploadPercent(0);
                  setCurrentPicktureIndex(p => {
                    const total = p + 1
                    if (total == maxPhotosAmount) {
                      navigation.navigate("CompletedReport", { pictures, signImagePath: params.signImagePath, pathName: params.pathName })
                      return p;
                    }
                    return total
                  })
                })
                .catch(() => {
                  setUploadPercent(0);
                })
              }}
              size="giant"
              style={{
                width: '90%',
                backgroundColor: !pictures[currentPicktureIndex] ? '#e4e9f2' : '#41d5fb',
                borderColor: !pictures[currentPicktureIndex] ? '#e4e9f2' : '#41d5fb',
                borderRadius: 10,
                shadowColor: '#41d5fb',
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                zIndex: 4,
                shadowOpacity: 0.51,
                shadowRadius: 13.16,
                elevation: 10,
              }}>
              {() => {
                return <Text style={{ fontFamily: AppFontBold, color: !pictures[currentPicktureIndex] ? "#ACB1C0" : 'white', fontSize: 18 }}>
                  Save & Next
                </Text>
              }}
            </Button>
          </Layout>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default DocumentScreen