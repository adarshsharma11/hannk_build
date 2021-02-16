import { createGlobalState } from 'react-hooks-global-state';
import { PricedEquip, CarSearchItem } from '../../../types/SearchVehicleResponse';
import { setHours, setMinutes, addDays } from 'date-fns'

export type LocationCode = {
    Branchid: string,
    Branchname: string,
}

type InitialState = {
    originLocation: LocationCode | null,
    returnLocation: LocationCode | null,
    inmediatePickup: boolean | null,
    departureTime: Date,
    returnTime: Date,

    arrivalTime: '',
    reservationNumber: string | null,

    extras: (PricedEquip & { amount: number }) []

    vehicle: CarSearchItem | null,
    pickedBranch: any | null
};
 
const initialCreatingBookingState: InitialState = {
    originLocation: null,
    returnLocation: null,
    inmediatePickup: false,
    reservationNumber: null,
    departureTime: new Date(),
    returnTime: new Date(),
    extras: [],
    vehicle: null,
    arrivalTime: '',
    pickedBranch: null
};

export const {
    useGlobalState: useCreateBookingState,
    setGlobalState: setCreatingBookingGlobalState,
} = createGlobalState<InitialState>(initialCreatingBookingState);

export const resetBookingCreationState = () => {
    setCreatingBookingGlobalState("originLocation", initialCreatingBookingState.originLocation)
    setCreatingBookingGlobalState("returnLocation", initialCreatingBookingState.returnLocation)
    setCreatingBookingGlobalState("inmediatePickup", initialCreatingBookingState.inmediatePickup)
    setCreatingBookingGlobalState("reservationNumber", initialCreatingBookingState.reservationNumber)
    setCreatingBookingGlobalState("departureTime", initialCreatingBookingState.departureTime)
    setCreatingBookingGlobalState("returnTime", initialCreatingBookingState.returnTime)
    setCreatingBookingGlobalState("extras", initialCreatingBookingState.extras)
    setCreatingBookingGlobalState("vehicle", initialCreatingBookingState.vehicle)
    setCreatingBookingGlobalState("arrivalTime", initialCreatingBookingState.arrivalTime)
}