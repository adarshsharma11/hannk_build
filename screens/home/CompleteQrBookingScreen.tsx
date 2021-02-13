import React, { useState, useEffect } from 'react'
import { Layout, Text, Input, Button, CheckBox, Tab, TabView } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, View, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { CarSearchItem, PricedEquip } from '../../types/SearchVehicleResponse';
import { useTranslation } from 'react-i18next';
import { AppFontBold, AppFontRegular } from '../../constants/fonts';
import { APP_BRAND_COLOR } from '../../constants/Colors';
import { TRANSLATIONS_KEY } from '../../utils/i18n';
import QRCode from 'react-native-qrcode-svg';
import { MarkerVehicleType } from '../../utils/MarkerVehicleType';

type ParamList = {
    Payment: {
        vehicle: CarSearchItem;
        type: MarkerVehicleType;
        nextScreen: string
    };
};
const CompleteQrBookingScreen = () => {
    const navigation = useNavigation();
    const { i18n } = useTranslation();
    const route = useRoute<RouteProp<ParamList, 'Payment'>>();

    const baseCircleSize = 250

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: 'white' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: (baseCircleSize - 20), height: (baseCircleSize - 20), borderRadius: (baseCircleSize - 20) / 2 }}>
                    <Text style={{ fontSize: 34, textAlign: 'center' }}>Scan this code to complete the booking</Text>
                </View>

                <View style={{ borderWidth: 1, padding: '10%', marginTop: '5%', alignItems: 'center' }}>
                    <QRCode logoSize={220} value="http://awesome.link.qr" />
                </View>
                <Button
                    onPress={(e) => {
                        navigation.navigate(route.params.nextScreen, {  screen: 'Home', params: {...route.params.vehicle, booking: route.params.vehicle, isComplete: true, leftImageUri: undefined}, ...route.params} )
                    }}
                    size="giant"
                    style={{
                        marginTop: 'auto',
                        width: '60%',
                        marginBottom: '10%',
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
                    {() => <Text style={{ fontFamily: AppFontBold, color: 'white', fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.DONE_WORD).toString()}</Text>}
                </Button>
            </ScrollView >
        </SafeAreaView>
    )
};


export default CompleteQrBookingScreen