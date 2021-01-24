import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { makeUseAxios } from 'axios-hooks';
import { CarSearchItem } from 'hannk-mobile-common';

const simpleUseAxios = makeUseAxios({});

const CustomeMarker = ({ marker, icon, onSelect, cars = [] }: { cars?: CarSearchItem[],icon?: string, marker: any, onSelect: (location: any) => void }) => {
    const markerRef = useRef(null);
    const [firstPress, setFirstPress] = useState("Select");

    return (
        <Marker
            key={`${marker.lat}${marker.long}`}
            coordinate={{ latitude: parseFloat(marker.lat), longitude: parseFloat(marker.long) }}
            ref={markerRef}
            onPress={() => markerRef?.current?.showCallout()}
        >
            {marker.clientId == 1 && <Image style={{ height: 50, width: 50 }} source={icon || require('../../../../image/rightcars.png')} />}
            {marker.clientId == 10 && <Image style={{ height: 50, width: 50 }} source={icon || require('../../../../image/zezgo-logo.png')} />}
            <Callout onPress={() => {
                console.log(firstPress)
                if (firstPress == "Select") {
                    setFirstPress("Continue")
                } else {
                    onSelect(marker)
                    setFirstPress("Select")
                    markerRef?.current?.hideCallout()
                }
            }} style={{ flex: 1 }} tooltip={true}>
                <View style={{ justifyContent: "space-between",width: (Dimensions.get('screen').width / 100) * 60, height: (Dimensions.get('screen').height / 100) * 17, backgroundColor: "#FFFFFF", borderRadius: 25 }}>
                    <View style={{ padding: '3%' }}>
                        <Text style={{ fontSize: 17 }}>Pick Location</Text>
                    </View>
                    <View style={{ padding: '3%', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{marker.location}</Text>
                        <Text style={{ fontSize: 20 }}>
                            {cars.reduce((total, car) => {
                                console.log(car.VehAvailCore.Supplier_ID.slice(4,6))
                                car.VehAvailCore.Supplier_ID.slice(4,6) == marker.clientId ? total = total + 1 : total
                                return total
                            }, 0)}
                        </Text>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: '#00000030', zIndex: -1, borderBottomEndRadius: 25, borderBottomStartRadius: 25 }}>
                        <Text style={{ padding: '2%', paddingLeft: '3%',fontSize: 20, color: "white" }}>
                            Tap twice to choose
                        </Text>
                    </TouchableOpacity>
                </View>
            </Callout>
        </Marker>
    )
}

type Params = { onRegionsChange?: (regions: any[]) => void,mapRef?: React.MutableRefObject<any>,icon?: string, cars?: CarSearchItem[],onLocationChange?: (location: any) => void }
const BranchMap = ({ icon, onLocationChange, cars = [], mapRef: outerMapRef, onRegionsChange }: Params) => {
    const [region, setRegion] = useState();
    const [selectedLocation, setSelectedLocation] = useState<string>();
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

    useEffect(() => {
        onRegionsChange && onRegionsChange(data)
    }, [data])

    useEffect(() => {
        if (outerMapRef && mapRef.current) {
            outerMapRef.current = mapRef.current
        }
    }, [mapRef.current])

    useEffect(() => {
        if (selectedLocation) {
            onLocationChange && onLocationChange(selectedLocation)
        }
    }, [selectedLocation])

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
                        return (<CustomeMarker cars={cars} onSelect={(l) => setSelectedLocation(l)} icon={icon} marker={marker} />)
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