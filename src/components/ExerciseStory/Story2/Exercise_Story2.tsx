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

export default class Exercise_Story2 extends React.Component<ScreenProps, ScreenState> {
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

    await this.state.soundObject2.loadAsync(require('../../../resource/story2/war.mp3'));
    await this.state.soundObject2.setStatusAsync({ volume: 0.3})
    await this.state.soundObject2.playAsync();
    await this.delay(4000);
    if( this.props.navigation.isFocused()){

    await this.state.soundObject.loadAsync(require('../../../resource/story2/story2_intro.mp3'));
    await this.state.soundObject.setStatusAsync({ volume: 1.0})
    await this.state.soundObject.playAsync();}
  }

 async doPlay() {
    const soundObject3 = new Audio.Sound();
    await soundObject3.loadAsync(require('../../../resource/story2/story2_start.mp3'));
    await soundObject3.playAsync()
    await this.delay(2000);
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
        source={require('../../../../assets/icons/pattern3_2.png')}
        >
        <Text style={{ fontSize: width * 0.15, textAlign: 'center', fontWeight: 'bold' , color:'#FFFFFF' }}>에러월드 용사가 되어주세요!</Text>
        <Text style={{ fontSize: width * 0.06, marginTop: height * 0.03, marginLeft: '15%', color:'white'}}>퀘스트1 : 기어다니는 버그 죽이기</Text>
        <Text style={{ fontSize: width * 0.06, marginTop: height * 0.014, marginLeft: '15%' , color:'white'}}>퀘스트2 : 달라붙은 버그</Text>
        <Text style={{ fontSize: width * 0.06, marginVertical: height * 0.014, marginLeft: '15%' , color:'white'}}>퀘스트3 : 랜섬웨어공격 방어</Text>
        <TouchableOpacity style={styles.TouchableStyle}
          onPress={() => {  this.doPlay(); this.props.navigation.replace('exercise_guide_story2'); }}>
          <Text style={{ fontSize: height * 0.04, fontWeight: 'bold', textAlign: 'center' }}>에러월드 구하기</Text>
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
