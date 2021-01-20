import React, { useState, useEffect } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView, View, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { makeUseAxios } from 'axios-hooks';

const simpleUseAxios = makeUseAxios({ });

const BranchMap = () => {
    const [region, setRegion] = useState();
    const mapRef = React.createRef();

    const [{ data = [], loading, error }, doSearch] = simpleUseAxios({
        url: "https://www.grcgds.com/ota_api/branches.php",
        method: 'GET',
    })

    useEffect(() => {
        if (region) {
            mapRef?.current?.animateToRegion(region)
        }
    }, [region])

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                initialRegion={{ latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.01, longitudeDelta: 0.01, }}
                showsMyLocationButton={true}
                zoomEnabled={true}
                zoomTapEnabled={true}
                minZoomLevel={1}
                maxZoomLevel={17}
                zoomControlEnabled={true}
                scrollEnabled={true}
            >
                {
                    data.slice(0, 10).map((marker: any) => {
                        if (!region) setRegion({ latitude: parseFloat(marker.lat), longitude: parseFloat(marker.long), latitudeDelta: 0.0922, longitudeDelta: 0.0421 })
                        if (!marker || !marker.lat || !marker.long) return <></>
                        return (
                            <MapView.Marker coordinate={{ latitude: parseFloat(marker.lat), longitude: parseFloat(marker.long) }}>
                                {marker.clientId == 1 && <Image style={{ height: 50, width: 50 }} source={require('../../../../image/rightcars.png')} />}
                                    {marker.clientId == 10 && <Image style={{ height: 50, width: 50 }} source={require('../../../../image/zezgo-logo.png')} />}
                            </MapView.Marker>
                        )
                    })
                }
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: (Dimensions.get('screen').height / 100) * (Platform.OS == "android" ? 91 : 100),
        width: Dimensions.get('screen').width,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
export default BranchMap