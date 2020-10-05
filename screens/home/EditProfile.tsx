
import React, { useState, useEffect, useRef } from 'react'
import { Layout, Text, Input, Button, TabView, Tab, Toggle } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, Image, View, AsyncStorage } from 'react-native';
import useAxios from 'axios-hooks'
import { Formik } from 'formik';
import { GRCGDS_BACKEND } from 'react-native-dotenv'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { dispatchGlobalState, useGlobalState } from '../../state';
import { StackScreenProps } from '@react-navigation/stack';
import { NonLoginScreenProps, LoginScreenProps } from '../../types';
import LoadingSpinner from '../../partials/LoadingSpinner';
import ErrorLabel from '../../partials/ErrorLabel';
import PhoneInputComponent from '../../partials/PhoneInput';
import BackButton from '../../partials/BackButton';
import CountryPicker from 'react-native-country-picker-modal'
import userHasFullProfile from '../../utils/userHasFullProfile';
import userHasAllFiles from '../../utils/userHasAllFiles';
import { FileTypeEnum } from './DocumentUpload/DocumentState';
import userIsCompany from '../../utils/userIsCompany';
import TimeCheckbox from '../../partials/TimeCheckbox';
import { useFocusEffect } from '@react-navigation/native';
import { AppFontBold, AppFontRegular } from '../../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../utils/i18n';
import moment from 'moment';

