
import React, { useState } from 'react'
import { Text, Input, Button } from '@ui-kitten/components';
import { SafeAreaView, View } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import MapView from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
//@ts-ignore
import GetLocation from 'react-native-get-location'
// @ts-ignore
import GPSState from 'react-native-gps-state'
import useAxios from 'axios-hooks'
import LoadingSpinner from '../../../partials/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';


export default () => {
    const { i18n } = useTranslation();
    const route = useRoute();
    const returnAddressString = `${route.params.pLocationAddress.addressName.replace(/ /g, '+')}${route.params.pLocationAddress.CountryName.Name}`
    const [currentLocation, setCurrentLocation] = useState<{[k: string]: any} | null>(null);

    const [returnLocationReq, refetchReturn] = useAxios({
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${returnAddressString}&key=AIzaSyBJ8evu2aDcSyb2F2NIuNQ3L5TeLAGpino`,
    })

    useFocusEffect(
        React.useCallback(() => {
            if (!GPSState.isAuthorized()){
                GPSState.requestAuthorization(GPSState.AUTHORIZED_WHENINUSE)
            }
            refetchReturn();

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

        }, [])
    );

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start' }} >
            <View style={{ display: 'flex', height: '100%' }}>
                {(returnLocationReq.data && !returnLocationReq.loading && currentLocation) && <MapView
                    style={{ flex: 1 }}
                    initialCamera={{
                        center: {
                            latitude: currentLocation ? currentLocation.latitude: 37.4308165178,
                            longitude: currentLocation ? currentLocation.longitude: -122.160886388,
                        },
                        heading: 0,
                        pitch: 0,
                        zoom: 10,
                        altitude: 0,
                    }}
                    initialRegion={{
                        latitude: currentLocation ? currentLocation.latitude: 37.4308165178,
                        longitude: currentLocation ? currentLocation.longitude: -122.160886388,
                        latitudeDelta: 0.0,
                        longitudeDelta: 0.0
                    }}
                >
                    <MapViewDirections
                        origin={{
                            latitude: currentLocation ? currentLocation.latitude: 37.4308165178,
                            longitude: currentLocation ? currentLocation.longitude : -122.160886388,
                        }}
                        destination={{
                            latitude: returnLocationReq.data.results[0].geometry.location.lat,
                            longitude: returnLocationReq.data.results[0].geometry.location.lng
                        }}
                        onError={(err) => console.log(err)}
                        strokeWidth={2}
                        strokeColor={'#FB4A46'}
                        lineCap={'round'}
                        apikey={'AIzaSyBJ8evu2aDcSyb2F2NIuNQ3L5TeLAGpino'}
                    />
                </MapView>}


                {!currentLocation && returnLocationReq.loading && (
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Text category="h2">
                            {i18n.t(TRANSLATIONS_KEY.DETAILS_MAP_LOADING_ROUTE_TAG).toString()}
                        </Text>
                        <LoadingSpinner />
                    </View>
                )}

                {returnLocationReq.error && (
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Text category="h2">{i18n.t(TRANSLATIONS_KEY.DETAILS_MAP_FAIL_LOAD_ROUTE_TAG).toString()}</Text>
                    </View>
                )}
                {(returnLocationReq.data && !currentLocation && !returnLocationReq.loading) && <Button onPress={() => {

                }} size="small" style={{ position: 'absolute', right: 0, marginTop: '2%', marginLeft: '2%', borderRadius: 10, backgroundColor: '#cf1830', borderColor: '#cf1830', width: '30%' }}>
                    {() => <Text style={{ color: 'white' }}>{i18n.t(TRANSLATIONS_KEY.HELP_WORD).toString()}</Text>}
                </Button>}
            </View>

        </SafeAreaView>
    )
};
