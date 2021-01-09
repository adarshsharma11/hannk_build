import 'react-native-gesture-handler';
import React, { useEffect, useState, useReducer } from 'react'
import './utils/ErrorTrack';

import * as eva from '@eva-design/eva';
import EvaMapping from '@eva-design/eva/mapping';
import { ApplicationProvider } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import './utils/AxiosBootstrap';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Home from './screens/home/Home';
import TwitterLoginScreen from './screens/TwitterLoginWebview';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import SuccessForgotPasswordScreen from './screens/SuccessForgotPasswordScreen';
import SuccessPhoneVerificationScreen from './screens/SuccessPhoneVerification';
import EmptyLoadingScreen from './screens/EmptyLoadingScreen';
import VerifyPhoneScreen from './screens/VerifyPhoneScreen';
import VerifyEmailScreen from './screens/VerifyEmailScreen';
import { useGlobalState, dispatchGlobalState, saveAppConfig } from './state';
import SplashScreen from 'react-native-splash-screen'
import { Alert } from 'react-native';
import { AppState } from 'react-native'
import { getAppConfig } from 'hannk-mobile-common'
import BackgroundTimer from 'react-native-background-timer';
import './utils/i18n';
import RefCodeScreen from './screens/RefCodeScreen';
import HasRefCodeScreen from './screens/HasRefCodeScreen';
import { APP_BRAND_COLOR } from './constants/Colors';
import { CLIENT_ID, GRCGDS_BACKEND } from 'react-native-dotenv';
import Banner from './Banner';

if (!Object.fromEntries) {
  Object.fromEntries = Object.fromEntries || function(arr) {
    return arr.reduce(function(acc, curr) {
        acc[curr[0]] = curr[1];
        return acc;
    }, {});
  };
}

const Stack = createStackNavigator();

