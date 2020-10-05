
import React, { useState, useEffect } from 'react'
import { Layout, Text, Input, Button, Datepicker, NativeDateService, Avatar, Toggle } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, View, Image, TouchableWithoutFeedback, TouchableOpacity, Platform, Alert } from 'react-native';
import useAxios from 'axios-hooks'
import { Formik } from 'formik';
import { GRCGDS_BACKEND } from 'react-native-dotenv'
import { dispatchGlobalState, useGlobalState } from '../../state';
import { StackScreenProps } from '@react-navigation/stack';
import { NonLoginScreenProps, LoginScreenProps } from '../../types';
import LoadingSpinner from '../../partials/LoadingSpinner';
import ErrorLabel from '../../partials/ErrorLabel';
import PhoneInputComponent from '../../partials/PhoneInput';
import CountryPicker from 'react-native-country-picker-modal'
import userHasFullProfile from '../../utils/userHasFullProfile';
import userHasAllFiles from '../../utils/userHasAllFiles';
import { FileTypeEnum, useDocumentState, dispatchFileState, Actions } from './DocumentUpload/DocumentState';
import userIsCompany from '../../utils/userIsCompany';
import StepIndicator from 'react-native-step-indicator';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import moment from 'moment';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { axiosInstance } from '../../utils/AxiosBootstrap';
import * as Progress from 'react-native-progress';
import { CommonActions, useRoute, useFocusEffect } from '@react-navigation/native';
import { AppFontBold, AppFontRegular } from '../../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../utils/i18n';
import AsyncStorage from '@react-native-community/async-storage';
import isAppleLogin from '../../utils/isAppleLogin';
import useEffectSkipInitialRender from '../../utils/UseEffectSkipInitialRender';

const DATE_FORMAT = 'MMM DD,YYYY'
const formatDateService = new NativeDateService('en', { format: DATE_FORMAT });

