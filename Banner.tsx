import React, { useState, useRef, useEffect } from 'react'
import { Dimensions, Image, ImageProps, SafeAreaView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useGlobalState } from './state';
import { useFocusEffect } from '@react-navigation/native';

export default ({ navigation, route }: StackScreenProps<any>) => {
    const [initialBanner] = useGlobalState('initialBanner');
    const [initialScreen] = useGlobalState('initialScreen');
    const [timeOut, setUseTimeout] = useState(0);
    const [navigated, setNavigated] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            if (navigated == false) {
                const t = setTimeout(() => navigation.navigate(initialScreen), 10000)
                setUseTimeout(t)
                console.log("Banner screen", initialScreen)
                if (timeOut != 0) {
                    clearTimeout(timeOut)
                }
            }
        }, [initialScreen])
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {initialBanner && initialBanner.image && (
                <Image
                    source={{ uri: initialBanner.image }}
                    style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
                />
            )}
        </SafeAreaView>
    )
};