
import React, { useEffect } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StackScreenProps } from '@react-navigation/stack';
import { LoginScreenProps } from '../../types';
import DrawerMenu from './CustomeDrawer';
import NotificationScreen from './NotificationScreen';
import DocumentScreen from './DocumentUpload/DocumentScreen';
import VerifyPhoneScreen from '../VerifyPhoneScreen';
import VerifyEmailScreen from '../VerifyEmailScreen';
import SingleUploadScreen from './DocumentUpload/SingleUploadScreen';
import CompletedUploadScreen from './DocumentUpload/CompletedUploadScreen';
import MyTripsScreens from './MyTripsScreen';
import ActivateScreen from './ActivateScreen';
import LocalitationScreen from './Localitation';
import DamageScreen from './DamageScreen';
import NoPictureDamageScreen from './NoPictureDamageScreen';
import ReservationScreen from './bookingsDetails/ReservationScreen';
import SelectLocation from './createBookings/index';
import EndRentalScreen from './EndRentalScreen';
import SignScreen from './bookingsDetails/SignScreen';
import EditProfile from './EditProfile';
import NoResultScreen from './createBookings/NoResultScreen';
import ProfileVerificationScreen from './ProfileVerificationScreen';
import PolicyScreen from './PolicyScreen';
import FaqScreen from './Faq';
import TermsConditionsScreen from './TermsConditionsScreen';
import { useGlobalState } from '../../state';
import userHasFullProfile from '../../utils/userHasFullProfile';
import userHasAllFiles from '../../utils/userHasAllFiles';
import { GRCGDS_BACKEND } from 'react-native-dotenv';
import useAxios from 'axios-hooks'
import isAppleLogin from '../../utils/isAppleLogin';
import useEffectSkipInitialRender from '../../utils/UseEffectSkipInitialRender';
import isAppleUser from '../../utils/isAppleUser';
import ShareCodeScreen from './ShareCode';
import InmediatePickupScreen from './createBookings/InmediatePickupScreen';
import ImportAppScreen from './ImportAppScreen';
import NoCarReservationScreen from './bookingsDetails/NoCarReservationScreen';
import CompleteQrBookingScreen from './CompleteQrBookingScreen';
import ScooterChargeScreen from './createBookings/ScooterChargeScreen';
import ScooterPowerScreen from './createBookings/ScooterPowerScreen';
import PaymentScreen from './createBookings/PaymentScreen';


const Drawer = createDrawerNavigator();

let screens: any[] = [ { name: "CompletedUpload", screen: <Drawer.Screen name="CompletedUpload" component={CompletedUploadScreen} /> } ]
const allScreens = [
    { name: 'ShareCode', screen: <Drawer.Screen name="ShareCode" component={ShareCodeScreen} /> },
    { name: 'CreateBooking', screen: <Drawer.Screen name="CreateBooking" component={SelectLocation} /> },
    { name: 'Location', screen: <Drawer.Screen name="Location" component={LocalitationScreen} /> },
    { name: 'Reservation', screen: <Drawer.Screen name="Reservation" component={ReservationScreen} /> },
    { name: 'NoCarReservation', screen: <Drawer.Screen name="NoCarReservation" component={NoCarReservationScreen} /> },
    { name: 'Damage', screen: <Drawer.Screen name="Damage" component={DamageScreen} /> },
    { name: 'NoPicturDamage', screen: <Drawer.Screen name="NoPicturDamage" component={NoPictureDamageScreen} /> },
    { name: 'CompleteQrBooking', screen: <Drawer.Screen name="CompleteQrBooking" component={CompleteQrBookingScreen} /> },
    { name: 'ScooterCharge', screen: <Drawer.Screen name="ScooterCharge" component={ScooterChargeScreen} /> },
    { name: 'ScooterPower', screen: <Drawer.Screen name="ScooterPower" component={ScooterPowerScreen} /> },
    { name: 'Payment', screen: <Drawer.Screen name="Payment" component={PaymentScreen} /> },
    { name: 'Activate', screen: <Drawer.Screen name="Activate" component={ActivateScreen} /> },
    { name: 'ImportApps', screen: <Drawer.Screen name="ImportApps" component={ImportAppScreen} /> },
    { name: 'Notifications', screen: <Drawer.Screen name="Notifications" component={NotificationScreen} /> },
    { name: 'EditProfile', screen: <Drawer.Screen name="EditProfile" component={EditProfile} /> },
    { name: 'Documents', screen: <Drawer.Screen name="Documents" component={DocumentScreen} /> },
    { name: 'SingleUpload', screen: <Drawer.Screen name="SingleUpload" component={SingleUploadScreen} /> },
    { name: 'Sign', screen: <Drawer.Screen name="Sign" component={SignScreen} /> },
    { name: 'EndRental', screen: <Drawer.Screen name="EndRental" component={EndRentalScreen} /> },
    { name: 'Policy', screen: <Drawer.Screen name="Policy" component={PolicyScreen} /> },
    { name: 'TermsConditions', screen: <Drawer.Screen name="TermsConditions" component={TermsConditionsScreen} /> },
    { name: 'NoResult', screen: <Drawer.Screen name="NoResult" component={NoResultScreen} /> },
    { name: 'InmediatePickup', screen: <Drawer.Screen name="InmediatePickup" component={InmediatePickupScreen} /> },
    { name: 'Faq', screen: <Drawer.Screen name="Faq" component={FaqScreen} /> },
]
export default ({ navigation }: StackScreenProps<LoginScreenProps>) => {
    const [profile] = useGlobalState('profile')
    const [{ data, loading, error }, doVerify] = useAxios({
        url: `${GRCGDS_BACKEND}`,
        method: 'POST'
    }, { manual: true })

    if (screens.length == 1) {

        const hasAllFiles = userHasAllFiles(profile || {})
        const hasFullProfile = userHasFullProfile(profile || {})

        console.log("hasFullProfile", hasFullProfile)
        console.log('hasAllFiles', hasAllFiles)
        console.log('isAppleUser', isAppleUser(profile))

        screens.push(...allScreens)
        screens.unshift({ name: 'MyBookings', screen: <Drawer.Screen name="MyBookings" component={MyTripsScreens} /> })
    }

    return (
        <Drawer.Navigator drawerContent={(props) => <DrawerMenu navigation={props.navigation} />} initialRouteName="Home">
            {screens.map((s) => s.screen)}
        </Drawer.Navigator>
    )
};
