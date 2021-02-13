import AsyncStorage from "@react-native-community/async-storage"
import moment from "moment"
import { MarkerVehicleType } from "../utils/MarkerVehicleType"

type Params = {
    pickTime: string,
    pickDate: string,
    dropTime: string,
    dropDate: string,
    locationCode: 'LHRA01' | 'SPUA01',
    bookingType: MarkerVehicleType,
    finalCost?: string | number,
    isComplete?: boolean,
}
export const storeLocalBooking = (booking: Params) => {

    const bookingData = {
        "resnumber": Math.random().toString().slice(2),
        "pLocation": booking.locationCode == 'LHRA01' ? "London Heathrow Airport": "Split - Airport (SPU)",
        "pLocationAddress": booking.locationCode == 'LHRA01' ? "London Heathrow Airport": "Split - Airport (SPU)",
        "pickUpInstructions": "",
        "pPhoneNumber": Math.random().toString().slice(2),
        "rPhoneNumber": Math.random().toString().slice(2),
        "unixPTime": moment().add(2, 'hours').unix(),
        "rLocation": booking.locationCode == 'LHRA01' ? "London Heathrow Airport": "Split - Airport (SPU)",
        "unixRTime": moment().add(5, 'hours').unix(),

        "reservationStatus": "",
        "keytype": "",
        "carModel": "",

        "finalCost": booking.finalCost || (Math.random() + parseInt(Math.random().toString().slice(3,5))).toFixed(2),
        "payableOnCollection": "0",
        "unixTime": moment().unix(),
        "vehicleType": booking.bookingType,
        "isCompleted": booking?.isComplete || false,
    }

    return AsyncStorage.getItem('localBookings')
    .then(bookings => {
        let bookingsArr = [bookingData]
        if (bookings) {
            bookingsArr = JSON.parse(bookings)
            bookingsArr.push(bookingData)
        }
        AsyncStorage.setItem('localBookings', JSON.stringify(bookingsArr))
    })
}

export const getLocalBookings = () => {
    return AsyncStorage.getItem('localBookings')
    .then(bookings => {
        if (bookings) {
            return { data: JSON.parse(bookings) }
        } else {
            return { data: [] }
        }
    })
}

export const updateBooking = (id: string, newData: any) => {
    return AsyncStorage.getItem('localBookings')
    .then(bookingsString => {
        if (!bookingsString) return Promise.resolve()

        const bookings = JSON.parse(bookingsString)
        const bookingToEdit = bookings.find(b => b.resnumber == id)
        if (!bookingToEdit) return Promise.resolve()

        const newBookingsArr = bookings.filter(b => b.resnumber != bookingToEdit.resnumber)
        newBookingsArr.push({ ...bookingToEdit, ...newData })
        
        return AsyncStorage.setItem('localBookings', JSON.stringify(newBookingsArr))
    })
}