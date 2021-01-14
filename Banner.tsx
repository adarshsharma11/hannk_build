import React, { useState, useRef, useEffect } from 'react'
import { Dimensions, Image, Text, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { StackScreenProps } from '@react-navigation/stack';
import { useGlobalState } from './state';
import { Button } from '@ui-kitten/components';
import { APP_BRAND_COLOR } from './constants/Colors';
import { AppFontBold } from './constants/fonts';
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from './utils/i18n';

export default ({ navigation, route }: StackScreenProps<any>) => {
    const [initialBanner] = useGlobalState('initialBanner');
    const [initialScreen] = useGlobalState('initialScreen');
    const { i18n } = useTranslation();
    const [timeOut, setUseTimeout] = useState(0);
    const [navigated, setNavigated] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: initialBanner && initialBanner.image ? 'flex-end' : 'center' }}>
            <Button
                onPress={(e) => navigation.navigate(initialScreen)}
                size="giant"
                style={{
                    position: "absolute",
                    zIndex: 10,
                    width: "80%",
                    bottom: '10%',
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
                    return (<>
                        <Text style={{ fontFamily: AppFontBold, color: "white", fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.PROCEED_WORD).toString()}</Text>
                        <Icon style={{ color: 'white' }} name={'right'} size={30} />
                    </>)
                }}
            </Button>
            {initialBanner && initialBanner.image ? (
                <Image
                    source={{ uri: initialBanner.image }}
                    style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
                />
            ) : (
                <Image
                    source={require('./image/app_ico.png')}
                />
            )}
        </SafeAreaView>
    )
};