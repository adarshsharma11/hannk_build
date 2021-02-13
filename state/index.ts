import { createGlobalState, createStore } from 'react-hooks-global-state';
import AsyncStorage from '@react-native-community/async-storage';
import { LoginManager } from 'react-native-fbsdk';

type InitialState = {
    storedBookings: []
    loading: boolean
    token: null | string
    error: null | string
    success: null | string
    profile: null | { [key: string]: any },
    paypalClientId: null | string,
    paypalSecretKey: null | string,
    termsAndConditions: null | string,
    initialBanner: null | string,
    initialScreen: string,
    currentLocation: null | {"accuracy": number, "altitude": number, "bearing": number, "latitude": number, "longitude": number, "provider": string, "speed": number, "time": number},
}
const initialState: InitialState = {
    storedBookings: [],
    loading: false,
    token: null,
    error: null,
    success: null,
    profile: null,
    paypalClientId: null,
    paypalSecretKey: null,
    termsAndConditions: null,
    initialBanner: null,
    initialScreen: "Home",
    currentLocation: null
};

const normalReducer = (state: any, action: { type: string, state?: any }): InitialState => {
    switch (action.type) {
        case 'error': {
            return { ...state, error: action.state };
        }
        case 'config': {
            return {
                ...state,
                paypalClientId: action.state.paypalClientId,
                paypalSecretKey: action.state.paypalSecretKey,
                termsAndConditions: action.state.termsAndConditions,
                initialBanner: action.state.banner,
            };
        }
        case 'loading': {
            return { ...state, loading: action.state };
        }
        case 'token': {
            AsyncStorage.setItem('token', action.state)
            return { ...state, token: action.state };
        }
        case 'profile': {
            AsyncStorage.setItem('profile', JSON.stringify(action.state))
            return { ...state, profile: action.state };
        }
        case 'logout': {
            LoginManager.logOut();
            AsyncStorage.removeItem('token')
            AsyncStorage.removeItem('profile')
            AsyncStorage.removeItem('appleLogin')
            return { ...state, token: null, profile: null };
        }
        case 'currentLocation': {
            return { ...state, currentLocation: action.state };
        }
        case 'error': {
            return { ...state, error: action.state };
        }
        case 'success': {
            return { ...state, success: action.state };
        }
        case 'saveBooking': {
            AsyncStorage.getItem('bookings')
            .then(bookingsString => {
                let bookings = []
                if (bookingsString) {
                    bookings = JSON.parse(bookingsString);
                }
                bookings.push(action.state);
                AsyncStorage.setItem('bookings', JSON.stringify(bookings))
            })
            return { ...state, storedBookings: [...state.storedBookings, action.state] };
        }
        default: return state;
    }
}

export const { dispatch: dispatchGlobalState, useGlobalState, getState: getGlobalState } = createStore(normalReducer, initialState)

export const saveAppConfig = (config: any) => {
    dispatchGlobalState({ type: "config", state: config })
}

export const setCurrentLocation = (location: any) => {
    dispatchGlobalState({ type: "currentLocation", state: location })
}

AsyncStorage.getItem('token')
    .then(token => {
        if (token) {
            dispatchGlobalState({ type: 'token', state: token})
        }
    })

AsyncStorage.getItem('profile')
    .then(profile => {
        if (profile) {
            dispatchGlobalState({ type: 'profile', state: JSON.parse(profile)})
        }
    })

AsyncStorage.getItem('bookings')
    .then(bookings => {
        if (bookings) {
            const bookingsArr = JSON.parse(bookings)
            bookingsArr.forEach((booking: any) => {
                dispatchGlobalState({ type: 'saveBooking', state: booking })
            });
        }
    })