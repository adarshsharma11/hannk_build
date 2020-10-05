import React, { useEffect, useState, useRef } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, Image, TextInput, View } from 'react-native';
import MenuButton from '../../../partials/MenuButton';
import { AppFontBold, AppFontRegular } from '../../../constants/fonts'
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';

const DocumentScreen = ({ navigation, route }) => {
    const { i18n } = useTranslation();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView keyboardShouldPersistTaps={"handled"} contentContainerStyle={{ flexGrow: 1}} >


            <Layout style={{ flex: 1, padding: '5%', backgroundColor: 'white' }}>
                <MenuButton />

                <Layout style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000', marginTop: '10%', marginBottom: '10%' }}>
                    <Text style={{ fontFamily: AppFontRegular,marginBottom: '10%', textAlign: 'center' }} category="h3">
                        {i18n.t(TRANSLATIONS_KEY.SIGN_OUR_AGREEMEN).toString()}
                    </Text>

                    <Text style={{ fontFamily: AppFontRegular,textAlign: 'center' }} category="h5">
                        {i18n.t(TRANSLATIONS_KEY.SIGN_MESSAGE).toString()}
                </Text>
                </Layout>


                <Button
                    onPress={() => {
                        navigation.navigate('Sign', { pictures: route.params.pictures });
                    }}
                    size="giant"
                    style={{
                        backgroundColor: '#41d5fb',
                        borderColor: '#41d5fb',
                        marginTop: '35%',
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
                    {() => <Text style={{ color: 'white', fontFamily: AppFontBold, fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.SIGN_AGREEMENT_BTN).toString()}</Text>}
                </Button>

            </Layout>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DocumentScreen