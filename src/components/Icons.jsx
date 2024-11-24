import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Icons = ({ type }) => {

  let imageSource;
  let iconStyle = [styles.icon];

  switch (type) {
    case 'check':
        imageSource = require('../assets/icons/check.png');
        break;
    case 'close':
        imageSource = require('../assets/icons/close.png');
        iconStyle.push(styles.green);
        break;
    case 'back':
        imageSource = require('../assets/icons/back.png');
        iconStyle.push(styles.green);
        break;
    case 'image':
        imageSource = require('../assets/icons/image.png');
        iconStyle.push(styles.green);
        break;
    case 'visited':
        imageSource = require('../assets/icons/visited.png');
        break;
  }

  return (
    <Image 
      source={imageSource} 
      style={iconStyle} 
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  green: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    tintColor: '#7fae6e'
  }
});

export default Icons;
