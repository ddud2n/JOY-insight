import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Alert, Dimensions, Linking, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeaderBackButton } from 'react-navigation-stack'
interface Props {
  navigation: any,
  route: any,
}

interface State{
  dark?: boolean
  dark2?: boolean
}

const { width, height } = Dimensions.get('window');
const AUTORENDER = true;

export default class SettingScreen extends React.Component<Props, State> {
  rafID?: number;
  state = {
    dark: false,
    dark2: false,
  }


  headerStyle = () => {
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              '도움말', '\n현재 페이지는 설정 페이지입니다.\n 1. 시스템 설정을 위한 화면 고대비 모드 ON/OFF 버튼과 INSIGHT 공식 인스타그램 이동 버튼, 이메일 문의 버튼이 있습니다.\n2. 서비스 정보를 안내를 위한 서비스 안내, 개인정보 처리방침, 오픈소스 라이선스 버튼이 있습니다.\n',
              [{ text: "확인" }],

            )}
          accessibilityLabel='도움말'
        >
          <Image
            style={{ width: 30, height: 30, marginRight: 10 }}
            source={this.state.dark == false ? require('../../../assets/icons/help_black.png') : require('../../../assets/icons/help_yellow.png')} />
        </TouchableOpacity>
      )
    })
  }

  
  async onControlChange(value) {
    await this.setState({ dark: value });
    await AsyncStorage.setItem('dark', value.toString(), () => { });

    var val='';
    await AsyncStorage.getItem('dark', (err, result) => {
      if (result == null) {
        val='null';
      } else {
        val=result;
      }
    })

    
  }

  async UNSAFE_componentWillMount(){
    var val ='';
    await AsyncStorage.getItem('dark', (err, result) => {
      if (result == null) {
        this.setState({ dark: false })
      } else {
        this.setState({ dark: result=='true' })
      }
    })
  }



  render() {

    this.headerStyle();
    
    return (
      <View style={this.state.dark==false ? styles.mainContainer : styles.mainContainer_dark}>
        <View style={this.state.dark==false ? styles.subContainer : styles.subContainer_dark}>
          <View style={{ height: height * 0.1, justifyContent: 'center', paddingLeft: 13, flex: 1 }}>
            <Text style={[{ fontSize: width * 0.1, fontWeight: '700' }, { color: this.state.dark==false ? 'black' : 'yellow' }]}>
            설정 및 문의하기</Text>
          </View>

          <View style={[this.state.dark==false ? styles.TouchableStyle : styles.TouchableStyle_dark,
          { flexDirection: 'row', alignItems: 'center' }]}>
            <Text style={[{ fontSize: width * 0.08 }, { color: this.state.dark==false ? 'black' : 'yellow' }]}>고대비 테마</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#333333' }}
              style={{
                flex: 1, height: '100%', marginRight: width * 0.02,
                transform: [{ scaleX: 1 }, { scaleY: 1 }]
              }}
              onValueChange={value => this.onControlChange(value)}
              value={this.state.dark}
              thumbColor={this.state.dark ? '#f5dd4b' : '#f4f3f4'}
              accessibilityLabel='고대비 테마 설정'
            />
          </View>

          <TouchableOpacity style={this.state.dark==false ? styles.TouchableStyle : styles.TouchableStyle_dark}
            onPress={() =>
              Linking.openURL('instagram://user?username=energeyezer')      //username=energeyezer로 바꾸기
                .catch(() => {
                  Linking.openURL('https://www.instagram.com/energeyezer');    //주소 바꾸기
                })
            }
          >
            <Image style={{ height: height * 0.07, width: width * 0.12, marginVertical: '3.3%', marginRight: '3%' }}
              source={require('../../../assets/icons/instagram.png')} resizeMode='contain' />
            <Text style={[{ fontSize: width * 0.08, textAlignVertical: 'center', marginLeft: '1.7%' }
              , { color: this.state.dark==false ? 'black' : 'yellow' }]}>공식 인스타그램</Text>
          </TouchableOpacity>

          <TouchableOpacity style={this.state.dark==false ? styles.TouchableStyle : styles.TouchableStyle_dark}
            onPress={() =>
              Linking.openURL(
                'mailto:energeyezer@gmail.com?subject=[서비스 문의]')}
          >
            <Image style={{ height: height * 0.07, width: width * 0.12, marginVertical: '3.3%', marginLeft: '1%', marginRight: '4%' }}
              source={require('../../../assets/icons/gmail2.png')} resizeMode='contain' />
            <Text style={[{ fontSize: width * 0.08, textAlignVertical: 'center' },
            { color: this.state.dark==false ? 'black' : 'yellow' }]}>이메일 문의</Text>
          </TouchableOpacity>


        </View>

        <View style={this.state.dark==false ? styles.subContainer : styles.subContainer_dark}>
          <View style={{ height: height * 0.1, justifyContent: 'center', paddingLeft: 13, }}>
            <Text style={[{ fontSize: width * 0.1, fontWeight: '700', textAlignVertical: 'center' },
            { color: this.state.dark==false ? 'black' : 'yellow' }]}>서비스 정보</Text>
          </View>
          <TouchableOpacity style={this.state.dark==false ? styles.TouchableStyle : styles.TouchableStyle_dark}
            onPress={() => this.props.navigation.navigate('Service_info')}>
            <Text style={[styles.touchableText, { color: this.state.dark==false ? 'black' : 'yellow' }]}>서비스 안내</Text>
          </TouchableOpacity>

          <TouchableOpacity style={this.state.dark==false ? styles.TouchableStyle : styles.TouchableStyle_dark}
            onPress={() => this.props.navigation.navigate('Privacy_info')}>
            <Text style={[styles.touchableText, { color: this.state.dark==false ? 'black' : 'yellow' }]}>개인정보 처리 방침</Text>
          </TouchableOpacity>

          <TouchableOpacity style={this.state.dark==false ? styles.TouchableStyle : styles.TouchableStyle_dark}
            onPress={() => this.props.navigation.navigate('Opensource_info')}>
            <Text style={[styles.touchableText, { color: this.state.dark==false ? 'black' : 'yellow' }]}>오픈소스 라이선스</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    backgroundColor: '#ddf7f7',
      
  },
  subContainer: {
    backgroundColor: '#CEEAE2',
    justifyContent: 'center',
    marginBottom: 13,
    flex: 0.5
  },
  TouchableStyle: {
    flexDirection: "row",
    alignContent: 'center',
    backgroundColor: 'white',
    marginVertical: '1%',
    flex: 1,
    paddingLeft: 13,
  },
  mainContainer_dark: {
    height: '100%',
    backgroundColor: '#202022',
      
  },
  subContainer_dark: {
    backgroundColor: '#434248',
    justifyContent: 'center',
    marginBottom: 13,
    flex: 0.5
  },
  TouchableStyle_dark: {
    backgroundColor: '#0d0d0d',
    flexDirection: "row",
    marginVertical: '1%',
    flex: 1,
    paddingLeft: 13,
  },
  touchableText: {
    fontSize: width * 0.08,
    textAlignVertical: 'center'
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
