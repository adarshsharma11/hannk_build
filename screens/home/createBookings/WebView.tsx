import React, { useState, useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import useAxios from 'axios-hooks'
import { useCreateBookingState } from './CreateBookingState';
import moment from 'moment';
import { dispatchGlobalState, useGlobalState } from '../../../state';
import { SafeAreaView } from 'react-native';
import { GRCGDS_BACKEND } from 'react-native-dotenv';
import { getPaypalUrls } from '../../../utils/PaypalUrls';
import { UsePaypal } from 'hannk-mobile-common';
var qs = require('qs');
var UrlParser = require('url-parse');

const WebViewScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const webview = useRef<WebView | null>(null)

    const [departureTime, setDepartureTime] = useCreateBookingState("departureTime");
    const [returnTime, setReturnTime] = useCreateBookingState("returnTime");
    const [originLocation, setOriginLocation] = useCreateBookingState("originLocation");
    const [, setArrivalTime] = useCreateBookingState("arrivalTime");
    const [returnLocation, setReturnLocation] = useCreateBookingState("returnLocation");
    const [, setReservationNumber] = useCreateBookingState("reservationNumber");
    const [, setExtras] = useCreateBookingState("extras");
    const [, setVehicle] = useCreateBookingState("vehicle");
    const [, setInmediatePickup] = useCreateBookingState("inmediatePickup");
    const [paypalClientId] = useGlobalState("paypalClientId");
    const [paypalSecretKey] = useGlobalState("paypalSecretKey");

    const urls = getPaypalUrls("DEV")
    const { capturePaymentForToken } = UsePaypal({ paypalClientId, paypalSecretKey, paypalPaymentUrl: urls.PAYPAL_CAPTURE_URL, paypalTokenUrl: urls.PAYPAL_TOKEN_URL })

    const [extras] = useCreateBookingState("extras");
    const [vehicle] = useCreateBookingState("vehicle");

    const [postCalled, setPostCalled] = useState(false);

    const [{ loading, error }, postCreation] = useAxios({
        url: GRCGDS_BACKEND,
        method: 'POST',
    }, { manual: true })

    const savePayment = (params: { token: string }) => {
        console.log("postCalled", postCalled)
        setPostCalled(true)
        if (postCalled) return
        if (loading) return

        const data = {
            pickup_date: moment(departureTime).format("YYYY-MM-DD"),
            pickup_time: moment(departureTime).format("HH:mm"),
            dropoff_date: moment(returnTime).format("YYYY-MM-DD"),
            dropoff_time: moment(returnTime).format("HH:mm"),
            pickup_location: originLocation?.internalcode,
            dropoff_location: returnLocation?.internalcode,
            pickupFullAddress: originLocation?.locationname,
            dropoffFullAddress: returnLocation?.locationname,
            veh_id: vehicle?.VehAvailCore.VehID,
            veh_name: vehicle?.VehAvailCore.Vehicle.VehMakeModel.Name,
            veh_picture: vehicle?.VehAvailCore.Vehicle.VehMakeModel.PictureURL,
            currency_code: route.params.purchase_units[0].amount.currency_code,
            paypalPaymentId: route.params.paypalPaymentId,
            total_price: route.params.purchase_units[0].amount.value,
            equipment: extras.map(i => {
                return {
                    vendorEquipID: i.PricedEquip.Equipment.vendorEquipID,
                    Description: i.PricedEquip.Equipment.Description,
                    CurrencyCode: i.PricedEquip.Charge.Taxamounts.Taxamount.CurrencyCode,
                    amount: i.amount,
                    price: i.PricedEquip.Charge.Amount,
                }
            }),
            module_name: "CREATE_BOOKING"
        }

        capturePaymentForToken(params.token, route.params.paypalJson)
            .then(() => {
                return postCreation({ data })
            })
            .then((postCreationResponse) => {
                console.log("postCreation", postCreationResponse.data);
                setReservationNumber(postCreationResponse.data.VehSegmentCore.ConfID.Resnumber)
                dispatchGlobalState({ type: 'saveBooking', state: { ...data, reservationNumber: postCreationResponse.data.VehSegmentCore.ConfID.Resnumber } })

                navigation.navigate("Confirmation")
            })
            .catch((err) => {
                console.log("postCreationerr", err);
                console.log("postCreationerr data", err?.response?.data);

                dispatchGlobalState({ type: 'error', state: "We could not create your booking!" });

                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            { name: 'MyBookings' },
                        ],
                    })
                );
                setPostCalled(false)
                setDepartureTime(moment().set({ hour: 10, minutes: 30, second: 0, millisecond: 0 }).toDate());
                setReturnTime(moment().set({ hour: 10, minutes: 30, second: 0, millisecond: 0 }).toDate());
                setOriginLocation(null)
                setReturnLocation(null)
                setArrivalTime('');
                setExtras([])
                setVehicle(null)
                setInmediatePickup(false);
            })
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <WebView
                ref={ref => (webview.current = ref)}
                source={{ uri: route.params.url }}
                onNavigationStateChange={(e) => {
                    const { url } = e;
                    if (!url) return;

                    // handle certain doctypes
                    console.log('webview', url)
                    console.log('includes', url.includes('PAYMENT_CANCELLED'))
                    const parsed = new UrlParser(url)
                    const urlParams = qs.parse(parsed.query.substring(1))
                    console.log(urlParams)
                    if (url.includes('PAYMENT_SUCCESS')) {
                        savePayment({ token: urlParams.token })
                    }
                    if (url.includes('PAYMENT_CANCELLED')) {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    { name: 'MyBookings' },
                                ],
                            })
                        );
                    }
                }}
            />
        </SafeAreaView>
    );
}
export default WebViewScreen
