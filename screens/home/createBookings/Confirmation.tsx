
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Text, Input, Button, Select, SelectItem, Popover, Toggle } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, Image, View } from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { Decimal } from 'decimal.js';
import { useCreateBookingState } from './CreateBookingState';
import moment from 'moment';
import CarTripInfoCard from '../../../partials/CarTripInfoCard';
import MenuButton from '../../../partials/MenuButton';
import { AppFontBold } from '../../../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';
import { APP_BRAND_COLOR } from '../../../constants/Colors';
import userHasAllFiles from '../../../utils/userHasAllFiles';
import { useGlobalState } from '../../../state';


export default () => {
    const navigation = useNavigation();
    const { i18n } = useTranslation();
    const [profile] = useGlobalState("profile");

    const [departureTime, setDepartureTime] = useCreateBookingState("departureTime");
    const [returnTime, setReturnTime] = useCreateBookingState("returnTime");
    const [originLocation, setOriginLocation] = useCreateBookingState("originLocation");
    const [returnLocation, setReturnLocation] = useCreateBookingState("returnLocation");
    const [arrivalTime, setArrivalTime] = useCreateBookingState("arrivalTime");
    const [reservationNumber] = useCreateBookingState("reservationNumber");
    const [, setExtras] = useCreateBookingState("extras");
    const [vehicle, setVehicle] = useCreateBookingState("vehicle");
    const [, setInmediatePickup] = useCreateBookingState("inmediatePickup");

    const [extras] = useCreateBookingState("extras");

    const totalToCharge = new Decimal(vehicle?.VehAvailCore.TotalCharge.RateTotalAmount || '0.0').add(extras.reduce((prev, next) => {
        prev = new Decimal(next.PricedEquip.Charge.Amount).times(next.amount).add(prev).toNumber()
        return prev
    }, 0)).toString()

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: '5%', justifyContent: 'space-between', display: 'flex' }} keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: 'white' }}>
                <View style={{ position: 'absolute', padding: '5%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2}}>
                    <MenuButton />
                </View>
                <Layout>
                    <CarTripInfoCard
                        pickupLocation={originLocation?.locationname || ''}
                        pickupTime={moment(departureTime)}
                        dropOffLocation={returnLocation?.locationname || ''}
                        dropoffTime={moment(returnTime)}

                        carName={vehicle?.VehAvailCore.Vehicle.VehMakeModel.Name || 'Car'}
                        finalCost={totalToCharge.toString()}
                        currencyCode={vehicle?.VehAvailCore.TotalCharge.CurrencyCode || 'USD'}
                        arrivalTime={arrivalTime}
                        image_preview_url={vehicle?.VehAvailCore.Vehicle.VehMakeModel.PictureURL}
                        reservationNumber={reservationNumber}

                        leftImageUri={undefined}
                        keyLess={false}
                    />

                    { profile && !userHasAllFiles(profile) && (
                        <>
                            <Text style={{ textAlign: 'center'}}>Please ensure to fill in your profile details and upload required documents before collecting the vehicle.</Text>
                            <Text style={{ textAlign: 'center'}}>Before you collect your car, please complete the profile verification process.</Text>
                        </>
                    )}

                    <Layout style={{ marginTop: '5%' }}>
                        <Button
                            onPress={() => {
                                setTimeout(() => {
                                    setDepartureTime(moment().set({ hour: 10, minutes: 30, second: 0, millisecond: 0 }).toDate());
                                    setReturnTime(moment().set({ hour: 10, minutes: 30, second: 0, millisecond: 0 }).toDate());
                                    setOriginLocation(null)
                                    setReturnLocation(null)
                                    setArrivalTime('');
                                    setExtras([])
                                    setVehicle(null)
                                    setInmediatePickup(false);
                                }, 2000);
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
                            }}
                            size="giant" style={{
                                borderRadius: 10,
                                backgroundColor: APP_BRAND_COLOR,
                                borderColor: APP_BRAND_COLOR,
                                paddingLeft: 20,
                                paddingRight: 20,
                                marginBottom: '2%'
                            }}>
                            {() => <Text style={{ color: 'white', fontFamily: AppFontBold, fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.CONFIRMATION_GO_HOME_BTN).toString()}</Text>}
                        </Button>
                    </Layout>
                </Layout>
            </ScrollView >

        </SafeAreaView>
    )
};
