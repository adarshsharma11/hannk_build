import React, { useRef, useState } from 'react';
import { Layout, Text, Button, Datepicker, NativeDateService, TabView, Card, Avatar, Input } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native';
import LoadingSpinner from '../partials/LoadingSpinner';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../partials/BackButton';
import useAxios from 'axios-hooks'
import { GRCGDS_BACKEND } from 'react-native-dotenv'
import { AppFontBold, AppFontRegular } from '../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../utils/i18n';

const RefCodeScreen = () => {
    const navigation = useNavigation();
    const { i18n } = useTranslation();

    const [refCode, setRefCode] = useState<null | string>(null);

    const [{ data, loading, error }, doRecover] = useAxios({
        url: `${GRCGDS_BACKEND}`,
        method: 'POST'
    }, { manual: true })

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <Layout style={{ flex: 1, padding: '5%', backgroundColor: 'white' }}>
                <BackButton />
                <Layout style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000', marginBottom: '25%', marginTop: '5%' }}>
                    <Text style={{ fontFamily: AppFontBold, textAlign: 'center' }} category="h3">
                        {i18n.t(TRANSLATIONS_KEY.REF_CODE_TITLE_SCREEN).toString()}
                    </Text>
                </Layout>


                <Input
                    style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                    size='large'
                    onChangeText={(e) => setRefCode(e)}
                    label={() => <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>{i18n.t(TRANSLATIONS_KEY.REF_CODE_INPUT_TAG).toString()}</Text>}
                    placeholder={i18n.t(TRANSLATIONS_KEY.REF_CODE_INPUT_PLACEHOLDER).toString()}
                />

                <Button
                    disabled={loading}
                    accessoryRight={loading ? LoadingSpinner : undefined}
                    onPress={() => navigation.navigate("Signup", { refCode })}
                    size="large"
                    style={{
                        backgroundColor: loading == false ? '#41d5fb' : '#e4e9f2',
                        borderColor: loading == false ? '#41d5fb' : '#e4e9f2',
                        marginBottom: '5%',
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
                    {() => <Text style={{ fontFamily: AppFontBold, color: 'white', fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.ACTIVATE_WORD).toString()}</Text>}
                </Button>
                <Button
                    disabled={loading}
                    accessoryRight={loading ? LoadingSpinner : undefined}
                    onPress={() => navigation.navigate("Signup")}
                    size="large"
                    style={{
                        backgroundColor: '#cf1830',
                        borderColor: '#cf1830',
                        marginBottom: '15%',
                        borderRadius: 10,
                        shadowColor: '#cf1830',
                        shadowOffset: {
                            width: 0,
                            height: 10,
                        },
                        shadowOpacity: 0.51,
                        shadowRadius: 13.16,
                        elevation: 10,
                    }}>
                    {() => <Text style={{ fontFamily: AppFontBold, color: 'white', fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.CANCEL_WORD).toString()}</Text>}
                </Button>
                <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00000000' }}>
                    <Text onPress={() => navigation.navigate("Login")} style={{ color: '#41d5fb' }}>{i18n.t(TRANSLATIONS_KEY.FORGOT_BACK_TO_SIGN).toString()}</Text>
                </Layout>

            </Layout>
        </SafeAreaView>
    );
};

export default RefCodeScreen