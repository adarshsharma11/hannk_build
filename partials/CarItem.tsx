import React, { useState, useEffect } from 'react';
import { Layout, Text, Avatar, Button } from '@ui-kitten/components';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Image, TouchableWithoutFeedback, ViewStyle, View } from 'react-native';
import ResolveDoors from '../utils/ResolveDoors';
import ResolveTransmission from '../utils/ResolveTransmission';
import ResolveCurrencySymbol from '../utils/ResolveCurrencySymbol';
import GetCategoryByAcrissCode from '../utils/GetCategoryByAcrissCode';
import { CarSearchItem } from '../types/SearchVehicleResponse';
import { AppFontBold, AppFontRegular } from '../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../utils/i18n';
import { APP_BRAND_COLOR } from '../constants/Colors';

const hightLightStyles = {
    backgroundColor: `${APP_BRAND_COLOR}50`,
    priceColor: 'white'
}

type Props = {
    onClick?: () => void,
    showBookButton?: boolean,
    isActive?: boolean,
    vehicle: CarSearchItem
    style?: ViewStyle
    centerCarName?: boolean
}

const CarItem: React.FC<Props> = ({ vehicle, isActive, onClick, showBookButton, style: customeStyles, centerCarName = false }) => {
    const { i18n } = useTranslation();

    const currentStyles = isActive ? hightLightStyles : { backgroundColor: 'white', priceColor: 'black' }

    return (
        <TouchableWithoutFeedback>
            <Layout style={{ paddingLeft: '3%', paddingRight: '3%', paddingBottom: '3%', borderBottomColor: 'gray', borderBottomWidth: 1, display: 'flex', flexDirection: 'column', backgroundColor: currentStyles.backgroundColor, ...customeStyles }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ display: 'flex', justifyContent: 'center' }}>
                        <Text style={{ textAlign: centerCarName ? 'center' : 'left', fontSize: 14, fontFamily: AppFontBold, color: 'gray' }}>
                            {GetCategoryByAcrissCode(vehicle.VehAvailCore.Vehicle.VehType.VehicleCategory)}
                        </Text>
                        <Text style={{ textAlign: centerCarName ? 'center' : 'left', fontSize: 16, fontFamily: AppFontBold, }}>{vehicle.VehAvailCore.Vehicle.VehMakeModel.Name}</Text>
                        <Text style={{ textAlign: centerCarName ? 'center' : 'left', fontSize: 12, color: 'gray' }}>or similar</Text>
                    </View>

                    <View style={{ padding: '3%', position: 'absolute', right: 0 }}>
                        <Avatar style={{ borderRadius: 10 }} shape='square' source={require('../image/hannkicon.png')} />
                    </View>
                </View>
                <Layout style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '70%', backgroundColor: '#00000000' }}>
                    <Layout style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#00000000' }}>
                        <Layout style={{ width: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000000' }}>
                            <Image source={{ uri: vehicle.VehAvailCore.Vehicle.VehMakeModel.PictureURL }} style={{ flex: 1, width: 160, height: 160, resizeMode: 'contain' }} />
                        </Layout>

                        <Layout style={{ width: '90%', marginLeft: '10%', display: 'flex', flexDirection: 'column', backgroundColor: '#00000000' }}>
                            <Layout style={{ display: 'flex', flexDirection: 'row', marginBottom: '4%', backgroundColor: 'rgba(0,0,0,0)' }}>
                                <Image source={require('../image/door.png')} style={{ width: 20, height: 20 }} />
                                <Text>{ResolveDoors(vehicle.VehAvailCore.Vehicle.VehType.VehicleCategory)} doors</Text>
                            </Layout>
                            {(vehicle.VehAvailCore.Vehicle.VehClass.Size !== null && vehicle.VehAvailCore.Vehicle.VehClass.Size !== undefined && vehicle.VehAvailCore.Vehicle.VehClass.Size.toString() != "0") && (
                                <Layout style={{ display: 'flex', flexDirection: 'row', marginBottom: '4%', backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <Image source={require('../image/seats.png')} style={{ width: 20, height: 20 }} />
                                    <Text>{vehicle.VehAvailCore.Vehicle.VehClass.Size} seats</Text>
                                </Layout>
                            )}
                            {vehicle.VehAvailCore.Vehicle.AirConditionInd && (
                                <Layout style={{ display: 'flex', flexDirection: 'row', marginBottom: '4%', backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <Image source={require('../image/AC.png')} style={{ width: 20, height: 20 }} />
                                    <Text>Air Conditioning</Text>
                                </Layout>

                            )}
                            {ResolveTransmission(vehicle.VehAvailCore.Vehicle.VehType.VehicleCategory) && (
                                <Layout style={{ display: 'flex', flexDirection: 'row', marginBottom: '4%', backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <Image source={require('../image/manual.png')} style={{ width: 20, height: 20 }} />
                                    <Text>{ResolveTransmission(vehicle.VehAvailCore.Vehicle.VehType.VehicleCategory)}</Text>
                                </Layout>
                            )}

                            <Layout style={{ display: 'flex', flexDirection: 'row', marginBottom: '4%', backgroundColor: 'rgba(0,0,0,0)' }}>
                                <Avatar style={{ borderRadius: 10, height: 35, width: 35 }} shape='square' source={require('../image/key.png')} />
                            </Layout>



                        </Layout>

                    </Layout>
                    <Layout style={{ backgroundColor: '#00000000' }}>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <FontAwesome5 style={{ marginRight: '2%' }} name={"gas-pump"} size={16} />
                            <Text style={{ fontSize: 13, fontFamily: AppFontBold }}>
                                {i18n.t(TRANSLATIONS_KEY.CAR_LIST_ITEM_FUEL_POLICY).toString()}:{' '}
                            </Text>
                            <Text style={{ fontSize: 13 }}>
                                {i18n.t(TRANSLATIONS_KEY.CAR_LIST_ITEM_FUEL_POLICY_LILE_TO_LIKE).toString()}
                            </Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <FontAwesome5 style={{ marginRight: '2%' }} name={"road"} size={16} />
                            <Text style={{ fontSize: 13, fontFamily: AppFontBold }}>
                                {i18n.t(TRANSLATIONS_KEY.CAR_LIST_ITEM_MILEAGE).toString()}:{' '}
                            </Text>
                            <Text style={{ fontSize: 13 }}>
                                {i18n.t(TRANSLATIONS_KEY.CAR_LIST_ITEM_UNLIMITED).toString()}
                            </Text>
                        </View>
                    </Layout>

                </Layout>
                <Layout style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#00000000', marginLeft: 'auto' }}>
                    <Text style={{ fontFamily: AppFontBold, color: currentStyles.priceColor, fontSize: 18 }}>{ResolveCurrencySymbol(vehicle.VehAvailCore.TotalCharge.CurrencyCode || '')} </Text>
                    <Text style={{ fontFamily: AppFontBold, color: currentStyles.priceColor, fontSize: 18 }}>{vehicle.VehAvailCore.TotalCharge.RateTotalAmount}</Text>
                </Layout>
                {showBookButton && (
                    <Button
                        onPress={() => {
                            onClick && onClick()
                        }}
                        size="giant"
                        style={{
                            backgroundColor: APP_BRAND_COLOR,
                            borderColor: APP_BRAND_COLOR,
                            borderRadius: 10,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            width: "50%",
                            shadowColor: APP_BRAND_COLOR,
                            shadowOffset: {
                                width: 0,
                                height: 10,
                            },
                            shadowOpacity: 0.51,
                            shadowRadius: 13.16,
                            elevation: 10,
                        }}>
                        {() => <Text style={{ color: 'white', fontFamily: AppFontBold, fontSize: 18 }}>Book Now</Text>}
                    </Button>
                )}
            </Layout>
        </TouchableWithoutFeedback>
    );
}

export default CarItem
