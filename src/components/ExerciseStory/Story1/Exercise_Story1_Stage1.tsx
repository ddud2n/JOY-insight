import React, { Component } from 'react';
import { StyleSheet, View, ImageBackground, Text, Image, Dimensions, Button } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';

//TTS
import { Audio } from 'expo-av';


interface ScreenProps {
  navigation: any;
}

interface ScreenState {
  soundObject?:Audio.Sound
  soundObject2?:Audio.Sound
  dark?:string
}

export default class Exercise_Story1_Stage1 extends React.Component<ScreenProps, ScreenState> {
  rafID?: number;

  headerStyle = () => {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => this.props.navigation.replace('exercise_story')}
           tintColor={this.state.dark=='false'?'black':'yellow'}
        />
      )
    })
  }

  async delay(how: number) {
    return new Promise(resolve => setTimeout(resolve, how));
  }


  async first() {
    await this.delay(500);
    await this.state.soundObject.loadAsync(require('../../../resource/story1/_jing2.wav'));
    await this.state.soundObject.playAsync();
    await this.delay(2000);

    await this.state.soundObject2.loadAsync(require('../../../resource/story1/story1_first.mp3'));
    await this.state.soundObject2.playAsync();
    await this.delay(6500).then(()=>this.props.navigation.replace('Story_Tree'));
  }

  UNSAFE_componentWillMount() {
    AsyncStorage.getItem('dark', (err, result) => {
      if (result == null) {
        this.setState({dark:'false'})
      } else {
        this.setState({dark:result})
      }
    })
    
    const soundObject = new Audio.Sound();
    this.setState({soundObject})

    const soundObject2 = new Audio.Sound();
    this.setState({soundObject2})
  }

  componentWillUnmount() {
    this.state.soundObject.stopAsync();
    this.state.soundObject2.stopAsync();

    this.state.soundObject.unloadAsync();
    this.state.soundObject2.unloadAsync();
  }
  

  render() {

    this.headerStyle();

    this.first()
    

    return (
      <ImageBackground
        style={{ width: "100%", height: "100%", opacity: 0.8 }}
        source={require('../../../../assets/icons/pattern3.png')} >
        <View style={styles.mainContainer}>
          <Text style={{ fontSize: width * 0.13, textAlign: 'center' }}>제1과목 : 활쏘기</Text>
          <Text style={{ fontSize: width * 0.08, textAlign: 'center', marginTop: 20 }}>- 팔과 어깨 근력훈련 -</Text>
          <Image
            resizeMode="contain"
            style={{ width: width * 0.75, height: width * 0.7, marginTop: height * 0.02, marginBottom: height * 0.04 }}
            source={require('../../../../assets/icons/arrow.jpg')} />
        </View>
      </ImageBackground>
    );
  }

}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  sectionContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200
  },
  cameraContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  TouchableStyle: {
    backgroundColor: 'red',
    marginTop: height * 0.04,
    marginHorizontal: width * 0.2,
    height: height * 0.12,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 }, //그림자 위치
    elevation: 9,
  },
});
