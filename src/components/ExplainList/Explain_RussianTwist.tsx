import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import {HeaderBackButton} from 'react-navigation-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Props {
  navigation: any,
  route: any,
}


const AUTORENDER = true;

export default class Explain_RussianTwist extends React.Component<Props> {
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
                '도움말','러시안 트위스트 동작에 대한 자세한 설명을 제공하는 페이지입니다. 러시안 트위스트에 대한 설명을 통해 정확한 자세를 익혀보세요.',
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
            <Text style={{fontSize:20, fontWeight:'700'}}>정면을 보고 앉아주세요.</Text>
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={{fontSize:20, fontWeight:'700'}}>두 손을 깍지 낀 상태로 앞으로 쭉 뻗어주세요.</Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={{fontSize:20, fontWeight:'700'}}>팔꿈치를 굽히지 않은 상태에서 팔과 배에 자극을 주며 팔을 왼쪽으로 한 번, 오른쪽으로 한 번 움직여주세요.</Text>
          </View>

          
          <View style={styles.sectionContainer}>
            <Text style={{fontSize:20, fontWeight:'700'}}>이 때 팔이 아래로 내려가지 않도록 해주세요.</Text>
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
