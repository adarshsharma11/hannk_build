import React, { useState, useEffect } from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { Layout, Text, Toggle } from '@ui-kitten/components';
import { AsyncStorage, TouchableOpacity, TextInput } from 'react-native';
//@ts-ignore
import Autocomplete from 'react-native-autocomplete-input';
import FuzzySearch from 'fuzzy-search';
import { GrcgdsLocation } from '../types';
import { AppFontBold, AppFontRegular } from '../constants/fonts'
import { TRANSLATIONS_KEY } from '../utils/i18n';
import { useTranslation } from 'react-i18next';

export type LocationSearchInputProps = {
  pickupLocation?: { [k: string]: any } | null
  returnLocation?: { [k: string]: any } | null
  hideReturnToggle?: boolean
  isInmediatePickup?: boolean

  onOriginLocationSelected: (location: any) => void
  onReturnLocationSelected: (location: any) => void
}
const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ hideReturnToggle = false, isInmediatePickup = false,...props}) => {
  const [searchingFor, setSearchingFor] = useState<"ORIGIN" | "RETURN">("ORIGIN");
  const { i18n } = useTranslation();
  const [locations, setLocations] = useState<GrcgdsLocation[]>([]);
  const [pickupResults, setPickupResults] = useState<GrcgdsLocation[] | null>(null);
  const [returnResults, setReturnResults] = useState<GrcgdsLocation[] | null>(null);
  const [returnSameLocation, setReturnSameLocation] = useState<boolean>(true);

  const [originLocation, setOrigin] = useState<GrcgdsLocation | null>(null);
  const [returnLocation, setReturn] = useState<GrcgdsLocation | null>(null);

  const [originInputText, setOriginInputText] = useState<string>('');
  const [returnInputText, setReturnInputText] = useState<string>('');

  useEffect(() => {
    AsyncStorage.getItem('locationsData')
      .then(stringData => {
        if (!stringData) return
        try {
          const jsonData = JSON.parse(stringData)
          setLocations(jsonData);
        } catch (error) {
          console.log('We could not parse the string location data: ' + error.toString());
        }
      })
      if (props.pickupLocation) setOrigin(props.pickupLocation)
      if (props.returnLocation) setReturn(props.returnLocation)
  }, [])

  useEffect(() => {
    if (isInmediatePickup != undefined) {
      setReturnSameLocation(isInmediatePickup)
    }
  }, [isInmediatePickup])

  useEffect(() => {
    setOriginInputText(props.pickupLocation?.locationname)
    setReturnInputText(props.returnLocation?.locationname)
  }, [props.pickupLocation,props.returnLocation])

  return (
    <>
      <Layout style={{ display: 'flex', flexDirection: 'row', zIndex: 6 }}>
        {returnSameLocation && (
          <Layout style={{ marginLeft: '2%',display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <FontAwesomeIcon size={15} style={{ color: '#41d5fb' }} name="circle" />
          </Layout>
        )}

        {!returnSameLocation && (
          <Layout style={{ marginLeft: '2%',display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <FontAwesomeIcon size={15} style={{ color: '#41d5fb' }} name="circle" />
            <Layout style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <MaterialCommunityIcon style={{ marginBottom: '5%' }} size={4} name="rectangle" />
              <MaterialCommunityIcon style={{ marginBottom: '5%' }} size={4} name="rectangle" />
              <MaterialCommunityIcon style={{ marginBottom: '5%' }} size={4} name="rectangle" />
              <MaterialCommunityIcon style={{ marginBottom: '5%' }} size={4} name="rectangle" />
              <MaterialCommunityIcon size={4} name="rectangle" />
            </Layout>
            <FontAwesomeIcon size={15} name="square" />
          </Layout>
        )}
        <Layout style={{ display: 'flex', flexDirection: 'column', width: '85%', marginLeft: '1%' }}>
          <Autocomplete
            style={{ color: '#000000', fontFamily: AppFontBold, padding: '3%',fontSize: 16, width: '100%', borderColor: 'white', borderBottomColor: '#E4E9F2', borderBottomWidth: 1 }}
            containerStyle={{ width: '100%' }}
            inputContainerStyle={{ width: '100%', borderColor: 'white', borderBottomColor: 'black', borderBottomWidth: 1 }}
            listStyle={{ borderColor: 'white' }}
            listContainerStyle={{ maxHeight: "100%" }}
            placeholder={i18n.t(TRANSLATIONS_KEY.NEW_BOOKING_ENTER_ORIGIN_PLACEHOLDER).toString()}
            data={!pickupResults ? [] : pickupResults}
            value={originInputText}
            onChangeText={text => {
              setOriginInputText(text)
              const searcher = new FuzzySearch(locations, ['internalcode', 'locationname', "locationvariation"]);
              const result = searcher.search(text)
              setPickupResults(result)
              setSearchingFor("ORIGIN")
            }}
            renderItem={({ item, i }) => (
              <TouchableOpacity onPress={() => {
                props.onOriginLocationSelected(item)
                setOriginInputText(item.locationname)
                setOrigin(item)
                setPickupResults(null)
              }}>
                <Layout style={{ display: 'flex', flexDirection: 'row', backgroundColor: "white",borderBottomColor: '#E4E9F2', borderBottomWidth: 1, paddingBottom: '3%', paddingTop: '3%' }}>
                  <EvilIcon style={{ color: '#41D5FB' }} name="location" size={32} />
                  <Text style={{ fontSize: 18 }}>{item.locationname}</Text>
                </Layout>
              </TouchableOpacity>
            )}
          />
          {!returnSameLocation && (
            <Autocomplete
              style={{ color: '#000000', fontFamily: AppFontBold, padding: '3%',fontSize: 16, width: '100%', borderColor: 'white', borderBottomColor: '#E4E9F2', borderBottomWidth: 1 }}
              containerStyle={{ width: '100%' }}
              inputContainerStyle={{ width: '100%', borderColor: 'white', borderBottomColor: 'black', borderBottomWidth: 1 }}
              listStyle={{ borderColor: 'white' }}
              listContainerStyle={{ maxHeight: "100%" }}
              placeholder={i18n.t(TRANSLATIONS_KEY.NEW_BOOKING_RETURN_DESTINATION_PLACEHOLDER).toString()}
              data={!returnResults ? [] : returnResults}
              value={returnInputText}
              onChangeText={text => {
                setReturnInputText(text)
                const searcher = new FuzzySearch(locations, ['internalcode', 'locationname', "locationvariation"]);
                const result = searcher.search(text)
                setReturnResults(result)
                setSearchingFor("ORIGIN")
              }}
              renderItem={({ item, i }) => (
                <TouchableOpacity onPress={() => {
                  setReturnInputText(item.locationname)
                  props.onReturnLocationSelected(item)
                  setReturn(item)
                  setReturnResults(null)
                }}>
                  <Layout style={{ display: 'flex', flexDirection: 'row', borderBottomColor: '#E4E9F2', borderBottomWidth: 1, paddingBottom: '3%', paddingTop: '3%' }}>
                    <EvilIcon style={{ color: '#41D5FB' }} name="location" size={32} />
                    <Text style={{ fontSize: 18 }}>{item.locationname}</Text>
                  </Layout>
                </TouchableOpacity>
              )}
            />
          )}
        </Layout>
      </Layout>
      {hideReturnToggle !== false && (
        <Toggle checked={returnSameLocation} style={{ alignSelf: 'center', marginTop: '3%', marginBottom: '3%' }} onChange={() => setReturnSameLocation(p => {
          const n = !p
          if (n) {
            setReturnInputText("")
            props.onReturnLocationSelected(null)
          }
          return n
        })}>
          {i18n.t(TRANSLATIONS_KEY.NEW_BOOKING_RETURN_ON_SAME_LOCATION_TAG).toString()}
      </Toggle>
      )}
    </>
  );
}

export default LocationSearchInput