
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Text, Input, Button, Select, SelectItem, Popover, Toggle, Menu } from '@ui-kitten/components';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import SmoothPicker from "react-native-smooth-picker";
import Modal from 'react-native-modal';
import { SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useCreateBookingState } from './CreateBookingState';
import TimeCheckbox from '../../../partials/TimeCheckbox';
import CarItem from '../../../partials/CarItem';
import { CarSearchItem, PricedEquip } from '../../../types/SearchVehicleResponse';
import ResolveCurrencySymbol from '../../../utils/ResolveCurrencySymbol';
import MenuButton from '../../../partials/MenuButton';
import Decimal from 'decimal.js';
import { AppFontBold, AppFontRegular } from '../../../constants/fonts'
import { TRANSLATIONS_KEY } from '../../../utils/i18n';
import { useTranslation } from 'react-i18next';
import BackButton from '../../../partials/BackButton';
import { APP_BRAND_COLOR } from '../../../constants/Colors';

type ParamList = {
    CarExtras: {
        vehicle: CarSearchItem;
    };
};
export default () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<ParamList, 'CarExtras'>>();
    const { i18n } = useTranslation();

    const [selectedExtras, setExtras] = useCreateBookingState("extras");
    const [showCounterModal, setShowCounterModal] = useState(false)
    const [amountSelected, setAmountSelected] = useState(0)
    const [selectedEquip, setSelectedEquip] = useState<PricedEquip | null>(null)

    const veh = route.params.vehicle

    veh.VehAvailCore.TotalCharge.RateTotalAmount =  new Decimal(veh.VehAvailCore.TotalCharge.RateTotalAmount).add(selectedExtras.reduce((total, next) => {
        const extraTotal = new Decimal(next.PricedEquip.Charge.Amount).times(next.amount);
        total = new Decimal(total).add(extraTotal).toNumber()
        return total
    },0)).toFixed(2)

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: '5%', justifyContent: 'space-between', display: 'flex' }} keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: 'white' }}>
                <View style={{ zIndex: 2, flexDirection: 'row',width: '100%', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <MenuButton />
                    <BackButton />
                </View>
                <Layout style={{ flexGrow: 1 }}>
                    <CarItem style={{ marginBottom: '5%' }} centerCarName={true} vehicle={veh} />
                    <Text style={{ marginBottom: '5%' }}>
                        {i18n.t(TRANSLATIONS_KEY.CAR_EXTRAS_TAG).toString()}
                    </Text>

                    {route.params.vehicle.VehAvailCore.PricedEquips.map(equip => {
                        const found = selectedExtras.find(i => i.PricedEquip.Equipment.vendorEquipID == equip.PricedEquip.Equipment.vendorEquipID)
                        const currentPrice = found ? found.amount * parseFloat(equip.PricedEquip.Charge.Amount): null;
                        return (
                            <TimeCheckbox
                                style={{ marginBottom: '5%' }}
                                checked={found != null && found.amount != 0}
                                title={`${equip.PricedEquip.Equipment.Description} ${currentPrice ? `(${ResolveCurrencySymbol(found?.PricedEquip.Charge.Taxamounts.Taxamount.CurrencyCode)}${currentPrice})` : ''}`}
                                replaceCheckbox={() => {
                                    const found = selectedExtras.find(i => i.PricedEquip.Equipment.Description == equip.PricedEquip.Equipment.Description)
                                    return <View style={{ backgroundColor: found ? APP_BRAND_COLOR : 'white', borderColor: found ? 'white' : APP_BRAND_COLOR, borderWidth: 1, borderRadius: 20, height: 35, width: 35, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {found ?
                                            <Text style={{ fontSize: 15, color: 'white' }}>{found.amount}</Text>
                                            : <Text style={{ fontSize: 25, color: APP_BRAND_COLOR }} >+</Text>}
                                    </View>
                                }}
                                onChange={() => {
                                    setSelectedEquip(equip);
                                    setShowCounterModal(true)
                                }}
                            />
                        );
                    })}

                    <Layout style={{ marginTop: 'auto' }}>
                        <Button
                        onPress={() => navigation.navigate('Payment', { vehicle: route.params.vehicle })}
                            size="giant" style={{
                                borderRadius: 10,
                                backgroundColor: APP_BRAND_COLOR,
                                borderColor: APP_BRAND_COLOR,
                                paddingLeft: 20,
                                paddingRight: 20,
                                marginBottom: '2%'
                            }}>
                            {() => <Text style={{ color: 'white', fontFamily: AppFontBold, fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.CONTINUE_WORD).toString()}</Text>}
                        </Button>
                    </Layout>
                </Layout>
            </ScrollView >
            <Modal
                onBackdropPress={() => setShowCounterModal(false)}
                isVisible={showCounterModal}
                style={{
                    justifyContent: 'flex-end',
                    margin: 0,
                }}>
                <Layout style={{ height: '40%', padding: '3%' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <AntDesignIcon
                                onPress={() => {
                                    setAmountSelected(p => {
                                        const v = p + 1
                                        if (v >= 16) return 16
                                        return v;
                                    })
                                }}
                                size={28}
                                name="down"
                            />
                            <AntDesignIcon
                                onPress={() => {
                                    setAmountSelected(p => {
                                        const v = p - 1
                                        if (v <= 0) return 0
                                        return v;
                                    })
                                }}
                                size={28}
                                name="up"
                            />
                        </View>
                        <Text style={{ color: APP_BRAND_COLOR, fontSize: 18 }} onPress={() => {
                            setAmountSelected(0)
                            setShowCounterModal(false)
                            if (!selectedEquip) return
                            setExtras(p => {
                                const found = p.find(i => i.PricedEquip.Equipment.vendorEquipID == selectedEquip.PricedEquip.Equipment.vendorEquipID)
                                if (found) {
                                    const toReturn = [ ...p.filter(i => i.PricedEquip.Equipment.vendorEquipID !== selectedEquip.PricedEquip.Equipment.vendorEquipID) ]
                                    if (amountSelected != 0) toReturn.push({ ...selectedEquip, amount: amountSelected })
                                    return toReturn
                                    
                                }

                                if (amountSelected != 0) {
                                    return [...p, { ...selectedEquip, amount: amountSelected }]
                                }

                                return p
                            })
                        }}>
                            Done
                        </Text>
                    </View>
                    <View style={{ height: '100%' }}>
                        <SmoothPicker
                            selectOnPress={true}
                            scrollAnimation
                            data={Array.from({ length: 16 }, (_, i) => i)}
                            onSelected={({ item, index }) => {
                                setAmountSelected(item)
                            }}
                            renderItem={({ item, index }) => (
                                <View style={{
                                    marginRight: 'auto',
                                    marginLeft: 'auto',
                                    width: '70%',
                                    height: 30,
                                    borderColor: APP_BRAND_COLOR,
                                    borderWidth: item == amountSelected ? 1 : 0,
                                    borderRadius: 10
                                }}>
                                    <Text style={{ textAlign: 'center', fontSize: 18 }}>{item}</Text>
                                </View>
                            )}
                        />
                    </View>
                </Layout>
            </Modal>

        </SafeAreaView>
    )
};
