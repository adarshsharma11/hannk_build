import React, { useState, useEffect } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, Dimensions, Image, Platform } from 'react-native';
// @ts-ignore
import GPSState from 'react-native-gps-state'
//@ts-ignore
import GetLocation from 'react-native-get-location'
import LoadingSpinner from '../../../partials/LoadingSpinner';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MenuButton from '../../../partials/MenuButton';
import { AppFontBold } from '../../../constants/fonts';
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';
import { APP_BRAND_COLOR } from '../../../constants/Colors';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import useAxios from 'axios-hooks'
import { VehAvailCore } from '../../../types/SearchVehicleResponse';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';

const InmediatePickupScreen = () => {
  const navigation = useNavigation();
  const { i18n } = useTranslation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [filter, setFilter] = useState(['charge point', 'car', 'bike', 'scooter']);

  const [region, setRegion] = useState();

  // const [{ data, loading, error }, getCars] = useAxios<VehAvailCore[]>({
  //   url: `https://www.grcgds.com/ota_api/mapsapi.php?type=${filter[0]}`,
  //   method: 'GET',
  //   validateStatus: () => true
  // }, { manual: true })

  Geocoder.init("AIzaSyAfADVN1iJ2m-ypbDuNVnJ-QM2VnNj_Oj8");

  const getData = async (filters) => {
    let dataToAdd = []
    let markerPoints = []
    if (filters.length != 0) {
      for (let i = 0; i < filters.length; i++) {
        let data = await getDataForType(filters[i])
        data.data.data.length > 0 && data.data.data.map(item => dataToAdd.push(item))
      }
      let initialRegion = {
        latitude: Number(dataToAdd[0].lat),
        longitude: Number(dataToAdd[0].lng),
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      }

      dataToAdd.map(item => {
        let data = {
          coordinates: {
            latitude: Number(item.lat),
            longitude: Number(item.lng)
          },
          type: item.type,
          available: item.Available
        }
        markerPoints.push(data)
      })
      setMarkers(markerPoints)
      setRegion(initialRegion)
    }
    else {
      setMarkers([])
      setRegion()
    }
  }

  const getDataForType = async (type) => {
    let data = await axios.get(`https://www.grcgds.com/ota_api/mapsapi.php?type=${type}`)
    return data
  }

  useFocusEffect(
    React.useCallback(() => {
      if (!GPSState.isAuthorized()) {
        GPSState.requestAuthorization(GPSState.AUTHORIZED_WHENINUSE)
      }

      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          console.log(location)
          setCurrentLocation(location)
        })
        .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
        })

    }, [])
  );

  useEffect(() => {
    getData(filter)
  }, [])

  const getLatLong = (address) => {
    Geocoder.from(address)
      .then(json => {
        var location = json.results[0].geometry.location;
        let initialRegion = {
          latitude: Number(location.lat),
          longitude: Number(location.lng),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }
        let data = [{
          coordinates: {
            latitude: Number(location.lat),
            longitude: Number(location.lng)
          },
          type: 'default'
        }]
        setMarkers(data)
        setRegion(initialRegion)
      })
      .catch(error => console.warn(error));
  }

  const addToFilterArray = (filterToAdd) => {
    // console.log(filter,'-----current filters------')
    let isExists = filter.filter(item => item == filterToAdd)
    // console.log(isExists)
    if (isExists.length > 0) {
      let filters = filter.filter(item => item != filterToAdd)
      console.log(filters, '========removed======')
      setFilter(filters)
      getData(filters)
    }
    else {
      let data = filter.concat(filterToAdd)
      setFilter(data)
      getData(data)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Layout style={{ position: 'absolute', padding: '5%', backgroundColor: 'red', zIndex: 2, display: 'flex', flexDirection: 'row', backgroundColor: '#00000000', alignItems: 'center', justifyContent: 'center', marginTop: '2%' }}>
        <MenuButton />
      </Layout>
      <Layout style={{ position: 'absolute', marginTop: Dimensions.get('screen').width * (Platform.OS == "android" ? 0.10 : 0.25), marginLeft: Dimensions.get('screen').width * 0.20, zIndex: 20, width: Dimensions.get('screen').width * 0.65, backgroundColor: 'red' }}>

        <Layout>
          <GooglePlacesAutocomplete
            placeholder='Google map search'
            onPress={(data, details = null) => {
              getLatLong(data.description)
            }}
            query={{
              key: 'AIzaSyAfADVN1iJ2m-ypbDuNVnJ-QM2VnNj_Oj8',
              language: 'en',
            }}
          />
        </Layout>
        <Layout style={{ flexDirection: 'row', backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => addToFilterArray('charge point')}>
            {filter.includes('charge point') ? <Image source={require('../../../image/icon-chargepoint-available.png')} /> : <Image source={require('../../../image/icon-chargepoint-inuse.png')} />}
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => addToFilterArray('car')}>
            {filter.includes('car') ? <Image source={require('../../../image/icon-car-available.png')} /> : <Image source={require('../../../image/icon-car-notavailable.png')} />}
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => addToFilterArray('bike')}>
            {filter.includes('bike') ? <Image source={require('../../../image/icon-bike-available.png')} /> : <Image source={require('../../../image/icon-bike-unavailable.png')} />}
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => addToFilterArray('scooter')}>
            {filter.includes('scooter') ? <Image source={require('../../../image/icon-scooter-available.png')} /> : <Image source={require('../../../image/icon-scooter-unavailable.png')} />}
          </TouchableOpacity>
        </Layout>
      </Layout>

      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          initialRegion={region}
          region={region}
          showsUserLocation={true}
          followUserLocation={true}
          showsMyLocationButton={true}
          zoomEnabled={true}
          zoomTapEnabled={true}
          zoomControlEnabled={true}
          scrollEnabled={true}
        >
          {
            markers && markers.map((marker) => {
              return (
                // <Marker
                //   coordinate={marker.coordinates}
                //   title='Test'
                // />
                <MapView.Marker coordinate={marker.coordinates}>
                  <View>
                    {
                      marker.type == 'Car' &&
                      <>
                        {marker.available == 0 && <Image source={require('../../../image/icon-car-notavailable.png')} />}
                        {marker.available == 1 && <Image source={require('../../../image/icon-car-available.png')} />}
                      </>
                    }
                    {
                      marker.type == 'Bike' &&
                      <>
                        {marker.available == 0 && <Image source={require('../../../image/icon-bike-unavailable.png')} />}
                        {marker.available == 1 && <Image source={require('../../../image/icon-bike-available.png')} />}
                      </>
                    }
                    {
                      marker.type == 'Scooter' &&
                      <>
                        {marker.available == 0 && <Image source={require('../../../image/icon-scooter-unavailable.png')} />}
                        {marker.available == 1 && <Image source={require('../../../image/icon-scooter-available.png')} />}
                      </>
                    }
                    {
                      marker.type == 'chargepoint' &&
                      <>
                        {marker.available == 0 && <Image source={require('../../../image/icon-chargepoint-inuse.png')} />}
                        {marker.available == 1 && <Image source={require('../../../image/icon-chargepoint-available.png')} />}
                      </>
                    }
                    {
                      marker.type == 'default' && <Image source={require('../../../image/my-marker.png')} />
                    }
                  </View>
                </MapView.Marker>
              )
            })
          }
        </MapView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: (Dimensions.get('screen').height / 100) * (Platform.OS == "android" ? 91 : 100),
    width: Dimensions.get('screen').width,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: -1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1
  },
});
export default InmediatePickupScreen