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

export default class Exercise_Story2_Stage3 extends React.Component<ScreenProps, ScreenState> {
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

  async third() {
    await this.delay(1000);
    const jing = new Audio.Sound();
    await jing.loadAsync(require('../../../resource/story2/game.wav'));
    await jing.playAsync();
    await this.delay(2000);

    await this.state.soundObject.loadAsync(require('../../../resource/story2/story2_third.mp3'));
    await this.state.soundObject.playAsync();
    await this.delay(6500).then(()=>this.props.navigation.replace('Story_Tree2'));
  
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

    this.third()
    

    return (
      <ImageBackground
      style={{ width: "100%", height: "100%", opacity: 0.8 }}
      source={require('../../../../assets/icons/pattern3_2.png')} >
        <View style={styles.mainContainer}>
        <Text style={{ fontSize: width * 0.09, textAlign: 'center', color:'#FFFFFF' }}>퀘스트3 : 랜섬웨어 감염</Text>
        <Text style={{ fontSize: width * 0.08, textAlign: 'center', marginTop: 20 , color:'#FFFFFF' }}>- 균형을 잡아 랜섬웨어 방어 -</Text>
        <Image
          resizeMode="contain"
          style={{ width: width * 0.75, height: width * 0.7, marginTop: height * 0.02, marginBottom: height * 0.04 }}
          source={require('../../../../assets/icons/knight.png')} />
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
