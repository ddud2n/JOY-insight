import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Alert, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Props {
  navigation: any,
  route: any,
}


const { width, height } = Dimensions.get('window');

export default class ExplainScreen extends React.Component<Props> {
  rafID?: number;
  state = {
    dark: 'false',
  }

  headerStyle = () => {
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity

          onPress={() =>
            Alert.alert(
              '도움말', '운동 동작 설명 페이지입니다. 자세한 동작 설명을 원하는 운동을 선택하여 정확한 자세를 익혀보세요.',
              [{ text: "확인" }]
            )}

          accessibilityLabel='도움말'
        >
          <Image
            style={{ width: 30, height: 30, marginRight: 10 }}
            source={this.state.dark == 'false' ? require('../../assets/icons/help_black.png') : require('../../assets/icons/help_yellow.png')} />

        </TouchableOpacity>
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


    return (
      <ScrollView style={this.state.dark == 'false' ? styles.mainContainer : styles.mainContainer_dark} bounces={true}>
        <View style={styles.TitleContainer}>
          <Text style={[styles.TitleText, { color: this.state.dark == 'false' ? 'black' : 'yellow' }]}>운동 리스트</Text>
        </View>

        <TouchableOpacity style={this.state.dark == 'false' ? styles.TouchableStyle : styles.TouchableStyle_dark}
          onPress={() => { this.props.navigation.navigate('Explain_Squart'); }}>
          <Text style={[styles.TouchableText, { color: this.state.dark == 'false' ? 'black' : 'yellow' }]}>스쿼트</Text>
        </TouchableOpacity>


        <TouchableOpacity style={this.state.dark == 'false' ? styles.TouchableStyle : styles.TouchableStyle_dark}
          onPress={() => { this.props.navigation.navigate('Explain_Tree'); }}>
          <Text style={[styles.TouchableText, { color: this.state.dark == 'false' ? 'black' : 'yellow' }]}>나무 자세</Text>
        </TouchableOpacity>

        <TouchableOpacity style={this.state.dark == 'false' ? styles.TouchableStyle : styles.TouchableStyle_dark}
          onPress={() => { this.props.navigation.navigate('Explain_StandingSide'); }}>
          <Text style={[styles.TouchableText, { color: this.state.dark == 'false' ? 'black' : 'yellow' }]}>스탠딩 사이드 크런치</Text>
        </TouchableOpacity>

        <TouchableOpacity style={this.state.dark == 'false' ? styles.TouchableStyle : styles.TouchableStyle_dark}
          onPress={() => { this.props.navigation.navigate('Explain_Backback'); }}>
          <Text style={[styles.TouchableText, { color: this.state.dark == 'false' ? 'black' : 'yellow' }]}>백 익스텐션</Text>
        </TouchableOpacity>

        <TouchableOpacity style={this.state.dark == 'false' ? styles.TouchableStyle : styles.TouchableStyle_dark}
          onPress={() => { this.props.navigation.navigate('Explain_ChestOpener'); }}>
          <Text style={[styles.TouchableText, { color: this.state.dark == 'false' ? 'black' : 'yellow' }]}>체스트 오프너</Text>
        </TouchableOpacity>

        <TouchableOpacity style={this.state.dark == 'false' ? styles.TouchableStyle : styles.TouchableStyle_dark}
          onPress={() => { this.props.navigation.navigate('Explain_RussianTwist'); }}>
          <Text style={[styles.TouchableText, { color: this.state.dark == 'false' ? 'black' : 'yellow' }]}>러시안 트위스트</Text>
        </TouchableOpacity>

        <TouchableOpacity style={this.state.dark == 'false' ? styles.TouchableStyle : styles.TouchableStyle_dark}
          onPress={() => { this.props.navigation.navigate('Explain_BellyBomb'); }}>
          <Text style={[styles.TouchableText, { color: this.state.dark == 'false' ? 'black' : 'yellow' }]}>벨리 밤</Text>
        </TouchableOpacity>

        <TouchableOpacity style={this.state.dark == 'false' ? styles.TouchableStyle : styles.TouchableStyle_dark}
          onPress={() => { this.props.navigation.navigate('Explain_SideBomb'); }}>
          <Text style={[styles.TouchableText, { color: this.state.dark == 'false' ? 'black' : 'yellow' }]}>사이드 밤</Text>
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
