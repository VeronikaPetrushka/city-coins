import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Calendar } from 'react-native-calendars';
import places from '../constants/places';
import Icons from './Icons';

const { height, width } = Dimensions.get('window');

const heightThreshold = 700;

const imageContainerHeight = height < heightThreshold ? height * 0.15 : height * 0.2;

const Plan = () => {
    const navigation = useNavigation();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    const [purchasedPlaces, setPurchasedPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [visitingDate, setVisitingDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [errors, setErrors] = useState({
        visitingDate: '',
    });

    useEffect(() => {
        setVisitingDate(null);
        setErrors({ visitingDate: '' });
    }, []);

    const handleDayPress = (day) => {
        const selectedDate = new Date(day.dateString);
        setVisitingDate(selectedDate);
        setShowCalendar(false);
    };

    const validateForm = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        const newErrors = {};
    
        if (!value) {
            newErrors.selectedPlace = 'Please select a place.';
        }
    
        if (!visitingDate) {
            newErrors.visitingDate = 'Please select a visiting date.';
        } else if (visitingDate <= today) {
            newErrors.visitingDate = 'Please select a future visiting date.';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    
    const handleSubmit = async () => {
        if (validateForm()) {
            const planDetails = {
                visitingDate: visitingDate.toLocaleDateString('en-GB').replace(/\//g, '.'),
                place: selectedPlace,
            };
    
            try {
                const storedPlan = await AsyncStorage.getItem('plan');
                const planArray = storedPlan ? JSON.parse(storedPlan) : [];
    
                planArray.push(planDetails);
    
                await AsyncStorage.setItem('plan', JSON.stringify(planArray));
    
                Alert.alert('Success', 'Your plan has been saved successfully!');
                
                setValue(null);
                setSelectedPlace(null);
                setVisitingDate(null);
            } catch (error) {
                Alert.alert('Storage Error', `There was an error saving the plan: ${error.message}`);
            }
        } else {
            Alert.alert(
                'Validation Error',
                Object.values(errors).join('\n')
            );
        }
    };
        
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const storedPurchasedPlaces = await AsyncStorage.getItem('purchasedPlaces');
                const purchasedPlacesArray = storedPurchasedPlaces ? JSON.parse(storedPurchasedPlaces) : [];
                setPurchasedPlaces(purchasedPlacesArray);
            } catch (error) {
                Alert.alert('Error', 'Could not load purchased places: ' + error.message);
            }
        };

        fetchPlaces();
    }, []);

    const combinedPlaces = [...places, ...purchasedPlaces];

    useEffect(() => {
        const combinedItems = combinedPlaces.map((place) => ({
            label: place.name,
            value: place.name,
        }));
        setItems(combinedItems);
    }, [places, purchasedPlaces]);

    const handlePlaceSelect = (placeName) => {
        if (!placeName) return;
        const selected = combinedPlaces.find((place) => place.name === placeName);
        if (selected) {
            console.log('Selected Place:', selected);
            setSelectedPlace(selected);
        } else {
            console.error('Place not found in combinedPlaces:', placeName);
        }
    };  
    
    const handleBackPress = () => {
        navigation.navigate('HomeScreen');
    };
    
    return (
        <ImageBackground source={require('../assets/newDiz/back.png')} style={{ flex: 1 }}>
        <View style={styles.container}>
            <TouchableOpacity style={styles.backIcon} onPress={handleBackPress}>
                <Icons type={'back'}/>
            </TouchableOpacity>

            <Text style={styles.title}>Plan Your Visit</Text>

            <View style={{ width: width * 0.54, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: height * 0.03, marginTop: height * 0.05 }}>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    onChangeValue={(placeName) => handlePlaceSelect(placeName)}
                    setItems={setItems}
                    placeholder="Select a place"
                    style={styles.dropdown}
                    dropDownContainerStyle={{ borderColor: '#00b967', backgroundColor: '#153c07', width: width * 0.5 }}
                    placeholderStyle={{ color: '#aac99e', fontSize: 16 }}
                    textStyle={{ color: '#aac99e', fontSize: 16, fontWeight: '500' }}
                    dropDownDirection="BOTTOM"
                />

                <TouchableOpacity style={styles.dateBtn} onPress={() => setShowCalendar(!showCalendar)}>
                    <Text style={styles.dateText}>
                        {visitingDate ? visitingDate.toLocaleDateString() : 'Visiting date'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ width: width * 0.89, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: height * 0.03, marginTop: height * 0.05 }}>
                <View style={styles.imageContainer}>
                    {selectedPlace ? (
                        <Image source={selectedPlace.image} style={styles.placeImage} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <View style={styles.imageIcon}>
                                <Icons type={'image'} />
                            </View>
                        </View>
                    )}
                </View>
                <View style={styles.selectedInfo}>
                    <Text style={styles.selectedInfoText}>{visitingDate ? `Date: ${visitingDate.toLocaleDateString()}` : 'Date'}</Text>
                    <Text style={styles.selectedInfoText}>{value ? `Attraction: ${value}` : 'Attraction'}</Text>
                </View>
            </View>

            {showCalendar && (
                <Calendar
                    style={{ width: width * 0.89, borderRadius: 12 }}
                    onDayPress={handleDayPress}
                    markedDates={{
                        [visitingDate?.toISOString().split('T')[0]]: { selected: true, selectedColor: '#2b790e' },
                    }}
                    theme={{
                        selectedDayBackgroundColor: '#2b790e',
                        todayTextColor: '#00b967',
                        arrowColor: '#2b790e',
                        textDayFontWeight: '500',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '500',
                    }}
                />
            )}

            <TouchableOpacity style={[styles.submitBtn, {marginTop: height * 0.1}]} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.submitBtn, {backgroundColor: '#339011', marginTop: height * 0.02}]} onPress={() => navigation.navigate('PlannedTripsScreen')}>
                <Text style={styles.submitBtnText}>Other plans</Text>
            </TouchableOpacity>
            
        </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingTop: height * 0.07,
        padding: 20,
    },
    backIcon: {
        width: 60,
        height: 60,
        padding: 10,
        position: 'absolute',
        top: height * 0.04,
        left: 10,
        zIndex: 10
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        color: '#7fae6e',
        textAlign: 'center',
        marginBottom: 20,
    },
    dropdown: {
        width: width * 0.5,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#00b967',
        backgroundColor: 'transparent',
        borderRadius: 12,
    },
    dateBtn: {
        width: width * 0.35,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        borderColor: '#00b967',
        borderWidth: 1,
    },
    dateText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#aac99e',
    },
    imageContainer: {
        width: width * 0.35,
        height: imageContainerHeight,
        alignItems: 'center',
    },
    placeImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#aac99e',
        backgroundColor: 'rgba(44, 62, 80, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        marginBottom: 20,
    },
    imageIcon: {
        width: 50,
        height: 50,
    },
    selectedInfo: {
        width: width * 0.5,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        height: imageContainerHeight,
    },
    selectedInfoText: {
        fontSize: 16,
        flexWrap: 'wrap',
        lineHeight: 21,
        color: '#3C3C3B',
        padding: 3,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        fontWeight: '800'
    },
    submitBtn: {
        width: width * 0.89,
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#00b967',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtnText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: '900',
    }
});

export default Plan;