export default ({ navigation }: StackScreenProps<NonLoginScreenProps & LoginScreenProps>) => {
    const { i18n } = useTranslation();

    const [{ data, loading, error }, doLogin] = useAxios({
        url: `${GRCGDS_BACKEND}`,
        method: 'POST'
    }, { manual: true })

    const [profile] = useGlobalState('profile')
    const hasFullProfile = userHasFullProfile(profile || {})
    const hasAllFiles = userHasAllFiles(profile || {})
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [asCompany, setAsCompany] = useState(false);
    const [selfie, setSelfie] = useState<null | {[k :string] : any} | boolean>(null);
    const [driverLicence, setDriverLicence] = useState<null | {[k :string] : any} | boolean>(null);
    const [passport, setPassport] = useState<null | {[k :string] : any} | boolean>(null);

    const formRef = useRef()

    useFocusEffect(
        React.useCallback(() => {
            console.log(profile.company)
            console.log(profile.vat)
            if (profile && profile.company != 'NONE' && profile.vat != 'NONE') setAsCompany(true)

            return () => formRef?.current?.resetForm();
        }, [])
    );

    console.log(profile)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView keyboardShouldPersistTaps={"handled"} >

                <Layout style={{ flex: 1, padding: '3%' }}>

                    <Layout style={{ paddingBottom: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                        {navigation.canGoBack() && (
                            <Layout style={{ paddingRight: '3%' }}>
                                <BackButton />
                            </Layout>
                        )}
                        <Text style={{ textAlign: 'left', fontSize: 24, fontFamily: AppFontBold }} category='s2'>
                            {i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_SCREEN_TITLE).toString()}
                        </Text>
                    </Layout>

                    <Formik
                        initialValues={{
                            emailaddress: '',
                            mobilenumber: '',
                            firstname: '',
                            lastname: '',
                            mobilecode: '+1',
                            add1: '',
                            add2: '',
                            city: '',
                            postcode: '',
                            countryCode: profile?.country ? profile.country : '',
                            twoauth: false,
                            ...profile,
                            company: profile && profile.company != 'NONE' ? profile.company : '',
                            vat: profile && profile.vat != 'NONE' ? profile.vat : ''
                        }}
                        enableReinitialize
                        validate={(values) => {
                            const errors: { mobilenumber?: string, mobilecode?: string, tele?: string, company?: string, vat?: string } = {};
                            if (!values.mobilenumber) {
                                errors.mobilenumber = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);
                            } else if (values.mobilenumber.length > 10) {
                                //TODO: fix translation
                                errors.mobilenumber = 'Phone number can be max 10 digits';
                            }
                            if (!values.mobilecode) errors.mobilecode = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);

                            if (userIsCompany(profile || {})) {
                                if (!values.company) errors.company = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);
                                if (!values.vat) errors.vat = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);
                            }

                            return errors

                        }}
                        onSubmit={values => {
                            doLogin({ data: { ...values, module_name: "EDIT_PROFILE" } })
                                .then((res) => {
                                    console.log(res.data)
                                    if (res.data.vphone != 1 || res.data.vemail != 1) {
                                        dispatchGlobalState({ type: 'logout' })
                                        return
                                    }

                                    dispatchGlobalState({ type: 'token', state: res.data.token })
                                    dispatchGlobalState({ type: 'profile', state: res.data })
                                })
                                .catch(err => console.log(err))
                        }}
                    >
                        {({ handleChange, setFieldValue, handleSubmit, values, errors, touched }) => {
                            return (
                                <>
                                    <TabView
                                        indicatorStyle={{ backgroundColor: '#41d5fb' }}
                                        selectedIndex={selectedIndex}
                                        onSelect={index => setSelectedIndex(index)}>
                                        <Tab style={{ paddingTop: '6%', paddingBottom: '1%' }} title={evaProps => <Text {...evaProps} style={{ fontFamily: AppFontBold, color: selectedIndex == 0 ? '#41d5fb' : '#aeb1c3' }}>{i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_PROFILE_TAB).toString()}</Text>} >
                                            <>
                                                <Input
                                                    disabled={profile?.socialmedia}
                                                    status={errors.emailaddress && touched.emailaddress ? 'danger' : undefined}
                                                    value={values.emailaddress}
                                                    onChangeText={handleChange('emailaddress')}
                                                    style={{ backgroundColor: profile?.socialmedia ? 'rgba(0,0,0,0.2)' : '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                                    size="large"
                                                    label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_EMAIL_TAG).toString()}</Text>}
                                                    placeholder={i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_EMAIL_PLACEHOLDER).toString()}
                                                    caption={errors.emailaddress && touched.emailaddress ? () => <ErrorLabel text={errors.emailaddress} /> : undefined}

                                                />

                                                <Layout style={{ marginBottom: '3%' }}>
                                                    <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>
                                                        {i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_PHONE_NUMBER_TAG).toString()}
                                                    </Text>
                                                    <PhoneInputComponent
                                                        styles={{ borderColor: errors.mobilenumber && touched.mobilenumber ? '#ffa5bc' : '#e5eaf2', }}
                                                        mobilecode={values.mobilecode}
                                                        mobileNumber={values.mobilenumber}
                                                        onCountryChanged={(countryCode) => {
                                                        }}
                                                        onCodeChange={(code) => {
                                                            setFieldValue('mobilecode', code)
                                                        }}
                                                        onNumberChange={(number) => {
                                                            handleChange('mobilenumber')(number)
                                                        }}
                                                    />
                                                    {errors.mobilenumber && touched.mobilenumber && <ErrorLabel text={errors.mobilenumber} />}
                                                </Layout>

                                                <Toggle disabled={profile == null || profile.vphone != 1} checked={values.twoauth == true || values.twoauth == 1} style={{ marginBottom: '0%' }} onChange={() => setFieldValue("twoauth", !values.twoauth)}>
                                                    {i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_ENABLE_2_FACTOR).toString()}
                                                </Toggle>

                                                <Layout style={{ marginBottom: '3%' }}>
                                                    <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>
                                                        {i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_COUNTRY_TAG).toString()}
                                                    </Text>
                                                    <CountryPicker
                                                        containerButtonStyle={{ borderWidth: 1, borderColor: '#E4E9F2', padding: '2%', borderRadius: 10 }}
                                                        countryCode={values.countryCode.toUpperCase()}
                                                        withFilter={true}
                                                        withFlagButton={true}
                                                        withCountryNameButton={true}
                                                        onSelect={(country) => {
                                                            setFieldValue('countryCode', country.cca2.toLowerCase())
                                                        }}
                                                    />
                                                </Layout>

                                                <Input
                                                    status={errors.firstname && touched.firstname ? 'danger' : undefined}
                                                    value={values.firstname}
                                                    onChangeText={handleChange('firstname')}
                                                    style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                                    size="large"
                                                    label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_FIRST_NAME_TAG).toString()}</Text>}
                                                    placeholder={i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_FIRST_NAME_PLACEHOLDER).toString()}
                                                    caption={errors.firstname && touched.firstname ? () => <ErrorLabel text={errors.firstname} /> : undefined}
                                                />

                                                <Input
                                                    status={errors.lastname && touched.lastname ? 'danger' : undefined}
                                                    value={values.lastname}
                                                    onChangeText={handleChange('lastname')}
                                                    style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                                    size="large"
                                                    label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_LAST_NAME_PLACEHOLDER).toString()}</Text>}
                                                    placeholder={i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_LAST_NAME_PLACEHOLDER).toString()}
                                                    caption={errors.lastname && touched.lastname ? () => <ErrorLabel text={errors.lastname} /> : undefined}
                                                />

                                                <Input
                                                    status={errors.add1 && touched.add1 ? 'danger' : undefined}
                                                    value={values.add1}
                                                    onChangeText={handleChange('add1')}
                                                    style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                                    size="large"
                                                    label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_ADDRESS_1_PLACEHOLDER).toString()}</Text>}
                                                    placeholder={i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_ADDRESS_1_PLACEHOLDER).toString()}
                                                    caption={errors.add1 && touched.add1 ? () => <ErrorLabel text={errors.add1} /> : undefined}
                                                />

                                                <Input
                                                    status={errors.add2 && touched.add2 ? 'danger' : undefined}
                                                    value={values.add2}
                                                    onChangeText={handleChange('add2')}
                                                    style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                                    size="large"
                                                    label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_ADDRESS_2_PLACEHOLDER).toString()}</Text>}
                                                    placeholder={i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_ADDRESS_2_PLACEHOLDER).toString()}
                                                    caption={errors.add2 && touched.add2 ? () => <ErrorLabel text={errors.add2} /> : undefined}
                                                />

                                                <Input
                                                    status={errors.city && touched.city ? 'danger' : undefined}
                                                    value={values.city}
                                                    onChangeText={handleChange('city')}
                                                    style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                                    size="large"
                                                    label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_CITY_TAG).toString()}</Text>}
                                                    placeholder={i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_CITY_PLACEHOLDER).toString()}
                                                    caption={errors.city && touched.city ? () => <ErrorLabel text={errors.city} /> : undefined}
                                                />

                                                <Input
                                                    status={errors.postcode && touched.postcode ? 'danger' : undefined}
                                                    value={values.postcode}
                                                    onChangeText={handleChange('postcode')}
                                                    style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                                    size="large"
                                                    label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_POSTCODE_TAG).toString()}</Text>}
                                                    placeholder={i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_POSTCODE_PLACEHOLDER).toString()}
                                                    caption={errors.postcode && touched.postcode ? () => <ErrorLabel text={errors.postcode} /> : undefined}
                                                />

                                                <Toggle checked={asCompany} style={{ marginBottom: '5%' }} onChange={() => setAsCompany(p => !p)}>
                                                    {i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_COMPANY_TAG).toString()}
                                                </Toggle>

                                                {asCompany && (
                                                    <>
                                                        <Input
                                                            status={errors.company && touched.company ? 'danger' : undefined}
                                                            value={values.company}
                                                            onChangeText={handleChange('company')}
                                                            style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                                            size="large"
                                                            label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_COMPANY_NAME_TAG).toString()}</Text>}
                                                            placeholder={i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_COMPANY_NAME_PLACEHOLDER).toString()}
                                                            caption={errors.company && touched.company ? () => <ErrorLabel text={errors.company} /> : undefined}
                                                        /><Input
                                                            status={errors.vat && touched.vat ? 'danger' : undefined}
                                                            value={values.vat}
                                                            onChangeText={handleChange('vat')}
                                                            style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                                            size="large"
                                                            label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_COMPANY_VAT_TAG).toString()}</Text>}
                                                            placeholder={i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_COMPANY_VAT_PLACEHOLDER).toString()}
                                                            caption={errors.vat && touched.vat ? () => <ErrorLabel text={errors.vat} /> : undefined}
                                                        />
                                                    </>
                                                )}

                                                <Button
                                                    accessoryRight={loading ? LoadingSpinner : undefined}
                                                    disabled={loading}
                                                    onPress={(e) => {
                                                        if (hasFullProfile && !hasAllFiles) {
                                                            navigation.navigate("SingleUpload", {
                                                                fileType: FileTypeEnum.passport
                                                            });
                                                        } else {
                                                            handleSubmit()
                                                        }
                                                    }}
                                                    size="giant"
                                                    style={{
                                                        backgroundColor: loading == false ? '#41d5fb' : '#e4e9f2',
                                                        borderColor: loading == false ? '#41d5fb' : '#e4e9f2',
                                                        borderRadius: 10,
                                                        shadowColor: '#41d5fb',
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 10,
                                                        },
                                                        shadowOpacity: 0.51,
                                                        shadowRadius: 13.16,
                                                        elevation: 10,
                                                    }}>
                                                    {() => {
                                                        return <Text style={{ fontFamily: AppFontBold, color: loading ? "#ACB1C0" : 'white', fontSize: 18 }}>
                                                            {hasFullProfile && !hasAllFiles ? "Next" : 'Save'}
                                                        </Text>
                                                    }}
                                                </Button>
                                            </>
                                        </Tab>
                                        <Tab style={{ paddingTop: '6%', paddingBottom: '1%' }} title={evaProps => <Text {...evaProps} style={{ fontFamily: AppFontBold, color: selectedIndex == 1 ? '#41d5fb' : '#aeb1c3' }}>{i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_DOCUMENT_TAB).toString()}</Text>} >
                                            <>
                                                {profile?.passimage != "" ? (
                                                    <TimeCheckbox
                                                        replaceCheckbox={() => {
                                                            return <MaterialCommunityIcon size={24} name="file-document-edit" />
                                                        }}
                                                        onClick={() => {
                                                            if (profile?.vpass == 0) {
                                                                navigation.navigate("SingleUpload", {
                                                                    fileType: FileTypeEnum.passport,
                                                                    fileToShow: `${profile.passimage}`,
                                                                    day: profile?.passday,
                                                                    month: profile?.passmonth,
                                                                    year: profile?.passyear,
                                                                    docNumber: profile?.passport,
                                                                    docCountry: profile?.passcountry,
                                                                })
                                                            }
                                                        }}
                                                        nonEditable={true}
                                                        accessoryRight={(style) => {
                                                            return (
                                                                <Image
                                                                    style={{ width: 50, height: 50, borderRadius: 25, marginRight: '5%' }}
                                                                    source={{ uri: `https://www.right-cars.com/uploads/pass/${profile?.passimage}` }}
                                                                />
                                                            );
                                                        }}
                                                        subTitle={profile?.passimage ? () => {
                                                            return (
                                                                <FileMetadata
                                                                    docNum={profile?.passport}
                                                                    docCountry={profile?.passcountry}
                                                                    day={profile?.passday}
                                                                    month={profile?.passmonth}
                                                                    year={profile?.passyear}
                                                                />
                                                            );
                                                        } : undefined}
                                                        defaultChecked={profile?.vself == 1}
                                                        style={{ marginBottom: '5%' }}
                                                        title={i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_PASSPORT_TAG).toString()}
                                                        onChange={() => {

                                                        }}
                                                    />
                                                ) : null}

                                                {profile?.selfiurl != "" ? (
                                                    <TimeCheckbox
                                                        replaceCheckbox={() => {
                                                            return <MaterialCommunityIcon size={24} name="file-document-edit" />
                                                        }}
                                                        onClick={() => {
                                                            navigation.navigate("SingleUpload", {
                                                                fileType: FileTypeEnum.selfi,
                                                                fileToShow: `https://www.right-cars.com/uploads/selfi/${profile?.selfiurl}`,
                                                            })
                                                        }}
                                                        nonEditable={true}
                                                        accessoryRight={(style) => {
                                                            return (
                                                                <Image
                                                                    style={{ width: 50, height: 50, borderRadius: 25, marginRight: '5%' }}
                                                                    source={{ uri: `https://www.right-cars.com/uploads/selfi/${profile?.selfiurl}` }}
                                                                />
                                                            );
                                                        }}
                                                        subTitle={profile?.passimage ? () => {
                                                            return (
                                                                <FileMetadata />
                                                            );
                                                        } : undefined}
                                                        defaultChecked={profile?.vpass == 1}
                                                        style={{ marginBottom: '5%' }}
                                                        title={i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_SELFI_TAG).toString()}
                                                        onChange={() => {

                                                        }}
                                                    />
                                                ) : null}

                                                {profile?.drimage != "" ? (
                                                    <TimeCheckbox
                                                        replaceCheckbox={() => {
                                                            return <MaterialCommunityIcon size={24} name="file-document-edit" />
                                                        }}
                                                        onClick={() => {
                                                            if (profile?.vdr == 0) {
                                                                navigation.navigate("SingleUpload", {
                                                                    fileType: FileTypeEnum.driving_license,
                                                                    fileToShow: `${profile.drimage}`,
                                                                    day: profile?.drday,
                                                                    month: profile?.drmonth,
                                                                    year: profile?.dryear,
                                                                    docNumber: profile?.drlic,
                                                                    docCountry: profile?.drcountry,
                                                                })
                                                            }
                                                        }}
                                                        nonEditable={true}
                                                        accessoryRight={(style) => {
                                                            return (
                                                                <Image
                                                                    style={{ width: 50, height: 50, borderRadius: 25, marginRight: '5%' }}
                                                                    source={{ uri: `https://www.right-cars.com/uploads/drlic/${profile?.drimage}` }}
                                                                />
                                                            );
                                                        }}
                                                        subTitle={profile?.passimage ? () => {
                                                            return (
                                                                <FileMetadata
                                                                    docNum={profile?.drlic}
                                                                    docCountry={profile?.drcountry}
                                                                    day={profile?.drday}
                                                                    month={profile?.drmonth}
                                                                    year={profile?.dryear}
                                                                />
                                                            );
                                                        } : undefined}
                                                        defaultChecked={profile?.vdr == 1}
                                                        style={{ marginBottom: '5%' }}
                                                        title={i18n.t(TRANSLATIONS_KEY.EDIT_PROFILE_DRIVER_LICENSE_TAG).toString()}
                                                        onChange={() => {

                                                        }}
                                                    />
                                                ) : null}

                                                {profile?.passimage == "" && profile?.selfiurl == "" && profile?.drimage == "" && <Text style={{ textAlign: 'center', fontSize: 18, marginTop: '10%' }}>No files uploaded</Text>}

                                            </>
                                        </Tab>
                                    </TabView>

                                </>
                            )
                        }}
                    </Formik>
                </Layout>
            </ScrollView>

        </SafeAreaView>
    )
};

