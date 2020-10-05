
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Text, Input, Button, Toggle } from '@ui-kitten/components';
import { TouchableWithoutFeedback, ImageProps, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Formik } from 'formik';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RenderProp } from '@ui-kitten/components/devsupport';
import PhoneInputComponent from '../partials/PhoneInput';
import { TextInput } from 'react-native-gesture-handler';
import ReactNativePhoneInput from 'react-native-phone-input';
import ErrorLabel from '../partials/ErrorLabel';
import { GRCGDS_BACKEND } from 'react-native-dotenv'
import useAxios from 'axios-hooks'
import LoadingSpinner from '../partials/LoadingSpinner';
import { dispatchGlobalState } from '../state';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackButton from '../partials/BackButton';
import FacebookButton from '../partials/FacebookButton';
import appleAuth, {
    AppleButton,
    AppleAuthError,
    AppleAuthRequestOperation,
    AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';
import TwitterButton from '../partials/TwitterButton';
import { LoginManager, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import { handlePermissionPromt, handleUserData } from '../utils/FacebookAuth';
import { axiosInstance } from '../utils/AxiosBootstrap';
import { AppFontBold, AppFontRegular } from '../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../utils/i18n';
import { HandleAppleLoginResponse } from '../utils/HandleAppleLoginResponse';
import userHasFullProfile from '../utils/userHasFullProfile';
import AsyncStorage from '@react-native-community/async-storage';


export default () => {
    const navigation = useNavigation();
    const route = useRoute()
    const { i18n } = useTranslation();

    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [phonenumberToShow, setPhonenumberToShow] = useState<string>('');
    const [isoCountry, setIsoCountry] = useState<string>('us');
    const [asCompany, setAsCompany] = useState(false);
    const phoneInput = useRef<ReactNativePhoneInput<typeof TextInput> | null>(null);
    const [{ data, loading, error }, doRegister] = useAxios({
        url: `${GRCGDS_BACKEND}/user/register`,
        method: 'POST'
    }, { manual: true })

    const [loginReq, doLogin] = useAxios({
        url: `${GRCGDS_BACKEND}/user/login`,
        method: 'POST'
    }, { manual: true })


    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const renderInputIcon: RenderProp<Partial<ImageProps>> = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon style={{ color: secureTextEntry ? '#e4e9f2' : 'black' }} name={secureTextEntry ? 'eye' : 'eye-slash'} size={30} />
        </TouchableWithoutFeedback>
    );

    const handleResponse = async () => {
        HandleAppleLoginResponse()
            .then(appleAuthRequestResponse => {
                console.log(appleAuthRequestResponse)
                const data = {
                    module_name: "LOGIN_WITH_APPLE",
                    email: appleAuthRequestResponse.email,
                    refCode: route?.params?.refCode
                }
                doLogin({ data, method: 'POST' })
                    .then(({ data: userData }) => {
                        console.log(userData)
                        dispatchGlobalState({ type: 'token', state: userData.token })
                        dispatchGlobalState({ type: 'profile', state: userData })
                        if (userData.token && !userHasFullProfile(userData)) {
                            navigation.navigate('Home')
                        } else if (userData.twoauth != 0) {
                            dispatchGlobalState({ type: 'profile', state: userData })
                            navigation.navigate('Opt')
                        } else {
                            if (userData.vphone != 1) navigation.navigate('Opt')
                            if (userData.vemail != 1) navigation.navigate('VerifyEmail')
                            if (userData.vphone == 1 && userData.vemail == 1) navigation.navigate('Home')
                        }
                    })
            })
    }

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <ScrollView keyboardShouldPersistTaps={"handled"} >
                <Layout style={{ flex: 1, paddingLeft: '3%', paddingRight: '3%', paddingBottom: '3%' }}>
                    <Layout style={{ paddingBottom: '5%' }}>
                        <Layout style={{ flex: 1, paddingTop: '3%', paddingBottom: '2%', display: 'flex', flexDirection: 'row' }}>
                            <BackButton />
                            <Text style={{ textAlign: 'left', paddingLeft: '3%', fontSize: 25, marginBottom: '3%', fontFamily: AppFontBold }} category='s2'>
                                {i18n.t(TRANSLATIONS_KEY.REGISTER_SCREEN_TITLE).toString()}
                            </Text>
                        </Layout>
                        <Layout style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text style={{ color: 'black' }}>
                                {i18n.t(TRANSLATIONS_KEY.REGISTER_HAVE_ACCOUNT).toString()}
                            </Text>
                            <Text onPress={() => navigation.navigate('Login')} style={{ color: '#41d5fb' }}>
                                {i18n.t(TRANSLATIONS_KEY.REGISTER_LOG_IN).toString()}
                            </Text>
                        </Layout>
                    </Layout>

                    <Formik
                        initialValues={{
                            emailaddress: '',
                            password: '',
                            telecode: '',
                            tele: '',
                            countryCode: '',
                            confirmPassword: '',
                            company: '',
                            vat: '',
                            refCode: route?.params?.refCode
                        }}
                        validate={(values) => {
                            const errors: { emailaddress?: string, password?: string, tele?: string } = {};
                            if (!values.emailaddress) {
                                errors.emailaddress = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD).toString();
                            }

                            if (!values.password) {
                                errors.password = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD).toString();
                            }

                            if (!values.tele) {
                                errors.tele = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD).toString();
                            } else if (values.tele.length > 10) {
                                //TODO: fix translation
                                errors.tele = 'Phone number can be max 10 digits';
                            }

                            return errors

                        }}
                        onSubmit={values => {

                            const data = values
                            if (!data.telecode) data.telecode = '+1';
                            if (!data.countryCode) data.countryCode = 'us';
                            data.username = values.emailaddress
                            data.module_name = "REGISTER"

                            doRegister({ data: { ...data, asCompany } })
                                .then(async (res) => {
                                    await AsyncStorage.removeItem('appleLogin')

                                    console.log(res.data)
                                    const data = {
                                        username: values.emailaddress,
                                        password: values.password,
                                        module_name: "LOGIN"
                                    }
                                    return doLogin({ data })
                                })
                                .then(res => {
                                    dispatchGlobalState({ type: 'token', state: res.data.token })
                                    dispatchGlobalState({ type: 'profile', state: res.data })
                                    navigation.navigate('Opt')
                                })

                        }}
                    >
                        {({ handleChange, touched, handleSubmit, values, errors, setFieldValue }) => {
                            return (
                                <>
                                    <Input
                                        status={errors.emailaddress && touched.emailaddress ? 'danger' : undefined}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.REGISTER_LOGIN_TAG).toString()}</Text>}
                                        placeholder={i18n.t(TRANSLATIONS_KEY.REGISTER_LOGIN_PLACEHOLDER).toString()}
                                        value={values.emailaddress}
                                        onChangeText={handleChange('emailaddress')}
                                        caption={errors.emailaddress && touched.emailaddress ? () => <ErrorLabel text={errors.emailaddress} /> : undefined}
                                    />
                                    <Input
                                        status={errors.password && touched.password ? 'danger' : undefined}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.REGISTER_PASSWORD_TAG).toString()}</Text>}
                                        placeholder={i18n.t(TRANSLATIONS_KEY.REGISTER_PASSWORD_TAG).toString()}
                                        secureTextEntry={secureTextEntry}
                                        accessoryRight={renderInputIcon}
                                        value={values.password}
                                        onChangeText={(e) => {
                                            handleChange('password')(e)
                                            handleChange('confirmPassword')(e)
                                        }}
                                        caption={errors.password && touched.password ? () => <ErrorLabel text={errors.password} /> : undefined}
                                    />

                                    <Layout style={{ marginBottom: '3%' }}>
                                        <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>
                                            {i18n.t(TRANSLATIONS_KEY.REGISTER_PHONE_NUMBER_TAG).toString()}
                                        </Text>
                                        <PhoneInputComponent
                                            styles={{ borderColor: errors.tele && touched.tele ? '#ffa5bc' : '#e5eaf2', }}
                                            mobilecode={values.telecode}
                                            mobileNumber={phonenumberToShow}
                                            onCountryChanged={(countryCode) => {
                                                setFieldValue('countryCode', countryCode)
                                            }}
                                            onCodeChange={(code) => {
                                                setFieldValue('telecode', code)
                                            }}
                                            onNumberChange={(number) => {
                                                handleChange('tele')(number)
                                            }}
                                        />
                                        {errors.tele && touched.tele && <ErrorLabel text={errors.tele} />}
                                    </Layout>

                                    <Toggle checked={asCompany} onChange={() => setAsCompany(p => !p)}>
                                        {i18n.t(TRANSLATIONS_KEY.REGISTER_COMPANY_NAME_PLACEHOLDER).toString()}
                                    </Toggle>

                                    {asCompany && (
                                        <Layout>
                                            <Input
                                                status={errors.company && touched.company ? 'danger' : undefined}
                                                style={{ backgroundColor: '#ffffff', borderRadius: 10, marginTop: '3%', marginBottom: '3%' }}
                                                size="large"
                                                label={() => <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.REGISTER_COMPANY_NAME_TAG).toString()}</Text>}
                                                placeholder={i18n.t(TRANSLATIONS_KEY.REGISTER_COMPANY_NAME_PLACEHOLDER).toString()}
                                                value={values.company}
                                                onChangeText={handleChange('company')}
                                                caption={errors.company && touched.company ? () => <ErrorLabel text={errors.company} /> : undefined}
                                            />
                                            <Input
                                                status={errors.vat && touched.vat ? 'danger' : undefined}
                                                style={{ backgroundColor: '#ffffff', borderRadius: 10 }}
                                                size="large"
                                                label={() => <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.REGISTER_COMPANY_VAT_TAG).toString()}</Text>}
                                                placeholder={i18n.t(TRANSLATIONS_KEY.REGISTER_COMPANY_VAT_PLACEHOLDER).toString()}
                                                value={values.vat}
                                                onChangeText={handleChange('vat')}
                                                caption={errors.vat && touched.vat ? () => <ErrorLabel text={errors.vat} /> : undefined}
                                            />
                                        </Layout>
                                    )}

                                    <Button
                                        disabled={loading == true || loginReq.loading == true}
                                        accessoryRight={loading ? LoadingSpinner : undefined}
                                        onPress={(e) => { handleSubmit() }}
                                        size="giant"
                                        style={{
                                            marginTop: '10%',
                                            backgroundColor: loading == false ? '#41d5fb' : '#e4e9f2',
                                            borderColor: loading == false ? '#41d5fb' : '#e4e9f2',
                                            marginBottom: '10%',
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
                                        {() => <Text style={{ fontFamily: AppFontBold, color: loading ? "#ACB1C0" : 'white', fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.REGISTER_SIGN_UP).toString()}</Text>}
                                    </Button>
                                </>
                            );
                        }}
                    </Formik>

                    <Text style={{ textAlign: 'center', color: '#8f9bb5', marginBottom: '5%' }} category='s2'>
                        {i18n.t(TRANSLATIONS_KEY.REGISTER_OR_SOCIAL).toString()}
                    </Text>

                    <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                        <FacebookButton isSmall={false} onPress={() => {
                            LoginManager.logInWithPermissions(["public_profile", "email"])
                                .then(handlePermissionPromt)
                                .then(async (data) => {
                                    await AsyncStorage.removeItem('appleLogin')
                                    handleUserData(data, route?.params?.refCode)
                                })
                                .then(() => navigation.navigate('Home'))
                                .catch((error) => console.log("Login fail with error: " + error))
                        }} />
                        {Platform.OS == "ios" && (
                            <AppleButton
                                buttonStyle={AppleButton.Style.BLACK}
                                buttonType={AppleButton.Type.SIGN_IN}
                                style={{
                                    marginTop: '2%',
                                    width: '90%', // You must specify a width
                                    height: 45, // You must specify a height
                                }}
                                onPress={() => handleResponse()}
                            />
                        )}
                    </Layout>

                    <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '5%', flexWrap: 'wrap' }}>
                        <Text style={{ fontFamily: AppFontRegular, color: 'black' }}>{i18n.t(TRANSLATIONS_KEY.REGISTER_BY_CLICK_YOU_ACCEPT).toString()}</Text>
                        <Text style={{ fontFamily: AppFontRegular, color: '#41d5fb' }}>{i18n.t(TRANSLATIONS_KEY.REGISTER_TERM_COND).toString()} </Text>
                        <Text style={{ fontFamily: AppFontRegular, color: 'black' }}>{i18n.t(TRANSLATIONS_KEY.REGISTER_AS_WELL).toString()} </Text>
                        <Text style={{ fontFamily: AppFontRegular, color: '#41d5fb' }}>{i18n.t(TRANSLATIONS_KEY.REGISTER_PRIVACY).toString()}</Text>
                    </Layout>
                </Layout>
            </ScrollView>
        </SafeAreaView>
    )
};
