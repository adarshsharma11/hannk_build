import React, { useEffect, useState } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, ScrollView, Image, TextInput, View, Platform } from 'react-native';
import MenuButton from '../../../partials/MenuButton';
import { AppFontBold, AppFontRegular } from '../../../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MarkerVehicleType } from '../../../utils/MarkerVehicleType';
import LinearGradient from 'react-native-linear-gradient';
import { APP_BRAND_COLOR } from '../../../constants/Colors';

const baseCircleSize = 300

const NoCarReservationScreen = () => {
    const { i18n } = useTranslation();
    const { params } = useRoute<any>();
    const navigation = useNavigation<any>();

    let icon = 'bicycle'
    if (params.vehicleType == MarkerVehicleType.MOPED) icon = 'motorbike'
    if (params.vehicleType == MarkerVehicleType.SCOOTER) icon = 'scooter'

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView keyboardShouldPersistTaps={"handled"} contentContainerStyle={{ flexGrow: 1, backgroundColor: '#f7f9fc', padding: '5%' }}>
                <View style={{ flexDirection: 'row' }}>
                    <View>
                        <MenuButton />
                    </View>
                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                        <Text style={{ fontFamily: AppFontRegular, textAlign: 'center', textTransform: 'uppercase' }} category="h5">
                            {i18n.t(TRANSLATIONS_KEY.CONFIRMATION_WORD).toString()}
                        </Text>
                        <Text style={{ textAlign: 'center', fontFamily: AppFontBold, fontSize: 22 }} >
                            {params.booking.registratioNumber}{' '}
                        </Text>
                    </View>
                </View>
                <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    {params.booking.vehicleType == MarkerVehicleType.CHARGE && (
                        <>
                            <LinearGradient colors={['#007c00', '#f7a000', '#f70000']} style={{ marginTop: '10%', justifyContent: 'center', alignItems: 'center', width: baseCircleSize, height: baseCircleSize, borderRadius: baseCircleSize / 2 }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: (baseCircleSize - 20), height: (baseCircleSize - 20), borderRadius: (baseCircleSize - 20) / 2 }}>
                                    <MaterialCommunityIcon name="car" size={baseCircleSize - 120} />
                                    <MaterialCommunityIcon name="battery-charging-high" size={50} />
                                </View>
                            </LinearGradient>
                        </>
                    )}
                    {params.booking.vehicleType != MarkerVehicleType.CHARGE && (
                        <>
                            <View style={{ marginTop: '10%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#049930', width: baseCircleSize, height: baseCircleSize, borderRadius: baseCircleSize / 2 }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: (baseCircleSize - 20), height: (baseCircleSize - 20), borderRadius: (baseCircleSize - 20) / 2 }}>
                                    <MaterialCommunityIcon name={icon} size={baseCircleSize - 75} color={'#049930'} />
                                </View>
                            </View>
                        </>
                    )}
                </View>

                <Button
                    onPress={(e) => {
                        let nextScreen = "ScooterCharge"
                        if (params.booking.vehicleType == MarkerVehicleType.CHARGE) {
                            nextScreen = "ScooterPower"
                        }
                        navigation.navigate(params.isComplete ? nextScreen : "CompleteQrBooking", { vehicle: params.booking, type: params.booking.vehicleType })
                    }}
                    size="giant"
                    style={{
                        marginTop: 'auto',
                        width: '60%',
                        marginBottom: '10%',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        backgroundColor:  APP_BRAND_COLOR,
                        borderColor:  APP_BRAND_COLOR,
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
                    {() => <Text style={{ fontFamily: AppFontBold, color: 'white', fontSize: 18 }}>{i18n.t(params.isComplete ? TRANSLATIONS_KEY.COMPLETE_WORD: TRANSLATIONS_KEY.PAYMENT_BOOOK_NOW_BTN).toString()}</Text>}
                </Button>

            </ScrollView>
        </SafeAreaView>
    );
};

export default NoCarReservationScreen