type Props = { docNum?: string, docCountry?: string, day?: string, month?: string, year?: string }
const FileMetadata: React.FC<Props> = ({ docNum, docCountry, day, month, year }) => {
    return (
        <>
            <Layout style={{ marginBottom: '3%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <View >
                    {day && <Text style={{ textAlign: 'left', fontFamily: AppFontBold }} category="s1">
                        Expiry
                    </Text>}
                    {docNum && <Text style={{ textAlign: 'left', fontFamily: AppFontBold }} category="s1">
                        Document Number
                    </Text>}
                    {docCountry && <Text style={{ textAlign: 'left', fontFamily: AppFontBold }} category="s1">
                        Issuing Country
                    </Text>}
                </View>

                <View style={{ marginLeft: '5%', display: 'flex', justifyContent: 'center' }}>
                    {day && <Text style={{ fontFamily: AppFontRegular, fontSize: 16 }}>
                        {moment(`${day}-${month}-${year}`, "DD-MM-YYYY").format('D MMM YYYY')}
                    </Text>}
                    {docNum && <Text style={{ fontFamily: AppFontRegular, fontSize: 16 }}>
                        {docNum}
                    </Text>}
                    {docCountry && <Text style={{ fontFamily: AppFontRegular, fontSize: 16 }}>
                        {docCountry}
                    </Text>}
                </View>
            </Layout>
        </>
    );
}