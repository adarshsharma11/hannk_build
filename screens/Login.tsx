
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Text, Input, Button } from '@ui-kitten/components';
import { TouchableWithoutFeedback, ImageProps, SafeAreaView, ScrollView, Alert, Platform, View, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RenderProp } from '@ui-kitten/components/devsupport';
import useAxios from 'axios-hooks'
import { Formik } from 'formik';
import { GRCGDS_BACKEND } from 'react-native-dotenv'
import { dispatchGlobalState } from '../state';
import { StackScreenProps } from '@react-navigation/stack';
import { NonLoginScreenProps, LoginScreenProps } from '../types';
import LoadingSpinner from '../partials/LoadingSpinner';
import FacebookButton from '../partials/FacebookButton';
import TwitterButton from '../partials/TwitterButton';
import appleAuth, {
    AppleButton,
    AppleAuthError,
    AppleAuthRequestOperation,
    AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';
import ErrorLabel from '../partials/ErrorLabel';
import { LoginManager } from "react-native-fbsdk";
import { handlePermissionPromt, handleUserData } from '../utils/FacebookAuth';
import { axiosInstance } from '../utils/AxiosBootstrap';
import userHasFullProfile from '../utils/userHasFullProfile';
import * as Progress from 'react-native-progress';
import { AppFontBold, AppFontRegular } from '../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../utils/i18n';
import { HandleAppleLoginResponse } from '../utils/HandleAppleLoginResponse';

export default ({ navigation }: StackScreenProps<NonLoginScreenProps & LoginScreenProps>) => {
    const { i18n } = useTranslation();

    const [{ data, loading, error }, doLogin] = useAxios({
        url: `${GRCGDS_BACKEND}/user/login`,
        method: 'POST'
    }, { manual: true })

    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [loadingLogin, setLoadingLogin] = useState(false);

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
                const data = {
                    module_name: "LOGIN_WITH_APPLE",
                    email: appleAuthRequestResponse.email
                }
                doLogin({ data, method: 'POST' })
                    .then(({ data: userData }) => {
                        console.log(userData)
                        dispatchGlobalState({ type: 'token', state: userData.token })
                        dispatchGlobalState({ type: 'profile', state: userData })
                        if (userData.token && !userHasFullProfile(userData)) {
                            navigation.navigate('Home', { screen: "ProfileVerification", params: { appleSignIn: true } })
                        } else if (userData.twoauth != 0) {
                            dispatchGlobalState({ type: 'profile', state: userData })
                            navigation.navigate('Opt')
                        } else {
                            if (userData.vphone != 1) navigation.navigate('Opt')
                            if (userData.vemail != 1) navigation.navigate('VerifyEmail')
                            if (userData.vphone == 1 && userData.vemail == 1) navigation.navigate('Home', { screen: "MyBookings" })
                        }
                        setLoadingLogin(false)
                    })
            })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {loadingLogin && (
                <View style={{ backgroundColor: 'rgba(255,255,255,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 4 }}>
                    <Progress.Circle
                        showsText={true}
                        textStyle={{ color: "#41d5fb" }}
                        color={"#41d5fb"}
                        borderWidth={4}
                        size={150}
                        indeterminate={true}
                    />
                </View>
            )}
            <ScrollView keyboardShouldPersistTaps={"handled"} >

                <Layout style={{ flex: 1, padding: '3%' }}>
                    <Layout style={{ paddingBottom: '10%' }}>
                        <Text style={{ textAlign: 'left', fontSize: 24, marginBottom: 10, fontFamily: AppFontBold }} category='s2'>
                            {i18n.t(TRANSLATIONS_KEY.LOGIN_SCREEN_TITLE).toString()}
                        </Text>
                    </Layout>

                    <Formik
                        initialValues={{ clientname: '', password: '' }}
                        validate={(values) => {
                            const errors: { clientname?: string, password?: string } = {};
                            if (!values.clientname) {
                                errors.clientname = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD).toString();
                            }

                            if (!values.password) {
                                errors.password = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD).toString();
                            }

                            return errors

                        }}
                        onSubmit={values => {
                            if (!values.clientname) return
                            if (!values.password) return
                            const data = {
                                username: values.clientname,
                                password: values.password,
                                module_name: "LOGIN"
                            }
                            doLogin({ data, method: 'POST' })
                                .then(async (res) => {
                                    await AsyncStorage.removeItem('appleLogin')
                                    return res
                                })
                                .then((res) => {
                                    console.log(res.data)
                                    if (res.data.twoauth != 0) {
                                        dispatchGlobalState({ type: 'profile', state: res.data })
                                        navigation.navigate('Opt')
                                    } else {
                                        dispatchGlobalState({ type: 'token', state: res.data.token })
                                        dispatchGlobalState({ type: 'profile', state: res.data })
                                        if (res.data.vphone != 1) navigation.navigate('Opt')
                                        if (res.data.vemail != 1) navigation.navigate('VerifyEmail')
                                        if (res.data.vphone == 1 && res.data.vemail == 1) navigation.navigate('Home', { screen: "MyBookings" })
                                    }
                                })
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
                            return (
                                <>
                                    <Input
                                        status={errors.clientname && touched.clientname ? 'danger' : undefined}
                                        value={values.clientname}
                                        onChangeText={handleChange('clientname')}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.LOGIN_EMAIL_TAG).toString()}</Text>}
                                        placeholder={i18n.t(TRANSLATIONS_KEY.LOGIN_EMAIL_PLACEHOLDER).toString()}
                                        caption={errors.clientname && touched.clientname ? () => <ErrorLabel text={errors.clientname} /> : undefined}

                                    />

                                    <Input
                                        status={errors.password && touched.password ? 'danger' : undefined}
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.LOGIN_PASSWORD_TAG).toString()}</Text>}
                                        placeholder={i18n.t(TRANSLATIONS_KEY.LOGIN_PASSWORD_PLACEHOLDER).toString()}
                                        secureTextEntry={secureTextEntry}
                                        accessoryRight={renderInputIcon}
                                        caption={errors.password && touched.password ? () => <ErrorLabel text={errors.password} /> : undefined}
                                    />
                                    <Text onPress={() => navigation.navigate("ForgotPassword")} style={{ fontSize: 15, textAlign: 'right', color: '#70dffb', marginBottom: '6%' }} category='s2'> Forgot your password? </Text>
                                    <Button
                                        accessoryRight={loading ? LoadingSpinner : undefined}
                                        disabled={loading}
                                        onPress={(e) => { handleSubmit() }}
                                        size="giant"
                                        style={{
                                            backgroundColor: loading == false ? '#41d5fb' : '#e4e9f2',
                                            borderColor: loading == false ? '#41d5fb' : '#e4e9f2',
                                            marginBottom: '15%',
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
                                        {() => <Text style={{ fontFamily: AppFontBold, color: loading ? "#ACB1C0" : 'white', fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.LOGIN_SIGN_IN).toString()}</Text>}
                                    </Button>
                                </>
                            )
                        }}
                    </Formik>

                    <Text style={{ textAlign: 'center', color: '#8f9bb5', marginBottom: '5%' }} category='s2'>
                        {i18n.t(TRANSLATIONS_KEY.LOGIN_OR_SOCIAL_LOGIN).toString()}
                    </Text>

                    <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                        <FacebookButton isSmall={false} onPress={() => {
                            if (Platform.OS === "android") {
                                LoginManager.setLoginBehavior("web_only")
                            }
                            LoginManager.logInWithPermissions(["public_profile", "email"])
                                .then(async (r) => {
                                    await AsyncStorage.removeItem('appleLogin')
                                    setLoadingLogin(true)
                                    return r
                                })
                                .then(handlePermissionPromt)
                                .then(handleUserData)
                                .then((userData) => {
                                    console.log("userData", userData)
                                    if (userData.token && !userHasFullProfile(userData)) {
                                        navigation.navigate('Home')
                                    } else if (userData.twoauth != 0) {
                                        dispatchGlobalState({ type: 'profile', state: userData })
                                        navigation.navigate('Opt')
                                    } else {
                                        dispatchGlobalState({ type: 'token', state: userData.token })
                                        dispatchGlobalState({ type: 'profile', state: userData })
                                        if (userData.vphone != 1) navigation.navigate('Opt')
                                        if (userData.vemail != 1) navigation.navigate('VerifyEmail')
                                        if (userData.vphone == 1 && userData.vemail == 1) navigation.navigate('Home')
                                    }
                                    setLoadingLogin(false)
                                })
                                .catch((error) => {
                                    setLoadingLogin(false)
                                    console.log("Login fail with error: " + error)
                                    navigation.navigate('Login')
                                })
                        }} />
                        {Platform.OS == "ios" && (
                            <AppleButton
                                buttonStyle={AppleButton.Style.BLACK}
                                buttonType={AppleButton.Type.SIGN_IN}
                                style={{
                                    marginTop: "2%",
                                    width: '90%', // You must specify a width
                                    height: 45, // You must specify a height
                                }}
                                onPress={() => handleResponse()}
                            />
                        )}
                    </Layout>

                    <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '10%' }}>
                        <Text style={{ color: 'black' }}>
                            {i18n.t(TRANSLATIONS_KEY.LOGIN_DONT_HAVE_ACCOUNT).toString()}{' '}
                        </Text>
                        <Text onPress={() => navigation.navigate('HasRefCodeScreen')} style={{ color: '#41d5fb' }}>
                            {i18n.t(TRANSLATIONS_KEY.LOGIN_SIGN_UP).toString()}
                        </Text>
                    </Layout>
                </Layout>
            </ScrollView>

        </SafeAreaView>
    )
};
