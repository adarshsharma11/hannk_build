
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Text, Input, Button, Select, SelectItem, Popover, List, Toggle } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, View, TouchableHighlight, TouchableOpacity, Dimensions, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker'
import Modal from 'react-native-modal';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCreateBookingState } from './CreateBookingState';
import TimeCheckbox from '../../../partials/TimeCheckbox';
import LocationSearchInput from '../../../partials/SearchLocationInput';
import DateTimePicker from '@react-native-community/datetimepicker';
//@ts-ignore
import GetLocation from 'react-native-get-location'
// @ts-ignore
import SystemSetting from 'react-native-system-setting'
import useAxios from 'axios-hooks'
import moment from 'moment';
import LoadingSpinner from '../../../partials/LoadingSpinner';
import { VehAvailCore, VehicleResponse, VehSearch } from '../../../types/SearchVehicleResponse';
import MenuButton from '../../../partials/MenuButton';
import { checkMultiple, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { AppFontBold, AppFontRegular } from '../../../constants/fonts'
import Orientation, { OrientationType } from 'react-native-orientation-locker';
import { useTranslation } from 'react-i18next';
import { HannkSuggestionInput, HannkDatePicker, HannkTimePicker } from 'hannk-mobile-common';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';
import BackButton from '../../../partials/BackButton';
import { setHours, getHours, addHours, isAfter, setMinutes, getMinutes } from 'date-fns'
import { APP_BRAND_COLOR } from '../../../constants/Colors';
import { GRCGDS_BACKEND } from 'react-native-dotenv';

const DATE_FORMAT = "DD MMM YYYY"

export default () => {
    const navigation = useNavigation();
    const { i18n } = useTranslation();
    const [originLocation, setOriginLocation] = useCreateBookingState("originLocation");
    const [returnLocation, setReturnLocation] = useCreateBookingState("returnLocation");
    const [inmediatePickup, setInmediatePickup] = useCreateBookingState("inmediatePickup");
    const [departureTime, setDepartureTime] = useCreateBookingState("departureTime");
    const [returnTime, setReturnTime] = useCreateBookingState("returnTime");
    const [currentLocation, setCurrentLocation] = useState(null);
    const [currentWidth, setCurrentWidth] = useState(Dimensions.get('window').width);

    const [showDepartureDatepicker, setShowDepartureDatepicker] = useState(false);
    const [showDepartureTimepicker, setShowDepartureTimepicker] = useState(false);

    const [showReturnDatepicker, setShowReturnDatepicker] = useState(false);
    const [showReturnTimepicker, setShowReturnTimepicker] = useState(false);


    const [{ data, loading, error }, doSearch] = useAxios<VehAvailCore[]>({
        url: GRCGDS_BACKEND,
        method: 'GET',
        validateStatus: () => true
    }, { manual: true })

    const onOrientationDidChange = (orientation: OrientationType) => {
        console.log("Dimensions.get('screen').width", Dimensions.get('screen').width)
        setCurrentWidth(Dimensions.get('screen').width);
    }

    useEffect(() => {
        Orientation.addDeviceOrientationListener(onOrientationDidChange);
        Orientation.getOrientation(onOrientationDidChange);

        return () => Orientation.removeDeviceOrientationListener(onOrientationDidChange);
    }, []);

    useEffect(() => {
        if (inmediatePickup == true) {
            setDepartureTime(moment().toDate())
            setOriginLocation({
                internalcode: '32151',
                locationname: 'Current Location',
            })

            SystemSetting.isLocationEnabled()
                .then((enable: boolean) => {
                    if (enable == false) {
                        SystemSetting.switchLocation(() => { })
                    }
                })
        } else {
            setOriginLocation(null)
            setReturnLocation(null)
        }
    }, [inmediatePickup])

    useFocusEffect(
        React.useCallback(() => {
            checkMultiple([PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE])
                .then((result) => {
                    switch (result["android.permission.ACCESS_FINE_LOCATION"]) {
                        case RESULTS.UNAVAILABLE:
                            console.log('This feature is not available (on this device / in this context)');
                            break;
                        case RESULTS.DENIED:
                            console.log('The permission has not been requested / is denied but requestable');
                            request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((r) => {
                                // if (r == RESULTS.UNAVAILABLE) Alert.alert('This feature is not available (on this device / in this context) even after asking')
                                if (r == RESULTS.DENIED) Alert.alert(':(', 'Please, allow the location, for us to do amazing things for you!')
                                if (r == RESULTS.BLOCKED) Alert.alert(':(', 'Please, allow the location, for us to do amazing things for you!')
                            });
                            break;
                        case RESULTS.GRANTED:
                            console.log('The permission is granted');
                            GetLocation.getCurrentPosition({
                                enableHighAccuracy: true,
                                timeout: 15000,
                            })
                                .then(location => {
                                    setCurrentLocation(location)
                                })
                                .catch(error => {
                                    const { code, message } = error;
                                    console.warn(code, message);
                                })
                            break;
                        case RESULTS.BLOCKED:
                            console.log('The permission is denied and not requestable anymore');
                            Alert.alert(':(', 'Please, allow the location, for us to do amazing things for you!')
                            break;
                    }

                    switch (result["ios.permission.LOCATION_WHEN_IN_USE"]) {
                        case RESULTS.UNAVAILABLE:
                            console.log(
                                'This feature is not available (on this device / in this context)',
                            );
                            break;
                        case RESULTS.DENIED:
                            console.log('The permission has not been requested / is denied but requestable');
                            request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
                                // if (result == RESULTS.UNAVAILABLE) Alert.alert('This Location feature is not available (on this device / in this context)')
                                if (result == RESULTS.DENIED) Alert.alert(':(', 'You denied the Location permissions, allow the location, for us to do amazing things for you!')
                                if (result == RESULTS.BLOCKED) Alert.alert(':(', 'You blocked the Location permissions, allow the location, for us to do amazing things for you!')
                            });
                            break;
                        case RESULTS.GRANTED:
                            console.log('The permission is granted');
                            GetLocation.getCurrentPosition({
                                enableHighAccuracy: true,
                                timeout: 15000,
                            })
                                .then(location => {
                                    setCurrentLocation(location)
                                })
                                .catch(error => {
                                    const { code, message } = error;
                                    console.warn(code, message);
                                })
                            break;
                        case RESULTS.BLOCKED:
                            console.log('The permission is denied and not requestable anymore');
                            Alert.alert(':(', 'Location is blocked, allow the location for us to do amazing things for you!')
                            break;
                    }
                })
                .catch((error) => {
                    // …
                });

        }, [])
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} >
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: '5%', justifyContent: 'space-between', display: 'flex' }} keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: 'white' }}>

                <Layout style={{ flexGrow: 1 }}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <MenuButton />
                        <Text style={{ width: '80%', textAlign: 'center', fontSize: 22, fontFamily: AppFontBold }} category='s2'>
                            {i18n.t(TRANSLATIONS_KEY.NEW_BOOKING_SCREEN_TITLE).toString()}
                        </Text>
                        <BackButton />
                    </View>
                    <TimeCheckbox
                        checked={inmediatePickup == undefined ? undefined : inmediatePickup}
                        style={{ marginBottom: '5%' }}
                        title={i18n.t(TRANSLATIONS_KEY.NEW_BOOKING_IMMEDIATE_PICKUP_TITLE).toString()}
                        subTitle={i18n.t(TRANSLATIONS_KEY.NEW_BOOKING_IMMEDIATE_PICKUP_SUBTITLE).toString()}
                        onChange={(v) => setInmediatePickup(p => {
                            if (p === null) return true
                            return !p
                        })}
                    />
                    <TimeCheckbox
                        checked={inmediatePickup == undefined ? undefined : !inmediatePickup}
                        title={i18n.t(TRANSLATIONS_KEY.NEW_BOOKING_IN_ADVANCE_PICKUP_TITLE).toString()}
                        onChange={(v) => {
                            setInmediatePickup(p => {
                                if (p === null) return false
                                return !p
                            })
                        }}
                    />
                    <HannkSuggestionInput
                        NEW_BOOKING_ENTER_ORIGIN_PLACEHOLDER={i18n.t(TRANSLATIONS_KEY.NEW_BOOKING_ENTER_ORIGIN_PLACEHOLDER).toString()}
                        NEW_BOOKING_RETURN_DESTINATION_PLACEHOLDER={i18n.t(TRANSLATIONS_KEY.NEW_BOOKING_RETURN_DESTINATION_PLACEHOLDER).toString()}
                        NEW_BOOKING_RETURN_ON_SAME_LOCATION_TAG={i18n.t(TRANSLATIONS_KEY.NEW_BOOKING_RETURN_ON_SAME_LOCATION_TAG).toString()}
                        hideReturnToggle={inmediatePickup == false}
                        pickupLocation={originLocation}
                        returnLocation={returnLocation}
                        isInmediatePickup={inmediatePickup == null ? true : !inmediatePickup}
                        onOriginLocationSelected={(l) => {
                            setOriginLocation(l)
                        }}
                        onReturnLocationSelected={(l) => setReturnLocation(l)}
                    />
                    {inmediatePickup !== null && (
                        <View style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <View>
                                <Text style={{ fontFamily: AppFontBold }}>{i18n.t(TRANSLATIONS_KEY.NEW_BOOKING_DEPARTURE_DATE_TAG).toString()}</Text>
                                <TouchableOpacity onPress={() => setShowDepartureDatepicker(true)}>
                                    <View style={{ borderTopWidth: 1, borderBottomWidth: 1 }}>
                                        <Text style={{ textAlign: 'center', fontSize: 24 }}>{moment(departureTime).format(DATE_FORMAT)}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={{ fontFamily: AppFontBold }}>{i18n.t(TRANSLATIONS_KEY.NEW_BOOKING_DEPARTURE_TIME_TAG).toString()}</Text>
                                <TouchableOpacity onPress={() => setShowDepartureTimepicker(true)}>
                                    <View style={{ borderTopWidth: 1, borderBottomWidth: 1 }}>
                                        <Text style={{ textAlign: 'center', fontSize: 24 }}>{moment(departureTime).format("hh mm A")}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <HannkDatePicker
                                onChange={(d) => {
                                    if (inmediatePickup) {
                                        const nowPlus24Hours = addHours(new Date(), 24)
                                        if (isAfter(d, nowPlus24Hours)) {
                                            setDepartureTime(setHours(nowPlus24Hours, getHours(departureTime)))
                                        } else {
                                            setDepartureTime(setHours(d, getHours(departureTime)))
                                        }
                                    } else {
                                        setDepartureTime(setHours(d, getHours(departureTime)))
                                    }
                                    setReturnTime(setHours(addHours(d, 24), getHours(returnTime)))
                                    setShowDepartureDatepicker(false)
                                }}
                                date={departureTime}
                                isVisible={showDepartureDatepicker}
                            />
                            <HannkTimePicker
                                date={departureTime}
                                onChange={(d) => {
                                    setDepartureTime(setMinutes(setHours(departureTime, getHours(d)), getMinutes(d)))
                                    setShowDepartureTimepicker(false)
                                }}
                                isVisible={showDepartureTimepicker}
                            />
                            <View style={{ marginTop: '10%' }}>
                                <Text style={{ fontFamily: AppFontBold }}>{i18n.t(TRANSLATIONS_KEY.NEW_BOOKING_RETURN_DATE_TAG).toString()}</Text>
                                <TouchableOpacity onPress={() => setShowReturnDatepicker(true)}>
                                    <View style={{ borderTopWidth: 1, borderBottomWidth: 1 }}>
                                        <Text style={{ textAlign: 'center', fontSize: 24 }}>{moment(returnTime).format(DATE_FORMAT)}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={{ fontFamily: AppFontBold }}>{i18n.t(TRANSLATIONS_KEY.NEW_BOOKING_RETURN_TIME_TAG).toString()}</Text>
                                <TouchableOpacity onPress={() => setShowReturnTimepicker(true)}>
                                    <View style={{ borderTopWidth: 1, borderBottomWidth: 1 }}>
                                        <Text style={{ textAlign: 'center', fontSize: 24 }}>{moment(returnTime).format("hh mm A")}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <HannkDatePicker
                                onChange={(d) => {
                                    setReturnTime(setMinutes(setHours(d, getHours(returnTime)), getMinutes(d)))
                                    setShowReturnDatepicker(false)
                                }}
                                date={returnTime}
                                isVisible={showReturnDatepicker}
                            />
                            <HannkTimePicker
                                date={returnTime}
                                onChange={(d) => {
                                    setReturnTime(setMinutes(setHours(returnTime, getHours(d)), getMinutes(d)))
                                    setShowReturnTimepicker(false)
                                }}
                                isVisible={showReturnTimepicker}
                            />
                        </View>
                    )}
                </Layout>
                <Layout style={{ marginTop: '5%' }}>
                    <Button
                        disabled={originLocation == null || inmediatePickup == null || loading == true}
                        accessoryRight={loading ? LoadingSpinner : undefined}
                        onPress={() => {
                            if (!originLocation) return

                            if (!returnLocation) {
                                setReturnLocation(originLocation)
                            }

                            doSearch({
                                params: {
                                    module_name: "SEARCH_VEHICLE",

                                    pickup_date: moment(departureTime).format(`YYYY-MM-DD`),
                                    pickup_time: moment(departureTime).format(`HH:ss`),

                                    dropoff_date: moment(returnTime).format(`YYYY-MM-DD`),
                                    dropoff_time: moment(returnTime).format(`HH:ss`),

                                    pickup_location: originLocation.internalcode,
                                    dropoff_location: returnLocation ? returnLocation.internalcode : originLocation.internalcode,
                                }
                            })
                                .then(res => {
                                    if (res.data.length == 0) {
                                        navigation.navigate("NoResult");
                                    } else {
                                        navigation.navigate(
                                            'CarsList',
                                            {
                                                cars: res.data,
                                                searchParams: {
                                                    pickUpDate: moment(departureTime),
                                                    pickUpTime: moment(departureTime),

                                                    dropOffDate: moment(returnTime),
                                                    dropOffTime: moment(returnTime),

                                                    pickUpLocation: originLocation,
                                                    dropOffLocation: returnLocation ? returnLocation : originLocation,
                                                }
                                            }
                                        );
                                    }
                                })
                                .catch(() => {
                                    navigation.navigate("NoResult");
                                })
                        }} size="giant" style={{
                            borderRadius: 10,
                            backgroundColor: (originLocation != null && inmediatePickup != null) && loading == false ? APP_BRAND_COLOR : `${APP_BRAND_COLOR}50`,
                            borderColor: (originLocation != null && inmediatePickup != null) && loading == false ? APP_BRAND_COLOR : `${APP_BRAND_COLOR}50`,
                            paddingLeft: 20,
                            paddingRight: 20,
                            marginBottom: '2%'
                        }}>
                        {() => <Text style={{ color: loading ? "#ACB1C0" : 'white', fontFamily: AppFontBold, fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.SEARCH_WORD).toString()}</Text>}
                    </Button>
                </Layout>
            </ScrollView >
        </SafeAreaView>
    )
};
