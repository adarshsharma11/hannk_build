import React, { useEffect, useState, useRef } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, ScrollView, Image, TextInput, View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import SignatureCapture from 'react-native-signature-capture';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useGlobalState } from '../../../state';
import MenuButton from '../../../partials/MenuButton';
import { AppFontRegular } from '../../../constants/fonts';
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS_KEY } from '../../../utils/i18n';


const DocumentScreen = ({ navigation }) => {
    const { i18n } = useTranslation();
    const signRef = useRef<TextInput | null>(null);
    const route = useRoute();
    const [isClean, setIsClean] = useState(true);
    const [profile] = useGlobalState('profile');

    return (
        <>
            <View style={[{ flex: 1 }]}>
                <SignatureCapture
                    ref={ref => {
                        signRef.current = ref;
                    }}
                    style={[{ flex: 1 }]}
                    showNativeButtons={false}
                    showBorder={false}
                    saveImageFileInExtStorage={true}
                    showTitleLabel={false}
                    onDragEvent={() => {
                        setIsClean(false);
                    }}
                    onSaveEvent={(res) => {
                        navigation.navigate('Report', {
                            signImagePath: `data:image/png;base64,${res.encoded}`,
                            pathName: res.pathName
                        })
                    }}
                />
                {isClean && <View style={{ position: 'absolute', width: '100%',top: '50%' }}>
                    <Text style={{ fontFamily: AppFontRegular,fontSize: 48,textAlign: 'center', color: 'rgba(0,0,0,0.2)'}}>Please sign here</Text>
                </View>}
                <View style={{ position: 'absolute', top: '5%', left: '5%', zIndex: 4 }}>
                    <MenuButton />
                </View>
                <View style={{ position: 'absolute', top: '85%', left: '5%', zIndex: 4 }}>
                    <TouchableWithoutFeedback onPress={() => {
                        signRef.current?.resetImage();
                        setIsClean(true)
                    }}>
                        <View >
                            <MaterialCommunityIcons name="reload" size={50} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: AppFontRegular,marginLeft: '5%', fontSize: 18 }}>{i18n.t(TRANSLATIONS_KEY.SIGN_SIGNED_BY).toString()} {profile.firstname}{' '}{profile.lastname}</Text>
                <Button
                    disabled={isClean}
                    onPress={() => {
                        if (isClean) return
                        signRef.current?.saveImage()
                    }}
                    style={{
                        backgroundColor: isClean == false ? '#41d5fb' : '#e4e9f2',
                        borderColor: isClean == false ? '#41d5fb' : '#e4e9f2',
                    }}>{i18n.t(TRANSLATIONS_KEY.CONFIRM_WORD).toString()}</Button>
            </View>
            </>
    );
};

export default DocumentScreen