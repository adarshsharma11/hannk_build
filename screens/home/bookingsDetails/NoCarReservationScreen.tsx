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

const NoCarReservationDetails = ({ params }) => {
    const { i18n } = useTranslation();
    const navigation = useNavigation<any>();

    let icon = 'bicycle'
    if (params.vehicleType == MarkerVehicleType.MOPED) icon = 'motorbike'
    if (params.vehicleType == MarkerVehicleType.SCOOTER) icon = 'scooter'

    return (
        <View style={{ paddingTop: '5%', flexGrow: 1 }}>
            <View style={{ flexDirection: 'row' }}>
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
        </View>
    );
};

export default NoCarReservationDetails