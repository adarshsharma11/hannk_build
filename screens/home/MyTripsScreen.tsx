import React, { useEffect, useState } from 'react';
import { Layout, Text, Tab, Datepicker, NativeDateService, TabView, Card, Avatar, List, Button } from '@ui-kitten/components';
import { SafeAreaView, View, AsyncStorage } from 'react-native';
import moment from 'moment';
import TripCard, { TripCardProps } from '../../partials/TripCard';
import MenuButton from '../../partials/MenuButton';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { GRCGDS_BACKEND } from 'react-native-dotenv'
import useAxios from 'axios-hooks'
import LoadingSpinner from '../../partials/LoadingSpinner';
import { useGlobalState } from '../../state';
import Decimal from 'decimal.js';
import { AppFontBold, AppFontRegular } from '../../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../utils/i18n';
import { resetBookingCreationState } from './createBookings/CreateBookingState';

const DocumentScreen = () => {
  const navigation = useNavigation();
  const { i18n } = useTranslation();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [parsedResponse, setParsedResponse] = useState([]);
  const [storedBookings] = useGlobalState('storedBookings');

  const [activeTrips, setActiveTrips] = useState(null);
  const [upcommingTrips, setUpcommingTrips] = useState(null);
  const [completedTrips, setCompletedTrips] = useState(null);

  const [{ loading }, refetch] = useAxios({
    url: `http://grcgds.com/mobileapp/index.php?module_name=GET_BOOKINGS`,
    method: 'GET',
  }, { manual: true })

  useFocusEffect(
    React.useCallback(() => {
      resetBookingCreationState()
      refetch()
        .then(r => {
          setParsedResponse(r.data.map(i => {
            const storedData = storedBookings.find(a => a.reservationNumber == i.resnumber)

            return {
              currencyCode: storedData?.currency_code,
              image_preview_url: storedData?.veh_picture ? storedData?.veh_picture : 'https://carimages.rent.it/EN/1539285845928.png',
              leftImageUri: '../image/rightcars.png',
              keyLess: false,
              "tripDate": moment.utc(moment.unix(i.unixPTime)),
              "pickupLocation": i.pLocation,
              "dropOffLocation": i.rLocation,
              pickupLocationPhoneNumber: i.pPhoneNumber,
              dropoffLocationPhoneNumber: i.rPhoneNumber,
              "pickupTime": moment.utc(moment.unix(i.unixPTime)),
              "dropoffTime": moment.utc(moment.unix(i.unixRTime)),
              carName: `${i.carModel}\nOr Similar`,
              registratioNumber: i.resnumber,
              "finalCost": i?.finalCost ? new Decimal(i.finalCost.replace("USD","").replace(/\s/g, '')).toFixed(2) : '',
              "arrivalTime": moment.utc(moment.unix(i.unixRTime)),
              pickUpInstructions: i.pickUpInstructions,
              reservationStatus: i.reservationStatus,
              pLocationAddress: i.pLocationAddress,
              equipment: i?.equipment || [],
              keytype: i?.keytype,
            }
          }))
        })
    }, [])
  );

  const [locationReq, doSearch] = useAxios({
    url: `http://grcgds.com/mobileapp/index.php`,
    params: { module_name: 'LOCATION_SEARCH' }
  })

  useEffect(() => {
    if (locationReq.data) {
      try {
        const jsonStringData = JSON.stringify(locationReq.data);
        AsyncStorage.setItem('locationsData', jsonStringData)
      } catch (error) {
        console.log('We fail to save location data: ' + error.toString())
      }
    }
  }, [locationReq.loading]);

  useEffect(() => {
    setTimeout(() => {
      const sortedBookings = parsedResponse.sort(function (left, right) {
        return moment.utc(left.pickupTime).diff(moment.utc(right.pickupTime))
      });
      AsyncStorage.setItem('myBookings', JSON.stringify(sortedBookings))

      const activeTrips = sortedBookings ? sortedBookings.filter(booking => {
        return booking.pickupTime.isBetween(moment(), moment().add('h', 24))
      }) : null
      setActiveTrips(activeTrips)

      const upcomming = sortedBookings ? sortedBookings.filter(booking => {
        return booking.pickupTime.isAfter(moment().add('h', 24)) && booking.reservationStatus != 'Cancelled' && booking.reservationStatus != 'Completed'
      }) : null

      setUpcommingTrips(upcomming)

      const completed = sortedBookings ? sortedBookings.filter(booking => {
        return booking.dropoffTime.isBefore(moment()) || booking.reservationStatus == 'Cancelled' || booking.reservationStatus == 'Completed'
      }) : null

      setCompletedTrips(completed)
    }, 0)
  }, [parsedResponse])

  useEffect(() => {
    try {
      AsyncStorage.getItem('myBookings')
        .then(jsonStringData => {
          const parsedValues = JSON.parse(jsonStringData).map(i => {
          
            return {
              currencyCode: i.currencyCode,
              image_preview_url: i.image_preview_url,
              leftImageUri: i.leftImageUri,
              keyLess: i.keyLess,
              "tripDate": moment(i.tripDate),
              "pickupLocation": i.pickupLocation,
              "dropOffLocation": i.dropOffLocation,
              pickupLocationPhoneNumber: i.pickupLocationPhoneNumber,
              "pickupTime": moment(i.pickupTime),
              "dropoffTime": moment(i.dropoffTime),
              carName: i.carName,
              registratioNumber: i.registratioNumber,
              "finalCost": i.finalCost,
              "arrivalTime": moment(i.arrivalTime),
              pickUpInstructions: i.pickUpInstructions,
              reservationStatus: i.reservationStatus,
              pLocationAddress: i.pLocationAddress,
              equipment: i?.equipment || [],
            }
          })
          setCompletedTrips(parsedValues)
        })
    } catch (error) {
      console.log('We fail to save location data: ' + error.toString())
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, backgroundColor: 'red' }}>

        <Layout>
          <Layout style={{ paddingTop: '3%', paddingLeft: '3%', display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between' }}>
            <MenuButton />
          </Layout>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: '5%', }}>
            <Text style={{ alignSelf: 'flex-start', marginLeft: '3%', fontFamily: AppFontBold, fontSize: 29 }}>
              {i18n.t(TRANSLATIONS_KEY.MY_TRIPS_SCREEN_TITLE).toString()}
            </Text>
            <Button
              onPress={(e) => navigation.navigate("CreateBooking")}
              size="small"
              style={{
                backgroundColor: '#41d5fb',
                borderColor: '#41d5fb',
                borderRadius: 10,
              }}>
              {() => <Text style={{ fontFamily: AppFontBold, color: 'white', fontSize: 16 }}>{i18n.t(TRANSLATIONS_KEY.CREATE_BTN_TEXT).toString()}</Text>}
            </Button>
          </View>
        </Layout>

        <Layout style={{ flex: 1 }}>
          <TabView
            indicatorStyle={{ backgroundColor: '#41d5fb' }}
            selectedIndex={selectedIndex}
            onSelect={index => setSelectedIndex(index)}>
            <Tab style={{ paddingTop: '6%', paddingBottom: '1%' }} title={evaProps => <Text {...evaProps} style={{ fontFamily: AppFontBold, color: selectedIndex == 0 ? '#41d5fb' : '#aeb1c3' }}>{i18n.t(TRANSLATIONS_KEY.ACTIVE_TAB_TXT).toString()}</Text>} >
              <Layout style={{ height: '86%' }}>
                {loading && (
                  <Layout style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                    <LoadingSpinner />
                  </Layout>
                )}
                {activeTrips && activeTrips.length !== 0 && <List
                  style={{ backgroundColor: '#f7f9fc', padding: '5%', flexGrow: 1 }}
                  data={activeTrips}
                  renderItem={(data: any) => {
                    return (
                      <TripCard
                        key={data.index}
                        {...data.item}
                      />
                    );
                  }}
                />}
                {!loading && activeTrips && activeTrips.length == 0 && <Text style={{ fontFamily: AppFontRegular,textAlign: 'center', marginTop: '20%' }} category="h5">{i18n.t(TRANSLATIONS_KEY.NO_ACTIVE_BOOKING_TXT).toString()}</Text>}

              </Layout>
            </Tab>
            <Tab style={{ paddingTop: '6%', paddingBottom: '1%' }} title={evaProps => <Text {...evaProps} style={{ fontFamily: AppFontBold, color: selectedIndex == 1 ? '#41d5fb' : '#aeb1c3' }}>{i18n.t(TRANSLATIONS_KEY.UPCOMING_TAB_TXT).toString()}</Text>} >
              <Layout style={{ height: '96%' }}>
                {loading && (
                  <Layout style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                    <LoadingSpinner />
                  </Layout>
                )}
                {upcommingTrips && upcommingTrips.length !== 0 && <List
                  style={{ backgroundColor: '#f7f9fc', padding: '5%', flexGrow: 1, marginBottom: 70 }}
                  data={upcommingTrips}
                  renderItem={(data: any) => {
                    return (
                      <TripCard
                        key={data.index}
                        {...data.item}
                      />
                    );
                  }}
                />}

                {!loading && upcommingTrips && upcommingTrips.length == 0 && <Text style={{ fontFamily: AppFontRegular,textAlign: 'center', marginTop: '20%' }} category="h5">{i18n.t(TRANSLATIONS_KEY.NO_UPCOMING_BOOKING_TXT).toString()}</Text>}
              </Layout>
            </Tab>

            <Tab style={{ paddingTop: '6%', paddingBottom: '1%' }} title={evaProps => <Text {...evaProps} style={{ fontFamily: AppFontBold, color: selectedIndex == 2 ? '#41d5fb' : '#aeb1c3' }}>{i18n.t(TRANSLATIONS_KEY.COMPLETED_TAB_TXT).toString()}</Text>} >
              <Layout style={{ height: '96%' }}>
                {loading && (
                  <Layout style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                    <LoadingSpinner />
                  </Layout>
                )}
                {completedTrips && completedTrips.length !== 0 && <List
                  style={{ backgroundColor: '#f7f9fc', padding: '5%', display: 'flex', flexDirection: 'column' }}
                  data={completedTrips}
                  renderItem={(data: any) => {
                    return (
                      <TripCard
                        key={data.index}
                        {...data.item}
                      />
                    );
                  }}
                />}

                {!loading && completedTrips && completedTrips.length == 0 && <Text style={{ fontFamily: AppFontRegular,textAlign: 'center', marginTop: '20%' }} category="h5">{i18n.t(TRANSLATIONS_KEY.NO_COMPLETED_BOOKING_TXT).toString()}</Text>}
              </Layout>
            </Tab>

          </TabView>

        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

export default DocumentScreen