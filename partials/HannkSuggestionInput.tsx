import React, { useEffect, useState } from 'react';
import { ViewStyle, FlatList, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialIcons';
import { Input } from '@ui-kitten/components';
import i18n from '../utils/i18n';

type HannkSuggestionOption = { id: string, label: string }

const Item = ({ item, onSelect }: { onSelect: (o: HannkSuggestionOption) => void,item: HannkSuggestionOption }) => {
    return (<TouchableOpacity onPress={() => onSelect(item)} style={{ paddingVertical: '3%', borderBottomWidth: 1, borderBottomColor: '#00000050',justifyContent: 'space-between', width: '100%', flexDirection: 'row' }}>
      <Text style={{ fontSize: 18 }}>{item.label}</Text>
    </TouchableOpacity>)    
};

const HannkSuggestionInput = ({ options }: {options: HannkSuggestionOption[] }) => {
    const [selectedOption, setselectedOption] = useState<null | HannkSuggestionOption>(null)
    const [searchTerm, setStartsWith] = useState("")
    const [inputValue, setInputValue] = useState("")
    const [suggestion, setSuggestions] = useState<HannkSuggestionOption[]>([]);

    useEffect(() => {
        if (searchTerm) {
            setSuggestions(options.filter(o => o.label.startsWith(searchTerm)))
            setInputValue(searchTerm)
        }
    }, [searchTerm])

    useEffect(() => {
        if (selectedOption?.label) {
            setInputValue(selectedOption.label)
            setSuggestions([])
        }
    }, [selectedOption])

    const renderIcon = (props: any) => {
        return (<MaterialCommunityIcon style={{ fontSize: 22, color: props.style.tintColor }} name={'search'} />)
    };

    const renderItem = ({ item }: any) => (
        <Item item={item} onSelect={(o) => setselectedOption(o)} />
    );

    return (
        <>
        <Input
            value={inputValue}
            label='Search'
            placeholder='Place your Text'
            caption='Search for companies to import'
            accessoryRight={renderIcon}
            onChangeText={nextValue => setStartsWith(nextValue)}
        />
        {suggestion.length != 0 && (
            <FlatList
                style={{ height: (Dimensions.get('screen').height / 100) * 30 }}
                data={suggestion}
                renderItem={renderItem}
                keyExtractor={item => item.id}
          />
        )}
        </>
    );
};

export default HannkSuggestionInput