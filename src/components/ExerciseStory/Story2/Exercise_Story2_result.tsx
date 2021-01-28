import React, { Component } from 'react';
import { StyleSheet, View, ImageBackground, Text, Dimensions } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';
//TTS
import { Audio } from 'expo-av';


interface ScreenProps {
  navigation: any;
}

interface ScreenState {
  soundObject?: Audio.Sound,
  soundObject2?:Audio.Sound,
  soundObject3?:Audio.Sound,
  soundObject4?:Audio.Sound,
  result?: String,
  tree_score: Number,
  squart_score: Number,
  standingside_score: Number,
  complete?:boolean
  complete2?:boolean,
  dark?:string
}

var tree_miss = 0;
var squart_miss = 0;
var standingside_miss = 0;



export default class Exercise_Story2 extends React.Component<ScreenProps, ScreenState> {
  rafID?: number;

  constructor(props: ScreenProps) {
    super(props);
  }
  state = {
    soundObject: null,
    soundObject2: null,
    soundObject3: null,
    soundObject4: null,
    result: '',
    tree_score: 0,
    standingside_score: 0,
    squart_score: 0,
    complete: false,
    complete2: false,
    dark:'false',
  }

  headerStyle = () => {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => this.props.navigation.navigate("exercise_story")}
           tintColor={this.state.dark=='false'?'black':'yellow'}
        />
      )
    })
  }

  async delay(how: number) {
    return new Promise(resolve => setTimeout(resolve, how));
  }


  async result() {

    /////////////////////////////get miss//////////////////////////////

    await AsyncStorage.getItem('squart_miss', (err, result) => {
      if (result == null) {
        squart_miss = 0
      } else {
        squart_miss = Number(result)
      }
    })

    await AsyncStorage.getItem('standingside_miss', (err, result) => {
      if (result == null) {
        standingside_miss = 0
      } else {
        standingside_miss = Number(result)
      }
    })

    await AsyncStorage.getItem('tree_miss', (err, result) => {
      if (result == null) {
        tree_miss = 0
      } else {
        tree_miss = Number(result)
      }
    })

    /////////////////////////////get score//////////////////////////////
    this.setState({ tree_score: Number(((100 * (1 - tree_miss / (15 + tree_miss)))).toFixed(0)) })
    this.setState({ squart_score: Number(((100 * (1 - squart_miss / (5 + squart_miss)))).toFixed(0)) })
    this.setState({ standingside_score: Number(((100 * (1 - standingside_miss / (8 + standingside_miss)))).toFixed(0)) })
    var sum = this.state.tree_score + this.state.squart_score + this.state.standingside_score

    /////////////////////////////합불//////////////////////////////
    if (sum >= 250) {
      this.setState({ result: 'success' })
    } else {
      this.setState({ result: 'fail' })
    }

    
    await this.state.soundObject4.loadAsync(require('../../../resource/story2/war.mp3'));
    await this.state.soundObject4.setStatusAsync({ volume: 0.1})
    await this.state.soundObject4.playAsync();

    if (this.state.result == 'success') {
      if( this.props.navigation.isFocused()){
        await this.delay(500)
        await this.state.soundObject.loadAsync(require('../../../resource/story2/story2_result.mp3'));
        await this.state.soundObject.playAsync();
        await this.delay(5000)}
        if( this.props.navigation.isFocused()){
        await this.state.soundObject2.loadAsync(require('../../../resource/story1/_drum.mp3'));
        await this.state.soundObject2.setStatusAsync({ volume: 0.7})
        await this.state.soundObject2.playAsync();
        }
        await this.setState({complete2:true});
        await this.delay(5200)
        await this.setState({complete:true});
        if( this.props.navigation.isFocused()){
        await this.state.soundObject3.loadAsync(require('../../../resource/story1/_success.mp3'));
        await this.state.soundObject3.setStatusAsync({ volume: 0.55})
        await this.state.soundObject3.playAsync();
        await this.state.soundObject4.loadAsync(require('../../../resource/story2/story2_success_finish.mp3'));
        await this.state.soundObject4.setStatusAsync({ volume: 0.55})
        await this.state.soundObject4.playAsync();
        
        }
    } else if (this.state.result = 'fail') {
      if( this.props.navigation.isFocused()){
        await this.delay(500)
        await this.state.soundObject.loadAsync(require('../../../resource/story2/story2_result.mp3'));
        await this.state.soundObject.playAsync();
        await this.delay(5000);}

        if( this.props.navigation.isFocused()){
        await this.state.soundObject2.loadAsync(require('../../../resource/story1/_drum.mp3'));
        await this.state.soundObject2.setStatusAsync({ volume: 0.7})
        await this.state.soundObject2.playAsync();
        }
        await this.setState({complete2:true});
        await this.delay(5200)
        await this.setState({complete:true});
        if( this.props.navigation.isFocused()){
        await this.state.soundObject3.loadAsync(require('../../../resource/story1/_fail.mp3'));
        await this.state.soundObject3.setStatusAsync({ volume: 0.6})
        await this.state.soundObject3.playAsync();
        await this.state.soundObject4.loadAsync(require('../../../resource/story2/story2_fail_finish.mp3'));
        await this.state.soundObject4.setStatusAsync({ volume: 0.55})
        await this.state.soundObject4.playAsync();
        
        }
    }

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
    this.setState({ soundObject })

    const soundObject2 = new Audio.Sound();
    this.setState({ soundObject2 })
    
    const soundObject3 = new Audio.Sound();
    this.setState({ soundObject3 })

    const soundObject4 = new Audio.Sound();
    this.setState({ soundObject4 })

    this.result()
  }

  componentWillUnmount() {
    this.state.soundObject.unloadAsync();
    this.state.soundObject2.unloadAsync();
    this.state.soundObject3.unloadAsync();
    this.state.soundObject4.unloadAsync();
  }


  render() {
    this.headerStyle();

    const final_fail =
      <ImageBackground
        style={{ width: "100%", height: "100%", opacity: 0.8 }}
        source={require('../../../../assets/icons/pattern3_2.png')} >
        <View style={styles.mainContainer}>
          <Text style={{ fontSize: width * 0.13, textAlign: 'center', fontWeight: 'bold' , color:'#FFFFFF' }}>퀘스트 결과</Text>
          <Text style={{ fontSize: width * 0.08, textAlign: 'center', marginTop: 50, marginBottom: height * 0.01 , color:'#FFFFFF' }}>퀘스트1 : {`${this.state.squart_score}`}</Text>
          <Text style={{ fontSize: width * 0.08, textAlign: 'center', marginTop: 20, marginBottom: height * 0.01 , color:'#FFFFFF' }}>퀘스트2 : {`${this.state.standingside_score}`}</Text>
          <Text style={{ fontSize: width * 0.08, textAlign: 'center', marginTop: 20, marginBottom: height * 0.01 , color:'#FFFFFF' }}>퀘스트3 : {`${this.state.tree_score}`}</Text>
          <Text style={{ fontSize: width * 0.083, fontWeight: 'bold', textAlign: 'center', marginTop: 20, marginBottom: height * 0.05 , color:'#FFFFFF'}}>
          {this.state.complete2?'총점 : '+(this.state.tree_score + this.state.squart_score + this.state.standingside_score)+'점':''}</Text>
          <Text style={{ fontSize: width * 0.13, textAlign: 'center', fontWeight: 'bold' , color:'#FFFFFF'}}>{this.state.complete?'실패':''}</Text>
        </View>
      </ImageBackground>

    const final_success =
      <ImageBackground
        style={{ width: "100%", height: "100%", opacity: 0.8 }}
        source={require('../../../../assets/icons/pattern3_2.png')} >
        <View style={styles.mainContainer}>
          <Text style={{ fontSize: width * 0.13, textAlign: 'center', fontWeight: 'bold' , color:'#FFFFFF'}}>퀘스트 결과</Text>
          <Text style={{ fontSize: width * 0.08, textAlign: 'center', marginTop: 50, marginBottom: height * 0.01 , color:'#FFFFFF' }}>퀘스트1 : {`${this.state.squart_score}`}</Text>
          <Text style={{ fontSize: width * 0.08, textAlign: 'center', marginTop: 20, marginBottom: height * 0.01 , color:'#FFFFFF' }}>퀘스트2 : {`${this.state.standingside_score}`}</Text>
          <Text style={{ fontSize: width * 0.08, textAlign: 'center', marginTop: 20, marginBottom: height * 0.01 , color:'#FFFFFF'}}>퀘스트3 : {`${this.state.tree_score}`}</Text>
          <Text style={{ fontSize: width * 0.083, fontWeight: 'bold', textAlign: 'center', marginTop: 20, marginBottom: height * 0.05 , color:'#FFFFFF'}}>
          {this.state.complete2?'총점 : '+(this.state.tree_score + this.state.squart_score + this.state.standingside_score)+'점':''}</Text>
            <Text style={{ fontSize: width * 0.13, textAlign: 'center', fontWeight: 'bold' , color:'#FFFFFF'}}>{this.state.complete?'성공':''}</Text>
        </View>
      </ImageBackground>



    return (
      this.state.result == 'success' ? final_success : final_fail
    );
  }

}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: height * 0.15,
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
