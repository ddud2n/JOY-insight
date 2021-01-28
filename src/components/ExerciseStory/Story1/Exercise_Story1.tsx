import React, { Component } from 'react';
import { StyleSheet, View, ImageBackground, Text, Image, Dimensions, Button } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';

//TTS
import { Audio } from 'expo-av';
import { TouchableOpacity } from 'react-native-gesture-handler';


interface ScreenProps {
  navigation: any;
}

interface ScreenState {
  soundObject?:Audio.Sound
  soundObject2?:Audio.Sound
  dark?:string
}

export default class Exercise_Story1 extends React.Component<ScreenProps, ScreenState> {
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


  async intro() {
    await this.state.soundObject2.loadAsync(require('../../../resource/story1/_Beautiful_Korea.mp3'));
    await this.state.soundObject2.setStatusAsync({ volume: 0.1})
    await this.state.soundObject2.playAsync();
    await this.delay(4000);
    if( this.props.navigation.isFocused()){
    await this.state.soundObject.loadAsync(require('../../../resource/story1/story1_intro.mp3'));
    await this.state.soundObject.setStatusAsync({ volume: 1.0})
    await this.state.soundObject.playAsync();}
  }

 async doPlay() {
    const soundObject3 = new Audio.Sound();
    await soundObject3.loadAsync(require('../../../resource/story1/story1_start.mp3'));
    await soundObject3.playAsync()
    await soundObject3.unloadAsync();
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
    this.state.soundObject.unloadAsync();
    this.state.soundObject2.unloadAsync();
  }
  

  render() {

    this.headerStyle();

    this.intro()
    



    return (
      <ImageBackground
        style={{ width: '100%', height: '100%', opacity: 0.8, justifyContent: 'center' }}
        source={require('../../../../assets/icons/pattern3.png')}
        >
        <Text style={{ fontSize: width * 0.15, textAlign: 'center', fontWeight: 'bold' }}>무과시험 도전!</Text>
        <Text style={{ fontSize: width * 0.1, marginTop: height * 0.03, marginLeft: '15%' }}>제1과목 : 활쏘기</Text>
        <Text style={{ fontSize: width * 0.1, marginTop: height * 0.014, marginLeft: '15%' }}>제2과목 : 마상무예</Text>
        <Text style={{ fontSize: width * 0.1, marginVertical: height * 0.014, marginLeft: '15%' }}>제3과목 : 격구</Text>
        <TouchableOpacity style={styles.TouchableStyle}
          onPress={() => {  this.doPlay(); this.props.navigation.replace('exercise_guide_story1'); }}>
          <Text style={{ fontSize: height * 0.05, fontWeight: 'bold', textAlign: 'center' }}>도전하기</Text>
        </TouchableOpacity>
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
