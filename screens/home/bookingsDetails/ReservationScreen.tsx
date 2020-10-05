import React, { useEffect } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, ScrollView, Image, Alert, View } from 'react-native';
import LoadingSpinner from '../../../partials/LoadingSpinner';
import { useRoute, useNavigation } from '@react-navigation/native';
import useAxios from 'axios-hooks'
import { Linking } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import ResolveCurrencySymbol from '../../../utils/ResolveCurrencySymbol';
import ReportScreen from './ReportScreen';
import KeyedReservationScreen from './KeyedReservation';
import VerifyCancelCodeScreen from './VerifyCancelCodeScreen';
import CompletedReportScreen from './CompletedReportScreen';
import AgreementScreen from './AgreementScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCarDetailState } from './detailsState';
import MenuButton from '../../../partials/MenuButton';
import moment from 'moment';
import Decimal from 'decimal.js';
import { AppFontBold, AppFontRegular } from '../../../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';
import GdprScreen from './GdprScreen';
import InsuranceScreen from './InsuranceScreen';
import MainTermsScreen from './MainTermsScreen';

const DocumentScreen = () => {
  const route = useRoute();
  const { i18n } = useTranslation();
  const [isAllowing, setIsAllowing] = useCarDetailState("isAllowing");
  const navigation = useNavigation();

  if (!route.params) return <></>

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', }}>
      <ScrollView contentContainerStyle={{ backgroundColor: 'white', flexGrow: 1 }}>
        <View style={{ paddingTop: '5%', height: '90%', paddingLeft: '5%', paddingRight: '5%', display: 'flex', flexDirection: 'column' }}>
          <View style={{ width: '100%' }}>
            <Layout style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
              <View style={{ position: 'absolute', height: '100%', display: 'flex', alignItems: 'center' }}>
                <MenuButton />
              </View>
              <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <Text style={{ fontFamily: AppFontRegular, textAlign: 'center', textTransform: 'uppercase' }} category="h5">
                  {i18n.t(TRANSLATIONS_KEY.CONFIRMATION_WORD).toString()}
                </Text>
                <Text style={{ textAlign: 'center', fontFamily: AppFontBold, fontSize: 22 }} >
                  {route.params.registratioNumber}{' '}
                </Text>
                <Image
                  style={{ width: 200, height: 200, resizeMode: 'contain' }}
                  source={{ uri: route.params.image_preview_url }}
                />
              </View>
            </Layout>

            <View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-around' }}>
              <Layout style={{ marginBottom: '3%' }}>
                <Text style={{ textAlign: 'center', color: 'grey', fontFamily: AppFontBold }} category="s1">
                  {i18n.t(TRANSLATIONS_KEY.DETAILS_PICKUP_LOCATION_TAG).toString()}
                </Text>
                <Text style={{ textAlign: 'center', fontFamily: AppFontRegular, fontSize: 16 }}>
                  {route.params.pickupLocation}
                </Text>
              </Layout>

              <Layout style={{ marginBottom: '3%' }}>
                <Text style={{ textAlign: 'center', color: 'grey', fontFamily: AppFontBold }} category="s1">
                  {i18n.t(TRANSLATIONS_KEY.DETAILS_DROP_LOCATION_TAG).toString()}
                </Text>
                <Text style={{ textAlign: 'center', fontFamily: AppFontRegular, fontSize: 16 }}>
                  {route.params.dropOffLocation}
                </Text>
              </Layout>
            </View>

            <View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-around' }}>
              <Layout style={{ marginBottom: '3%' }}>
                <Text style={{ textAlign: 'center', color: 'grey', fontFamily: AppFontBold }} category="s1">
                  {i18n.t(TRANSLATIONS_KEY.DETAILS_PICKUP_LOCATION_TIME_TAG).toString()}
                </Text>
                <Text style={{ textAlign: 'center', fontFamily: AppFontRegular, fontSize: 16 }}>
                  {route.params.pickupTime.format('HH:mm')}
                </Text>
              </Layout>

              <Layout style={{ marginBottom: '3%' }}>
                <Text style={{ textAlign: 'center', color: 'grey', fontFamily: AppFontBold }} category="s1">
                  {i18n.t(TRANSLATIONS_KEY.DETAILS_DROP_LOCATION_TIME_TAG).toString()}
                </Text>
                <Text style={{ textAlign: 'center', fontFamily: AppFontRegular, fontSize: 16 }}>
                  {route.params.dropoffTime.format('HH:mm')}
                </Text>
              </Layout>
            </View>

            <Layout style={{ marginBottom: '3%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <View >
                <Text style={{ textAlign: 'left', fontFamily: AppFontBold }} category="s1">
                  {i18n.t(TRANSLATIONS_KEY.DETAILS_CAR_BOOKING_TAG).toString()}
                </Text>
                {route.params.equipment.map((i) => {
                  return (
                    <Text style={{ textAlign: 'left', fontFamily: AppFontBold }} category="s1">
                      {i.Description}
                    </Text>
                  );
                })}
                <Text style={{ textAlign: 'left', fontFamily: AppFontBold }} category="s1">
                  {i18n.t(TRANSLATIONS_KEY.DETAILS_TOTAL_PRICE_TAG).toString()}
                </Text>
                <Text style={{ textAlign: 'left', fontFamily: AppFontBold }} category="s1">
                  {i18n.t(TRANSLATIONS_KEY.DETAILS_PAYABLE_COLLECTION_TAG).toString()}
                </Text>
              </View>

              <View style={{ marginLeft: '5%', display: 'flex', justifyContent: 'center' }}>
                <Text style={{ fontFamily: AppFontRegular, fontSize: 16 }}>
                  {route.params.currencyCode}{' '}
                  {route.params.finalCost}
                </Text>
                {route.params.equipment.map((i) => {
                  return (
                    <Text style={{ textAlign: 'left', fontFamily: AppFontRegular }} category="s1">
                      {route.params.currencyCode}{' '}
                      {(i.Amount)}
                    </Text>
                  );
                })}
                <Text style={{ fontFamily: AppFontRegular, fontSize: 16 }}>
                  {route.params.currencyCode}{' '}
                  {new Decimal(route.params.finalCost || 0).add(route.params.equipment.reduce((total, next) => {
                    return new Decimal(next.Amount || 0).times(1).add(total || 0).toNumber();
                  }, 0)).toFixed(2)}
                </Text>
                <Text style={{ fontFamily: AppFontRegular, fontSize: 16 }}>
                  {route.params.currencyCode}{' '}
                  {route.params.equipment.reduce((total, next) => {
                    return new Decimal(next.Amount || 0).times(1).add(total || 0).toFixed(2);
                  }, 0)}
                </Text>
              </View>
            </Layout>

            <Layout style={{ width: '75%', marginLeft: 'auto', marginRight: 'auto' }}>
              <Text style={{ textAlign: 'center', color: 'grey', fontFamily: AppFontBold }} category="s1">
                {i18n.t(TRANSLATIONS_KEY.DETAILS_PICKUP_INSTRUCTIONS_TAG).toString()}
              </Text>
              <Text style={{ textAlign: 'center', fontFamily: AppFontRegular, fontSize: 18 }}>
                {route.params.pickUpInstructions}
              </Text>
            </Layout>

            {isAllowing && (
              <Layout style={{ backgroundColor: '#00000000', flex: 1 }}>
                <Button onPress={() => navigation.navigate("Sign")} size="giant" style={{ borderRadius: 10, backgroundColor: '#5ac8fa', borderColor: '#5ac8fa', paddingLeft: 20, paddingRight: 20, marginBottom: '2%' }}>
                  {() => <Text style={{ fontFamily: AppFontRegular, color: 'white' }}>Accept</Text>}
                </Button>
                <Button onPress={() => {
                  console.log("setIsAllowing")
                  setIsAllowing(false)
                }} size="giant" style={{ borderRadius: 10, backgroundColor: '#cf1830', borderColor: '#cf1830', paddingLeft: 20, paddingRight: 20 }}>
                  {() => <Text style={{ fontFamily: AppFontRegular, color: 'white' }}>Decline</Text>}
                </Button>
              </Layout>
            )}
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};



const Tab = createBottomTabNavigator();
export default function App({ navigation, route }) {
  const [, setDetails] = useCarDetailState("details");
  const [isAllowing, setIsAllowing] = useCarDetailState("isAllowing");
  const { i18n } = useTranslation();


  useEffect(() => {
    setDetails(route.params.params)
  }, [])

  return (
    <Tab.Navigator tabBarOptions={{
      style: { display: isAllowing == true || route.params.params.reservationStatus == 'Completed' || route.params.params.reservationStatus == 'Cancelled' ? 'none' : 'flex' }
    }} >
      <Tab.Screen
        name="Home"
        component={DocumentScreen}
        options={{
          tabBarButton: () => <></>,
        }}
      />

      <Tab.Screen
        name="CompletedReport"
        component={CompletedReportScreen}
        options={{
          tabBarButton: () => <></>,
        }}
      />

      <Tab.Screen
        name="Agreement"
        component={AgreementScreen}
        options={{
          tabBarButton: () => <></>,
        }}
      />

      <Tab.Screen
        name="KeyedReservation"
        component={KeyedReservationScreen}
        options={{
          tabBarButton: () => <></>,
        }}
      />

      <Tab.Screen
        name="VerifyCancel"
        component={VerifyCancelCodeScreen}
        options={{
          tabBarButton: () => <></>,
        }}
      />

      <Tab.Screen
        name="GdprScreen"
        component={GdprScreen}
        options={{
          tabBarButton: () => <></>,
        }}
      />

      <Tab.Screen
        name="InsuranceScreen"
        component={InsuranceScreen}
        options={{
          tabBarButton: () => <></>,
        }}
      />
      <Tab.Screen
        name="MainTermsScreen"
        component={MainTermsScreen}
        options={{
          tabBarButton: () => <></>,
        }}
      />

      <Tab.Screen
        name="Directions"
        component={() => <></>}
        options={{
          tabBarButton: () => {
            return (
              <View style={{ width: '25%' }}>
                <TouchableOpacity style={{ height: '100%' }} onPress={() => {
                  navigation.navigate('KeyedReservation', route.params.params)
                  return

                }}>
                  <View style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', borderColor: 'rgba(0,0,0,0.2)', borderRightWidth: 0 }}>
                    <MaterialIcons name="location-on" style={{ color: '#41d5fb' }} size={24} />
                    <Text style={{ marginLeft: '5%', color: 'gray', fontFamily: AppFontRegular, fontSize: 12, textTransform: 'uppercase' }}>
                      {i18n.t(TRANSLATIONS_KEY.DETAILS_DIRECTION_MENU_OPTION).toString()}
                    </Text>
                  </View>

                </TouchableOpacity>
              </View>
            );
          }
        }}
      />
      <Tab.Screen
        name="Help"
        component={() => <></>}
        options={{
          tabBarButton: () => {
            return (
              <View style={{ width: '25%' }}>
                <TouchableOpacity style={{ height: '100%' }} onPress={() => {
                  Linking.openURL(`tel:${route.params.params.pickupLocationPhoneNumber}`)
                }}>
                  <View style={{ height: '100%', borderColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                    <MaterialIcons name="phone" style={{ color: '#41d5fb' }} size={24} />
                    <Text style={{ textAlign: 'center', color: 'gray', fontFamily: AppFontRegular, fontSize: 12, textTransform: 'uppercase' }}>
                      {i18n.t(TRANSLATIONS_KEY.DETAILS_HELP_MENU_OPTION).toString()}
                    </Text>
                  </View>

                </TouchableOpacity>
              </View>
            );
          }
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          tabBarButton: () => {
            const cannotCollect = route.params.params.pickupTime.isAfter(moment().add('h', 24)) && route.params.params.reservationStatus != 'Cancelled' && route.params.params.reservationStatus != 'Completed'

            return (
              <View style={{ width: '25%' }}>
                <TouchableOpacity disabled={cannotCollect} style={{ height: '100%' }} onPress={() => {
                  if (cannotCollect) return
                  setIsAllowing(true)
                  navigation.navigate('GdprScreen', { ...route.params.params })
                }}>
                  <View style={{ height: '100%', borderColor: 'rgba(0,0,0,0.2)', borderRightWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                    <MaterialIcons name="directions-car" style={{ color: cannotCollect ? '#41d5fb40' : '#41d5fb' }} size={24} />
                    <Text style={{ textAlign: 'center', color: 'gray', fontFamily: AppFontRegular, fontSize: 12, textTransform: 'uppercase' }}>
                      {i18n.t(TRANSLATIONS_KEY.DETAILS_COLLECT_MENU_OPTION).toString()}
                    </Text>
                  </View>

                </TouchableOpacity>
              </View>
            );
          }
        }}
      />

      <Tab.Screen
        name="Cancel"
        component={() => <></>}
        options={{
          tabBarButton: () => {
            const cannotCancel = route.params.params.reservationStatus == 'Cancelled' || route.params.params.pickupTime.isBetween(moment(), moment().add('h', 24))
            return (
              <View style={{ width: '25%' }}>
                <TouchableOpacity disabled={cannotCancel} style={{ height: '100%' }} onPress={() => {
                  if (cannotCancel) return
                  navigation.navigate('VerifyCancel', { ...route.params.params })
                }}>
                  <View style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderColor: 'rgba(0,0,0,0.2)', borderRightWidth: 0, flexDirection: 'column' }}>
                    <MaterialIcons name="cancel" style={{ color: cannotCancel ? '#cf183040' : '#cf1830' }} size={24} />
                    <Text style={{ marginLeft: '5%', color: 'gray', fontFamily: AppFontRegular, fontSize: 12, textTransform: 'uppercase' }}>
                      {i18n.t(TRANSLATIONS_KEY.DETAILS_CANCEL_MENU_OPTION).toString()}
                    </Text>
                  </View>

                </TouchableOpacity>
              </View>
            );
          }
        }}
      />
    </Tab.Navigator>
  );
}
