import React, { useState, useEffect, useRef } from 'react';
import { Svg, Image as ImageSvg } from 'react-native-svg';
import { Text, View, StyleSheet, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { makeUseAxios } from 'axios-hooks';
import { CarSearchItem, HannkCarItem } from 'hannk-mobile-common';
import { APP_BRAND_COLOR } from '../../../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../../utils/i18n';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from '@ui-kitten/components';
import { AppFontBold } from '../../../../constants/fonts';
import { useCreateBookingState } from '../CreateBookingState';
import { MarkerVehicleType } from '../../../../utils/MarkerVehicleType';
import { storeLocalBooking } from '../../../../state/extraState';

const simpleUseAxios = makeUseAxios({});

type MarkerParams = {
    markerType?: 'CAR' | 'SCOOTER',
    cars?: CarSearchItem[],
    icon?: string, marker: any,
    onSelect?: (location: any) => void,
    onMarkerPress?: (marker: any) => void,
    calloutContent?: () => JSX.Element
}
const CustomeMarker = ({ marker, icon, onSelect, calloutContent, onMarkerPress }: MarkerParams) => {
    const markerRef = useRef(null);
    const [price, setPrice] = useState("");
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        setPrice(((Math.random() * 30) + 1).toFixed(2))
        setAmount(Math.floor(Math.random() * 10) + 1)
    }, [])

    return (
        <Marker
            key={`${marker.lat}${marker.long}`}
            coordinate={{ latitude: parseFloat(marker.lat), longitude: parseFloat(marker.long) }}
            ref={markerRef}
            onPress={() => {
                markerRef?.current?.showCallout()
                onMarkerPress && onMarkerPress(marker)
            }}
        >
            {marker.clientId == 1 && <Image style={{ height: 50, width: 50 }} source={icon || require('../../../../image/rightcars.png')} />}
            {marker.clientId == 10 && <Image style={{ height: 50, width: 50 }} source={icon || require('../../../../image/zezgo-logo.png')} />}
            <Callout
                    onPress={() => {
                        onSelect && onSelect(marker)
                        markerRef?.current?.hideCallout()
                    }}
                    style={{ flex: 1 }}
                    tooltip={true}>
                    {calloutContent ? calloutContent() : (
                        <View style={{ justifyContent: "space-between", width: (Dimensions.get('screen').width / 100) * 65, backgroundColor: "#FFFFFF", borderRadius: 25 }}>
                            <View style={{ padding: '3%' }}>
                                <Text style={{ fontSize: 17 }}>
                                    {marker.clientId == 1 && "Right Cars"}
                                    {marker.clientId == 10 && "Zezgo Cars"}
                                </Text>
                            </View>
                            <View style={{ padding: '3%', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ width: "65%", fontWeight: 'bold', fontSize: 22 }}>{marker.location}</Text>
                                <View style={{ width: "30%" }}>
                                    <Svg width={70} height={70}>
                                        <ImageSvg
                                            width={'100%'}
                                            height={'100%'}
                                            preserveAspectRatio="xMidYMid slice"
                                            href={{ uri: `https://www.grcgds.com/${marker.clientId == 1 ? "rightcars" : "zezgo-logo"}.png` }}
                                        />
                                    </Svg>
                                </View>
                            </View>
                            <View style={{ padding: '3%' }}>
                                <Text style={{ fontSize: 20 }}>
                                    {`${amount} cars available from €${price}`}
                                </Text>
                            </View>
                            <TouchableOpacity style={{ backgroundColor: '#00000030', zIndex: -1, borderBottomEndRadius: 25, borderBottomStartRadius: 25 }}>
                                <Text style={{ padding: '2%', paddingLeft: '3%', fontSize: 20, color: "white" }}>
                                    Tap to choose
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Callout>
        </Marker>
    )
}

type Params = { onRegionsChange?: (regions: any[]) => void, mapRef?: React.MutableRefObject<any>, cars?: CarSearchItem[], onLocationChange?: (location: any) => void }
const BranchMap = ({ onLocationChange, cars = [], mapRef: outerMapRef, onRegionsChange }: Params) => {
    const [region, setRegion] = useState();
    const [selectedLocation, setSelectedLocation] = useState<string>();
    const [showQrFor, setShowQrFor] = useState<any>();
    const [showShareModal, setShowShareModal] = useState<boolean>(false);
    const [showChargeDriveTime, setShowChargeDriveTime] = useState<{ show: boolean, type?: MarkerVehicleType, marker?: any }>({ show: false });
    const [originLocation] = useCreateBookingState("originLocation");
    const mapRef = React.createRef();
    const { i18n } = useTranslation();
    const navigation = useNavigation();

    const [departureTime, setDepartureTime] = useCreateBookingState("departureTime");
    const [returnTime, setReturnTime] = useCreateBookingState("returnTime");

    const [{ data = [], loading, error }, doSearch] = simpleUseAxios({
        url: `https://www.grcgds.com/hannkmobileapp_dev/branches.php?code=${originLocation?.internalcode || 'LHRA01r'}`,
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
        <>
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
                            const shareMarker = { ...marker, lat: parseFloat(marker.lat) + 0.0050, long: parseFloat(marker.long) + 0.0050 }
                            const scooterMarker = { ...marker, lat: parseFloat(marker.lat) + 0.0050, long: parseFloat(marker.long) - 0.0050 }
                            const mopedMarker = { ...marker, lat: parseFloat(marker.lat) + 0.0150, long: parseFloat(marker.long) - 0.0050 }
                            const bycicleMarker = { ...marker, lat: parseFloat(marker.lat) + 0.0150, long: parseFloat(marker.long) - 0.0195 }
                            const chargingMarker = { ...marker, lat: parseFloat(marker.lat) - 0.0100, long: parseFloat(marker.long) - 0.0195 }
                            return (
                                <>
                                    <CustomeMarker
                                        calloutContent={() => <></>}
                                        cars={cars}
                                        onMarkerPress={(marker) => {
                                            setShowChargeDriveTime({ show: true, type: MarkerVehicleType.CHARGE, marker })
                                        }}
                                        icon={require('../../../../image/charge-points.png')}
                                        marker={chargingMarker} />
                                    <CustomeMarker
                                        calloutContent={() => <></>}
                                        cars={cars}
                                        onMarkerPress={(marker) => setShowChargeDriveTime({ show: true, type: MarkerVehicleType.BYCICLE, marker })}
                                        icon={require('../../../../image/bicycle.png')}
                                        marker={bycicleMarker} />
                                    <CustomeMarker
                                        calloutContent={() => <></>}
                                        cars={cars}
                                        onMarkerPress={(marker) => setShowChargeDriveTime({ show: true, type: MarkerVehicleType.MOPED, marker })}
                                        icon={require('../../../../image/moped.png')}
                                        marker={mopedMarker} />
                                    <CustomeMarker
                                        calloutContent={() => <></>}
                                        cars={cars}
                                        onMarkerPress={(marker) => setShowChargeDriveTime({ show: true, type: MarkerVehicleType.SCOOTER, marker })}
                                        icon={require('../../../../image/scooter.png')}
                                        marker={scooterMarker} />
                                    <CustomeMarker
                                        calloutContent={() => <></>}
                                        cars={cars}
                                        onMarkerPress={() => setShowShareModal(true)} icon={require('../../../../image/car-share.png')} marker={shareMarker} />

                                    <CustomeMarker cars={cars} onSelect={(l) => {
                                        storeLocalBooking({
                                            dropTime: returnTime.toString(),
                                            pickTime: departureTime.toString(),
                                            locationCode: originLocation?.Branchname || 'LHRA01',
                                        })
                                        .then(() => {
                                            setSelectedLocation(l)
                                        })
                                    }} icon={require('../../../../image/car-rental.png')} marker={marker} />
                                </>
                            )
                        })
                    }
                </MapView>
            </View>
            <Modal
                onBackdropPress={() => setShowShareModal(false)}
                onBackButtonPress={() => setShowShareModal(false)}
                backdropOpacity={0.25}
                isVisible={showShareModal}
                swipeDirection={['up', 'left', 'right', 'down']}
                style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: '#00000000' }}>
                <View style={styles.content}>
                    {cars.length > 0 && (
                        <HannkCarItem
                            APP_BRAND_COLOR={APP_BRAND_COLOR}
                            CAR_LIST_ITEM_FUEL_POLICY={i18n.t(TRANSLATIONS_KEY.CAR_LIST_ITEM_FUEL_POLICY).toString()}
                            CAR_LIST_ITEM_FUEL_POLICY_LILE_TO_LIKE={i18n.t(TRANSLATIONS_KEY.CAR_LIST_ITEM_FUEL_POLICY_LILE_TO_LIKE).toString()}
                            CAR_LIST_ITEM_MILEAGE={i18n.t(TRANSLATIONS_KEY.CAR_LIST_ITEM_MILEAGE).toString()}
                            CAR_LIST_ITEM_UNLIMITED={i18n.t(TRANSLATIONS_KEY.CAR_LIST_ITEM_UNLIMITED).toString()}
                            carLogo={{ source: "https://image.shutterstock.com/image-vector/edit-vector-icon-260nw-546038194.jpg" }}
                            showBookButton={true}
                            style={{ width: '120%' }}
                            centerCarName={true}
                            key={cars[0].VehAvailCore.VehID}
                            vehicle={cars[0]}
                            isActive={false}
                            showBorderBottom={false}
                            onClick={() => {
                                storeLocalBooking({
                                    dropTime: returnTime.toString(),
                                    pickTime: departureTime.toString(),
                                    locationCode: originLocation?.Branchname || 'LHRA01',
                                    bookingType: route.params.type
                                })
                                .then(() => {
                                    navigation.navigate('Payment', { vehicle: cars[0], goTo: 'MyBookings' })
                                    setShowShareModal(false)  
                                })
                            }} />
                    )}
                </View>
            </Modal>
            <Modal
                onBackdropPress={() => setShowChargeDriveTime({ show: false })}
                onBackButtonPress={() => setShowChargeDriveTime({ show: false })}
                backdropOpacity={0.25}
                isVisible={showChargeDriveTime.show}
                swipeDirection={['up', 'left', 'right', 'down']}
                style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: '#00000000' }}>
                <View style={styles.content}>
                    <View style={{ backgroundColor: '#049930', padding: '2%', marginBottom: '2%', width: '90%', alignItems: 'center' }}>
                        {showChargeDriveTime.type == MarkerVehicleType.BYCICLE && <MaterialCommunityIcon name="bicycle" color="#ffffff" size={200} />}
                        {showChargeDriveTime.type == MarkerVehicleType.MOPED && <MaterialCommunityIcon name="motorbike" color="#ffffff" size={200} />}
                        {showChargeDriveTime.type == MarkerVehicleType.SCOOTER && <MaterialCommunityIcon name="scooter" color="#ffffff" size={200} />}
                        {showChargeDriveTime.type == MarkerVehicleType.CHARGE && <MaterialCommunityIcon name="car-electric" color="#ffffff" size={200} />}
                    </View>
                    <View style={{ backgroundColor: '#049930', padding: '2%', borderRadius: 10, marginBottom: '2%', width: '90%' }}>
                        <Text style={{ color: 'white', fontSize: 28, textAlign: 'center' }}>
                            {showChargeDriveTime.type == MarkerVehicleType.BYCICLE && 'Pay Bicycle Ride'}
                            {showChargeDriveTime.type == MarkerVehicleType.MOPED && 'Pay Urban Moped Ride'}
                            {showChargeDriveTime.type == MarkerVehicleType.SCOOTER && 'Pay Urban Scooter Ride'}
                            {showChargeDriveTime.type == MarkerVehicleType.CHARGE && 'Electric Vehicle Charging'}
                        </Text>
                    </View>
                    <Button
                        onPress={(e) => {
                            navigation.navigate("QRScreen", { vehicle: cars[0], type: showChargeDriveTime.type })
                            setShowChargeDriveTime({ show: false })
                        }}
                        size="giant"
                        style={{
                            width: '90%',
                            backgroundColor: APP_BRAND_COLOR,
                            borderColor: APP_BRAND_COLOR,
                            borderRadius: 10,
                            shadowColor: APP_BRAND_COLOR,
                            shadowOffset: {
                                width: 0,
                                height: 10,
                            },
                            shadowOpacity: 0.51,
                            shadowRadius: 13.16,
                            elevation: 10,
                        }}>
                        {() => <Text style={{ fontFamily: AppFontBold, color: 'white', fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.RESERVE_WORD).toString()}</Text>}
                    </Button>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        height: (Dimensions.get('screen').height / 100) * (Platform.OS == "android" ? 91 : 100),
        width: Dimensions.get('screen').width,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        flexGrow: 1
    },
    content: {
        backgroundColor: 'white',
        padding: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
});
export default BranchMap