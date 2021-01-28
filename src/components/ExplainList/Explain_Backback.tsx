import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import {HeaderBackButton} from 'react-navigation-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Props {
  navigation: any,
  route: any,
}


const AUTORENDER = true;

export default class Explain_Backback extends React.Component<Props> {
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
                '도움말','백 익스텐션 동작에 대한 자세한 설명을 제공하는 페이지입니다. 백 익스텐션에 대한 설명을 통해 정확한 자세를 익혀보세요.',
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
            <Text style={{fontSize:20, fontWeight:'700'}}>먼저 왼쪽으로 90도 돌아주세요. 팔을 어깨높이만큼 들어 일직선으로 쭉 올려주세요.</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={{fontSize:20, fontWeight:'700'}}>그런다음 허리를 꼿꼿이 편 상태로 허리를 숙입니다. 이때 허리가 구부정해지지 않도록 주의해주세요.</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={{fontSize:20, fontWeight:'700'}}>30초 동안 백익스텐션 자세를 유지해주세요. </Text>
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
  