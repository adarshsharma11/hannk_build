import React, { useEffect } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    FlatList,
    Alert,
    SafeAreaView
} from "react-native";

import { Layout, Avatar, Text, Divider, Button, Modal, Card } from "@ui-kitten/components";
import { LoginScreenProps } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useGlobalState, dispatchGlobalState } from "../../state";
import userHasFullProfile from "../../utils/userHasFullProfile";
import userHasAllFiles from "../../utils/userHasAllFiles";
import { useIsDrawerOpen } from "@react-navigation/drawer";
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppFontRegular } from "../../constants/fonts";
import i18n, { TRANSLATIONS_KEY } from "../../utils/i18n";
import { CommonActions, useNavigationState } from "@react-navigation/native";

const menuData = [
    { name: i18n.t(TRANSLATIONS_KEY.MENU_ITEM_MY_PROFILE), screenName: "EditProfile", iconName: 'account', key: 'sdwwe' },
    { name: i18n.t(TRANSLATIONS_KEY.MENU_ITEM_PRIVACY_POLICY), screenName: "Policy", iconName: 'shield', key: 'swwe' },
    { name: i18n.t(TRANSLATIONS_KEY.MENU_ITEM_TERMS_CONDITIONS), screenName: "TermsConditions", iconName: 'file-document', key: 'sdsfwwe' },
    {
        name: i18n.t(TRANSLATIONS_KEY.MENU_ITEM_LOGOUT), iconName: 'logout', key: 'assdrw', onPress: () => {
            Alert.alert(
                "",
                i18n.t(TRANSLATIONS_KEY.LOGOUT_MESSAGE),
                [
                    {
                        text: i18n.t(TRANSLATIONS_KEY.NO_WORD),
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: i18n.t(TRANSLATIONS_KEY.YES_WORD), onPress: () => dispatchGlobalState({ type: 'logout' }) }
                ],
                { cancelable: false }
            );
        }
    },
];

const DrawerMenu = ({ navigation }: { navigation: any }) => {
    const [profile] = useGlobalState('profile')

    const hasFullProfile = userHasFullProfile(profile || {})
    const hasAllFiles = userHasAllFiles(profile || {})

    const wasDrawerOpen = useIsDrawerOpen();

    useEffect(() => {
        if (hasFullProfile && hasAllFiles) {
            const found = menuData.find(i => i.key == "asd")
            if (!found) menuData.unshift({ name: "My Trips", screenName: "MyBookings", iconName: "car-side", iconSize: 30, resetHistory: true, key: 'asd' });
        }
    }, [wasDrawerOpen])

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1}}>
                <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
                    <Layout style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', borderBottomWidth: 1, borderBottomColor: 'grey', paddingBottom: '8%' }}>
                        {profile?.selfiurl == "" && (
                            <Avatar
                                style={{ width: 125, height: 125, }}
                                source={require('../../image/rightcars.png')}
                            />
                        )}
                        {profile?.selfiurl != "" && (
                            <Avatar
                                style={{ width: 125, height: 125, }}
                                source={{ uri: `https://www.right-cars.com/uploads/selfi/${profile?.selfiurl}` }}
                            />
                        )}
                    </Layout>
                </TouchableOpacity>

                <FlatList
                    style={{ backgroundColor: 'rgba(0,0,0,0)' }}
                    data={menuData}
                    renderItem={({ item }) => (
                        // @ts-ignore
                        <DrawerItem
                            iconName={item.iconName}
                            navigation={navigation}
                            onPress={item.onPress}
                            iconSize={item.iconSize}
                            screenName={item.screenName as keyof LoginScreenProps}
                            name={item.name}
                            key={item.key}
                            resetHistory={item.resetHistory}
                        />
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const DrawerItem = ({ navigation, name, iconName, screenName, iconSize, resetHistory, onPress }: StackScreenProps<LoginScreenProps> & { name: string, iconSize: number, resetHistory?: boolean, iconName: string, onPress?: () => void, screenName?: keyof LoginScreenProps }) => {

    return (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
                if (screenName) {

                    /*if (resetHistory == true) {
                        navigation.dispatch((state) => {
                            return CommonActions.reset({
                                ...state,
                                index: 0,
                                routes: [
                                    { name: screenName },
                                    ...state.routes
                                ],
                            })
                        });
                        navigation.closeDrawer()
                    } else {
                        navigation.navigate(screenName)
                    }*/

                    navigation.navigate(screenName)

                } else {
                    onPress && onPress();
                }
            }}
        >
            <MaterialCommunityIcon style={{ marginLeft: '8%', marginRight: '4%', color: '#41d5fb', fontSize: iconSize || 25 }} name={iconName} />
            <Text style={styles.menuItemText}>{name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.43)",
        paddingTop: '10%',
        display: 'flex',
        justifyContent: 'center'
    },
    menuItem: {
        flexDirection: "row",
        alignItems: 'center',
        paddingTop: '3%',
        paddingBottom: '3%',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.6,
    },
    menuItemText: {
        fontSize: 18,
        fontWeight: "300",
        color: "rgba(0,0,0,0.8)",
        fontFamily: AppFontRegular
    },
});

export default DrawerMenu;