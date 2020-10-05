import React, { useState } from 'react'
import { Layout, Text, Input, Button, CheckBox, Tab, TabView } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, View, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import useAxios from 'axios-hooks'
import { useCreateBookingState } from './CreateBookingState';
import base64 from 'react-native-base64'
import { Decimal } from 'decimal.js';
import LoadingSpinner from '../../../partials/LoadingSpinner';
import { VehVendorAvail, PricedEquip } from '../../../types/SearchVehicleResponse';
import ResolveCurrencySymbol from '../../../utils/ResolveCurrencySymbol';
import MenuButton from '../../../partials/MenuButton';
import { AppFontBold, AppFontRegular } from '../../../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';
import BackButton from '../../../partials/BackButton';

const GET_PAYPAL_JSON = (vehicle: VehVendorAvail, meta, extras: (PricedEquip & { amount: number })[]) => {
    return {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "transactions": [{
            "amount": {
                "total": new Decimal(vehicle.TotalCharge.RateTotalAmount).toString(),
                "currency": vehicle.VehicleCharge.CurrencyCode || "USD",
            },
            "description": "This is the payment transaction description.",
            "custom": "EBAY_EMS_90048630024435",
            "invoice_number": "48787589673",
            "payment_options": {
                "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
            },
            "soft_descriptor": "ECHI5786786",
            "item_list": {
                "items": [{
                    "name": `Ride on ${vehicle.Vehicle.VehMakeModel.Name}`,
                    "description": `A ride from ${meta?.originLocation?.locationname} to ${meta?.returnLocation?.locationname}`,
                    "quantity": "1",
                    "price": vehicle.TotalCharge.RateTotalAmount,
                    "tax": "0",
                    "sku": "1",
                    "currency": vehicle.VehicleCharge.CurrencyCode || "USD"
                },
                ],
            }
        }],
        "note_to_payer": "Contact us for any questions on your order.",
        "redirect_urls": {
            "return_url": "https://right-cars.com/mobileapp/index.php?module_name=PAYMENT_SUCCESS",
            "cancel_url": "https://right-cars.com/mobileapp/index.php?module_name=PAYMENT_CANCELLED",
        }
    }
};

type ParamList = {
    Payment: {
        vehicle: VehVendorAvail;
    };
};
export default () => {
    const navigation = useNavigation();
    const { i18n } = useTranslation();
    const route = useRoute<RouteProp<ParamList, 'Payment'>>();

    const [originLocation] = useCreateBookingState("originLocation");
    const [returnLocation] = useCreateBookingState("returnLocation");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [termsAcepted, setTermsAcepted] = useState(false);

    const [extras] = useCreateBookingState("extras");

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    const basic = base64.encode(`AcfO5vyIR0TVL7suCJZYRyQe4DWREqtPeIc0VqTSdIWidz-OWtnyufCKUYmfHE7Sm0TLdwhWw3K5Cg2y:EJ8Mupf6iYRBd6qiWhOdam0r0HpwSUaRGgypfbvUgHgRKIbvbBE72zhrqWSlAbyrl_-GKTa8arfDXp_3`)
    const [{ data, loading, error }, getAccessToken] = useAxios({
        url: `https://api.paypal.com/v1/oauth2/token`,
        method: 'POST',
        params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${basic}`,
        },
    }, { manual: true })

    const [, doPayment] = useAxios({
        url: 'https://api.paypal.com/v1/payments/payment',
        method: 'POST'
    }, { manual: true })

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
                                        {ResolveCurrencySymbol(paypalJson.transactions[0].amount.currency)}{' '}
                                        {new Decimal(paypalJson.transactions[0].amount.total).add(extras.reduce((prev, next) => {
                                            prev = new Decimal(next.Charge.Amount).times(next.amount).add(prev).toNumber()
                                            return prev
                                        }, 0)).toFixed(2)}
                                    </Text>
                                </View>
                                <View style={{ marginLeft: '15%',}}>
                                    <BackButton />
                                </View>
                            </View>
                        </Layout>
                        <Layout style={{ padding: '5%' }}>
                            <TabView
                                indicatorStyle={{ backgroundColor: '#41d5fb' }}
                                selectedIndex={selectedIndex}
                                onSelect={index => setSelectedIndex(index)}>
                                <Tab style={{ paddingTop: '4%', paddingBottom: '1%' }} title={evaProps => <Text {...evaProps} style={{ fontSize: 18, fontFamily: AppFontBold, color: selectedIndex == 0 ? '#41d5fb' : '#aeb1c3' }}>Paypal</Text>} >
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
                                                        <Text {...evaProps} onPress={() => navigation.navigate('TermsConditions')} style={{ fontFamily: AppFontRegular, color: '#41d5fb', fontSize: 16 }}>
                                                            {i18n.t(TRANSLATIONS_KEY.TERMS_CONDITIONS_WORD).toString()}
                                                        </Text>
                                                        <Text {...evaProps} style={{ fontFamily: AppFontRegular, fontSize: 16 }}>
                                                            {' '}{i18n.t(TRANSLATIONS_KEY.AND_WORD).toString()}{' '}
                                                        </Text>
                                                        <Text {...evaProps} onPress={() => navigation.navigate('Policy')} style={{ fontFamily: AppFontRegular, color: '#41d5fb', fontSize: 16 }}>
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
                                    getAccessToken()
                                        .then(res => {

                                            return doPayment({
                                                headers: {
                                                    'Authorization': `Bearer ${res.data.access_token}`
                                                },
                                                data: paypalJson
                                            })
                                        })
                                        .then((res) => {
                                            console.log(JSON.stringify(res.data))
                                            navigation.navigate('WebView', { url: res.data.links.find(i => i.method == 'REDIRECT').href, paypalPaymentId: res.data.id, ...paypalJson })
                                        })
                                        .catch(err => {
                                            console.log(err)
                                            if (err.response) {
                                                console.log(err.response.data);
                                            }
                                        })
                                }}
                                accessoryRight={loading ? LoadingSpinner : undefined}
                                size="giant" style={{
                                    borderRadius: 10,
                                    marginTop: '10%',
                                    backgroundColor: termsAcepted ? '#41d5fb' : '#e4e9f2',
                                    borderColor: termsAcepted ? '#41d5fb' : '#e4e9f2',
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    marginBottom: '2%'
                                }}>
                                {() => <Text style={{ color: loading ? "#ACB1C0" : 'white', fontFamily: AppFontBold, fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.PAYMENT_BOOOK_NOW_BTN).toString()}</Text>}
                            </Button>
                        </View>
                    </Layout>

                </Layout>
            </ScrollView >

        </SafeAreaView>
    )
};
