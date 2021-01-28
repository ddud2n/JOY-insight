import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Alert, Dimensions,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';

interface Props {
  navigation: any,
  route: any,

}
const AUTORENDER = true;

export default class HomeScreen extends React.Component<Props> {
  rafID?: number;
  state = {
    dark: 'false',
    isReady: false
  }


  headerStyle = () => {
    this.props.navigation.setOptions({
      headerStyle: {
        backgroundColor: this.state.dark == 'false' ? '#43d5e9' : '#0d0d0d',
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      },
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 40
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={() => Alert.alert(
            '도움말', '\n안녕하세요 AI 홈트레이닝 서비스 INSIGHT입니다. 각 페이지 상단 좌측에는 뒤로가기 버튼, 우측에는 도움말 버튼이 있습니다.\n\n현재 페이지는 Insight 홈화면 입니다. 운동시작을 원하시면 ‘운동 시작’ 버튼을, 운동에 대한 자세한 설명을 확인하시려면 ‘운동 동작 설명’ 버튼을, 운동 히스토리 및 업적을 확인하려면 ‘마이페이지’ 버튼, 시스템 설정 및 서비스 안내를 원하시면 ‘설정’ 버튼을 눌러주세요.\n', [{ text: "확인" }])}
          accessibilityLabel='도움말'
        >
          <Image
            style={{ width: 30, height: 30, marginRight: 10 }}
            source={this.state.dark == 'false' ? require('../../assets/icons/help_black.png') : require('../../assets/icons/help_yellow.png')} />

        </TouchableOpacity>
      )
    })
  }

 async componentDidMount() {
    await Font.loadAsync({
      'Gong_M': require('../../assets/fonts/Gong_Gothic_Medium.ttf'),
      'SCDream3': require('../../assets/fonts/SCDream3.otf'),
      'SCDream5': require('../../assets/fonts/SCDream5.otf'),
    });
    this.setState({ isReady: true })
  }


  render() {

    AsyncStorage.getItem('dark', (err, result) => {
      if (result == null) {
        this.setState({ dark: 'false' })
      } else {
        this.setState({ dark: result })
      }
    })

    this.headerStyle();

    const { width, height } = Dimensions.get('window');
    if (this.state.isReady) {
      return (
        <View style={{ flex: 1, backgroundColor: this.state.dark == 'false' ? 'white' : '#434248', }}>
          <View style={{
            height: '17%', backgroundColor: this.state.dark == 'false' ? '#43d5e9' : '#0d0d0d',
            borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
            shadowColor: 'black',
            shadowOpacity: 100,//그림자 투명도
            shadowOffset: { width: 2, height: 2 }, //그림자 위치
            elevation: 10,
          }}>
            <Text style={{
              fontSize: width * 0.09, fontWeight: '900', color: this.state.dark == 'false' ? '#19202E' : 'yellow',
              marginLeft: '10%', letterSpacing: 10, lineHeight: height * 0.07, fontFamily: 'Gong_M'
            }}>
              INSIGHT
          </Text>
            <Text style={{
              fontSize: width * 0.036, fontWeight: '100', color: this.state.dark == 'false' ? 'black' : 'yellow',
              marginLeft: '10.2%', letterSpacing: 8, fontFamily: 'SCDream3'
            }}>
              당신의 헬스 트레이너
             </Text>
          </View>

          <View style={this.state.dark == 'false' ? styles.buttonContainer : styles.buttonContainer_dark}>
            <TouchableOpacity
              style={[styles.buttonStyle, { backgroundColor: this.state.dark == 'false' ? '#3feddc' : '#0d0d0d' }]}
              onPress={() => {
                this.props.navigation.navigate('Exercise');
              }}
            >
              <Image
                resizeMode="contain"
                style={{ width: height * 0.1, marginLeft: '7%', marginRight: '5%', borderRadius: 62 }}
                source={require('../../assets/icons/1.jpg')} />
              <View style={{ flexDirection: 'column' }}>
                <Text style={[styles.buttonText, this.state.dark == 'false' ? { color: 'black' } : { color: 'yellow' }]}>운동 시작</Text>
                <Text style={styles.buttonText2}>Start workout</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { this.props.navigation.navigate('Explain'); }}
              style={[styles.buttonStyle, { backgroundColor: this.state.dark == 'false' ? '#62f4c7' : '#0d0d0d' }]}>
              <Image
                resizeMode="contain"
                style={{ width: height * 0.1, marginLeft: '7%', marginRight: '5%', borderRadius: 62 }}
                source={require('../../assets/icons/2.png')} />
              <View style={{ flexDirection: 'column' }}>
                <Text style={[styles.buttonText, this.state.dark == 'false' ? { color: 'black' } : { color: 'yellow' }]}>운동 동작 설명</Text>
                <Text style={styles.buttonText2}>Exercise Tutorial</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonStyle, { backgroundColor: this.state.dark == 'false' ? '#37f5ad' : '#0d0d0d' }]}
              onPress={() => { this.props.navigation.navigate('MyPage'); }}>
              <Image
                resizeMode="contain"
                style={{ width: height * 0.1, marginLeft: '7%', marginRight: '5%', borderRadius: 100 }}
                source={require('../../assets/icons/3.png')} />
              <View style={{ flexDirection: 'column' }}>
                <Text style={[styles.buttonText, this.state.dark == 'false' ? { color: 'black' } : { color: 'yellow' }]}>마이 페이지</Text>
                <Text style={styles.buttonText2}>My page</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonStyle, { backgroundColor: this.state.dark == 'false' ? '#04f099' : '#0d0d0d' }]}
              onPress={() => { this.props.navigation.navigate('Settings'); }}
            >
              <Image
                resizeMode="contain"
                style={{ width: height * 0.1, marginLeft: '7%', marginRight: '5%', borderRadius: 100 }}
                source={require('../../assets/icons/4.png')} />
              <View style={{ flexDirection: 'column' }}>
                <Text style={[styles.buttonText, this.state.dark == 'false' ? { color: 'black' } : { color: 'yellow' }]}>설정</Text>
                <Text style={styles.buttonText2}>Settings</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return <View style={styles.loadingIndicator}><ActivityIndicator size='large' color='#43d5e9' /></View>;
    }
  }
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  loadingIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginVertical: '10%'
  },
  buttonContainer_dark: {
    flex: 1,
    backgroundColor: '#434248',
    marginVertical: '10%'
  },
  buttonStyle: {
    backgroundColor: '#91AAF2',
    marginBottom: '4%',
    borderRadius: 25,
    height: '23%',
    alignItems: 'center',
    marginHorizontal: '4%',
    flexDirection: "row",
  },
  buttonText: {
    fontSize: width * 0.07,
    //lineHeight: height * 0.055,
    fontWeight: 'bold',
    color: '#4a5455',
    //fontFamily: 'SCDream5'
  },
  buttonText2: {
    fontSize: width * 0.045,
    lineHeight: height * 0.033,
    fontWeight: '500',
    color: '#4a5455',
    fontFamily: 'SCDream3'
  },

});
