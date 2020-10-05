import React, { useState, useEffect, useRef } from 'react';
import { Layout, Text, Button, Datepicker, NativeDateService, Input, Avatar } from '@ui-kitten/components';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { TouchableWithoutFeedback, ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { GRCGDS_BACKEND } from 'react-native-dotenv'
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';
import { Image, SafeAreaView, View, TouchableOpacity, Platform } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { dispatchFileState, FileTypeEnum, useDocumentState, Actions } from './DocumentState';
import { Formik, FormikProps } from 'formik';
import moment from 'moment';
import Modal from 'react-native-modal';
import useAxios from 'axios-hooks'
import { useGlobalState, dispatchGlobalState } from '../../../state';
import { StackScreenProps } from '@react-navigation/stack';
import { LoginScreenProps } from '../../../types';
import CountryPicker, { getAllCountries, FlagType } from 'react-native-country-picker-modal'
import * as Progress from 'react-native-progress';
import { useFocusEffect } from '@react-navigation/native';
import { AppFontBold, AppFontRegular } from '../../../constants/fonts'
import MenuButton from '../../../partials/MenuButton';
import i18n, { TRANSLATIONS_KEY } from '../../../utils/i18n';
import { composeInitialProps } from 'react-i18next';
import ErrorLabel from '../../../partials/ErrorLabel';
import LoadingSpinner from '../../../partials/LoadingSpinner';

const DATE_FORMAT = 'MMM DD,YYYY'
const formatDateService = new NativeDateService('en', { format: DATE_FORMAT });

const options = {
    title: 'Select picture',
    chooseFromLibraryButtonTitle: '',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

type Props = StackScreenProps<LoginScreenProps, 'SingleUpload'>;

const DocumentScreen = ({ route, navigation }: Props) => {
    const [change, triggerChange] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fileToShow, setFileToShow] = useState<string | null>(null);
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [currentCountryObj, setCurrentCountryObj] = useState<any>({});
    const [currentFileType, setCurrentFileType] = useState(FileTypeEnum.passport);
    const [dictionary] = useDocumentState("dictionary")
    const [profile] = useGlobalState('profile')
    const [uploadPercent, setUploadPercent] = useState(0);
    const [showCounterModal, setShowCounterModal] = useState(false)
    const formikRef = useRef<FormikProps<any>>()

    const [getFilesReq, sendFile] = useAxios({
        url: `${GRCGDS_BACKEND}`,
        method: 'POST',
        onUploadProgress: (e) => {
            var percentCompleted = Math.round((e.loaded * 100) / e.total)
            setUploadPercent(percentCompleted);
        }
    }, { manual: true })

    const initialValues = {
        docNumber: route.params?.docNumber,
        fileCountry: route.params?.docCountry,
        expDate: moment(`${route.params.year}-${route.params.month}-${route.params.day}`, 'YYYY-MM-DD')
    }

    useFocusEffect(
        React.useCallback(() => {
            if (route.params.fileType == FileTypeEnum.passport) {
                setFileToShow(`https://www.right-cars.com/uploads/pass/${profile?.passimage}`)
            }
            if (route.params.fileType == FileTypeEnum.driving_license) {
                setFileToShow(`https://www.right-cars.com/uploads/drlic/${profile?.drimage}`)
            }
            if (route.params.fileType == FileTypeEnum.selfi) {
                setFileToShow(`https://www.right-cars.com/uploads/selfi/${profile?.selfiurl}`)
            }
            triggerChange(p => !p)
            getAllCountries(FlagType.FLAT)
                .then(countries => {
                    const found = countries.find(c => c.cca2.toLowerCase() == route.params?.docCountry)
                    setCurrentCountryObj(found)
                })
            return () => {
                dispatchFileState({ type: Actions.RESET, state: {} })
                formikRef.current?.resetForm({ values: initialValues })
            }
        }, [route.params])
    );


    useEffect(() => {
        if (route.params && route.params.fileType) {
            console.log('params', route.params.fileType)
            setCurrentFileType(route.params.fileType)
        } else {
            setCurrentFileType(FileTypeEnum.passport)
        }
    }, [route.params])

    const currenButtonState = () => {
        if (dictionary.get(currentFileType)?.file) {
            return { btnTxt: 'Save', disabled: false }
        }

        return { btnTxt: 'Save', canGoNext: false, disabled: true }

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

            <Layout style={{ display: 'flex', flex: 1, padding: '3%' }}>
                <Formik
                    innerRef={(r) => formikRef.current = r}
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validate={(values) => {

                        const errors: any = {}
                        if (!values.docNumber && route.params.fileType != FileTypeEnum.selfi) errors.docNumber = i18n.t(TRANSLATIONS_KEY.REQUIRED_WORD);

                        return errors
                    }}
                    onSubmit={values => {

                        const data = new FormData();

                        const file = dictionary.get(currentFileType)?.file;

                        const currentFile = dictionary.get(currentFileType)?.file
                        if (currentFile) {
                            if ("fileName" in currentFile) {
                                (file as DocumentPickerResponse).name = (currentFile as ImagePickerResponse).fileName || currentFileType;
                            }
                        }

                        data.append("module_name", "FILE_UPLOAD");
                        if (file) {
                            data.append("file", {
                                ...file,
                                uri: (Platform.OS === 'android') ? file.uri : file.uri.replace('file://', '')
                            });
                        }
                        data.append("fileType", currentFileType);
                        if (currentFileType != FileTypeEnum.selfi) {
                            data.append("expDate", values.expDate.format('YYYY-MM-DD'));
                            data.append("filecountry", currentCountryObj.cca2?.toLowerCase());
                            data.append("docNumber", values.docNumber);
                        }

                        sendFile({ data })
                            .then(r => {
                                if (route.params.fileType == FileTypeEnum.passport) {
                                    setFileToShow(`https://www.right-cars.com/uploads/pass/${r.data?.passimage}`)
                                }
                                if (route.params.fileType == FileTypeEnum.driving_license) {
                                    setFileToShow(`https://www.right-cars.com/uploads/drlic/${r.data?.drimage}`)
                                }
                                if (route.params.fileType == FileTypeEnum.selfi) {
                                    setFileToShow(`https://www.right-cars.com/uploads/selfi/${r.data?.selfiurl}`)
                                }
                                dispatchGlobalState({ type: 'profile', state: r.data })
                                dispatchFileState({ type: Actions.RESET, state: {} })
                                triggerChange(p => !p)
                                setUploadPercent(0)
                                setSaving(false)
                            })
                            .catch(r => console.log(r))

                    }}
                >
                    {({ handleChange, setFieldValue, handleSubmit, values, errors, touched, setFieldTouched }) => {

                        return (
                            <>
                                <ScrollView keyboardShouldPersistTaps={"handled"} contentContainerStyle={{ flexGrow: 1 }}>
                                    <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', zIndex: 2, marginBottom: '15%' }}>
                                        <View style={{ position: 'absolute', left: 0, zIndex: 4 }}>
                                            <MenuButton />
                                        </View>
                                        <Text style={{ textAlign: 'center', fontSize: 24, fontFamily: AppFontBold }} category='s2'>
                                            {currentFileType}
                                        </Text>
                                    </Layout>
                                    {getFilesReq.loading && (
                                        <View style={{ backgroundColor: 'white', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Progress.Circle
                                                showsText={true}
                                                textStyle={{ color: "#41d5fb" }}
                                                color={"#41d5fb"}
                                                size={100}
                                                progress={uploadPercent / 100}
                                                indeterminate={uploadPercent == 0}
                                                formatText={() => {
                                                    return `${uploadPercent}%`
                                                }}
                                            />
                                        </View>
                                    )}
                                    {!getFilesReq.loading && !route.params.fileToShow && !dictionary.get(currentFileType)?.file && (
                                        <TouchableOpacity onPress={() => {
                                            setShowCounterModal(true)
                                        }}>
                                            <View style={{ backgroundColor: 'white', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                                <EntypoIcon style={{ marginRight: '5%', color: '#41d5fb' }} size={100} name="camera" />
                                                <Text style={{ color: 'black', textAlign: 'left', fontSize: 16, fontFamily: AppFontRegular }} category='s2'>
                                                    {i18n.t(TRANSLATIONS_KEY.PROFILE_VERIFICATION_ASK_FILE).toString()}
                                                </Text>
                                                <Text style={{ color: 'black', textAlign: 'left', fontSize: 26, fontFamily: AppFontBold }} category='s2'>
                                                    {currentFileType}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}

                                    {fileToShow && !dictionary.get(currentFileType)?.file && <View style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {change ? (
                                            <TouchableOpacity onPress={() => {
                                                console.log('opeing modal')
                                                setShowCounterModal(true)
                                            }}>
                                                <View style={{ marginBottom: '3%' }}>
                                                    <Avatar
                                                        key={fileToShow}
                                                        style={{ width: 200, height: 200, resizeMode: 'cover', zIndex: -2 }}
                                                        source={{ uri: fileToShow, cache: 'reload' }}
                                                    />

                                                    <View style={{ zIndex: 2, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 100, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                                        <EntypoIcon style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '1%', paddingHorizontal: '3%', borderRadius: 10 }} size={20} name="edit" />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                                <TouchableOpacity onPress={() => {
                                                    console.log('opeing modal')
                                                    setShowCounterModal(true)
                                                }}>
                                                    <View style={{ marginBottom: '3%' }}>
                                                        <Avatar
                                                            key={fileToShow}
                                                            style={{ width: 200, height: 200, resizeMode: 'cover', zIndex: -2 }}
                                                            source={{ uri: fileToShow, cache: 'reload' }}
                                                        />

                                                        <View style={{ zIndex: 2, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 100, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                                            <EntypoIcon style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '1%', paddingHorizontal: '3%', borderRadius: 10 }} size={20} name="edit" />
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                    </View>}

                                    {dictionary.get(currentFileType)?.file && <View style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Avatar
                                            key={dictionary.get(currentFileType)?.file?.uri}
                                            style={{ width: 175, height: 175, resizeMode: 'cover', marginTop: '3%', marginBottom: '3%', zIndex: -2 }}
                                            source={{ uri: `data:image/jpeg;base64,${dictionary.get(currentFileType)?.file?.data}`, cache: 'reload' }}
                                        />
                                    </View>}
                                    {currentFileType != FileTypeEnum.selfi && (
                                        <View style={{ backgroundColor: 'white', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Datepicker
                                                style={{ paddingLeft: '5%', paddingRight: '5%', marginBottom: '1%', width: '100%' }}
                                                controlStyle={{
                                                    backgroundColor: 'white',
                                                    borderRadius: 10,
                                                    borderColor: errors.expDate && touched.expDate ? '#ffa5bc' : '#E4E9F2'
                                                }}
                                                placeholder={() => <Text style={{ padding: '1.5%', paddingLeft: '4%', color: errors.expDate && touched.expDate ? '#ffa5bc' : '#8F9BB3' }}>{errors.expDate && touched.expDate ? errors.expDate : 'Expire Date'}</Text>}
                                                date={values?.expDate?.toDate()}
                                                title={(d) => moment(d)?.format(DATE_FORMAT)}
                                                dateService={formatDateService}
                                                onSelect={nextDate => setFieldValue("expDate", moment(nextDate))}
                                                accessoryRight={() => <EntypoIcon style={{ color: errors.expDate && touched.expDate ? '#ffa5bc' : '#8F9BB3', textAlign: 'left' }} name="calendar" size={22} />}
                                            />

                                            <Input
                                                status={errors.docNumber && touched.docNumber ? 'danger' : undefined}
                                                value={values.docNumber}
                                                onChangeText={handleChange('docNumber')}
                                                placeholderTextColor={errors.docNumber && touched.docNumber ? '#ffa5bc' : '#8F9BB3'}
                                                style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '1%', width: "90%" }}
                                                size="large"
                                                onBlur={() => setFieldTouched('docNumber')}
                                                placeholder={'Document Number'}
                                            />
                                            {errors.docNumber && touched.docNumber && <ErrorLabel style={{ marginLeft: '5%', alignSelf: 'flex-start' }} text={errors.docNumber} />}
                                            <Layout style={{ marginBottom: '1%', width: '90%' }}>
                                                <TouchableOpacity onPress={() => setShowCountryModal(true)}>
                                                    <View style={{ width: '100%', borderWidth: 1, borderColor: errors.fileCountry && touched.fileCountry ? '#ffa5bc' : '#E4E9F2', borderRadius: 10 }}>
                                                        {errors.fileCountry && touched.fileCountry && !currentCountryObj && (
                                                            <Text style={{ color: '#ffa5bc', padding: '3.5%', marginLeft: '3.5%' }}>
                                                                {errors.fileCountry}
                                                            </Text>
                                                        )}
                                                        {!errors.fileCountry && currentCountryObj && currentCountryObj.name && (
                                                            <Text style={{ color: '#8F9BB3', padding: '3.5%', marginLeft: '3.5%' }}>
                                                                {currentCountryObj.name.trim()}
                                                            </Text>
                                                        )}
                                                        {(!errors.fileCountry || !touched.fileCountry) && !currentCountryObj && (
                                                            <Text style={{ color: '#8F9BB3', padding: '3.5%', marginLeft: '3.5%' }}>
                                                                Select Country
                                                            </Text>
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                                {showCountryModal && (
                                                    <CountryPicker
                                                        containerButtonStyle={{
                                                            borderWidth: 1,
                                                            borderColor: errors.expDate && errors.expDate ? '#ffa5bc' : '#E4E9F2',
                                                            padding: '3%',
                                                            borderRadius: 10,
                                                            width: 350,
                                                        }}
                                                        countryCode={values.fileCountry?.cca2?.toUpperCase()}
                                                        visible={true}
                                                        withFilter={true}
                                                        withFlagButton={true}
                                                        withCountryNameButton={true}
                                                        renderFlagButton={() => {
                                                            return
                                                        }}
                                                        onClose={() => setTimeout(() => setShowCountryModal(false), 0)}
                                                        onSelect={(country) => {
                                                            setCurrentCountryObj(country)
                                                            setFieldValue('fileCountry', country)
                                                            setTimeout(() => setShowCountryModal(false), 0)
                                                        }}
                                                    />
                                                )}
                                            </Layout>
                                        </View>
                                    )}

                                </ScrollView>

                                <Layout style={{ paddingTop: '2%' }}>
                                    <Button
                                        disabled={getFilesReq.loading || saving}
                                        accessoryRight={getFilesReq.loading || saving ? LoadingSpinner : undefined}
                                        onPress={() => {
                                            const currentState = currenButtonState()
                                            console.log(currentState)
                                            setSaving(true)
                                            if (currentState.canGoNext) {
                                                navigation.navigate(currentState.goTo, currentState.with)
                                                return
                                            } else {
                                                handleSubmit()
                                            }
                                        }}
                                        size="giant"
                                        style={{
                                            backgroundColor: getFilesReq.loading || saving ? '#e4e9f2' : '#41d5fb',
                                            borderColor: getFilesReq.loading || saving ? '#e4e9f2' : '#41d5fb',
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
                                        {() => <Text style={{ fontFamily: AppFontBold, color: 'white', fontSize: 18 }}>
                                            {currenButtonState().btnTxt}
                                        </Text>}
                                    </Button>
                                </Layout>
                            </>
                        )
                    }}
                </Formik>
                <Modal
                    onBackdropPress={() => setShowCounterModal(false)}
                    isVisible={showCounterModal}
                    style={{
                        justifyContent: 'flex-end',
                        margin: 0,
                    }}>
                    <Layout style={{ height: '40%', padding: '3%' }}>
                        <View style={{ height: '100%' }}>
                            <Text style={{ textAlign: 'center', width: '100%', fontFamily: AppFontBold }}>Complete using action</Text>
                            <View style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                <TouchableOpacity onPress={(e) => {
                                    ImagePicker.launchCamera(options, (response) => {
                                        //console.log('Response = ', response);

                                        if (response.didCancel) {
                                            console.log('User cancelled image picker');
                                        } else if (response.error) {
                                            console.log('ImagePicker Error: ', response.error);
                                        } else if (response.customButton) {
                                            console.log('User tapped custom button: ', response.customButton);
                                        } else {
                                            setShowCounterModal(false)
                                            dispatchFileState({ type: currentFileType, state: { file: response } })
                                        }
                                    });
                                }}>
                                    <View>
                                        <EntypoIcon style={{ color: '#41d5fb' }} size={50} name="camera" />
                                        <Text style={{ textAlign: 'center', width: '100%', fontFamily: AppFontBold }}>
                                            {i18n.t(TRANSLATIONS_KEY.CAMERA_WORD).toString()}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={(e) => {
                                    ImagePicker.launchImageLibrary(options, (response) => {
                                        //console.log('Response = ', response);

                                        if (response.didCancel) {
                                            console.log('User cancelled image picker');
                                        } else if (response.error) {
                                            console.log('ImagePicker Error: ', response.error);
                                        } else if (response.customButton) {
                                            console.log('User tapped custom button: ', response.customButton);
                                        } else {
                                            setShowCounterModal(false)
                                            dispatchFileState({ type: currentFileType, state: { file: response } })
                                        }
                                    });
                                }}>
                                    <View>
                                        <EntypoIcon style={{ color: '#41d5fb' }} size={50} name="folder-images" />
                                        <Text style={{ textAlign: 'center', width: '100%', fontFamily: AppFontBold }}>
                                            {i18n.t(TRANSLATIONS_KEY.GALLERY_WORD).toString()}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <Text onPress={() => setShowCounterModal(false)} style={{ textAlign: 'center', width: '100%', fontFamily: AppFontBold }}>
                                Cancel
                                        </Text>
                        </View>
                    </Layout>
                </Modal>
            </Layout>
        </SafeAreaView>
    )
};

export default DocumentScreen