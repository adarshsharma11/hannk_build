import React, { useState, useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import useAxios from 'axios-hooks'
import { useCreateBookingState } from './CreateBookingState';
import moment from 'moment';
import { dispatchGlobalState, useGlobalState } from '../../../state';
import { SafeAreaView } from 'react-native';

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


    const [profile] = useGlobalState('profile');


    const [extras] = useCreateBookingState("extras");
    const [vehicle] = useCreateBookingState("vehicle");

    const [navigatedToSuccess, setNavigatedToSuccess] = useState(0);
    const [postDone, setPostDone] = useState(false);

    const [{ loading, error }, postCreation] = useAxios({
        url: `http://grcgds.com/mobileapp/index.php`,
        method: 'POST',
    }, { manual: true })

    useEffect(() => {
        console.log("postDone", postDone)
        console.log("navigatedToSuccess", navigatedToSuccess)
        if (navigatedToSuccess == 0) return
        if (postDone) return
        if (loading) return

        const data = {
            pickup_date: moment(departureTime).format("YYYY-MM-DD"),
            pickup_time: moment(departureTime).format("HH:mm"),
            dropoff_date: moment(returnTime).format("YYYY-MM-DD"),
            dropoff_time: moment(returnTime).format("HH:mm"),
            pickup_location: originLocation?.internalcode,
            dropoff_location: returnLocation?.internalcode,
            veh_id: vehicle?.VehID,
            veh_name: vehicle?.Vehicle.VehMakeModel.Name,
            veh_picture: vehicle?.Vehicle.VehMakeModel.PictureURL,
            currency_code: route.params.transactions[0].amount.currency,
            paypalPaymentId: route.params.paypalPaymentId,
            total_price: route.params.transactions[0].amount.total,
            equipment: extras.map(i => {
                return {
                    vendorEquipID: i.Equipment.vendorEquipID,
                    Description: i.Equipment.Description,
                    CurrencyCode: i.Charge.Taxamount.CurrencyCode,
                    amount: i.amount,
                    price: i.Charge.Amount,
                }
            }),
            module_name: "CREATE_BOOKING"
        }
        postCreation({ data })
            .then((res) => {
                console.log("postCreation", res.data);
                setReservationNumber(res.data.VehSegmentCore.ConfID.Resnumber)
                dispatchGlobalState({ type: 'saveBooking', state: { ...data, reservationNumber: res.data.VehSegmentCore.ConfID.Resnumber } })

                navigation.navigate("Confirmation")
                setPostDone(true)
            })
            .catch((err) => {
                console.log(err)
                dispatchGlobalState({ type: 'error', state: "We could not create your booking!" });

                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            { name: 'MyBookings' },
                        ],
                    })
                );
                setPostDone(true)
                setDepartureTime(moment().set({ hour: 10, minutes: 30, second: 0, millisecond: 0 }).toDate());
                setReturnTime(moment().set({ hour: 10, minutes: 30, second: 0, millisecond: 0 }).toDate());
                setOriginLocation(null)
                setReturnLocation(null)
                setArrivalTime('');
                setExtras([])
                setVehicle(null)
                setInmediatePickup(false);
            })

    }, [navigatedToSuccess]);

    return (
        <SafeAreaView style={{ flex: 1}}>
            <WebView
                ref={ref => (webview.current = ref)}
                source={{ uri: route.params.url }}
                onNavigationStateChange={(e) => {
                    const { url } = e;
                    if (!url) return;

                    // handle certain doctypes
                    console.log('webview', url)
                    console.log('includes', url.includes('PAYMENT_CANCELLED'))
                    if (url.includes('PAYMENT_SUCCESS')) {
                        setNavigatedToSuccess(p => p + 1)
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
