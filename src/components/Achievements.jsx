import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import places from '../constants/places';
import Icons from './Icons';

const { width, height } = Dimensions.get('window');

const Achievements = () => {
  const navigation = useNavigation();
  const [visitedTrips, setVisitedTrips] = useState([]);
  const [purchasedPlaces, setPurchasedPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const storedVisitedTrips = await AsyncStorage.getItem('visitedTrips');
        const visitedTripsArray = storedVisitedTrips ? JSON.parse(storedVisitedTrips) : [];
        setVisitedTrips(visitedTripsArray);

        const storedPurchasedPlaces = await AsyncStorage.getItem('purchasedPlaces');
        const purchasedPlacesArray = storedPurchasedPlaces ? JSON.parse(storedPurchasedPlaces) : [];
        setPurchasedPlaces(purchasedPlacesArray);
      } catch (error) {
        Alert.alert('Error', 'Could not load visited trips or purchased places: ' + error.message);
      }
    };

    fetchPlaces();
  }, []);

  const handleDetailsPress = (place) => {
    navigation.navigate('DetailsScreen', { place });
  };

  const handleBackPress = () => {
    navigation.navigate('HomeScreen');
  };

  const isVisited = (placeName) => {
    return visitedTrips.some((trip) => trip.place.name === placeName);
  };

  const renderPlace = ({ item }) => {
    const visited = isVisited(item.name);

    return (
      <View style={styles.placeContainer}>
        <Image
          source={item.image}
          style={[
            styles.placeImage,
            visited && styles.visitedBorder,
          ]}
        />
        <Text style={styles.placeName}>{item.name}</Text>
        <TouchableOpacity
          style={[
            styles.detailsButton,
            visited && styles.visitedButton,
          ]}
          onPress={() => handleDetailsPress(item)}
        >
          <Text style={styles.detailsButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const combinedPlaces = [...places, ...purchasedPlaces];

  return (
    <ImageBackground source={require('../assets/newDiz/back.png')} style={{ flex: 1 }}>
    <View style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={handleBackPress}>
        <Icons type={'back'} />
      </TouchableOpacity>
      <Text style={styles.title}>Achievements</Text>
      <FlatList
        data={combinedPlaces}
        keyExtractor={(item) => item.name}
        renderItem={renderPlace}
        contentContainerStyle={styles.list}
      />
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: height * 0.07,
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
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 30,
    color: '#7fae6e',
    width: width * 0.8,
    textAlign: 'center',
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  list: {
    alignItems: 'center',
    width: '100%',
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
  visitedBorder: {
    borderColor: '#ffc000',
  },
  placeName: {
    marginTop: 10,
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    color: '#aac99e',
  },
  detailsButton: {
    marginTop: 10,
    backgroundColor: '#00b967',
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  visitedButton: {
    backgroundColor: '#ffc000',
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
  },
});

export default Achievements;
