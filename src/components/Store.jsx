import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../constants/store';
import Icons from './Icons';

const { width, height } = Dimensions.get('window');

const Store = () => {
  const [visitedTrips, setVisitedTrips] = useState([]);
  const [score, setScore] = useState(0);
  const [purchasedPlaces, setPurchasedPlaces] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchVisitedTripsAndScore = async () => {
      try {
        const storedVisitedTrips = await AsyncStorage.getItem('visitedTrips');
        const visitedTripsArray = storedVisitedTrips ? JSON.parse(storedVisitedTrips) : [];
        setVisitedTrips(visitedTripsArray);

        const storedScore = await AsyncStorage.getItem('score');
        setScore(storedScore ? parseInt(storedScore, 10) : 0);

        const storedPurchasedPlaces = await AsyncStorage.getItem('purchasedPlaces');
        const purchasedPlacesArray = storedPurchasedPlaces ? JSON.parse(storedPurchasedPlaces) : [];
        setPurchasedPlaces(purchasedPlacesArray);
      } catch (error) {
        Alert.alert('Error', 'Could not load data: ' + error.message);
      }
    };

    fetchVisitedTripsAndScore();
  }, []);

  const handleBackPress = () => {
    navigation.navigate('HomeScreen');
  };

  const handleBuy = async (item) => {
    if (score < 2000) {
      Alert.alert('Insufficient Score', 'You need at least 2000 points to make a purchase.');
      return;
    }

    try {
      const updatedScore = score - 2000;
      await AsyncStorage.setItem('score', updatedScore.toString());
      setScore(updatedScore);

      const newPurchasedPlaces = [...purchasedPlaces, item];
      setPurchasedPlaces(newPurchasedPlaces);
      await AsyncStorage.setItem('purchasedPlaces', JSON.stringify(newPurchasedPlaces));

      Alert.alert('Purchase Successful', `${item.name} has been added to your Achievements !`);
    } catch (error) {
      Alert.alert('Error', 'Could not complete the purchase: ' + error.message);
    }
  };

  const isVisited = (placeName) => {
    return visitedTrips.some((trip) => trip.place.name === placeName);
  };

  const isPurchased = (placeName) => {
    return purchasedPlaces.some((place) => place.name === placeName);
  };

  const renderPlace = ({ item }) => {
    const visited = isVisited(item.name);
    const purchased = isPurchased(item.name);
    const canBuy = score >= 2000 && !purchased;

    return (
      <View style={styles.placeContainer}>
        <Image
          source={item.image}
          style={[
            styles.placeImage,
            visited && styles.visitedBorder,
            purchased && styles.purchasedBorder,
          ]}
        />
        <Text style={styles.placeName}>{item.name}</Text>
        <TouchableOpacity
          style={[styles.buyButton, !canBuy && styles.disabledButton, purchased && styles.purchasedButton]}
          onPress={() => canBuy && handleBuy(item)}
          disabled={!canBuy}
        >
          <Text style={styles.buyButtonText}>
            {purchased ? 'Purchased' : '2000'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ImageBackground source={require('../assets/newDiz/back.png')} style={{ flex: 1 }}>
    <View style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={handleBackPress}>
        <Icons type={'back'} />
      </TouchableOpacity>
      <Text style={styles.title}>Store</Text>
      <Text style={styles.scoreText}>Your Score: {score}</Text>
      <FlatList
        data={store}
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
    marginBottom: 10,
    color: '#7fae6e',
    width: width * 0.8,
    textAlign: 'center',
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#aac99e',
    marginBottom: 20,
    textAlign: 'center',
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
  purchasedBorder: {
    borderColor: '#4CAF50',
  },
  placeName: {
    marginTop: 10,
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    color: '#aac99e',
  },
  buyButton: {
    marginTop: 10,
    backgroundColor: '#02ae53',
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  purchasedButton: {
    backgroundColor: '#4CAF50',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
  },
});

export default Store;
