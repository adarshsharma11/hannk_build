import React, { useState, useEffect, useRef } from 'react';
import { Layout, Text, TabView, Tab, Button, Card, TabBar } from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIconsIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import { SafeAreaView, ScrollView, TouchableOpacity, Dimensions, View, TouchableWithoutFeedback } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import CarItem from '../../../../partials/CarItem';
import { useCreateBookingState } from '../CreateBookingState';
import { VehVendorAvail, VehRentalCore } from '../../../type/SearchVehicleResponse';
import { HannkCarItem } from 'hannk-mobile-common';
import GetCategoryByAcrissCode from '../../../../utils/GetCategoryByAcrissCode';
import { AppFontBold, AppFontRegular } from '../../../../constants/fonts'
import Orientation, { OrientationType } from 'react-native-orientation-locker';
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../../utils/i18n';
import { APP_BRAND_COLOR } from '../../../../constants/Colors';
import { CarSearchItem } from '../../../../types/SearchVehicleResponse';
import BranchMap from './BranchMap';
const retajlogo = require('../../../../image/hannkicon.png')

const _dataProvider = new DataProvider((r1, r2) => r1.VehID !== r2.VehID)

type ParamList = {
  CarsList: {
    cars: CarSearchItem[];
  };
};
const CarsListScreen = () => {
  const route = useRoute<RouteProp<ParamList, 'CarsList'>>();
  const mapRef = useRef(null);
  const { i18n } = useTranslation();

  const navigation = useNavigation();
  const [pickedBranch, setPickedBranch] = useCreateBookingState("pickedBranch");

  const [, setVehicle] = useCreateBookingState('vehicle')
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showSortModal, setShowSortModal] = useState(false)
  const [sortState, setSortState] = useState<"LowToHigh" | "HighToLow">("LowToHigh")
  const [carTransmissionOptions, setCarTransmissionOptions] = useState([])
  const [carTypeOptions, setCarTypeOptions] = useState([])
  const [transmissionFilters, setTransmissionFilter] = useState<string[]>([])
  const [typesFiter, setTypesFilter] = useState<string[]>([])
  const [applyFilter, setApplyFilter] = useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [firstNavigateToMap, setFirstNavigateToMap] = useState<boolean>(false);

  const cars = route.params.cars

  const getCars = () => {
    return cars.filter(c => {
      return true
      if (!c.VehAvailCore) return false
      const carCliendId = c.VehAvailCore.Supplier_ID.slice(4, 6)
      console.log("carCliendId",carCliendId)
      return carCliendId == pickedBranch?.clientId
    })
  }

  const currentLayoutProvider = new LayoutProvider(
    index => {
      if (index == 0) return 'HEADER'
      return 0
    },
    (type, dim) => {
      if (type === 'HEADER') {
        dim.width = Dimensions.get('window').width;
        dim.height = 190;
      } else {
        dim.width = Dimensions.get('window').width;
        dim.height = 380;
      }
    }
  )

  const [dataToUse, setDataToUse] = useState(_dataProvider.cloneWithRows(cars));

  const onOrientationDidChange = (orientation: OrientationType) => {
    let isPortrait = false
    if (orientation == 'PORTRAIT' || orientation == 'PORTRAIT-UPSIDEDOWN' || orientation == 'FACE-DOWN' || orientation == 'FACE-UP') {
      isPortrait = true
      console.log('isPortrait')
    } else {
      console.log('isnotPortrait')
    }

    /*setLp(new LayoutProvider(
      index => {
        if (index == 0) return 'HEADER'
        return 0
      },
      (type, dim) => {
        if (type === 'HEADER') {
          dim.width = Dimensions.get('window').width;
          dim.height = 210;
        } else {
          dim.width = Dimensions.get('window').width;
          dim.height = 340;
        }
      }
    ))*/
  };

  useEffect(() => {
    Orientation.addDeviceOrientationListener(onOrientationDidChange);
    Orientation.getOrientation(onOrientationDidChange);

    getCars().unshift({ header: true, vehicle: { deeplink: 'q' } })
    const sortedCars = cars
      .sort((a, b) => {
        if (!a.VehAvailCore || !a.VehAvailCore.TotalCharge) return 1
        if (!b.VehAvailCore || !b.VehAvailCore.TotalCharge) return 1
        if (sortState == "LowToHigh") return parseFloat(a.VehAvailCore.TotalCharge.RateTotalAmount) - parseFloat(b.VehAvailCore.TotalCharge.RateTotalAmount)
        if (sortState == "HighToLow") return parseFloat(b.VehAvailCore.TotalCharge.RateTotalAmount) - parseFloat(a.VehAvailCore.TotalCharge.RateTotalAmount)
        return 0
      });
    setDataToUse(_dataProvider.cloneWithRows(sortedCars))
    const transmissions = cars
      .filter(c => c.VehAvailCore && c.VehAvailCore.VehID)
      .map(c => c.VehAvailCore.Vehicle.TransmissionType);
    setCarTransmissionOptions(Array.from((new Set(transmissions)).values()))

    const categories = cars
      .filter(c => c.VehAvailCore && c.VehAvailCore.VehID)
      .map(c => GetCategoryByAcrissCode(c.VehAvailCore.Vehicle.VehType.VehicleCategory));
    setCarTypeOptions(Array.from((new Set(categories)).values()))

    return () => Orientation.removeDeviceOrientationListener(onOrientationDidChange);
  }, [])

  useEffect(() => {
    const sortedCars = cars
      .sort((a, b) => {
        if (!a.VehAvailCore || !a.VehAvailCore.TotalCharge) return 1
        if (!b.VehAvailCore || !b.VehAvailCore.TotalCharge) return 1
        if (sortState == "LowToHigh") return parseFloat(a.VehAvailCore.TotalCharge.RateTotalAmount) - parseFloat(b.VehAvailCore.TotalCharge.RateTotalAmount)
        if (sortState == "HighToLow") return parseFloat(b.VehAvailCore.TotalCharge.RateTotalAmount) - parseFloat(a.VehAvailCore.TotalCharge.RateTotalAmount)
        return 0
      });
    setDataToUse(_dataProvider.cloneWithRows(sortedCars))
  }, [sortState])

  useEffect(() => {
    if (applyFilter == false) return
    let carsToFilter = cars

    if (transmissionFilters.length != 0) {
      carsToFilter = carsToFilter
        .filter((a) => {
          if (!a.VehAvailCore || !a.VehAvailCore.TotalCharge) return true
          return transmissionFilters.includes(a.VehAvailCore.Vehicle.TransmissionType);
        })
    }

    if (typesFiter.length != 0) {
      carsToFilter = carsToFilter
        .filter((a) => {
          if (!a.VehAvailCore || !a.VehAvailCore.TotalCharge) return true
          return typesFiter.includes(GetCategoryByAcrissCode(a.VehAvailCore.Vehicle.VehType.VehicleCategory));
        })
    }

    setDataToUse(_dataProvider.cloneWithRows(carsToFilter))
    setApplyFilter(false)
  }, [applyFilter])


  return (
    <SafeAreaView>
      <TabBar
        selectedIndex={selectedIndex}
        onSelect={index => setSelectedIndex(index)}>
        <Tab style={{ paddingTop: '6%', paddingBottom: '1%' }} title={evaProps => <Text {...evaProps} style={{ fontFamily: AppFontBold, color: selectedIndex == 0 ? APP_BRAND_COLOR : '#aeb1c3' }}>List View</Text>} />
        <Tab title='Map View' />
      </TabBar>
      {selectedIndex == 0 && (
        <View style={{ width: '100%', display: 'flex', justifyContent: 'center', minHeight: 1, minWidth: 1 }}>
          {getCars().length == 0 && (
            <>
              <Text style={{ fontSize: 28, textAlign: 'center' }}>No cars found</Text>
              <Text style={{ fontSize: 22, textAlign: 'center', paddingHorizontal: '1%',marginTop: '15%' }}>Go back and change you search params or pick another branch</Text>
            </>
          )}
          {getCars().length != 0 && (
            <RecyclerListView
              canChangeSize={true}
              style={{ width: '100%', backgroundColor: '#f0f2f3' }}
              layoutProvider={currentLayoutProvider}
              dataProvider={dataToUse}
              rowRenderer={(type, o: VehVendorAvail, idx) => {

                // @ts-ignore
                if (o.header) {
                  return (
                    <>
                      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: `${APP_BRAND_COLOR}50`, marginBottom: '2%' }}>
                        <View style={{ padding: '3%' }}>
                          <View style={{ width: '100%' }}>
                            <Text style={{ fontSize: 18, textAlign: 'left', fontFamily: AppFontBold }}>{route.params.searchParams.pickUpLocation.locationname}</Text>
                            <Text style={{ fontSize: 15, textAlign: 'left' }}>{route.params.searchParams.pickUpDate.format('MMM DD, h:mm')}</Text>
                          </View>

                          <View style={{ width: '100%' }}>
                            <Text style={{ fontSize: 18, textAlign: 'left', fontFamily: AppFontBold }}>{route.params.searchParams.dropOffLocation.locationname}</Text>
                            <Text style={{ fontSize: 15, textAlign: 'left' }}>{route.params.searchParams.dropOffDate.format('MMM DD, h:mm')}</Text>
                          </View>
                        </View>
                        <TouchableWithoutFeedback onPress={() => {
                          if (navigation.canGoBack()) {
                            navigation.goBack()
                          }
                        }}>
                          <View style={{ backgroundColor: `${APP_BRAND_COLOR}50`, width: '15%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialIconsIcons style={{ color: 'white' }} name={"edit"} size={24} />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'row', width: '100%', paddingLeft: '3%', paddingRight: '3%' }}>
                        <TouchableOpacity style={{ width: '49%' }} onPress={() => setShowSortModal(true)} >
                          <View style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center', borderWidth: 1, borderColor: '#00000050' }}>
                            <MaterialCommunityIcons style={{ alignSelf: 'flex-start', marginTop: 'auto', marginBottom: 'auto', color: 'gray' }} name={"sort-variant"} size={18} />
                            <Text style={{ fontSize: 18, textAlign: 'center', width: '50%', fontFamily: AppFontBold }}>
                              {i18n.t(TRANSLATIONS_KEY.CAR_LIST_SORT_LABEL).toString()}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: '49%', marginLeft: '1%' }} onPress={() => setShowFilterModal(true)}>
                          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', borderWidth: 1, borderColor: '#00000050' }}>
                            <MaterialCommunityIcons style={{ alignSelf: 'flex-start', marginTop: 'auto', marginBottom: 'auto', color: 'gray' }} name={"filter"} size={18} />
                            <Text style={{ fontSize: 18, textAlign: 'center', width: '50%', fontFamily: AppFontBold }}>
                              {i18n.t(TRANSLATIONS_KEY.CAR_LIST_FILTER_LABEL).toString()}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </>
                  );
                }

                return (
                  <HannkCarItem
                    APP_BRAND_COLOR={APP_BRAND_COLOR}
                    CAR_LIST_ITEM_FUEL_POLICY={i18n.t(TRANSLATIONS_KEY.CAR_LIST_ITEM_FUEL_POLICY).toString()}
                    CAR_LIST_ITEM_FUEL_POLICY_LILE_TO_LIKE={i18n.t(TRANSLATIONS_KEY.CAR_LIST_ITEM_FUEL_POLICY_LILE_TO_LIKE).toString()}
                    CAR_LIST_ITEM_MILEAGE={i18n.t(TRANSLATIONS_KEY.CAR_LIST_ITEM_MILEAGE).toString()}
                    CAR_LIST_ITEM_UNLIMITED={i18n.t(TRANSLATIONS_KEY.CAR_LIST_ITEM_UNLIMITED).toString()}
                    carLogo={{ source: "https://image.shutterstock.com/image-vector/edit-vector-icon-260nw-546038194.jpg" }}
                    showBookButton={true}
                    centerCarName={true}
                    key={o.VehID}
                    vehicle={o}
                    isActive={selectedIdx == idx}
                    onClick={() => {
                      setVehicle(cars[idx])
                      navigation.navigate('CarExtras', { vehicle: cars[idx] })
                    }} />
                );
              }}

            />
          )}
        </View>
      )}
      {selectedIndex == 1 && (
        <View>
          <BranchMap
          icon={require('../../../../image/icon-car-available.png')}
          onLocationChange={(selectedLocation) => {
            setPickedBranch(selectedLocation)
            setSelectedIndex(0)
          }}
          mapRef={mapRef} onRegionsChange={(regions) => {
            if (regions.length != 0 && firstNavigateToMap == false) {
              setTimeout(() => {
                mapRef?.current?.animateToRegion({ latitude: parseFloat(regions[0].lat), longitude: parseFloat(regions[0].long), latitudeDelta: 0.0922, longitudeDelta: 0.0421 })
              }, 1000);
            }
          }} />
        </View>
      )}
      {getCars().length == 0 && (
        <Button
          onPress={() => navigation.goBack()}
          size="medium"
          style={{
            marginTop: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            backgroundColor: APP_BRAND_COLOR,
            borderColor: APP_BRAND_COLOR,
            width: '80%',
            marginBottom: '5%',
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
          {() => <Text style={{ fontFamily: AppFontBold, color: 'white', fontSize: 18 }}>Go back</Text>}
        </Button>
      )}
      <Modal
        onBackdropPress={() => setShowSortModal(false)}
        isVisible={showSortModal}
        style={{
          marginHorizontal: 0,
          margin: 0,
        }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
          <Layout style={{ height: '100%', padding: '3%' }}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ marginBottom: '6%' }} category="h5">Sort By</Text>
              <Text onPress={() => setShowSortModal(false)} style={{ fontFamily: AppFontBold }} category="h3">X</Text>
            </View>
            <TouchableOpacity onPress={() => {
              setShowSortModal(false)
              setSortState("LowToHigh")
            }}>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 18, color: '#33adcc', fontFamily: AppFontBold, marginBottom: '5%' }}>
                  {i18n.t(TRANSLATIONS_KEY.CAR_LIST_LOW_TO_HIGH_OPTION).toString()}
                </Text>
                {sortState == "LowToHigh" && <MaterialCommunityIcons style={{ alignSelf: 'flex-start', color: APP_BRAND_COLOR }} name={"check"} size={24} />}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setShowSortModal(false)
              setSortState("HighToLow")
            }}>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 18, color: '#33adcc', fontFamily: AppFontBold, marginBottom: '5%' }}>
                  {i18n.t(TRANSLATIONS_KEY.CAR_LIST_HIGH_TO_LOW_OPTION).toString()}
                </Text>
                {sortState == "HighToLow" && <MaterialCommunityIcons style={{ alignSelf: 'flex-start', color: APP_BRAND_COLOR }} name={"check"} size={24} />}
              </View>
            </TouchableOpacity>
          </Layout>
        </SafeAreaView>
      </Modal>

      <Modal
        onBackdropPress={() => setShowFilterModal(false)}
        isVisible={showFilterModal}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
          <Layout style={{ height: '100%', padding: '3%' }}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ marginBottom: '4%' }} category="h5">Filter By</Text>
              <Text onPress={() => setShowFilterModal(false)} style={{ fontFamily: AppFontBold }} category="h3">X</Text>
            </View>
            <ScrollView>
              <Text style={{ fontSize: 18, color: '#33adcc', fontFamily: AppFontBold, marginBottom: '3%' }}>
                {i18n.t(TRANSLATIONS_KEY.CAR_LIST_TRANSMISSION_SUBTITLE).toString()}
              </Text>
              {carTransmissionOptions.map(i => {
                return (
                  <Card
                    onPress={() => {
                      setShowSortModal(false)
                      setTransmissionFilter(p => {
                        if (p.includes(i)) {
                          return p.filter(o => o != i)
                        }

                        return [...p, i]
                      })
                    }}
                    style={{
                      marginBottom: '4%',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.5,
                      shadowRadius: 3,
                      elevation: 2,
                    }}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <Text style={{ textAlign: 'left', color: APP_BRAND_COLOR, fontFamily: AppFontRegular }} category="h6">
                        {i}
                      </Text>
                      {transmissionFilters.includes(i) && <MaterialCommunityIcons style={{ marginLeft: '2%', color: APP_BRAND_COLOR }} name={"check"} size={24} />}
                    </View>
                  </Card>
                );
              })}

              <Text style={{ fontSize: 18, color: '#33adcc', fontFamily: AppFontBold, marginBottom: '3%' }}>
                {i18n.t(TRANSLATIONS_KEY.CAR_LIST_CAR_TYPE_SUBTITLE).toString()}
              </Text>
              {carTypeOptions.map(i => {
                return (
                  <Card
                    onPress={() => {
                      setShowSortModal(false)
                      setTypesFilter(p => {
                        if (p.includes(i)) {
                          return p.filter(o => o != i)
                        }

                        return [...p, i]
                      })
                    }}
                    style={{
                      marginBottom: '4%',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.5,
                      shadowRadius: 3,
                      elevation: 2,
                    }}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <Text style={{ textAlign: 'left', color: APP_BRAND_COLOR, fontFamily: AppFontRegular }} category="h6">
                        {i}
                      </Text>
                      {typesFiter.includes(i) && <MaterialCommunityIcons style={{ marginLeft: '2%', color: APP_BRAND_COLOR }} name={"check"} size={24} />}
                    </View>
                  </Card>
                );
              })}
            </ScrollView>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                onPress={(e) => {
                  setShowFilterModal(false)
                }}
                size="small"
                style={{
                  width: '48%',
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
                {() => {
                  return (
                    <>
                      <MaterialCommunityIcons style={{ color: 'white' }} size={26} name="close" />
                      <Text style={{ fontFamily: AppFontBold, color: 'white', fontSize: 18 }}>
                        {i18n.t(TRANSLATIONS_KEY.CLOSE_WORD).toString()}
                      </Text>
                    </>
                  );
                }}
              </Button>
              <Button
                onPress={(e) => {
                  setApplyFilter(true)
                  setShowFilterModal(false)
                }}
                size="small"
                style={{
                  width: '48%',
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
                {() => {
                  return (
                    <>
                      <MaterialCommunityIcons style={{ color: 'white' }} size={26} name="check" />
                      <Text style={{ fontFamily: AppFontBold, color: 'white', fontSize: 18 }}>
                        {i18n.t(TRANSLATIONS_KEY.APPLY_WORD).toString()}
                      </Text>
                    </>
                  );
                }}
              </Button>
            </View>

          </Layout>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default CarsListScreen