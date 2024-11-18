import React, { useRef, useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert, ImageBackground } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from "react-native-maps";
import Icons from "./Icons";

const { height } = Dimensions.get('window');

const Details = ({ place }) => {
    const mapRef = useRef(null);
    const navigation = useNavigation();
    const [markerSize, setMarkerSize] = useState(40);
    const [visited, setVisited] = useState(false);
    const [checkInDisabled, setCheckInDisabled] = useState(false);

    const checkIfVisited = async () => {
        try {
            const storedVisitedTrips = await AsyncStorage.getItem('visitedTrips');
            const visitedTripsArray = storedVisitedTrips ? JSON.parse(storedVisitedTrips) : [];
            const visitedTrip = visitedTripsArray.find(trip => trip.place && trip.place.name === place.name);
            setVisited(!!visitedTrip);
            console.log(`Visited status for ${place.name}:`, !!visitedTrip);
        } catch (error) {
            Alert.alert('Error', 'Could not check visit status: ' + error.message);
            console.error(error);
        }
    };

    const loadTrips = async () => {
        try {
            const storedTrip = await AsyncStorage.getItem('trip');
            const tripArray = storedTrip ? JSON.parse(storedTrip) : [];
            const availableTrips = tripArray.some(trip => !trip.isChecked && trip.quest);
            setCheckInDisabled(!availableTrips);
            console.log('Check-in disabled:', !availableTrips);
        } catch (error) {
            Alert.alert('Error', 'Could not load trips: ' + error.message);
            console.error(error);
        }
    };

    useEffect(() => {
        console.log("Details component mounted");
        checkIfVisited();
        loadTrips();

    }, [place]);    

    const handleBackPress = () => {
        navigation.navigate('HomeScreen');
    };
    
    return (
        // <ImageBackground source={require('../assets/newDiz/back.png')} style={{ flex: 1 }}>
        <View style={styles.container}>
            <TouchableOpacity style={styles.backIcon} onPress={handleBackPress}>
                <Icons type={'back'}/>
            </TouchableOpacity>
                <Image source={place.image} style={styles.image} />
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    key={place.name}
                    style={styles.map}
                    initialRegion={{
                        latitude: place.coordinates[0].lat,
                        longitude: place.coordinates[0].lng,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    onError={(e) => console.error('MapView error:', e)}
                >
                    <Marker
                        coordinate={{
                            latitude: place.coordinates[0].lat,
                            longitude: place.coordinates[0].lng,
                        }}
                    >
                        <View>
                            <Image
                                source={place.image}
                                style={[styles.markerImage, { width: markerSize, height: markerSize }]}
                            />
                            {visited && (
                                <View style={styles.visitedIcon}>
                                    <Icons type={'visited'} />
                                </View>
                            )}
                        </View>
                    </Marker>
                </MapView>
                <TouchableOpacity  
                    style={[styles.checkBtn, checkInDisabled && { opacity: 0.5 }]} 
                    onPress={() => navigation.navigate('CheckInScreen', {place: place})}
                    disabled={checkInDisabled}
                >
                    <Text style={styles.checkBtnText}>Check in</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{place.name}</Text>
                <ScrollView style={{width: '100%', height: height * 0.35}}>
                    <Text style={styles.description}>Adress: {place.address}</Text>
                    <Text style={styles.description}>Admission: {place.admission}</Text>
                    <Text style={styles.description}>{place.history}</Text>
                    <Text style={styles.fact}>{place.touristInterest}</Text>
                    <View style={{height: 100}}/>
                </ScrollView>
            </View>
        </View>
        // </ImageBackground>
    );
};


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingTop: 0,
        paddingBottom: 30,
        backgroundColor: '#e3effa'
    },
    backIcon: {
        width: 65,
        height: 65,
        padding: 10,
        position: 'absolute',
        top: height * 0.052,
        left: 10,
        zIndex: 10
    },
    image: {
        width: '100%',
        height: height * 0.33,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        marginBottom: 16,
    },
    mapContainer: {
        width: '100%',
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    map: {
        width: "48%",
        height: height * 0.2,
        borderRadius: 10,
        overflow: 'hidden'
    },
    checkBtn: {
        width: "48%",
        height: height * 0.2,
        borderRadius: 10,
        backgroundColor: '#3D85C6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkBtnText: {
        color: "#0036b7",
        fontSize: 20,
        fontWeight: '900',
    },
    markerImage: {
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#0036b7'
    },
    textContainer: {
        paddingHorizontal: 16,
        width: '100%'
    },
    name: {
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 15,
        color: '#0036b7',
        textAlign: 'center'
    },
    description: {
        fontSize: 17,
        marginBottom: 10,
        color: '#3D85C6',
        textAlign: 'justify'
    },
    fact: {
        fontSize: 15,
        color: '#3D85C6',
        textAlign: 'justify'
    },
    visitedIcon: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: -5,
        right: -5,
        zIndex: 15,
    },
});

export default Details;
