import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Dimensions, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const { width, height } = Dimensions.get('window');

const PlannedTrips = () => {
    const [plans, setPlans] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const storedPlans = await AsyncStorage.getItem('plan');
                const planArray = storedPlans ? JSON.parse(storedPlans) : [];
                setPlans(planArray);
            } catch (error) {
                Alert.alert('Error', `Could not load plans: ${error.message}`);
            }
        };

        fetchPlans();
    }, []);

    console.log('plans:', plans)

    const handleDeletePlan = async (index) => {
        try {
            const updatedPlans = plans.filter((_, i) => i !== index);
            setPlans(updatedPlans);
            await AsyncStorage.setItem('plan', JSON.stringify(updatedPlans));
        } catch (error) {
            Alert.alert('Error', `Could not delete the plan: ${error.message}`);
        }
    };

    const renderPlan = ({ item, index }) => {
        const { place, visitingDate } = item;
    
        return (
            <View style={styles.placeContainer}>
                <Image
                    source={place.image}
                    style={styles.placeImage}
                />
                <Text style={styles.placeName}>{place.name || 'No name available'}</Text>
                <Text style={styles.placeInfo}>{place.address || 'No address available'}</Text>
                <Text style={styles.placeInfo}>Planned on: {visitingDate}</Text>
        
                <TouchableOpacity
                    style={[styles.detailsButton, {backgroundColor: '#c73131'}]}
                    onPress={() =>
                        Alert.alert(
                            'Delete Plan',
                            'Are you sure you want to delete this plan?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive', onPress: () => handleDeletePlan(index) },
                            ]
                        )
                    }
                >
                    <Text style={styles.detailsButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    };


    return (
        <ImageBackground source={require('../assets/newDiz/back.png')} style={{ flex: 1 }}>
        <View style={styles.container}>
            <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack('')}>
                <Icons type={'back'} />
            </TouchableOpacity>
            <Text style={styles.title}>Planned Trips</Text>
            {plans.length > 0 ? (
                <FlatList
                    data={plans}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderPlan}
                />
            ) : (
                <Text style={styles.noPlansText}>No plans found. Start planning your trips!</Text>
            )}
        </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: height * 0.07,
        alignItems: 'center'
    },
    backIcon: {
        width: 60,
        height: 60,
        padding: 10,
        position: 'absolute',
        top: height * 0.04,
        left: 10,
        zIndex: 10,
      },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#7fae6e',
    },
    noPlansText: {
        fontSize: 16,
        color: '#aac99e',
        marginTop: 32,
        textAlign: 'center',
    },
    placeContainer: {
        width: width * 0.85,
        marginBottom: 30,
        alignItems: 'center',
      },
      placeImage: {
        width: '100%',
        height: height * 0.3,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'transparent',
      },
      placeName: {
        marginVertical: 10,
        fontWeight: '700',
        fontSize: 16,
        textAlign: 'center',
        color: '#aac99e',
      },
      detailsButton: {
        marginTop: 10,
        backgroundColor: '#3D85C6',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
      },
      detailsButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '900',
      },
        planDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    planText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    deleteButton: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeInfo: {
        color: '#6aa156'
    }
});

export default PlannedTrips;
