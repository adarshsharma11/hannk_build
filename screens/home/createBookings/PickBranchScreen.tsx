import React, { useState, useEffect } from 'react'
import { Layout, Text, Input, Button, CheckBox, Tab, TabView } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, View, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import useAxios from 'axios-hooks'
import { useCreateBookingState } from './CreateBookingState';
import base64 from 'react-native-base64'
import { UsePaypal } from 'hannk-mobile-common'
import { Decimal } from 'decimal.js';
import LoadingSpinner from '../../../partials/LoadingSpinner';
import { CarSearchItem, PricedEquip } from '../../../types/SearchVehicleResponse';
import ResolveCurrencySymbol from '../../../utils/ResolveCurrencySymbol';
import MenuButton from '../../../partials/MenuButton';
import { AppFontBold, AppFontRegular } from '../../../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';
import BackButton from '../../../partials/BackButton';
import { APP_BRAND_COLOR } from '../../../constants/Colors';
import { useGlobalState } from '../../../state';
import { getPaypalUrls } from '../../../utils/PaypalUrls';
import BranchMap from './carlist/BranchMap';


type ParamList = {
    Payment: {
        vehicle: CarSearchItem;
    };
};
const PickBranchScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [, setPickedBranch] = useCreateBookingState("pickedBranch");
    const { i18n } = useTranslation();
    const [selectedLocation, setSelectedLocation] = useState();

    useEffect(() => {
        if (selectedLocation) {
            setPickedBranch(selectedLocation)
            navigation.navigate('CarsList', route.params);
        }
    }, [selectedLocation])


    return (
        <SafeAreaView style={{ flex: 1 }} >
            <Layout>
                <View style={{ display: 'flex', flexDirection: 'row', position: "absolute", zIndex: 2, padding: '15%' }}>
                    <MenuButton />
                </View>
                <BranchMap
                    cars={route?.params?.cars}
                    onLocationChange={(location) => {
                        setSelectedLocation(location)
                    }}
                />
            </Layout>
        </SafeAreaView>
    )
};


export default PickBranchScreen