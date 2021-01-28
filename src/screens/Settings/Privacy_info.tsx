import React from 'react';
import { Text, StyleSheet, ScrollView, View, TouchableOpacity, Image, Alert, Switch, Linking } from 'react-native';
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
                '도움말','\n현재 페이지는 [설정]-[개인정보 처리방침] 페이지 입니다. 개인정보 수집 내역 및 처리 방침에 대해 안내합니다.',
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

          <Text style={{fontSize:40, fontWeight:'700'}}>개인정보 처리 방침</Text>


          <Text style={{fontSize:15}}>
'INSIGHT'는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.{"\n"}
'INSIGHT'는 개인정보처리방침을 개정하는 경우 공지사항(또는 개별공지)을 통하여 공지할 것입니다.{"\n"}
{"\n"}
○ 본 방침은부터 2020년 12월 20일부터 시행됩니다.{"\n"}
{"\n"}
1. 처리하는 개인정보의 항목 및 처리 목적{"\n"}
'INSIGHT'는 개인정보를 다음의 목적을 위해 처리합니다. 처리한 개인정보는 다음의 목적이외의 용도로는 사용되지 않으며 이용 목적이 변경될 시에는 사전동의를 구할 예정입니다.{"\n"}
{"\n"}
가. 민원사무 처리{"\n"}
민원사항 확인, 처리결과 통보 등을 목적으로 개인정보를 처리합니다.{"\n"}
{"\n"}
나. 개인영상정보{"\n"}
"운동시작 기능"을 위한 관절값(posenet) 추출 등을 목적으로 개인정보를 처리합니다.{"\n"}
{"\n"}
{"\n"}
2. 개인정보 처리 및 보유기간{"\n"}
'INSIGHT'는 어떠한 개인 정보도 서버로 전송하거나 데이터베이스에 저장하지 않습니다.{"\n"}
{"\n"}
{"\n"}
3. 개인정보 보호책임자{"\n"}
① 'INSIGHT'는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호 담당부서를 지정하고 있습니다.{"\n"}
▶ 개인정보 보호 담당부서{"\n"}
부서명 : 에너자이저{"\n"}
연락처 : energeyezer@gmail.com{"\n"}
{"\n"}
② 정보주체께서는 'INSIGHT'의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 'INSIGHT'는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.{"\n"}
{"\n"}
{"\n"}
4. 개인정보 처리방침 변경{"\n"}
① 이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.{"\n"}
{"\n"}
{"\n"}
5.  개인정보의 안전성 확보 조치{"\n"}
'INSIGHT'는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.{"\n"}
{"\n"}
1. 해킹 등에 대비한 기술적 대책{"\n"}
'INSIGHT'는 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.{"\n"}
{"\n"}
2. 개인정보에 대한 접근 제한{"\n"}
개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여,변경,말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.{"\n"}
          </Text>

        </View>

      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  // sectionContainer: {
  //   marginTop: 32,
  //   paddingHorizontal: 24,
  // },
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
    fontWeight: 'bold'
  }

});
