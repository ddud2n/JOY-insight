import React from 'react';
import { Text, StyleSheet, ScrollView, View, TouchableOpacity, Image, Alert, Switch, Linking, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Props {
  navigation: any,
  route: any,
}


const AUTORENDER = true;

export default class Service_info extends React.Component<Props> {
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
                '도움말','\n현재 페이지는 [설정]-[서비스 안내] 페이지 입니다.\n 애플리케이션의 기능, 페이지 이동 방법, 제작 지원에 대해 안내합니다.',
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
    
    return (
      <ScrollView style={styles.mainContainer}>
        <View style={styles.subContainer}>

          <Text style={{fontSize:40, fontWeight:'700'}}>서비스 안내</Text>

          <Text style={{fontSize:30, fontWeight:'700'}}>[제작지원 안내]</Text>
          <Text style={styles.textStyle}>
          INSIGHT는 현대오토에버와 서울사회복지공동모금회의 지원을 받아 제작되었습니다. 
          </Text>
          <Image
            resizeMode='contain'
            style={{ width: Dimensions.get('window').width*0.8, 
            height: Dimensions.get('window').height*0.1, alignSelf:'center', marginTop:7,marginBottom:30}}
            source={require('../../../assets/icons/logo.jpg')} />

          <Text style={styles.textStyle}>
          안녕하세요, 배리어프리 헬스 트레이닝 어플리케이션 'INSIGHT'입니다.
          'INSIGHT'를 통해 건강한 신체와 마음을 가꾸실 수 있도록 노력하겠습니다.{"\n"}{"\n"}
          </Text>

          <Text style={{fontSize:30, fontWeight:'700'}}>[기능소개]</Text>
          <Text style={{fontSize:25, fontWeight:'700'}}>1. 운동 리스트 모드</Text>
          <Text style={styles.textStyle}>
          - "운동시작 메뉴"에서 "운동 리스트"를 선택하면 운동리스트 모드를 사용하실 수 있습니다.{"\n"}
          - 운동 리스트 모드에서는 8가지의 운동을 제시합니다. 앉아서 하는 쉬운 동작부터 균형잡기 운동, 고난도 운동에 이르기까지 다양한 난이도의 운동을 담았습니다.
          사용자가 안전하게 운동을 진행할 수 있도록 운동 시작 전 ‘카메라 조정 기능'을 통해 주변에 위험한 물건은 없는지, 사용자가 카메라 화면 안에 잘 들어와 있는지를 인식하여 음성으로 알려드리는 기능을 구현했습니다.{"\n"}
          - 카메라 조정이 완료되면 운동 동작에 대한 자세한 설명을 청각적으로 제공하고, 사용자가 올바른 동작을 수행하면 "1회", "2회" 등 횟수를 카운트합니다.
          잘못된 동작을 수행했을 때는 "다리를 더 들어주세요" 와 같은 피드백을 제공합니다.{"\n"}
          {"\n"} </Text>
          
          <Text style={{fontSize:25, fontWeight:'700'}}>2. 운동 스토리 모드</Text>
          <Text style={styles.textStyle}>
          - 운동시작 메뉴에서 운동 리스트를 선택하며 운동리스트 모드를 사용하실 수 있습니다.{"\n"}
          - INSIGHT는 사용자의 지속적인 트레이닝을 위해 다양한 엔터테인먼트 서비스를 제공합니다.
           스토리 모드는 스토리에 맞춰 운동을 진행하도록 유도하여 운동에 재미를 더해줍니다. 
           현재 출시된 2가지 스토리 중 하나인 "무과시험 챌린지"에서는 조선시대 무과시험을 치르는 주인공이 되어 3가지 운동을 하게 됩니다. 운동을 마치고 나면, 무과시험에서 얻은 성적을 공개합니다. 
           여러 스토리를 체험하고, 그에 따른 성적을 확인하면서 운동을 즐길 수 있기를 기대합니다.{"\n"}
           {"\n"}</Text>

          <Text style={{fontSize:25, fontWeight:'700'}}>3. 마이페이지</Text>
          <Text style={styles.textStyle}>
          - 마이페이지에서는 '히스토리'와 '업적' 기능을 제공합니다. {"\n"}
          - '히스토리' 기능은 최근 7일간 사용자의 운동 시간과 종목을 기록하여 사용자가 체계적으로 운동 습관을 관리할 수 있도록 돕습니다. {"\n"}
          - '업적' 기능은 운동 횟수와 시간 등 일정 조건을 만족하면 업적 타이틀을 제공하여 운동에 재미와 성취감을 부여합니다.{"\n"}
          {"\n"}</Text>

          <Text style={{fontSize:25, fontWeight:'700'}}>4. 설정</Text>
          <Text style={styles.textStyle}>
          - 설정 페이지에서는 '고대비 모드'를 제공합니다. 설정에서 고대비 모드를 on/off 하여, 개인의 특성에 따라 어플리케이션의 사용성과 접근성을 향상시킬 수 있습니다.{"\n"}
          - 또한 INSIGHT 공식 인스타그램과 이메일 문의을 통해 개발자와 직접 소통할 수 있습니다.{"\n"}
          {"\n"}</Text>

          <Text style={{fontSize:30, fontWeight:'700'}}>[페이지 이동 안내]</Text>
          <Text style={styles.textStyle}>
          - 각 페이지의 최상단에 위치한 헤더에 '뒤로가기 버튼'과 현재 페이지 이름, '도움말 버튼'이 있습니다.{"\n"}
          - 현재 페이지 이름을 확인하시고, 이전 페이지로 돌아가기를 원하신다면 '뒤로가기 버튼'을 이용해주세요.{"\n"}
          - 현재 페이지가 제공하는 기능과 구성이 궁금하시다면 도움말 버튼을 이용주시길 바랍니다.{"\n"}
          {"\n"}
          </Text>

        </View>

      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    backgroundColor: 'white',
      
  },
  subContainer: {
    backgroundColor: 'white',
    flex:1,
    paddingHorizontal:15
  },
  TitleText: {
    fontSize:40,
    fontWeight: 'bold',
    lineHeight:40
  },
  textStyle:{
    fontSize:20,
  }
});