export default ({ navigation }: StackScreenProps<NonLoginScreenProps & LoginScreenProps>) => {
    const { i18n } = useTranslation();
    const route = useRoute();

    const labels = [
        i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_PROFILE_STEP),
        i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_PASSPORT_STEP),
        i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_DRIVING_LICENSE_STEP),
        i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_PROFILE_PICTURE_STEP),
        i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_COMPLETE_STEP),
    ];

    const options = {
        title: i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_SELECT_PICTURE),
        chooseFromLibraryButtonTitle: '',
        storageOptions: {
            skipBackup: true,
            path: 'images',
            cameraRoll: true,
            waitUntilSaved: true
        },
    };

    const [{ data, loading, error }, doLogin] = useAxios({
        url: `${GRCGDS_BACKEND}`,
        method: 'POST'
    }, { manual: true })

    const [sendFileReq, sendFile] = useAxios({
        url: `${GRCGDS_BACKEND}`,
        method: 'POST',
        onUploadProgress: (e) => {
            var percentCompleted = Math.round((e.loaded * 100) / e.total)
            setUploadPercent(percentCompleted);
        }
    }, { manual: true })

    const [uploadPercent, setUploadPercent] = useState(0);
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [currentFileType, setCurrentFileType] = useState(FileTypeEnum.passport);
    const [dictionary] = useDocumentState("dictionary");
    const [profile] = useGlobalState('profile')
    const hasFullProfile = userHasFullProfile(profile || {})
    const hasAllFiles = userHasAllFiles(profile || {})
    const [asCompany, setAsCompany] = useState(false);
    const [showCounterModal, setShowCounterModal] = useState(false)

    useFocusEffect(
        React.useCallback(() => {
            console.log("params useFocusEffect",route?.params)
            if (route?.params?.forceStep) { 
                setCurrentPosition(route?.params?.forceStep)
            }
        }, [route])
    );

    useEffectSkipInitialRender(() => {
        async function resolveCurrentStep() {
            console.log('resolving resolveCurrentStep')
            if (hasAllFiles) {
                setCurrentPosition(4)
            }
            if (profile?.selfiurl == "") {
                setCurrentPosition(3)
                setCurrentFileType(FileTypeEnum.selfi)
            }
    
            if (profile?.drimage == "") {
                setCurrentPosition(2)
                setCurrentFileType(FileTypeEnum.driving_license)
            }
            if (profile?.passimage == "") {
                setCurrentPosition(1)
                setCurrentFileType(FileTypeEnum.passport)
            }
    
            const isApple = await isAppleLogin()
            if (!hasFullProfile && isApple == false) {
                setCurrentPosition(0)
            }
        }

        resolveCurrentStep()

    }, [currentPosition])


    const resolveFormState = () => {
        console.log('resolving resolveFormState')
        if (currentPosition == 4) {
            return { btnTxt: i18n.t(TRANSLATIONS_KEY.OK_WORD), disable: false, cb: () => navigation.navigate("Home", { screen: "MyBookings" }) }
        }
        if (currentPosition == 0 && hasFullProfile) {
            return { btnTxt: i18n.t(TRANSLATIONS_KEY.NEXT_WORD), disable: false }
        }

        if (currentPosition == 0 && route?.params?.appleSignIn) {
            return { btnTxt: i18n.t(TRANSLATIONS_KEY.SAVE_NEXT_WORD), disable: false }
        }

        if (currentPosition == 0 && !hasFullProfile) {
            return { btnTxt: i18n.t(TRANSLATIONS_KEY.SAVE_NEXT_WORD), disable: false }
        }

        if (currentPosition == 1 && dictionary.get(FileTypeEnum.passport)?.file) {
            return { btnTxt: i18n.t(TRANSLATIONS_KEY.SAVE_NEXT_WORD), disable: false }
        }

        if (currentPosition == 2 && dictionary.get(FileTypeEnum.driving_license)?.file) {
            return { btnTxt: i18n.t(TRANSLATIONS_KEY.SAVE_NEXT_WORD), disable: false }
        }

        if (currentPosition == 3 && dictionary.get(FileTypeEnum.selfi)?.file) {
            return { btnTxt: i18n.t(TRANSLATIONS_KEY.SAVE_NEXT_WORD), disable: false }
        }


        return { btnTxt: i18n.t(TRANSLATIONS_KEY.SAVE_NEXT_WORD), disable: true };
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', display: 'flex', padding: '3%' }}>
            <Formik
                initialValues={{
                    fileCountry: '',
                    docNumber: '',
                    expDate: null,

                    twoauth: false,
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
                    ...profile,
                    company: '',
                    vat: '',
                }}
                validate={async (values) => {
                    const errors: { [k: string]: string } = {};
                    const isApple = await isAppleLogin()
                    if (currentPosition == 0 && isApple == false) {
                        if (!values.mobilenumber) {
                            errors.mobilenumber = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD)
                        } else if (new RegExp(/^\d+$/).test(values.mobilenumber) == false) {
                            errors.mobilenumber = i18n.t(TRANSLATIONS_KEY.ONLY_NUMBERS_ERRORS)
                        }
                        if (!values.emailaddress) errors.emailaddress = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);
                        if (!values.firstname) errors.firstname = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);
                        if (!values.countryCode) errors.countryCode = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);
                        if (!values.lastname) errors.lastname = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);
                        if (!values.add1) errors.add1 = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);
                        if (!values.city) errors.city = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);
                        if (!values.postcode) errors.postcode = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);

                        if (userIsCompany(profile || {}) || asCompany) {
                            if (!values.company) errors.company = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);
                            if (!values.vat) errors.vat = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);
                        }
                    }

                    if (currentPosition == 1 && profile?.passimage == "" || currentPosition == 2 && profile?.drimage == "") {
                        if (!values.expDate) errors.expDate = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);
                        if (!values.docNumber) errors.docNumber = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);
                        if (!values.fileCountry) errors.fileCountry = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);
                    }

                    return errors

                }}
                onSubmit={(values, { resetForm }) => {
                    if (currentPosition == 0 && !hasFullProfile) {
                        if (!values.mobilecode) values.mobilecode = '+1';
                        if (!values.mobilenumber) values.mobilecode = '';

                        doLogin({ data: { ...values, module_name: "EDIT_PROFILE" } })
                            .then((res) => {
                                dispatchGlobalState({ type: 'token', state: res.data.token })
                                dispatchGlobalState({ type: 'profile', state: res.data })
                                resetForm({ touched: {}, errors: {} })
                                if (res.data.socialmedia != 0 && res.data.vphone == 0) {
                                    navigation.dispatch(
                                        CommonActions.reset({
                                            index: 0,
                                            routes: [
                                                {
                                                    name: 'Opt',
                                                    params: {
                                                        onSuccess: () => {
                                                            navigation.navigate('Home', { screen: "ProfileVerification", params: { forceStep: 1 } })
                                                        },
                                                        onLater: () => {
                                                            dispatchGlobalState({ type: 'logout' })
                                                            navigation.dispatch(
                                                                CommonActions.reset({
                                                                    index: 0,
                                                                    routes: [{ name: 'Login' }],
                                                                })
                                                            )
                                                        },
                                                        onUnbackpress: () => {
                                                            dispatchGlobalState({ type: 'logout' })
                                                            navigation.dispatch(
                                                                CommonActions.reset({
                                                                    index: 0,
                                                                    routes: [{ name: 'Login' }],
                                                                })
                                                            )
                                                        }
                                                    }
                                                },
                                            ],
                                        })
                                    );
                                }
                                setCurrentPosition(1)
                            })
                            .catch(err => console.log(err))
                        return
                    }

                    if ((currentPosition == 1 || currentPosition == 2 || currentPosition == 3) && dictionary.get(currentFileType)?.file) {
                        if (currentPosition == 1 && profile?.passimage != "") {
                            setCurrentPosition(2)
                            return
                        }
                        if (currentPosition == 2 && profile?.drimage != "") {
                            setCurrentPosition(3)
                            return
                        }
                        if (currentPosition == 3 && profile?.selfiurl != "") {
                            setCurrentPosition(4)
                            return
                        }
                        const data = new FormData();
                        const file = dictionary.get(currentFileType)?.file;
                        const currentFile = dictionary.get(currentFileType)?.file
                        if (currentFile) {
                            if ("fileName" in currentFile) {
                                (file as DocumentPickerResponse).name = (currentFile as ImagePickerResponse).fileName || currentFileType;
                            }
                        }

                        data.append("module_name", "FILE_UPLOAD");
                        data.append("file", {
                            ...file,
                            uri: (Platform.OS === 'android') ? file.uri : file.uri.replace('file://', '')
                        });
                        data.append("fileType", currentFileType);
                        if (values.expDate) {
                            data.append("expDate", values.expDate.format('YYYY-MM-DD'));
                        }
                        data.append("filecountry", values.fileCountry.cca2?.toLowerCase());
                        data.append("docNumber", values.docNumber);


                        sendFile({ data })
                        .then(r => {
                            console.log(r.data)
                            dispatchGlobalState({ type: 'profile', state: r.data })
                            dispatchFileState({ type: Actions.RESET, state: {} })
                            setCurrentPosition(p => {
                                resetForm({ touched: {}, errors: {} })
                                console.log(`to step ${p + 1}`)
                                return p + 1
                            })
                            setUploadPercent(0)
                        })
                        .catch(r => console.log(r))

                        return
                    }
                }}
            >
                {({ setFieldTouched, handleChange, setFieldValue, handleSubmit, values, errors, touched }) => {
                    return (
                        <>
                            <StepIndicator
                                currentPosition={currentPosition}
                                labels={labels}
                                customStyles={{
                                    stepStrokeCurrentColor: '#41d5fb',
                                    stepStrokeFinishedColor: '#41d5fb',
                                    stepStrokeUnFinishedColor: '#41d5fb',
                                    stepIndicatorUnFinishedColor: '#41d5fb',
                                    separatorFinishedColor: '#7eaec4',
                                    separatorUnFinishedColor: '#dedede',
                                    stepIndicatorFinishedColor: '#41d5fb',
                                    labelColor: '#999999',
                                    currentStepLabelColor: '#7eaec4',
                                }}
                            />
                            {currentPosition == 0 && (
                                <ScrollView keyboardShouldPersistTaps={"handled"} contentContainerStyle={{ flexGrow: 1, padding: '3%' }}>
                                    <Input
                                        disabled={profile?.socialmedia}
                                        status={errors.emailaddress && touched.emailaddress ? 'danger' : undefined}
                                        value={values.emailaddress}
                                        onChangeText={handleChange('emailaddress')}
                                        style={{ backgroundColor: profile?.socialmedia ? 'rgba(0,0,0,0.2)' : '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_EMAIL_TAG).toString()}</Text>}
                                        placeholder={i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_EMAIL_PLACEHOLDER)}
                                        caption={errors.emailaddress && touched.emailaddress ? () => <ErrorLabel text={errors.emailaddress} /> : undefined}

                                    />

                                    <Layout style={{ marginBottom: '3%' }}>
                                        <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>
                                            {i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_PHONE_NUMBER_TAG).toString()}
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

                                    {profile && profile.socialmedia != 1 && (
                                        <Toggle checked={values.twoauth} style={{ marginBottom: '0%' }} onChange={() => setFieldValue("twoauth", !values.twoauth)}>
                                            {i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_ENABLE_2_FACTOR).toString()}
                                        </Toggle>
                                    )}

                                    <Layout style={{ marginBottom: '3%' }}>
                                        <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>
                                            {i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_COUNTRY_TAG).toString()}
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
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_FIRST_NAME_TAG).toString()}</Text>}
                                        placeholder={i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_FIRST_NAME_PLACEHOLDER).toString()}
                                        caption={errors.firstname && touched.firstname ? () => <ErrorLabel text={errors.firstname} /> : undefined}
                                    />

                                    <Input
                                        status={errors.lastname && touched.lastname ? 'danger' : undefined}
                                        value={values.lastname}
                                        onChangeText={handleChange('lastname')}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_LAST_NAME_TAG).toString()}</Text>}
                                        placeholder={i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_LAST_NAME_PLACEHOLDER).toString()}
                                        caption={errors.lastname && touched.lastname ? () => <ErrorLabel text={errors.lastname} /> : undefined}
                                    />

                                    <Input
                                        status={errors.add1 && touched.add1 ? 'danger' : undefined}
                                        value={values.add1}
                                        onChangeText={handleChange('add1')}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_ADDRESS_1_TAG).toString()}</Text>}
                                        placeholder={i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_ADDRESS_1_PLACEHOLDER).toString()}
                                        caption={errors.add1 && touched.add1 ? () => <ErrorLabel text={errors.add1} /> : undefined}
                                    />

                                    <Input
                                        status={errors.add2 && touched.add2 ? 'danger' : undefined}
                                        value={values.add2}
                                        onChangeText={handleChange('add2')}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_ADDRESS_2_TAG).toString()}</Text>}
                                        placeholder={i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_ADDRESS_2_PLACEHOLDER).toString()}
                                        caption={errors.add2 && touched.add2 ? () => <ErrorLabel text={errors.add2} /> : undefined}
                                    />

                                    <Input
                                        status={errors.city && touched.city ? 'danger' : undefined}
                                        value={values.city}
                                        onChangeText={handleChange('city')}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_CITY_TAG).toString()}</Text>}
                                        placeholder={i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_CITY_PLACEHOLDER).toString()}
                                        caption={errors.city && touched.city ? () => <ErrorLabel text={errors.city} /> : undefined}
                                    />

                                    <Input
                                        status={errors.postcode && touched.postcode ? 'danger' : undefined}
                                        value={values.postcode}
                                        onChangeText={handleChange('postcode')}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_POSTCODE_TAG).toString()}</Text>}
                                        placeholder={i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_POSTCODE_PLACEHOLDER).toString()}
                                        caption={errors.postcode && touched.postcode ? () => <ErrorLabel text={errors.postcode} /> : undefined}
                                    />

                                    <Toggle checked={asCompany} style={{ marginBottom: '5%' }} onChange={() => setAsCompany(p => !p)}>
                                        {i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_COMPANY_TAG).toString()}
                                    </Toggle>

                                    {asCompany && (
                                        <>
                                            <Input
                                                status={errors.company && touched.company ? 'danger' : undefined}
                                                value={values.company}
                                                onChangeText={handleChange('company')}
                                                style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                                size="large"
                                                label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_COMPANY_NAME_TAG).toString()}</Text>}
                                                placeholder={i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_COMPANY_NAME_PLACEHOLDER).toString()}
                                                caption={errors.company && touched.company ? () => <ErrorLabel text={errors.company} /> : undefined}
                                            /><Input
                                                status={errors.vat && touched.vat ? 'danger' : undefined}
                                                value={values.vat}
                                                onChangeText={handleChange('vat')}
                                                style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                                size="large"
                                                label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_COMPANY_VAT_TAG).toString()}</Text>}
                                                placeholder={i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_COMPANY_VAT_PLACEHOLDER).toString()}
                                                caption={errors.vat && touched.vat ? () => <ErrorLabel text={errors.vat} /> : undefined}
                                            />
                                        </>
                                    )}
                                </ScrollView>
                            )}

                            {currentPosition >= 4 && (
                                <View style={{ flexGrow: 1 }}>
                                    <Text style={{ textAlign: 'center', marginTop: '30%' }} category="h5">
                                        {i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_SUCCESS_MESSAGE).toString()}
                                    </Text>
                                </View>
                            )}

                            {(currentPosition == 1 || currentPosition == 2 || currentPosition == 3) && (
                                <ScrollView keyboardShouldPersistTaps={"handled"} contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}>
                                    {sendFileReq.loading && (
                                        <View style={{ backgroundColor: 'white', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Progress.Circle
                                                showsText={true}
                                                textStyle={{ color: "#41d5fb" }}
                                                color={"#41d5fb"}
                                                size={100}
                                                progress={uploadPercent / 100}
                                                indeterminate={uploadPercent == 0}
                                                formatText={() => {
                                                    return `${uploadPercent}%`
                                                }}
                                            />
                                        </View>
                                    )}

                                    {!sendFileReq.loading && !dictionary.get(currentFileType)?.file && (
                                        <TouchableOpacity onPress={() => {
                                            setShowCounterModal(true)
                                        }}>
                                            <View style={{ backgroundColor: 'white', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                                <EntypoIcon style={{ marginRight: '5%', color: '#41d5fb' }} size={100} name="camera" />
                                                <Text style={{ color: 'black', textAlign: 'left', fontSize: 16, fontFamily: AppFontRegular }} category='s2'>
                                                    {i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_ASK_FILE).toString()}
                                                </Text>
                                                <Text style={{ color: 'black', textAlign: 'left', fontSize: 26, fontFamily: AppFontBold }} category='s2'>
                                                    {currentFileType}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}

                                    {!sendFileReq.loading && dictionary.get(currentFileType)?.file && <View style={{ backgroundColor: 'white', minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <>
                                            <TouchableOpacity onPress={() => {
                                                setShowCounterModal(true)
                                            }}>
                                                <View style={{ marginBottom: '3%' }}>
                                                    <Avatar
                                                        key={dictionary.get(currentFileType)?.file?.uri}
                                                        style={{ width: 200, height: 200, resizeMode: 'cover', zIndex: -2 }}
                                                        source={{ uri: dictionary.get(currentFileType)?.file?.uri, cache: 'reload' }}
                                                    />

                                                    <View style={{ zIndex: 2, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 100, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                                        <EntypoIcon style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '1%', paddingHorizontal: '3%', borderRadius: 10 }} size={20} name="edit" />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            {currentFileType != FileTypeEnum.selfi && (
                                                <>
                                                    <Text style={{ fontSize: 15, marginBottom: '2%', marginLeft: '5%', alignSelf: 'flex-start' }} category='s2'>
                                                        {i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_EXPIRE_DATE_TAG).toString()}
                                                    </Text>
                                                    <Datepicker
                                                        style={{ paddingLeft: '5%', paddingRight: '5%', marginBottom: '1%', width: '100%' }}
                                                        controlStyle={{
                                                            backgroundColor: 'white',
                                                            borderRadius: 10,
                                                            borderColor: errors.expDate && touched.expDate ? '#ffa5bc' : '#E4E9F2'
                                                        }}
                                                        min={new Date()}
                                                        max={moment().startOf('year').add(100, 'y').toDate()}
                                                        placeholder={() => <Text style={{ padding: '1.5%', paddingLeft: '4%', color: errors.expDate && touched.expDate ? '#ffa5bc' : '#8F9BB3' }}>{i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_EXPIRE_DATE_PLACEHOLDER).toString()}</Text>}
                                                        date={values?.expDate?.toDate()}
                                                        title={(d) => moment(d)?.format(DATE_FORMAT)}
                                                        dateService={formatDateService}
                                                        onSelect={nextDate => setFieldValue("expDate", moment(nextDate))}
                                                        accessoryRight={() => <EntypoIcon style={{ color: errors.expDate && touched.expDate ? '#ffa5bc' : '#8F9BB3', textAlign: 'left' }} name="calendar" size={22} />}
                                                    />
                                                    {errors.expDate && touched.expDate && <ErrorLabel style={{ marginLeft: '5%', alignSelf: 'flex-start' }} text={errors.expDate} />}

                                                    <Text style={{ fontSize: 15, marginBottom: '2%', marginLeft: '5%', alignSelf: 'flex-start' }} category='s2'>
                                                        {i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_DOCUMENT_NUMBER_TAG).toString()}
                                                    </Text>
                                                    <Input
                                                        status={errors.docNumber && touched.docNumber ? 'danger' : undefined}
                                                        value={values.docNumber}
                                                        onChangeText={handleChange('docNumber')}
                                                        placeholderTextColor={errors.docNumber && touched.docNumber ? '#ffa5bc' : '#8F9BB3'}
                                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '1%', width: "90%" }}
                                                        size="large"
                                                        onBlur={() => setFieldTouched('docNumber')}
                                                        placeholder={i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_DOCUMENT_NUMBER_PLACEHOLDER).toString()}
                                                    />
                                                    {errors.docNumber && touched.docNumber && <ErrorLabel style={{ marginLeft: '5%', alignSelf: 'flex-start' }} text={errors.docNumber} />}

                                                    <Text style={{ fontSize: 15, marginBottom: '2%', marginLeft: '5%', alignSelf: 'flex-start' }} category='s2'>
                                                        {i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_FILE_COUNTRY_TAG).toString()}
                                                    </Text>
                                                    <Layout style={{ marginBottom: '1%', width: '90%' }}>
                                                        <TouchableOpacity onPress={() => setShowCountryModal(true)}>
                                                            <View style={{ width: '100%', borderWidth: 1, borderColor: errors.fileCountry && touched.fileCountry ? '#ffa5bc' : '#E4E9F2', borderRadius: 10 }}>
                                                                {errors.fileCountry && touched.fileCountry && (
                                                                    <Text style={{ color: '#ffa5bc', padding: '3.5%', marginLeft: '3.5%' }}>
                                                                        {i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_FILE_COUNTRY_PLACEHOLDER).toString()}
                                                                    </Text>
                                                                )}
                                                                {!errors.fileCountry && values.fileCountry.name && (
                                                                    <Text style={{ color: '#8F9BB3', padding: '3.5%', marginLeft: '3.5%' }}>
                                                                        {values.fileCountry.name}
                                                                    </Text>
                                                                )}
                                                                {(!errors.fileCountry || !touched.fileCountry) && !values.fileCountry.name && (
                                                                    <Text style={{ color: '#8F9BB3', padding: '3.5%', marginLeft: '3.5%' }}>
                                                                        {i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_FILE_COUNTRY_PLACEHOLDER).toString()}
                                                                    </Text>
                                                                )}
                                                            </View>
                                                        </TouchableOpacity>
                                                        {errors.fileCountry && touched.fileCountry && <ErrorLabel style={{ marginLeft: '5%', alignSelf: 'flex-start' }} text={errors.fileCountry} />}
                                                        {showCountryModal && (
                                                            <CountryPicker
                                                                containerButtonStyle={{
                                                                    borderWidth: 1,
                                                                    borderColor: errors.expDate && errors.expDate ? '#ffa5bc' : '#E4E9F2',
                                                                    padding: '3%',
                                                                    borderRadius: 10,
                                                                    width: 350,
                                                                }}
                                                                countryCode={values.fileCountry?.cca2?.toUpperCase()}
                                                                visible={true}
                                                                withFilter={true}
                                                                withFlagButton={true}
                                                                withCountryNameButton={true}
                                                                renderFlagButton={() => {
                                                                    return
                                                                }}
                                                                onClose={() => setTimeout(() => setShowCountryModal(false), 0)}
                                                                onSelect={(country) => {
                                                                    console.log(country.flag)
                                                                    setFieldValue('fileCountry', country)
                                                                }}
                                                            />
                                                        )}
                                                    </Layout>
                                                </>
                                            )}
                                        </>
                                    </View>}

                                </ScrollView>
                            )}

                            <Button
                                accessoryRight={loading ? LoadingSpinner : undefined}
                                disabled={loading || sendFileReq.loading || resolveFormState().disable }
                                onPress={(e) => {
                                    handleSubmit()
                                    const cb = resolveFormState().cb
                                    cb && cb()
                                }}
                                size="giant"
                                style={{
                                    backgroundColor: resolveFormState().disable || loading || sendFileReq.loading ? '#e4e9f2' : '#41d5fb',
                                    borderColor: resolveFormState().disable || loading || sendFileReq.loading ? '#e4e9f2' : '#41d5fb',
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
                                        {resolveFormState().btnTxt}
                                    </Text>
                                }}
                            </Button>
                            <Modal
                                onBackdropPress={() => setShowCounterModal(false)}
                                isVisible={showCounterModal}
                                style={{
                                    justifyContent: 'flex-end',
                                    margin: 0,
                                }}>
                                <Layout style={{ height: '40%', padding: '3%' }}>
                                    <View style={{ height: '100%' }}>
                                        <Text style={{ textAlign: 'center', width: '100%', fontFamily: AppFontBold }}>Complete using action</Text>
                                        <View style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={(e) => {
                                                try {
                                                    ImagePicker.launchCamera(options, (response) => {
                                                        //console.log('Response = ', response);

                                                        if (response.didCancel) {
                                                            console.log('User cancelled image picker');
                                                        } else if (response.error) {
                                                            console.log('ImagePicker Error: ', response.error);
                                                        } else if (response.customButton) {
                                                            console.log('User tapped custom button: ', response.customButton);
                                                        } else {
                                                            setShowCounterModal(false)
                                                            dispatchFileState({ type: currentFileType, state: { file: response } })
                                                            //AsyncStorage.setItem(currentFileType, JSON.stringify(response))
                                                        }
                                                    });
                                                } catch (error) {
                                                    axiosInstance({
                                                        url: GRCGDS_BACKEND,
                                                        method: 'POST',
                                                        data: {
                                                            module_name: 'ERROR_TRACK',
                                                            errorMessage: `${error.message}\n${error.stack}`,
                                                        }
                                                    })
                                                }
                                            }}>
                                                <View>
                                                    <EntypoIcon style={{ color: '#41d5fb' }} size={50} name="camera" />
                                                    <Text style={{ textAlign: 'center', width: '100%', fontFamily: AppFontBold }}>
                                                        {i18n.t(TRANSLATIONS_KEY.CAMERA_WORD).toString()}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={(e) => {
                                                try {
                                                    ImagePicker.launchImageLibrary(options, (response) => {
                                                        //console.log('Response = ', response);

                                                        if (response.didCancel) {
                                                            console.log('User cancelled image picker');
                                                        } else if (response.error) {
                                                            console.log('ImagePicker Error: ', response.error);
                                                        } else if (response.customButton) {
                                                            console.log('User tapped custom button: ', response.customButton);
                                                        } else {
                                                            setShowCounterModal(false)
                                                            dispatchFileState({ type: currentFileType, state: { file: response } })
                                                        }
                                                    });
                                                } catch (error) {
                                                    axiosInstance({
                                                        url: GRCGDS_BACKEND,
                                                        method: 'POST',
                                                        data: {
                                                            module_name: 'ERROR_TRACK',
                                                            errorMessage: `${error.message}\n${error.stack}`,
                                                        }
                                                    })
                                                }
                                            }}>
                                                <View>
                                                    <EntypoIcon style={{ color: '#41d5fb' }} size={50} name="folder-images" />
                                                    <Text style={{ textAlign: 'center', width: '100%', fontFamily: AppFontBold }}>
                                                        {i18n.t(TRANSLATIONS_KEY.GALLERY_WORD).toString()}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <Text onPress={() => setShowCounterModal(false)} style={{ textAlign: 'center', width: '100%', fontFamily: AppFontBold }}>
                                            Cancel
                                        </Text>
                                    </View>
                                </Layout>
                            </Modal>
                        </>
                    )
                }}
            </Formik>

        </SafeAreaView>
    )
};
