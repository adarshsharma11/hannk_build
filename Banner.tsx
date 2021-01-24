import React, { useState, useRef, useEffect } from 'react'
import { Dimensions, Image, Text, SafeAreaView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { StackScreenProps } from '@react-navigation/stack';
import { useGlobalState } from './state';
import { Button } from '@ui-kitten/components';
import { APP_BRAND_COLOR } from './constants/Colors';
import { AppFontBold } from './constants/fonts';
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from './utils/i18n';
import { useFocusEffect } from '@react-navigation/native';

export default ({ navigation, route }: StackScreenProps<any>) => {
    const [initialBanner] = useGlobalState('initialBanner');
    const [initialScreen] = useGlobalState('initialScreen');
    const { i18n } = useTranslation();
    const [timeOut, setUseTimeout] = useState(0);
    const [navigated, setNavigated] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            if (navigated == false) {
                const t = setTimeout(() => {
                    navigation.navigate(initialScreen)
                }, 5 * 1000)
                setUseTimeout(t)
                console.log("Banner screen", initialScreen)
                if (timeOut != 0) {
                    clearTimeout(timeOut)
                }
            }
        }, [initialScreen])
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: initialBanner && initialBanner.image ? 'flex-end' : 'center' }}>
            {initialBanner && initialBanner.image ? (
                <Image
                    source={{ uri: initialBanner.image }}
                    style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
                />
            ) : (
                <Image
                    source={require('./image/hannk-loader.gif')}
                />
            )}
        </SafeAreaView>
    )
};