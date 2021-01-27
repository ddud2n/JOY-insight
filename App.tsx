import * as React from 'react';
import { StyleSheet, Text, ImageBackground } from 'react-native';

//design
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//splash
//import SplashScreen from './src/screens/SplashScreen'


//main
import HomeScreen from './src/screens/Home';
import ExerciseScreen from './src/screens/Exercise/ExerciseScreen';
import ExplainScreen from './src/screens/ExplainScreen';
import SettingsScreen from './src/screens/Settings/SettingsScreen';
import MyPageScreen from './src/screens/MyPage/MyPageScreen';

//Exercise
import Exercise_list from './src/screens/Exercise/ExerciseScreen_list';
import Exercise_story from './src/screens/Exercise/ExerciseScreen_story';
import Exercise_guide from './src/screens/Exercise/ExerciseScreen_guide';

//list mode
import squart from './src/components/ExerciseList/Exercise_Squart';
import tree from './src/components/ExerciseList/Exercise_Tree';
import standingside from './src/components/ExerciseList/Exercise_Standingside';
import backback from './src/components/ExerciseList/Exercise_Backback';
import BellyBomb from './src/components/ExerciseList/Exercise_BellyBomb';
import SideBomb from './src/components/ExerciseList/Exercise_SideBomb';
import RussianTwist from './src/components/ExerciseList/Exercise_RussianTwist';
import ChestOpener from './src/components/ExerciseList/Exercise_ChestOpener';
//story mode
//story1
import Exercise_Story1 from './src/components/ExerciseStory/Story1/Exercise_Story1';
import Exercise_Story1_Stage1 from './src/components/ExerciseStory/Story1/Exercise_Story1_Stage1';
import Exercise_Story1_Stage2 from './src/components/ExerciseStory/Story1/Exercise_Story1_Stage2';
import Exercise_Story1_Stage3 from './src/components/ExerciseStory/Story1/Exercise_Story1_Stage3';
import Exercise_guide_story1 from './src/components/ExerciseStory/Story1/ExerciseScreen_guide_story1';
import Story_Tree from './src/components/ExerciseStory/Story1/Story_Tree';
import Stroy_Squart from './src/components/ExerciseStory/Story1/Stroy_Squart';
import Story_Standingside from './src/components/ExerciseStory/Story1/Story_Standingside';
import Exercise_Story1_result from './src/components/ExerciseStory/Story1/Exercise_Story1_result';

//story2 *************************************************************************************************
import Exercise_Story2_Stage1 from './src/components/ExerciseStory/Story2/Exercise_Story2_Stage1';
import Exercise_Story2_Stage2 from './src/components/ExerciseStory/Story2/Exercise_Story2_Stage2';
import Exercise_Story2_Stage3 from './src/components/ExerciseStory/Story2/Exercise_Story2_Stage3';
import Exercise_Story2 from './src/components/ExerciseStory/Story2/Exercise_Story2';
import Exercise_guide_story2 from './src/components/ExerciseStory/Story2/ExerciseScreen_guide_story2';
import Story_Tree2 from './src/components/ExerciseStory/Story2/Story_Tree2';
import Stroy_Squart2 from './src/components/ExerciseStory/Story2/Stroy_Squart2';
import Story_Standingside2 from './src/components/ExerciseStory/Story2/Story_Standingside2';
import Exercise_Story2_result from './src/components/ExerciseStory/Story2/Exercise_Story2_result';
// *******************************************************************************************************


//Explain
import Explain_Backback from './src/components/ExplainList/Explain_Backback'
import Explain_Squart from './src/components/ExplainList/Explain_Squart'
import Explain_StandingSide from './src/components/ExplainList/Explain_StandingSide'
import Explain_Tree from './src/components/ExplainList/Explain_Tree'
import Explain_BellyBomb from './src/components/ExplainList/Explain_BellyBomb'
import Explain_SideBomb from './src/components/ExplainList/Explain_SideBomb'
import Explain_ChestOpener from './src/components/ExplainList/Explain_ChestOpener'
import Explain_RussianTwist from './src/components/ExplainList/Explain_RussianTwist'

//Settings
import Service_info from './src/screens/Settings/Service_info';
import Privacy_info from './src/screens/Settings/Privacy_info';
import Opensource_info from './src/screens/Settings/Opensource_info';

//MyPage
import Achievements from './src/screens/MyPage/Achievements';
import History from './src/screens/MyPage/History';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo';
import * as Permissions from 'expo-permissions';


var moment = require('moment');
AsyncStorage.getItem('start_date', (err, result) => {
  if (result == null) { AsyncStorage.setItem('start_date', moment().format("YYYY-MM-DD"), () => { }) }
  else { }
})



