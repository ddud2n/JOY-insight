import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import {HeaderBackButton} from 'react-navigation-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Props {
  navigation: any,
  route: any,
}


const AUTORENDER = true;

export default class Explain_StandingSide extends React.Component<Props> {
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
                '도움말','스탠딩 사이드 크런치 동작에 대한 자세한 설명을 제공하는 페이지입니다. 스탠딩 사이드에 대한 설명을 통해 정확한 자세를 익혀보세요.',
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
            <Text style={{fontSize:20, fontWeight:'700'}}>다리를 어깨넓이만큼 벌리고, 두 손을 뒷통수에 얹어주세요. </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={{fontSize:20, fontWeight:'700'}}>그 자세에서 왼쪽 무릎과 왼쪽 팔꿈치가 맞닿을 수 있도록 왼쪽다리를 들면서 허리를 일직선으로 옆으로 숙여주세요. 다시 원래 자세로 돌아옵니다. </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={{fontSize:20, fontWeight:'700'}}>다음에는 오른쪽 팔꿈치와 오른쪽 무릎을 맞닿게 해주세요. 이렇게 양쪽을 번갈아 진행합니다. </Text>
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
