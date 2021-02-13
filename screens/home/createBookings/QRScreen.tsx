import React, { useState, useEffect } from 'react'
import { Layout, Text, Input, Button, CheckBox, Tab, TabView } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, View, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { CarSearchItem, PricedEquip } from '../../../types/SearchVehicleResponse';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppFontBold, AppFontRegular } from '../../../constants/fonts';
import { APP_BRAND_COLOR } from '../../../constants/Colors';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';
import QRCode from 'react-native-qrcode-svg';
import { storeLocalBooking } from '../../../state/extraState';
import { useCreateBookingState } from './CreateBookingState';
import { MarkerVehicleType } from '../../../utils/MarkerVehicleType';

type ParamList = {
    Payment: {
        vehicle: CarSearchItem;
        type: MarkerVehicleType;
        hideQr: boolean
    };
};
const QRScreen = () => {
    const navigation = useNavigation();
    const { i18n } = useTranslation();
    const route = useRoute<RouteProp<ParamList, 'Payment'>>();

    const [departureTime, setDepartureTime] = useCreateBookingState("departureTime");
    const [returnTime, setReturnTime] = useCreateBookingState("returnTime");
    const [originLocation, setOriginLocation] = useCreateBookingState("originLocation");

    const baseCircleSize = 250

    const hideQr = route.params.hideQr != undefined ? route.params.hideQr : false

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: 'white' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: (baseCircleSize - 20), height: (baseCircleSize - 20), borderRadius: (baseCircleSize - 20) / 2 }}>
                    <Text style={{ fontSize: 34, textAlign: 'center' }}>Thanks for your booking</Text>
                </View>

                <MaterialCommunityIcon name={"checkbox-marked-circle-outline"} color={"green"} size={200} />
                <Button
                    onPress={(e) => {
                        storeLocalBooking({
                            dropTime: returnTime.toString(),
                            pickTime: departureTime.toString(),
                            locationCode: originLocation?.Branchname || 'LHRA01',
                            bookingType: route.params.type
                        })
                        .then(() => {
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 1,
                                    routes: [
                                        { name: 'Home', state: {
                                            routes: [ { name: "MyBookings"} ]
                                        } },
                                    ],
                                })
                            );
                        })
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


export default QRScreen