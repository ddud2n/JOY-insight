import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';

interface Props {
  navigation: any,
  route: any,
}


const { width, height } = Dimensions.get('window');

const AUTORENDER = true;

export default class MyPageScreen extends React.Component<Props> {
  rafID?: number;

  state = {
    dark: 'false'
  }

  headerStyle = () => {
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity

          onPress={() =>
            Alert.alert(
              '도움말', '현재 페이지는 마이 페이지입니다. 운동 기록과 운동 업적 메뉴를 확인하실 수 있습니다.',
              [{ text: "확인" }]
            )}
          
          accessibilityLabel='도움말'
        >
          <Image
            style={{ width: 30, height: 30, marginRight: 10 }}
            source={this.state.dark == 'false' ? require('../../../assets/icons/help_black.png') : require('../../../assets/icons/help_yellow.png')} />
        </TouchableOpacity>
      )
    })
  }

  async UNSAFE_componentWillMount() {
    await AsyncStorage.getItem('dark', (err, result) => {
      if (result == null) {
        this.setState({ dark: 'false' })
      } else {
        this.setState({ dark: result })
      }
    })

    await Font.loadAsync({
      'SCDream3': require('../../../assets/fonts/SCDream3.otf'),
    });
  }


  render() {
    this.headerStyle();
    //const [isEnabled, setIsEnabled] = useState(false);
    //const toggleSwitch = () => setIsEnabled(previousState => !previousState);



    return (
      <View style={this.state.dark == 'false' ? styles.mainContainer : styles.mainContainer_dark}>
        <TouchableOpacity style={this.state.dark == 'false' ? styles.TouchableStyle : styles.TouchableStyle_dark}
          onPress={() => this.props.navigation.navigate('History')}>
          <Text style={[styles.TouchableText, { color: this.state.dark == 'false' ? 'black' : 'yellow' }]}>
        
            운동 기록</Text>
        </TouchableOpacity>

        <TouchableOpacity style={this.state.dark == 'false' ? styles.TouchableStyle : styles.TouchableStyle_dark}
          onPress={() => this.props.navigation.navigate('Achievements')}>
          <Text style={[styles.TouchableText, { color: this.state.dark == 'false' ? 'black' : 'yellow' }]}>운동 업적</Text>
        </TouchableOpacity>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    backgroundColor: '#ddf7f7',
      
  },
  TouchableStyle: {
    backgroundColor: 'white',
    marginTop: height * 0.015,
    marginHorizontal: width * 0.03,
    height: height * 0.12,
    borderRadius: 10,
    justifyContent: 'center',
    paddingLeft: width * 0.04,
  },
  mainContainer_dark: {
    height: '100%',
    backgroundColor: '#434248',
      
  },
  TouchableStyle_dark: {
    backgroundColor: '#0d0d0d',
    marginTop: height * 0.015,
    marginHorizontal: width * 0.03,
    height: height * 0.12,
    borderRadius: 10,
    justifyContent: 'center',
    paddingLeft: width * 0.04,
  },
  TitleContainer: {
    height: height * 0.1,
    justifyContent: 'center',
    paddingLeft: width * 0.04,
    paddingTop: height * 0.01,
    flex: 1
  },
  TouchableText: {
    fontSize: width * 0.09,

  },
  TitleText: {
    fontSize: width * 0.1,
    fontWeight: '700',
    fontFamily: 'SCDream3'
  }

});