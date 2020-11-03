import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Platform } from 'react-native';

const RCDatePicker: React.FC<{ onChange: (dateTime: Date) => void, isVisible: boolean, date: Date }> = ({ onChange, date: dateValue, isVisible = false }) => {
    const [date, setDate] = useState(dateValue)
    const [steps, setSteps] = useState(0);

    useEffect(() => {
        if (isVisible == true) setSteps(1)
    }, [isVisible])

    useEffect(() => {
        if (date) {
            setDate(dateValue)
        }
    }, [dateValue])

    if (Platform.OS == "ios") {
        return (
            <DateTimePickerModal
                date={date}
                isVisible={steps == 1}
                mode="date"
                onConfirm={(d) => {
                    setSteps(0)
                    if (d) {
                        setDate(d)
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
            {steps == 1 && (
                <DateTimePicker
                    value={date}
                    mode={"date"}
                    is24Hour={false}
                    display="default"
                    onTouchCancel={() => setSteps(0)}
                    onChange={(e, d) => {
                        setSteps(0)
                        if (d) {
                            setDate(d)
                            onChange(d)
                        }
                    }}
                />
            )}
        </>
    )
};

export default RCDatePicker