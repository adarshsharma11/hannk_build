import React from 'react';
import { Text} from '@ui-kitten/components';
import { TextStyle } from 'react-native';

const ErrorLabel: React.FC<{ text?: string, style?: TextStyle }> = ({ text, style }) => (
    <Text style={{ color:'#ffa5bc', ...style }} category='s2'>{text}</Text>
);

export default ErrorLabel