//AsyncStorage.clear()

interface Props {
  navigation: any
}

const Stack = createStackNavigator();

interface TextWithDefaultProps extends Text {
  defaultProps?: { allowFontScaling?: boolean };
}
((Text as unknown) as TextWithDefaultProps).defaultProps = ((Text as unknown) as TextWithDefaultProps).defaultProps || {};
((Text as unknown) as TextWithDefaultProps).defaultProps!.allowFontScaling = false


class App extends React.Component {

  state = {
    isLoading: true,
    dark: 'false',
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });

    //await this.delay(22000).then(() => this.setState({ timer: true }))
  }
  
  _cacheSplashResourcesAsync = async () => {
    const gif = require('./assets/17.gif');
    return Asset.fromModule(gif).downloadAsync();
  };

  render() {
    
    if (this.state.isLoading) {
      //setTimeout(() => { this.setState({ isLoading: false }) }, 4700);
      return (
        <ImageBackground
          resizeMode="stretch"
          source={require("./assets/17.gif")}
          onLoadEnd={()=>setTimeout(() => { this.setState({ isLoading: false }) }, 4700)}
          style={{ flex: 1 }}>
        </ImageBackground>
      )
    }
    else{
      AsyncStorage.getItem('dark', (err, result) => {
        if (result == null) {
          this.setState({ dark: 'false' })
        } else {
          this.setState({ dark: result })
        }
      })
      return (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
              headerStyle: {
                backgroundColor: this.state.dark == 'false' ? '#43d5e9' : '#0d0d0d',
              },
              headerTitleAlign: 'center',
              headerTintColor: this.state.dark == 'false' ? 'black' : 'yellow',
              headerTitleStyle: {
                fontWeight: 'bold',
                color: this.state.dark == 'false' ? 'black' : 'yellow',
                fontSize: 25
              },

              headerBackAccessibilityLabel: '뒤로가기' //접근성
            }}
          >
            {/*----------------Main navigation----------------*/}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: null,
              }}
            />
            <Stack.Screen
              name="Exercise"
              component={ExerciseScreen}
              options={{
                title: "운동 시작",
              }}
            />
            <Stack.Screen
              name="Explain"
              component={ExplainScreen}
              options={{
                title: "운동 동작 설명",
              }}
            />
            <Stack.Screen
              name="MyPage"
              component={MyPageScreen}
              options={{
                title: "마이 페이지",
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                title: "설정",
              }}
            />


            {/*----------------Exercise navigation----------------*/}
            <Stack.Screen
              name="exercise_guide"
              component={Exercise_guide}
              options={{
                title: "카메라 조정",
              }}
            />
            <Stack.Screen
              name="exercise_guide_story1"
              component={Exercise_guide_story1}
              options={{
                title: "카메라 조정",
              }}
            />
            <Stack.Screen
                name="exercise_guide_story2"
                component={Exercise_guide_story2}
                options={{
                  title: "카메라 조정",
                }}
              />
            <Stack.Screen
              name="exercise_list"
              component={Exercise_list}
              options={{
                title: "리스트 모드",
              }}
            />
            <Stack.Screen
              name="exercise_story"
              component={Exercise_story}
              options={{
                title: "스토리 모드",
              }}
            />

            {/*----------------Exercise story----------------*/}
            {/*--story1--*/}
            <Stack.Screen
              name="exercise_story1"
              component={Exercise_Story1}
              options={{
                title: "무과시험 도전하기",
              }}
            />
            <Stack.Screen
              name="exercise_story1_stage1"
              component={Exercise_Story1_Stage1}
              options={{
                title: "제 1과목",
              }}
            />
            <Stack.Screen
              name="exercise_story1_stage2"
              component={Exercise_Story1_Stage2}
              options={{
                title: "제 2과목",
              }}
            />
            <Stack.Screen
              name="exercise_story1_stage3"
              component={Exercise_Story1_Stage3}
              options={{
                title: "제 3과목",
              }}
            />
            <Stack.Screen
              name="Story_Tree"
              component={Story_Tree}
              options={{
                title: "나무 자세",
              }}
            />
            <Stack.Screen
              name="Story_Squart"
              component={Stroy_Squart}
              options={{
                title: "스쿼트",
              }}
            />
            <Stack.Screen
              name="Story_Standingside"
              component={Story_Standingside}
              options={{
                title: "스탠딩 사이드",
              }}
            />
            <Stack.Screen
              name="Exercise_Story1_result"
              component={Exercise_Story1_result}
              options={{
                title: "도전 결과",
              }}
            />

             {/*------------------------------story2-----------------------------------------*/}
             <Stack.Screen
                name="exercise_story2"
                component={Exercise_Story2}
                options={{
                  title: "버그월드 탈출하기",
                }}
              />
               <Stack.Screen
              name="exercise_story2_stage1"
              component={Exercise_Story2_Stage1}
              options={{
                title: "제 1과목",
              }}
            />
            <Stack.Screen
              name="exercise_story2_stage2"
              component={Exercise_Story2_Stage2}
              options={{
                title: "제 2과목",
              }}
            />
            <Stack.Screen
              name="exercise_story2_stage3"
              component={Exercise_Story2_Stage3}
              options={{
                title: "제 3과목",
              }}
            />
              <Stack.Screen
                name="Story_Tree2"
                component={Story_Tree2}
                options={{
                  title: "나무 자세",
                }}
              />
              <Stack.Screen
                name="Story_Squart2"
                component={Stroy_Squart2}
                options={{
                  title: "스쿼트",
                }}
              />
              <Stack.Screen
                name="Story_Standingside2"
                component={Story_Standingside2}
                options={{
                  title: "스탠딩 사이드",
                }}
              />
              <Stack.Screen
                name="Exercise_Story2_result"
                component={Exercise_Story2_result}
                options={{
                  title: "도전 결과",
                }}
              />


            {/*----------------Exercise list----------------*/}
            <Stack.Screen
              name="squart"
              component={squart}
              options={{
                title: "스쿼트",
              }}
            />
            <Stack.Screen
              name="tree"
              component={tree}
              options={{
                title: "나무 자세",
              }}
            />
            <Stack.Screen
              name="standingside"
              component={standingside}
              options={{
                title: "스탠딩 사이드 크런치",
              }}
            />
            <Stack.Screen
              name="backback"
              component={backback}
              options={{
                title: "백 익스텐션",
              }}
            />
            <Stack.Screen
              name="BellyBomb"
              component={BellyBomb}
              options={{
                title: "벨리 밤",
              }}
            />
            <Stack.Screen
              name="SideBomb"
              component={SideBomb}
              options={{
                title: "사이드 밤",
              }}
            />
            <Stack.Screen
              name="RussianTwist"
              component={RussianTwist}
              options={{
                title: "러시안 트위스트",
              }}
            />
            <Stack.Screen
              name="ChestOpener"
              component={ChestOpener}
              options={{
                title: "체스트 오프너",
              }}
            />

            {/*----------------Explain navigation----------------*/}
            <Stack.Screen
              name="Explain_Backback"
              component={Explain_Backback}
              options={{
                title: "백 익스텐션",
              }}
            />
            <Stack.Screen
              name="Explain_Squart"
              component={Explain_Squart}
              options={{
                title: "스쿼트",
              }}
            />
            <Stack.Screen
              name="Explain_Tree"
              component={Explain_Tree}
              options={{
                title: "나무 자세",
              }}
            />
            <Stack.Screen
              name="Explain_StandingSide"
              component={Explain_StandingSide}
              options={{
                title: "스탠딩 사이드",
              }}
            />
            <Stack.Screen
              name="Explain_ChestOpener"
              component={Explain_ChestOpener}
              options={{
                title: "체스트 오프너",
              }}
            />
            <Stack.Screen
              name="Explain_RussianTwist"
              component={Explain_RussianTwist}
              options={{
                title: "러시안 트위스트",
              }}
            />
            <Stack.Screen
              name="Explain_BellyBomb"
              component={Explain_BellyBomb}
              options={{
                title: "벨리 밤",
              }}
            />
            <Stack.Screen
              name="Explain_SideBomb"
              component={Explain_SideBomb}
              options={{
                title: "사이드 밤",
              }}
            />

            {/*----------------Settings navigation----------------*/}
            <Stack.Screen
              name="Service_info"
              component={Service_info}
              options={{
                title: "서비스 안내",
              }}
            />
            <Stack.Screen
              name="Privacy_info"
              component={Privacy_info}
              options={{
                title: "개인정보 처리 방침",
              }}
            />
            <Stack.Screen
              name="Opensource_info"
              component={Opensource_info}
              options={{
                title: "오픈소스 라이선스",
              }}
            />

            {/*----------------MyPage navigation----------------*/}
            <Stack.Screen
              name="Achievements"
              component={Achievements}
              options={{
                title: "업적",
              }}
            />
            <Stack.Screen
              name="History"
              component={History}
              options={{
                title: "운동 기록",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
  }
}

const styles = StyleSheet.create({

});

export default App;