import React, { useState, useEffect } from 'react'
import { Layout, Text, Input, Button, CheckBox, Tab, TabView } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, View, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { CarSearchItem, PricedEquip } from '../../../types/SearchVehicleResponse';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppFontBold, AppFontRegular } from '../../../constants/fonts';
import { APP_BRAND_COLOR } from '../../../constants/Colors';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';
import { MarkerVehicleType } from '../../../utils/MarkerVehicleType';

type ParamList = {
    Payment: {
        vehicle: CarSearchItem;
        type: MarkerVehicleType;
    };
};
const ScooterChargeScreen = () => {
    const navigation = useNavigation();
    const { i18n } = useTranslation();
    const route = useRoute<RouteProp<ParamList, 'Payment'>>();

    const baseCircleSize = 180
    let icon = 'bicycle'
    if (route.params.type == MarkerVehicleType.MOPED) icon = 'motorbike'
    if (route.params.type == MarkerVehicleType.SCOOTER) icon = 'scooter'

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: 'white' }}>
                <View style={{ marginTop: '10%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#049930', width: baseCircleSize, height: baseCircleSize, borderRadius: baseCircleSize / 2 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: (baseCircleSize - 20), height: (baseCircleSize - 20), borderRadius: (baseCircleSize - 20) / 2 }}>
                        <MaterialCommunityIcon name={icon} size={baseCircleSize - 75} color={'#049930'} />
                    </View>
                </View>

                <Text style={{ fontFamily: AppFontRegular, textAlign: 'center', fontSize: 26 }}>2hr and 20 min</Text>
                <Text style={{ fontFamily: AppFontRegular, textAlign: 'center', fontSize: 26 }}>25 miles</Text>
                <View style={{ borderWidth: 1, padding: '10%', marginTop: '5%' }}>
                    <Text style={{ fontFamily: AppFontRegular, textAlign: 'center', fontSize: 26, color: 'steelblue' }}>£15</Text>
                    <Text style={{ fontFamily: AppFontRegular, textAlign: 'center', fontSize: 26 }}>Tax Included</Text>
                </View>
                <Button
                    onPress={(e) => {
                        const vehicle = {
                            VehAvailCore: {
                                TotalCharge: {
                                    RateTotalAmount: route.params.vehicle.finalCost
                                }
                            }
                        }
                        navigation.navigate('Payment', { vehicle, goTo: 'MyBookings' })
                    }}
                    size="giant"
                    style={{
                        marginTop: 'auto',
                        width: '60%',
                        marginBottom: '10%',
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
                    {() => <Text style={{ fontFamily: AppFontBold, color: 'white', fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.PROCEED_TO_PAYMENT).toString()}</Text>}
                </Button>
            </ScrollView >
        </SafeAreaView>
    )
};


export default ScooterChargeScreen