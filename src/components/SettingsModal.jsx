import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, 
    KeyboardAvoidingView, Keyboard, Alert, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { useMusic } from '../constants/music.js';
import Icons from './Icons';

const { height, width } = Dimensions.get('window');

const SettingsModal = ({ visible, onClose }) => {
    const [name, setName] = useState("");
    const [uploadedImage, setUploadedImage] = useState({ uri: Image.resolveAssetSource(require('../assets/avatar/user.png')).uri });
    const [buttonText, setButtonText] = useState("Create account");
    const [errorMessage, setErrorMessage] = useState("");
    const { isPlaying, togglePlay } = useMusic();
    const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  
    useEffect(() => {
      const loadProfile = async () => {
        try {
          const storedName = await AsyncStorage.getItem('userProfile');
          const storedImageUri = await AsyncStorage.getItem('uploadedImage');
  
          if (storedName) {
            setName(storedName);
            setButtonText("Save changes");
          } else {
            setName("");
            setButtonText("Create account");
          }
  
          if (storedImageUri) {
            setUploadedImage({ uri: storedImageUri });
          } else {
            setUploadedImage({ uri: Image.resolveAssetSource(require('../assets/avatar/user.png')).uri });
          }
  
          setErrorMessage("");
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      };
  
      if (visible) {
        loadProfile();
      }
    }, [visible]);
  
    const handleNameChange = (text) => {
      setName(text);
    };
  
    const handleSubmit = async () => {
      if (name.length > 20) {
        setErrorMessage("Name cannot exceed 20 characters.");
        return;
      }
  
      try {
        await AsyncStorage.setItem('userProfile', name);
  
        if (uploadedImage.uri) {
          await AsyncStorage.setItem('uploadedImage', uploadedImage.uri);
      }
  
        console.log('User profile saved successfully!');
        setButtonText("Save changes");
        onClose();
      } catch (error) {
        console.error('Error saving user profile:', error);
      }
    };
  
  
    const uploadImageFromLibrary = () => {
      launchImageLibrary(
        { mediaType: 'photo', quality: 1 },
        (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.errorMessage) {
            Alert.alert('Error', response.errorMessage);
          } else {
            const imageUri = response.assets[0].uri;
            setUploadedImage({uri: imageUri});
          }
        }
      );
    };

    const handleToggleLoudness = async () => {
        togglePlay();
    };

    const handleReset = async () => {
      try {
          await AsyncStorage.removeItem('purchasedPlaces');
          await AsyncStorage.removeItem('visitedTrips');
          await AsyncStorage.removeItem('userProfile');
          await AsyncStorage.removeItem('uploadedImage');
          await AsyncStorage.removeItem('score');
          await AsyncStorage.removeItem('plan');

          Alert.alert('Success', 'All trip data has been reset.');
      } catch (error) {
          Alert.alert('Error', 'Failed to reset data: ' + error.message);
      }
  };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
            <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                <View style={styles.modalContent}>
                    {showResetConfirmation ? (
                        <>
                            <Text style={styles.confirmationText}>
                                Are you sure you want to reset your progress? It will reset your account along with your achievements, collected places, score, and plans!
                            </Text>
                            <TouchableOpacity style={[styles.resetBtn, {marginTop: 0}]} onPress={handleReset}>
                                <Text style={styles.resetBtnText}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelReset} onPress={() => setShowResetConfirmation(false)}>
                                <Text style={styles.cancelBtnText}>Close</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Icons type="close" />
                            </TouchableOpacity>

                            <ScrollView style={{width: '100%'}}>
                                <Text style={styles.modalTitle}>Settings</Text>

                                <View style={styles.upperContainer}>
                                    <View style={[styles.avatarPlaceholder, uploadedImage && styles.imagePlaceholder]}>
                                        <Image source={uploadedImage} style={styles.uploadedAvatarImage} />
                                    </View>
                                    <TouchableOpacity style={styles.btnUploadImage} onPress={uploadImageFromLibrary}>
                                        <Text style={styles.btnText}>Upload photo</Text>
                                    </TouchableOpacity>

                                    <View style={styles.inputContainer}>
                                    <TextInput
                                        value={name}
                                        placeholder="Enter your name"
                                        placeholderTextColor="#2b790e"
                                        onChangeText={handleNameChange}
                                        style={styles.input}
                                    />
                                    {errorMessage ? (
                                        <Text style={styles.errorText}>{errorMessage}</Text>
                                    ) : null}
                                    <TouchableOpacity style={styles.btnCreate} onPress={handleSubmit}>
                                        <Text style={styles.btnCreateText}>{buttonText}</Text>
                                    </TouchableOpacity>
                                    </View>

                                </View>

                                <View style={styles.regulatorContainer}>
                                    <Text style={styles.regulatorText}>Loudness</Text>
                                    <Text style={[styles.toggleText, isPlaying ? styles.toggleTextOn : styles.toggleTextOff]}>
                                        {isPlaying ? 'On' : 'Off'}
                                    </Text>
                                    <TouchableOpacity style={[styles.toggleContainer, isPlaying ? styles.toggleContainer : styles.toggleContainerOff]} onPress={handleToggleLoudness}>
                                        <View style={[styles.toggle, isPlaying ? styles.toggleOn : styles.toggleOff]}></View>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity style={styles.resetBtn} onPress={() => setShowResetConfirmation(true)}>
                                    <Text style={styles.resetBtnText}>Reset</Text>
                                </TouchableOpacity>
                            </ScrollView>

                        </>
                    )}
                </View>
                </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingTop: height * 0.1,
        padding: 25
    },
    modalContent: {
        width: '100%',
        height: '90%',
        padding: 5,
        paddingVertical: 40,
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,

    },
    modalTitle: {
        fontWeight: '900',
        fontSize: 28,
        textAlign: 'center',
        marginBottom: 20,
        color: '#7fae6e'
    },
    regulatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    regulatorText: {
        fontSize: 22,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#2b790e'
    },
    toggleContainer: {
        padding: 7,
        width: 100,
        height: 50,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#2b790e',
    },
    toggleContainerOff: {
        borderColor: '#ccc',
    },
    toggleText: {
        fontSize: 16,
    },
    toggleTextOn: {
        color: '#2b790e',
    },
    toggleTextOff: {
        color: '#ccc',
    },
    toggle: {
        borderRadius: 30,
        width: '45%',
        height: '100%',
    },
    toggleOn: {
        backgroundColor: '#2b790e',
        alignSelf: 'flex-end',
    },
    toggleOff: {
        backgroundColor: '#ccc',
        alignSelf: 'flex-start',
    },
    closeButton: {
        padding: 10,
        width: 40,
        height: 40,
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10
    },
    shareBtn: {
        width: '100%',
        backgroundColor: '#2b790e',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        marginTop: 60,
    },
    cancelBtnText: {
        fontSize: 19,
        fontWeight: '500',
        color: '#fff',
    },
    resetBtn: {
        width: width * 0.7,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#7fae6e',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    resetBtnText: {
        color: '#7fae6e',
        fontSize: 19,
        fontWeight: '500',
    },
    confirmationText: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 60,
        color: '#3C3C3B'
    },
    cancelReset: {
        width: width * 0.7,
        backgroundColor: '#7fae6e',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },

    upperContainer: {
        width: "100%",
        padding: 20,
        alignItems: "center"
      }, 
    
      title: {
        fontSize: 30,
        fontWeight: "900",
        marginBottom: 20,
        marginTop: -15,
        color: '#7fae6e'
      },
    
      avatarPlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 100,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginBottom: 20
      },
    
      imagePlaceholder: {
        padding: 0
      },
    
      uploadedAvatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
      },
    
      inputContainer: {
        width: "100%",
        justifyContent: "space-between"
      },
    
      input: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: height * 0.05,
        borderWidth: 1,
        borderColor: "#7fae6e",
        borderRadius: 10,
        width: "100%",
        fontSize: 17,
        color: '#7fae6e',
        marginBottom: 20,
      },
    
      btnCreate: {
        width: "100%",
        alignItems: "center",
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#2b790e',
      },
    
      btnCreateText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '500'
      },
    
      btnText: {
        fontSize: 18,
        color: '#7fae6e',
        fontWeight: '500'
      },
    
      btnUploadImage: {
        padding: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#2b790e',
        borderRadius: 10,
        width: '100%'
      },
    
      errorText: {
        color: '#e1251b',
        fontSize: 14,
        position: 'absolute',
        top: 100
      }
    
});

export default SettingsModal;
