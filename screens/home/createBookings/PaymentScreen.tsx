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

const GET_PAYPAL_JSON = (vehicle: CarSearchItem, meta, extras: (PricedEquip & { amount: number })[]) => {

    return {
        "intent": "CAPTURE",
        "purchase_units": [{
            "amount": {
                "currency_code": "GBP",
                "value": new Decimal(vehicle.VehAvailCore.TotalCharge.RateTotalAmount).toString(),
                "description": "Be featured on our app",
            }
        }],
        "application_context": {
            "return_url": "https://grcgds.com/mobileapp/index.php?module_name=PAYMENT_SUCCESS",
            "cancel_url": "https://grcgds.com/mobileapp/index.php?module_name=PAYMENT_CANCELLED",
        }
    }
};

type ParamList = {
    Payment: {
        vehicle: CarSearchItem;
    };
};
const PaymentScreen = () => {
    const navigation = useNavigation();
    const { i18n } = useTranslation();
    const route = useRoute<RouteProp<ParamList, 'Payment'>>();

    const [paypalClientId] = useGlobalState("paypalClientId");
    const [paypalSecretKey] = useGlobalState("paypalSecretKey");
    const [originLocation] = useCreateBookingState("originLocation");
    const [returnLocation] = useCreateBookingState("returnLocation");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [termsAcepted, setTermsAcepted] = useState(false);

    const [extras] = useCreateBookingState("extras");

    const urls = getPaypalUrls("DEV")
    const { generatePaymentOrderFor, getAccessTokenReq } = UsePaypal({ paypalClientId, paypalSecretKey, paypalPaymentUrl: urls.PAYPAL_CAPTURE_URL, paypalTokenUrl: urls.PAYPAL_TOKEN_URL })

    const paypalJson = GET_PAYPAL_JSON(
        route.params.vehicle,
        { originLocation, returnLocation },
        extras
    )

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', display: 'flex' }} keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: 'white' }}>

                <Layout>
                    <Layout style={{ marginTop: '5%' }}>
                        <Layout style={{ backgroundColor: '#f0f2f3', padding: '5%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <MenuButton />
                                <Text style={{ marginLeft: '5%', fontSize: 24, fontFamily: AppFontBold }}>
                                    {i18n.t(TRANSLATIONS_KEY.PAYMENT_SCREEN_TILE).toString()}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <View>
                                    <Text style={{ fontSize: 24, fontFamily: AppFontBold }}>
                                        {ResolveCurrencySymbol(paypalJson.purchase_units[0].amount.currency_code)}{' '}
                                        {new Decimal(paypalJson.purchase_units[0].amount.value).add(extras.reduce((prev, next) => {
                                            prev = new Decimal(next.PricedEquip.Charge.Amount).times(next.amount).add(prev).toNumber()
                                            return prev
                                        }, 0)).toFixed(2)}
                                    </Text>
                                </View>
                                <View style={{ marginLeft: '15%', }}>
                                    <BackButton />
                                </View>
                            </View>
                        </Layout>
                        <Layout style={{ padding: '5%' }}>
                            <TabView
                                indicatorStyle={{ backgroundColor: '#000000' }}
                                selectedIndex={selectedIndex}
                                onSelect={index => setSelectedIndex(index)}>
                                <Tab style={{ paddingTop: '4%', paddingBottom: '1%' }} title={evaProps => <Text {...evaProps} style={{ fontSize: 18, fontFamily: AppFontBold, color: selectedIndex == 0 ? APP_BRAND_COLOR : '#aeb1c3' }}>Paypal</Text>} >
                                    <View style={{ paddingTop: '10%', display: 'flex', alignItems: 'center' }}>
                                        <Image source={require('../../../image/paypal_logo.png')} />
                                        <Text style={{ fontSize: 20, textAlign: 'center', fontFamily: AppFontRegular }}>
                                            {i18n.t(TRANSLATIONS_KEY.PAYMENT_INFO).toString()}
                                        </Text>
                                        <CheckBox
                                            status="control"
                                            style={{ width: '90%', marginTop: '5%', justifyContent: 'flex-start' }}
                                            checked={termsAcepted}
                                            onChange={nextChecked => setTermsAcepted(nextChecked)}>
                                            {evaProps => {
                                                return (
                                                    <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', marginLeft: '3%' }}>
                                                        <Text {...evaProps} style={{ fontFamily: AppFontRegular, fontSize: 16 }}>
                                                            {i18n.t(TRANSLATIONS_KEY.PAYMENT_AGREE_AND_UNDERSTAND).toString()}
                                                        </Text>
                                                        <Text {...evaProps} style={{ fontFamily: AppFontRegular, fontSize: 16 }}>
                                                            {i18n.t(TRANSLATIONS_KEY.RIGHT_CARS_WORD).toString()}{' '}
                                                        </Text>
                                                        <Text {...evaProps} onPress={() => navigation.navigate('TermsConditions')} style={{ fontFamily: AppFontRegular, color: APP_BRAND_COLOR, fontSize: 16 }}>
                                                            {i18n.t(TRANSLATIONS_KEY.TERMS_CONDITIONS_WORD).toString()}
                                                        </Text>
                                                        <Text {...evaProps} style={{ fontFamily: AppFontRegular, fontSize: 16 }}>
                                                            {' '}{i18n.t(TRANSLATIONS_KEY.AND_WORD).toString()}{' '}
                                                        </Text>
                                                        <Text {...evaProps} onPress={() => navigation.navigate('Policy')} style={{ fontFamily: AppFontRegular, color: APP_BRAND_COLOR, fontSize: 16 }}>
                                                            {i18n.t(TRANSLATIONS_KEY.PRIVACY_POLICY_WORD).toString()}.
                                                        </Text>
                                                    </View>
                                                );
                                            }}
                                        </CheckBox>
                                    </View>
                                </Tab>
                            </TabView>
                        </Layout>
                        <View style={{ padding: '5%' }}>
                            <Button
                                disabled={!termsAcepted}
                                onPress={async () => {
                                    generatePaymentOrderFor(paypalJson)
                                        .then((res) => {
                                            console.log(res.data)
                                            navigation.navigate('WebView', { url: res.data.links.find(i => i.rel == 'approve').href, paypalPaymentId: res.data.id, paypalJson: paypalJson, ...paypalJson })

                                        })
                                        .catch(err => {
                                            console.log(err);
                                            if (err.response) {
                                                console.log(err.response.data);
                                            }
                                        })
                                }}
                                accessoryRight={getAccessTokenReq.loading ? LoadingSpinner : undefined}
                                size="giant" style={{
                                    borderRadius: 10,
                                    marginTop: '10%',
                                    backgroundColor: termsAcepted ? APP_BRAND_COLOR : `${APP_BRAND_COLOR}50`,
                                    borderColor: termsAcepted ? APP_BRAND_COLOR : `${APP_BRAND_COLOR}50`,
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    marginBottom: '2%'
                                }}>
                                {() => <Text style={{ color: getAccessTokenReq.loading ? "#ACB1C0" : 'white', fontFamily: AppFontBold, fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.PAYMENT_BOOOK_NOW_BTN).toString()}</Text>}
                            </Button>
                        </View>
                    </Layout>

                </Layout>
            </ScrollView >

        </SafeAreaView>
    )
};


export default PaymentScreen