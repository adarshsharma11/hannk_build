
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


const Drawer = createDrawerNavigator();

let screens: any[] = [ { name: 'ProfileVerification', screen: <Drawer.Screen name="ProfileVerification" component={ProfileVerificationScreen} /> } ]
const allScreens = [
    { name: 'CreateBooking', screen: <Drawer.Screen name="CreateBooking" component={SelectLocation} /> },
    { name: 'Location', screen: <Drawer.Screen name="Location" component={LocalitationScreen} /> },
    { name: 'Reservation', screen: <Drawer.Screen name="Reservation" component={ReservationScreen} /> },
    { name: 'Damage', screen: <Drawer.Screen name="Damage" component={DamageScreen} /> },
    { name: 'NoPicturDamage', screen: <Drawer.Screen name="NoPicturDamage" component={NoPictureDamageScreen} /> },
    { name: 'Activate', screen: <Drawer.Screen name="Activate" component={ActivateScreen} /> },
    { name: 'Notifications', screen: <Drawer.Screen name="Notifications" component={NotificationScreen} /> },
    { name: 'EditProfile', screen: <Drawer.Screen name="EditProfile" component={EditProfile} /> },
    { name: 'Documents', screen: <Drawer.Screen name="Documents" component={DocumentScreen} /> },
    { name: 'SingleUpload', screen: <Drawer.Screen name="SingleUpload" component={SingleUploadScreen} /> },
    { name: 'Sign', screen: <Drawer.Screen name="Sign" component={SignScreen} /> },
    { name: 'EndRental', screen: <Drawer.Screen name="EndRental" component={EndRentalScreen} /> },
    { name: 'Policy', screen: <Drawer.Screen name="Policy" component={PolicyScreen} /> },
    { name: 'TermsConditions', screen: <Drawer.Screen name="TermsConditions" component={TermsConditionsScreen} /> },
    { name: 'NoResult', screen: <Drawer.Screen name="NoResult" component={NoResultScreen} /> },
    { name: 'Faq', screen: <Drawer.Screen name="Faq" component={FaqScreen} /> },
]
export default ({ navigation }: StackScreenProps<LoginScreenProps>) => {
    const [profile] = useGlobalState('profile')
    const [{ data, loading, error }, doVerify] = useAxios({
        url: `${GRCGDS_BACKEND}`,
        method: 'POST'
    }, { manual: true })

    if (screens.length == 1) {
        screens = [
            { name: "CompletedUpload", screen: <Drawer.Screen name="CompletedUpload" component={CompletedUploadScreen} /> },
        ]

        const hasAllFiles = userHasAllFiles(profile || {})
        const hasFullProfile = userHasFullProfile(profile || {})

        console.log("hasFullProfile", hasFullProfile)
        console.log('hasAllFiles', hasAllFiles)
        console.log('isAppleUser', isAppleUser(profile))

        if ((hasFullProfile && hasAllFiles) || (hasAllFiles && isAppleUser(profile))) {
            screens.push(...allScreens)
            screens.unshift({ name: 'MyBookings', screen: <Drawer.Screen name="MyBookings" component={MyTripsScreens} /> })
        } else {
            screens = [ { name: 'ProfileVerification', screen: <Drawer.Screen name="ProfileVerification" component={ProfileVerificationScreen} /> } ]
        }
    }

    useEffect(() => {
        if (profile && profile.mobilenumber != "" && profile.mobilecode != "" && profile.vphone != 1) {
            doVerify({
                data: {
                    "module_name": "RESEND_VERIFY",
                    "id": profile.id
                }
            })
                .then(r => console.log(r.data))
        }
    }, [])

    useEffect(() => {
        async function checkPhone() {
            const isApple = await isAppleLogin()
            if (profile && ((isApple == true && profile.mobilenumber != "" && profile.mobilecode != "") || (isApple == false && profile.mobilenumber != "" && profile.mobilecode != "" && profile.vphone != 1))) {
                console.log("mobilenumber", profile.mobilenumber)
                console.log("mobilecode", profile.mobilecode)
                console.log("vphone", profile.vphone)

                const found = screens.find(item => item.name === 'Opt')

                if (found) {
                    screens = [found, ...screens.filter(item => item.name !== 'Opt'),]
                } else {
                    screens.unshift({ name: 'Opt', screen: <Drawer.Screen name="VerifyEmail" component={VerifyPhoneScreen} /> });
                }

            }
            if (profile && profile.vemail == 0) {
                if (!screens.find(i => i.name == 'VerifyEmail')) {
                    screens.unshift({ name: 'VerifyEmail', screen: <Drawer.Screen name="VerifyEmail" component={VerifyEmailScreen} /> });
                }
            }
        }
        checkPhone()
    }, [profile])

    useEffectSkipInitialRender(() => {
        async function checkFullProfile() {
            const isApple = await isAppleLogin()
            const hasAllFiles = userHasAllFiles(profile || {})
            const hasFullProfile = userHasFullProfile(profile || {})

            if (profile === null) {
                screens = [{ name: 'ProfileVerification', screen: <Drawer.Screen name="ProfileVerification" component={ProfileVerificationScreen} /> }]
            } else if ((hasFullProfile && hasAllFiles && isApple == false) || (hasAllFiles && isApple == true)) {
                screens = [{ name: 'MyBookings', screen: <Drawer.Screen name="MyBookings" component={MyTripsScreens} /> }, ...allScreens]
            } else {
                screens = [
                    { name: 'ProfileVerification', screen: <Drawer.Screen name="ProfileVerification" component={ProfileVerificationScreen} /> },
                    { name: "CompletedUpload", screen: <Drawer.Screen name="CompletedUpload" component={CompletedUploadScreen} /> },
                ]
            }
        }
        checkFullProfile()
    }, [profile])

    return (
        <Drawer.Navigator drawerContent={(props) => <DrawerMenu navigation={props.navigation} />} initialRouteName="Home">
            {screens.map((s) => s.screen)}
        </Drawer.Navigator>
    )
};
