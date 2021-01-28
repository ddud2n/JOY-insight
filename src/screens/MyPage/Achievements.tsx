import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Alert, ScrollView, Dimensions} from 'react-native';
import * as Progress from 'react-native-progress';
//import { useCount } from './count'
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  navigation: any,
  route: any,
}
var BackBack=0;
var BellyBomb=0;
var ChestOpener=0;
var RussianTwist=0;
var SideBomb=0;
var Squart=0;
var Standingside=0;
var Tree=0;


const {width, height} = Dimensions.get('window');
const AUTORENDER = true;

export default class Achievements extends React.Component<Props> {
  rafID?: number;
  
  state={
    dark:'false'
  }

  headerStyle = () => {
    this.props.navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity

            onPress={() => 
              Alert.alert(
                '도움말','\n현재 페이지는 [마이페이지]-[업적] 페이지입니다.\n업적마다 서로 다른 완료 조건을 만족시켜 업적을 달성해보세요!',
                [{ text: "확인" }],
                
              )}
            
            accessibilityLabel='도움말'
          >
            <Image 
            style={{width: 30, height: 30, marginRight:10}}
 source={this.state.dark=='false'?require('../../../assets/icons/help_black.png'):require('../../../assets/icons/help_yellow.png')} />
          </TouchableOpacity>
        )
    })
  }
  
  UNSAFE_componentWillMount(){
    AsyncStorage.getItem('dark', (err, result) => {
      if (result == null) {
        this.setState({dark:'false'})
      } else {
        this.setState({dark:result})
      }
    })
  }


  render() {
    this.headerStyle();

    AsyncStorage.getItem('BackBack', (err, result) => {
      if(result==null){ }
      else{
        BackBack=Number(result)
      }
    }),
    AsyncStorage.getItem('BellyBomb', (err, result) => {
      if(result==null){
      }
      else{
        BellyBomb=Number(result)
      }
    }),
    AsyncStorage.getItem('ChestOpener', (err, result) => {
      if(result==null){
      }
      else{
        ChestOpener=Number(result)
      }
    }),
    AsyncStorage.getItem('RussianTwist', (err, result) => {
      if(result==null){
      }
      else{
        RussianTwist=Number(result)
      }
    }),
    AsyncStorage.getItem('SideBomb', (err, result) => {
      if(result==null){
      }
      else{
        SideBomb=Number(result)
      }
    }),
    AsyncStorage.getItem('Squart', (err, result) => {
      if(result==null){
      }
      else{
        Squart=Number(result)
      }
    }),
    AsyncStorage.getItem('Standingside', (err, result) => {
      if(result==null){
      }
      else{
        Standingside=Number(result)
      }
    }),
    AsyncStorage.getItem('SideBomb', (err, result) => {
      if(result==null){
      }
      else{
        SideBomb=Number(result)
      }
    }),
    AsyncStorage.getItem('Tree', (err, result) => {
      if(result==null){
      }
      else{
        Tree=Number(result)
      }
    })
    if(Squart>=500){
      var achievement1='업적 달성 완료!'
    }
    else{
      var achievement1='완료 조건 500회 중 '+Squart.toString()+' 회 완료'
    }
    if((Tree/60)>=100){
      var achievement2='업적 달성 완료!'
    }
    else{
      var achievement2='완료 조건 100분 중 '+(Tree/60).toFixed(1).toString()+' 분 완료'
    }
    if(SideBomb+BellyBomb>=500){
      var achievement3='업적 달성 완료!'
    }
    else{
      var achievement3='완료 조건 사이드밤, 밸리밤 500회 중 '+(SideBomb+BellyBomb).toString()+' 회 완료'
    }
    if((RussianTwist+ChestOpener)>=500){
      var achievement4='업적 달성 완료!'
    }
    else{
      var achievement4='완료 조건 러시안트위스트, 체스트 오프너 500회 중 '+(RussianTwist+ChestOpener).toString()+' 회 완료'
    }
    return (
      <ScrollView style={this.state.dark=='false'?styles.mainContainer:styles.mainContainer_dark}>

          <View style={{height: height*0.08,justifyContent:'center', paddingLeft:13, flex:0.4}}>
            <Text style={{fontSize:width*0.07, fontWeight:'700', color:this.state.dark=='false'?'black':'yellow'}}>업적 리스트</Text>
          </View>

          <View style={this.state.dark=='false'?styles.TouchableStyle:styles.TouchableStyle_dark}>
            <Text style={{fontSize:width*0.05, color:this.state.dark=='false'?'black':'yellow'}}>스쿼트 마스터</Text>
            <Progress.Bar progress={Squart/500} width={width*0.7} height={height*0.03}/>
            <Text style={{fontSize:width*0.03, color:this.state.dark=='false'?'black':'yellow'}}>{achievement1}</Text>
          </View>

          <View style={this.state.dark=='false'?styles.TouchableStyle:styles.TouchableStyle_dark}>
            <Text style={{fontSize:width*0.05, color:this.state.dark=='false'?'black':'yellow'}}>나무 따라하기 마스터</Text>
            <Progress.Bar progress={Tree/6000} width={width*0.7} height={height*0.03}/>
            <Text style={{fontSize:width*0.03, color:this.state.dark=='false'?'black':'yellow'}}>{achievement2}</Text>
          </View>

          <View style={this.state.dark=='false'?styles.TouchableStyle:styles.TouchableStyle_dark}>
            <Text style={{fontSize:width*0.05, color:this.state.dark=='false'?'black':'yellow'}}>밤 베테랑</Text>
            <Progress.Bar progress={(BellyBomb+SideBomb)/500} width={width*0.7} height={height*0.03}/>
            <Text style={{fontSize:width*0.03, color:this.state.dark=='false'?'black':'yellow'}}>{achievement3}</Text>
          </View>

          <View style={this.state.dark=='false'?styles.TouchableStyle:styles.TouchableStyle_dark}>
            <Text style={{fontSize:width*0.05, color:this.state.dark=='false'?'black':'yellow'}}>앉아서 운동하기 베테랑</Text>
            <Progress.Bar progress={(RussianTwist+ChestOpener)/500} width={width*0.7} height={height*0.03}/>
            <Text style={{fontSize:width*0.03, color:this.state.dark=='false'?'black':'yellow'}}>{achievement4}</Text>
          </View>
          
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ddf7f7',
    height: '100%', 
  },
  TouchableStyle: {
    height:height*0.14,
    alignContent:'center',
    justifyContent:'space-evenly',
    backgroundColor: 'white',
    marginVertical: '1%',
    flex: 1,
    paddingLeft: 13,
    paddingVertical:5,
    marginBottom:height*0.01
  },
  mainContainer_dark: {
    height: '100%',
    backgroundColor: '#434248',
      
  },
  TouchableStyle_dark: {
    backgroundColor: '#0d0d0d',
    marginTop: height*0.015,
    marginHorizontal:width*0.03,
    height:height*0.12,
    borderRadius:10,
    justifyContent:'center',
    paddingLeft:width*0.04,
  },
  touchableText:{
    fontSize: width*0.08,
    textAlignVertical:'center'
  },
  buttonText: {
    fontSize: 45,
    fontWeight: '700',
  },
  TitleText: {
    fontSize: 40,
    fontWeight: 'bold'
  }

});
