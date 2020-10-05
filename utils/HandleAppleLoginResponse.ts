import appleAuth, {
    AppleButton,
    AppleAuthError,
    AppleAuthRequestOperation,
    AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export const HandleAppleLoginResponse = async () => {
    try {
        // performs login request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: AppleAuthRequestOperation.LOGIN,
            requestedScopes: [
                AppleAuthRequestScope.EMAIL,
                AppleAuthRequestScope.FULL_NAME,
            ],
        });

        if (appleAuthRequestResponse['realUserStatus']) {
            console.log(appleAuthRequestResponse)
            await AsyncStorage.setItem('appleLogin', "true")

            if (appleAuthRequestResponse.email){
                await AsyncStorage.setItem('appleEmail', appleAuthRequestResponse.email)
            } else if (await AsyncStorage.getItem('appleEmail')) {
                appleAuthRequestResponse.email = await AsyncStorage.getItem('appleEmail')
            }
            const data = {
                module_name: "LOGIN_WITH_APPLE",
                email: appleAuthRequestResponse.email
            }
            return appleAuthRequestResponse
        } else {
            throw new Error("Could not login")
        }
    } catch (error) {
        if (error.code === AppleAuthError.CANCELED) {
        }
        if (error.code === AppleAuthError.FAILED) {
            Alert.alert('FAILED Touch ID wrong');
        }
        if (error.code === AppleAuthError.INVALID_RESPONSE) {
            Alert.alert('INVALID_RESPONSE Touch ID wrong');
        }
        if (error.code === AppleAuthError.NOT_HANDLED) {
        }
        if (error.code === AppleAuthError.UNKNOWN) {
            Alert.alert('UNKNOW Touch ID wrong');
        }
        throw new Error(error.code)
    }
}