import React from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { HeaderBackButton } from 'react-navigation-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as tf from '@tensorflow/tfjs';

interface Props {
  navigation: any,
  route: any,
}

const BACKEND_TO_USE = 'rn-webgl';

const { width, height } = Dimensions.get('window');

export default class Exercise_list extends React.Component<Props> {
  rafID?: number;
  state = {
    dark: 'false',
  }

  async componentDidMount() {
    await tf.setBackend(BACKEND_TO_USE);
    await tf.ready();
  }

  headerStyle = () => {
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              '도움말', '\n현재 페이지는 [운동시작]-[스토리 모드] 페이지입니다. 흥미진진한 스토리 모드를 진행해 보세요!',
              [{ text: "확인" }]
            )}
          
          accessibilityLabel='도움말'
        >
          <Image
            style={{ width: 30, height: 30, marginRight: 10 }}
            source={this.state.dark == 'false' ? require('../../../assets/icons/help_black.png') : require('../../../assets/icons/help_yellow.png')} />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => this.props.navigation.navigate("Exercise")}
          tintColor={this.state.dark == 'false' ? 'black' : 'yellow'}
        />
      )
    })
  }

  UNSAFE_componentWillMount() {
    AsyncStorage.getItem('dark', (err, result) => {
      if (result == null) {
        this.setState({ dark: 'false' })
      } else {
        this.setState({ dark: result })
      }
    })
  }

  render() {
    this.headerStyle();


    const { params } = this.props.route;

    return (
      <ScrollView style={this.state.dark == 'false' ? styles.mainContainer : styles.mainContainer_dark} bounces={true}>
        <View style={styles.TitleContainer}>
          <Text style={[styles.TitleText, { color: this.state.dark == 'false' ? 'black' : 'yellow' }]}>스토리 선택</Text>
        </View>

        <TouchableOpacity style={this.state.dark == 'false' ? styles.TouchableStyle : styles.TouchableStyle_dark}
          onPress={() => { this.props.navigation.navigate('exercise_story1'); }}>
          <Text style={[styles.TouchableText, { color: this.state.dark == 'false' ? 'black' : 'yellow' }]}>무과 시험 챌린지</Text>
        </TouchableOpacity>

        <TouchableOpacity style={this.state.dark == 'false' ? styles.TouchableStyle : styles.TouchableStyle_dark}
          onPress={() => { this.props.navigation.navigate('exercise_story2'); }}>
          <Text style={[styles.TouchableText, { color: this.state.dark == 'false' ? 'black' : 'yellow' }]}>에러월드 버그 죽이기</Text>
        </TouchableOpacity>

      </ScrollView>
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
  }

});

