import React, { useRef } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MenuButton from '../../partials/MenuButton';
import Share from 'react-native-share';
import { ScrollView } from 'react-native-gesture-handler';
import { AppFontBold } from '../../constants/fonts';
import { APP_BRAND_COLOR } from '../../constants/Colors';
import { useGlobalState } from '../../state';

const ShareCodeScreen = () => {
  const navigation = useNavigation();
  const [profile] = useGlobalState("profile");

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Layout style={{ flex: 1, padding: '5%', backgroundColor: 'white' }}>

        <Layout style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#00000000', alignItems: 'center' }}>
          <MenuButton />
        </Layout>

        <ScrollView contentContainerStyle={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#00000000', marginTop: '10%', marginBottom: '10%' }}>
          <View style={{ borderRadius: 20, alignItems: 'center', height: '35%', marginTop: '30%' }}>
            <Text style={{ fontSize: 20 }}>Share your invitation code</Text>
            <Text style={{ fontSize: 50 }}>{`RI0000${profile?.id}`}</Text>
            <Button
              onPress={() => {
                const options = {
                  message: `Download the Retaj app from Play Store or Apple Store and use my activation code RI0000${profile?.id} to start renting cars.`,
                  title: "Invite a friend",
                }
                Share.open(options)
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    err && console.log(err);
                  });
              }}
              size="giant"
              style={{
                marginTop: '15%',
                backgroundColor: APP_BRAND_COLOR,
                borderColor: APP_BRAND_COLOR,
                borderRadius: 10,
                width: "80%",
                shadowColor: APP_BRAND_COLOR,
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.51,
                shadowRadius: 13.16,
                elevation: 10,
              }}>
              {() => <Text style={{ color: 'white', fontFamily: AppFontBold, fontSize: 18 }}>Share</Text>}
            </Button>
          </View>
        </ScrollView>

      </Layout>
    </SafeAreaView>
  );
};

export default ShareCodeScreen