export default () => {
  const [token] = useGlobalState('token');
  const [profile] = useGlobalState('profile');
  const [error] = useGlobalState('error');
  const [, setInitialScreen] = useGlobalState('initialScreen'); 

  const { getAppConfig: doGetAppConfig, getAppConfigReq } = getAppConfig(CLIENT_ID, true, GRCGDS_BACKEND)

  useEffect(() => {
    if (getAppConfigReq.data && !getAppConfigReq.loading) {
      saveAppConfig(getAppConfigReq.data)
      SplashScreen.hide()
    }
  }, [getAppConfigReq.loading])

  useEffect(() => {
    if (!profile || profile.vphone != 1 || profile.vemail != 1 || !token) {
      setInitialScreen("Login")
    }
  }, [token, profile])

  const cb = (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      console.log('app is on back')
      let c = 30
      BackgroundTimer.runBackgroundTimer(() => {
        console.log(c)
        if (c == 0){
          c = 30
          dispatchGlobalState({ type: 'logout'})
        } else {
          c  = c - 1
        }
      }, 1000 * 60 * 30);
    } else {
      BackgroundTimer.stopBackgroundTimer(); //after this call all code on background stop run.
    }
  }

  useEffect(() => {
    SplashScreen.hide()
    AppState.addEventListener('change', cb);
    
    return () => AppState.removeEventListener('change', cb);
  }, []);
  const j = { ...EvaMapping }
  //j.strict["text-font-family"] = "SF-UI-Display-Regular"
  j.components.Input.appearances.default.variantGroups.status.basic.state.focused.borderColor = APP_BRAND_COLOR
  j.components.Input.appearances.default.variantGroups.status.basic.backgroundColor = "white"

  j.components.Input.appearances.default.variantGroups.status.basic.state.focused.borderColor = APP_BRAND_COLOR
  j.components.Input.appearances.default.variantGroups.status.basic.backgroundColor = "white"

  j.components.Toggle.appearances.default.variantGroups.status.basic.backgroundColor = "white"
  j.components.Toggle.appearances.default.variantGroups.status.basic.borderColor = APP_BRAND_COLOR
  j.components.Toggle.appearances.default.variantGroups.status.basic.state.checked.backgroundColor = APP_BRAND_COLOR
  j.components.Toggle.appearances.default.variantGroups.status.basic.state.checked.borderColor = APP_BRAND_COLOR
  j.components.Toggle.appearances.default.variantGroups.status.basic.state.checked.iconTintColor = APP_BRAND_COLOR
  j.components.Toggle.appearances.default.variantGroups.status.basic.state.focused.borderColor = APP_BRAND_COLOR
  j.components.Toggle.appearances.default.variantGroups.status.basic.state.focused.backgroundColor = APP_BRAND_COLOR
  j.components.Toggle.appearances.default.variantGroups.status.basic.state.active.backgroundColor = APP_BRAND_COLOR
  j.components.Toggle.appearances.default.variantGroups.status.basic.state.active.borderColor = APP_BRAND_COLOR
  j.components.Toggle.appearances.default.variantGroups.status.basic.state["checked.active"].backgroundColor = APP_BRAND_COLOR
  j.components.Toggle.appearances.default.variantGroups.status.basic.state["checked.active"].borderColor = APP_BRAND_COLOR

  j.components.CheckBox.appearances.default.mapping.width = 25
  j.components.CheckBox.appearances.default.mapping.height = 25
  j.components.CheckBox.appearances.default.mapping.borderWidth = 2
  j.components.CheckBox.appearances.default.variantGroups.status.basic.backgroundColor = "white"
  j.components.CheckBox.appearances.default.variantGroups.status.basic.borderColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.basic.state.checked.backgroundColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.basic.state.checked.borderColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.basic.state.focused.borderColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.basic.state.focused.backgroundColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.basic.state.active.backgroundColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.basic.state.active.borderColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.basic.state["checked.active"].backgroundColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.basic.state["checked.active"].borderColor = APP_BRAND_COLOR

  j.components.CheckBox.appearances.default.variantGroups.status.control.backgroundColor = "white"
  j.components.CheckBox.appearances.default.variantGroups.status.control.borderColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.control.state.checked.backgroundColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.control.state.checked.borderColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.control.state.focused.borderColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.control.state.focused.backgroundColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.control.state.active.backgroundColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.control.state.active.borderColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.control.state["checked.active"].backgroundColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.control.state["checked.active"].borderColor = APP_BRAND_COLOR
  j.components.CheckBox.appearances.default.variantGroups.status.control.state.checked.iconTintColor = "white"

  j.components.Spinner.appearances.default.variantGroups.status.basic.borderColor = APP_BRAND_COLOR
  j.components.Spinner.appearances.default.variantGroups.status.primary.borderColor = APP_BRAND_COLOR

  j.components.Card.appearances.outline.mapping.bodyPaddingVertical = 8

  if (error) {
    Alert.alert(
      "Error",
      error,
      [
        { text: "Close", onPress: () => dispatchGlobalState({ type: 'error', state: null }) }
      ],
      { cancelable: false }
    );
  }

  return (
    <ApplicationProvider mapping={EvaMapping} theme={eva.light} customMapping={j}>
      <NavigationContainer>
        <Stack.Navigator headerMode='none'>
          {(token && profile && profile.vemail == 1) && (
            <>
              <Stack.Screen name="Banner" component={Banner} initialParams={{ goTo: "Home" }} />
              <Stack.Screen name="Home" component={Home} />
            </>
          )}

          {(!profile || profile.vphone != 1 || profile.vemail != 1 || !token) && (
            <>
              <Stack.Screen name="Banner" component={Banner} initialParams={{ goTo: "Home" }} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="TwitterLogin" component={TwitterLoginScreen} />
              <Stack.Screen name="Opt" component={VerifyPhoneScreen} />
              <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="SuccessEmail" component={SuccessPhoneVerificationScreen} />
              <Stack.Screen name="SuccessForgotPassword" component={SuccessForgotPasswordScreen} />
              <Stack.Screen name="EmptyLoading" component={EmptyLoadingScreen} />
              <Stack.Screen name="HasRefCodeScreen" component={HasRefCodeScreen} />
              <Stack.Screen name="RefCode" component={RefCodeScreen} />
            </>
          )}


        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  )
};