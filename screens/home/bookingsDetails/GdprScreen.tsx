import React, { useEffect, useState, useRef } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, ScrollView, Image, TextInput, View } from 'react-native';
import useAxios from 'axios-hooks'
import SignatureCapture from 'react-native-signature-capture';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { useGlobalState } from '../../../state';
import MenuButton from '../../../partials/MenuButton';
import { AppFontRegular } from '../../../constants/fonts';
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';
import * as Progress from 'react-native-progress';
import { useCarDetailState } from './detailsState';
import { APP_BRAND_COLOR } from '../../../constants/Colors';
const xml2js = require('react-native-xml2js');

const GdprScreen = () => {
    const { params } = useRoute<any>();
    const navigation = useNavigation();
    const [gdprText, setGdprText] = useState()
    const [loading, setLoading] = useState(false)
    const [isAllowing, setIsAllowing] = useCarDetailState("isAllowing");

    useEffect(() => {
        setLoading(true)
        fetch(`https://ota.right-cars.com/`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/xml"
            },
            body: `<OTA_resdetmobRQ xmlns="http://www.opentravel.org/OTA/2003/05"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05
            resdetmob.xsd">
            <POS>
            <Source>
            <RequestorID Type="1" ID="MOBILE001" ID_Name="RightCars" />
            </Source>
            </POS>
            <VehRetResRQCore>
            <ResNumber Number="${params?.registratioNumber}"/>
            </VehRetResRQCore>
            </OTA_resdetmobRQ>` // body data type must match "Content-Type" header
          })
          .then(r => {
              return r.text()
          })
          .then(r => {
              xml2js.parseString(r, (err, result) => {
                setGdprText(result.OTA_resdetmobRS.VehRetResRSCore[0].VehReservation[0].VehSegmentInfo[0].GDPR[0].Msg[0])
                setLoading(false)
            })
          })
    }, [])

    return (
        <View style={{ paddingTop: '5%', height: '90%', paddingLeft: '5%', paddingRight: '5%', display: 'flex', flexDirection: 'column' }}>
            <View style={[{ flex: 1 }]}>
                {loading && (
                    <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Progress.Circle
                            showsText={true}
                            textStyle={{ color: APP_BRAND_COLOR }}
                            color={APP_BRAND_COLOR}
                            borderWidth={4}
                            size={150}
                            indeterminate={true}
                        />
                    </View>
                )}

                {!loading && gdprText && (
                    <>
                        <Text style={{ textAlign: 'center', fontSize: 34, marginBottom: '5%' }}>GDPR</Text>
                        <Text style={{ flexGrow: 1, textAlign: 'justify' }}>{gdprText}</Text>
                        <Layout style={{ backgroundColor: '#00000000', flex: 1 }}>
                            <Button onPress={() => navigation.navigate("InsuranceScreen", { ...params })} size="giant" style={{ borderRadius: 10, backgroundColor: '#5ac8fa', borderColor: '#5ac8fa', paddingLeft: 20, paddingRight: 20, marginBottom: '2%' }}>
                                {() => <Text style={{ fontFamily: AppFontRegular, color: 'white' }}>Accept</Text>}
                            </Button>
                            <Button onPress={() => {
                                setIsAllowing(false)
                                navigation.navigate("Home")
                            }} size="giant" style={{ borderRadius: 10, backgroundColor: '#cf1830', borderColor: '#cf1830', paddingLeft: 20, paddingRight: 20 }}>
                                {() => <Text style={{ fontFamily: AppFontRegular, color: 'white' }}>Decline</Text>}
                            </Button>
                        </Layout>
                    </>
                )}

            </View>
        </View>
    );
};

export default GdprScreen