import React, { useRef } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MenuButton from '../../partials/MenuButton';
import { ScrollView } from 'react-native-gesture-handler';
import { AppFontBold } from '../../constants/fonts';

const DocumentScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Layout style={{ flex: 1, padding: '5%', backgroundColor: 'white' }}>

        <Layout style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#00000000', alignItems: 'center' }}>
          <MenuButton />
        </Layout>

        <ScrollView contentContainerStyle={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000', marginTop: '10%', marginBottom: '10%' }}>
          <Text style={{ marginBottom: '5%', textAlign: 'center' }} category="h3">
            FAQ
          </Text>
          </ScrollView>

        <Button
          onPress={() => {
            if (navigation.canGoBack()){
              navigation.goBack();
            }
          }}
          size="giant"
          style={{
            backgroundColor: '#41d5fb',
            borderColor: '#41d5fb',
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
          {() => <Text style={{ color: 'white', fontFamily: AppFontBold, fontSize: 18 }}>Go Back</Text>}
        </Button>

      </Layout>
    </SafeAreaView>
  );
};

export default DocumentScreen