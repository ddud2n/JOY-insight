import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import {HeaderBackButton} from 'react-navigation-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Props {
  navigation: any,
  route: any,
}


const AUTORENDER = true;

export default class Explain_ChestOpener extends React.Component<Props> {
  rafID?: number;

  state={
    dark: 'false',
  }

  headerStyle = () => {
    this.props.navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity

            onPress={() => 
              Alert.alert(
                '도움말','체스트 오프너 동작에 대한 자세한 설명을 제공하는 페이지입니다. 체스트 오프너에 대한 설명을 통해 정확한 자세를 익혀보세요.',
                [{ text: "확인" }]
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


    return (
      <ScrollView style={this.state.dark=='false'?styles.mainContainer:styles.mainContainer_dark} bounces={true}>
          <View style={styles.sectionContainer}>
            <Text style={{fontSize:20, fontWeight:'700'}}>왼편으로 45도 돌아서 앉아주세요. 두 손을 주먹쥔 채로 팔을 양쪽으로 벌려주세요.</Text>
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={{fontSize:20, fontWeight:'700'}}>그 상태에서 팔을 90도로 굽혀 주먹이 하늘을 향하도록 해주세요. 이것이 기본 자세입니다.</Text>
          </View>

          
          <View style={styles.sectionContainer}>
            <Text style={{fontSize:20, fontWeight:'700'}}>그 상태에서 양 팔을 붙여 얼굴 앞으로 모아주세요. 반복해주세요.</Text>
          </View>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    backgroundColor: '#ddf7f7',
      
  },
  mainContainer_dark: {
    height: '100%',
    backgroundColor: '#434248',
      
  },
  sectionContainer: {
    backgroundColor: 'white',
    justifyContent:'center',
    padding:10,
    borderRadius:10,
    marginHorizontal:10,
    marginTop:10,
  },
  buttonText: {
    fontSize:45,
    fontWeight:'700',
  },
  TitleText: {
    fontSize:40,
    fontWeight: 'bold'
  }

});
