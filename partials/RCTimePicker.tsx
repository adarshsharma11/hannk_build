import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const RCTimePicker: React.FC<{ onChange: (dateTime: Date) => void, isVisible: boolean, date: Date }> = ({ onChange, date: dateValue, isVisible = false }) => {
    const [time, setTime] = useState(dateValue)
    const [steps, setSteps] = useState(0);

    useEffect(() => {
        if (isVisible == true) setSteps(1)
    }, [isVisible])

    if (Platform.OS == "ios") {
        return (
            <DateTimePickerModal
                date={time}
                minuteInterval={30}
                isVisible={steps == 1}
                headerTextIOS="Pick a Time"
                mode="time"
                onConfirm={(d) => {
                    setSteps(0)
                    if (d) {
                        setTime(d)
                        onChange(d)
                    }
                }}
                onCancel={() => {
                    setSteps(0)
                }}
            />
        );
    }

    return (
        <>
        { steps == 1 && (
            <DateTimePicker
                value={time}
                mode={"time"}
                is24Hour={false}
                minuteInterval={30}
                display="default"
                onChange={(e, d) => {
                    setSteps(0)
                    if (d) {
                        setTime(d)
                        onChange(d)
                    }
                }}
            />
        )}
        </>
    )
};

export default RCTimePicker