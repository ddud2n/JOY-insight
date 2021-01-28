import React from 'react';
import { ActivityIndicator, StyleSheet, View, Platform, Text, Dimensions, ImageBackground, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeaderBackButton } from 'react-navigation-stack'
//카메라
//julia
import { Camera } from 'expo-camera';
import { ExpoWebGLRenderingContext } from 'expo-gl';
//딥러닝
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import * as tmPose from '@teachablemachine/pose';
import ProgressCircle from 'react-native-progress-circle'
//TTS
import { Audio } from 'expo-av';
const { width, height } = Dimensions.get('window');

interface ScreenProps {
  navigation?: any
  route?: any
}

interface ScreenState {
  hasCameraPermission?: boolean;
  // tslint:disable-next-line: no-any
  cameraType: any;
  isLoading: boolean;
  pose?: posenet.Pose;
  tm?: tmPose.CustomPoseNet;
  soundObject?: Audio.Sound;
  dark: string;
  soundObject1?: Audio.Sound;
  soundObject2?: Audio.Sound;
  soundObject3?: Audio.Sound;
  soundObject4?: Audio.Sound;
  soundObject5?: Audio.Sound;
  soundObject6?: Audio.Sound;
  soundObject7?: Audio.Sound;
  soundObject8?: Audio.Sound;
  soundObject9?: Audio.Sound;
  soundObject10?: Audio.Sound;
}

const inputTensorWidth = 152;
const inputTensorHeight = 200;

let textureDims: { width: number; height: number; };
if (Platform.OS === 'ios') {
  textureDims = {
    height: 1920,
    width: 1080,
  };
} else {
  textureDims = {
    height: 1200,
    width: 1600,
  };
}

const AUTORENDER = true;



// tslint:disable-next-line: variable-name
const TensorCamera = cameraWithTensors(Camera);

// standingside_status & count
var standingside_status = "null";
var standingside_count = 0;
var standingside_miss = 0;
var total_count = 0;

/////////////////////////////////////업적//////////////////////////////////////////////////////////
AsyncStorage.getItem('Standingside', (err, result) => {

  if (result == null) { }
  else {
    total_count = Number(result)
  }
});
//////////////////////////////////히스토리//////////////////////////////////////////////////////////
var moment = require('moment');
let start_date = moment().format("YYYY-MM-DD");
let today_date = moment()//.add(4,'d');
var diff = 0
var diff2 = ''
var history = 0
AsyncStorage.getItem('start_date', (err, result) => {
  if (result == null) { }
  else {
    start_date = moment(result)//.format("YYYY-MM-DD")
    
  }
})

//////////////////////////////////////////////////////////////////////////////////////
//for camera guide (init())
const minScore = 0.2;
var guide = 1;

//for compare
var NotKeypointsArr = [];
var DetectedArr = [];
var right = ['leftShoulder', 'leftElbow', 'leftWrist', 'leftHip', 'leftKnee'];
var left = ['rightShoulder', 'rightElbow', 'rightWrist', 'rightHip', 'rightKnee'];
var back = ['nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar', 'rightAnkle', 'leftAnkle'];

//////////////////////////////////////////////////////////////////////////////////////




export default class Story_Standingside2 extends React.Component<ScreenProps, ScreenState> {
  rafID?: number;

  constructor(props: ScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      cameraType: Camera.Constants.Type.front,
      dark: 'false',
    };
    this.standingside_init = this.standingside_init.bind(this); // tree_init 로 바꾸기 
  }

  headerStyle = () => {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => this.props.navigation.replace("exercise_story")}
          tintColor={this.state.dark == 'false' ? 'black' : 'yellow'}
        />
      )
    })
  }

  //스탠딩사이드 모델 load
  async standingside_loadtmModel() {
    const modelJson = 'http://34.86.103.226:8000/standingside_model'; //model.json 에서 wieghts 부분 수정하기
    const metaJson = 'http://34.86.103.226:8000/standingside_metadata';
    var model = await tmPose.load(modelJson, metaJson);
    return model;
  }

  async delay(how: number) {
    return new Promise(resolve => setTimeout(resolve, how));
  }


  //standingside main 함수
  async standingside_init(
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void, gl: ExpoWebGLRenderingContext) {

    if (today_date != null && start_date != null) {
      diff = today_date.diff(start_date, 'days')
    }

    diff2 = diff + '_Standingside'
    AsyncStorage.getItem(diff2, (err, result) => {
      if (result == null) { }
      else {
        history = Number(result)
        
      }
    })

    const loop = async () => {

      if (standingside_count == 8) {
        
        const soundObject20 = new Audio.Sound();
        await soundObject20.loadAsync(require('../../../resource/story2/story2_second_end.mp3'));
        await soundObject20.playAsync();
        await this.delay(7000)

        await AsyncStorage.setItem('standingside_miss', standingside_miss.toString(), () => { });
        
        return (this.props.navigation.replace('exercise_story2_stage3'))
      }

      if (!AUTORENDER) {
        updatePreview();
      }
      //posenet
      const imageTensor = images.next().value;
      const flipHorizontal = Platform.OS === 'ios' ? false : true;
      const { pose, posenetOutput } = await this.state.tm.estimatePose(imageTensor, flipHorizontal);

      //teachable 동작분류
      const prediction = await this.state.tm.predict(posenetOutput);

      if (pose != undefined) {
        var keypoints = pose.keypoints.filter(k => k.score > minScore)

      }


      //피드백 알고리즘
      if (prediction[0].probability >= 0.60 && pose != undefined) {
        standingside_status = "stand"
      }
      else if (prediction[1].probability >= 0.99 && pose != undefined) {
        if (standingside_status == "stand" || standingside_status == "low_knee" || standingside_status == "low_arm") {
          standingside_count++;
          total_count++;
          history++;
          ;
          AsyncStorage.setItem('Standingside', total_count.toString(), () => { });
          AsyncStorage.setItem(diff2, history.toString(), () => { });

          if (standingside_count == 1) {
            this.state.soundObject1.playAsync();
          }
          else if (standingside_count == 2) {
            this.state.soundObject2.playAsync();
          }
          else if (standingside_count == 3) {
            this.state.soundObject3.playAsync();
          }
          else if (standingside_count == 4) {
            this.state.soundObject4.playAsync();
          }
          else if (standingside_count == 5) {
            this.state.soundObject5.playAsync();
          }
          else if (standingside_count == 6) {
            this.state.soundObject6.playAsync();
          }
          else if (standingside_count == 7) {
            this.state.soundObject7.playAsync();
          }
          else if (standingside_count == 8) {
            this.state.soundObject8.playAsync();
          }

        }
        standingside_status = "correct"
      }
      else if (prediction[2].probability >= 0.50 && pose != undefined) {
        if (standingside_status == "stand" || standingside_status == "low_arm" || standingside_status == "correct") {
          
          await this.state.soundObject9.playAsync();
          await this.delay(1000)
          standingside_miss++;
        }
        standingside_status = "low_knee"
      }
      else if (prediction[3].probability == 1.00 && pose != undefined) {
        if (standingside_status == "low_knee" || standingside_status == "correct") {
          
          await this.state.soundObject10.playAsync();
          await this.delay(2000)
          standingside_miss++;
        }
        standingside_status = "low_arm"
      }

      this.setState({ pose });
      tf.dispose([imageTensor]);
      

      if (!AUTORENDER) {
        gl.endFrameEXP();
      }
      this.rafID = requestAnimationFrame(loop);

    };

    
    const soundObject14 = new Audio.Sound();
    await soundObject14.loadAsync(require('../../../resource/exercise/exercise_standing1.mp3'));
    await soundObject14.playAsync();
    await this.delay(15000)
    standingside_count = 0;
    standingside_status = "null";
    if (this.props.navigation.isFocused()) {
      const soundObject15 = new Audio.Sound();
      await soundObject15.loadAsync(require('../../../resource/story2/keyboard1.wav'));
      await soundObject15.playAsync()
    }
    loop();

  }


  UNSAFE_componentWillMount() {
    AsyncStorage.getItem('dark', (err, result) => {
      if (result == null) {
        this.setState({ dark: 'false' })
      } else {
        this.setState({ dark: result })
      }
    })

    const soundObject = new Audio.Sound();
    this.setState({ soundObject })

    const soundObject1 = new Audio.Sound();
    this.setState({ soundObject1 })
    soundObject1.loadAsync(require('../../../resource/exercise/exercise_squart3.mp3'));

    const soundObject2 = new Audio.Sound();
    this.setState({ soundObject2 })
    soundObject2.loadAsync(require('../../../resource/exercise/exercise_squart4.mp3'));

    const soundObject3 = new Audio.Sound();
    this.setState({ soundObject3 })
    soundObject3.loadAsync(require('../../../resource/exercise/exercise_squart5.mp3'));

    const soundObject4 = new Audio.Sound();
    this.setState({ soundObject4 })
    soundObject4.loadAsync(require('../../../resource/exercise/exercise_squart6.mp3'));

    const soundObject5 = new Audio.Sound();
    this.setState({ soundObject5 })
    soundObject5.loadAsync(require('../../../resource/exercise/exercise_squart7.mp3'));

    const soundObject6 = new Audio.Sound();
    this.setState({ soundObject6 })
    soundObject6.loadAsync(require('../../../resource/exercise/exercise_standing4.mp3'));

    const soundObject7 = new Audio.Sound();
    this.setState({ soundObject7 })
    soundObject7.loadAsync(require('../../../resource/exercise/exercise_standing5.mp3'));

    const soundObject8 = new Audio.Sound();
    this.setState({ soundObject8 })
    soundObject8.loadAsync(require('../../../resource/exercise/exercise_standing6.mp3'));

    const soundObject9 = new Audio.Sound();
    this.setState({ soundObject9 })
    soundObject9.loadAsync(require('../../../resource/exercise/exercise_standing3.mp3'));

    const soundObject10 = new Audio.Sound();
    this.setState({ soundObject10 })
    soundObject10.loadAsync(require('../../../resource/exercise/exercise_standing2.mp3'));
  }


  componentWillUnmount() {
    if (this.rafID) {
      cancelAnimationFrame(this.rafID);
    }
    const { soundObject } = this.state;
    this.state.soundObject.stopAsync();

    this.state.soundObject1.unloadAsync();
    this.state.soundObject2.unloadAsync();
    this.state.soundObject3.unloadAsync();
    this.state.soundObject4.unloadAsync();
    this.state.soundObject5.unloadAsync();
    this.state.soundObject6.unloadAsync();
    this.state.soundObject7.unloadAsync();
    this.state.soundObject8.unloadAsync();
    this.state.soundObject9.unloadAsync();
    this.state.soundObject10.unloadAsync();
  }

  async componentDidMount() {
    //julia2

    const [tm] = await Promise.all([this.standingside_loadtmModel()]); // tree_loadtmModel 로 바꾸기 

    this.setState({
      //julia3
      isLoading: false,
      tm: tm,
    });
  }

  renderPose() {
    const MIN_KEYPOINT_SCORE = 0.2;
    const { pose } = this.state;

    if (pose != null) {
      const keypoints = pose.keypoints
        .filter(k => k.score > MIN_KEYPOINT_SCORE)
        .map((k, i) => {
          return <Circle
            key={`skeletonkp_${i}`}
            cx={k.position.x}
            cy={k.position.y}
            r='2'
            strokeWidth='0'
            fill='blue'
          />;
        });

      const adjacentKeypoints =
        posenet.getAdjacentKeyPoints(pose.keypoints, MIN_KEYPOINT_SCORE);

      const skeleton = adjacentKeypoints.map(([from, to], i) => {
        return <Line
          key={`skeletonls_${i}`}
          x1={from.position.x}
          y1={from.position.y}
          x2={to.position.x}
          y2={to.position.y}
          stroke='green'
          strokeWidth='3'
        />;
      });


      return (
        <Svg height='100%' width='100%'
          viewBox={`0 0 ${inputTensorWidth} ${inputTensorHeight}`}>
          {skeleton}
          {keypoints}
        </Svg>

      );
    } else {
      return null;
    }
  }




  render() {

    this.headerStyle();

    const { isLoading } = this.state;

    const camView =
      <TensorCamera
        // Standard Camera props
        style={styles.camera}
        type={this.state.cameraType}
        zoom={0}
        // tensor related props
        cameraTextureHeight={textureDims.height}
        cameraTextureWidth={textureDims.width}
        resizeHeight={inputTensorHeight}
        resizeWidth={inputTensorWidth}
        resizeDepth={3}
        ratio={"16:9"}
        // tree_init 로 바꾸기
        onReady={this.standingside_init}
        autorender={AUTORENDER}
      />


    const counterView =
      <View style={{ marginTop: 20, marginLeft: 20, zIndex: 100, backgroundColor: 'null' }}>
        <ProgressCircle
          percent={(standingside_count / 8) * 100}
          radius={70}
          borderWidth={20}
          color="#3399FF"
          shadowColor="#d1d1d1"
          bgColor="#fff"
        >
          <Text style={{ fontSize: 40 }}>{standingside_count}<Text style={{ fontSize: 15 }}>회</Text></Text>
        </ProgressCircle>
      </View>

    const poseView =
      <View style={styles.modelResults}>
        {this.renderPose()}
      </View>

    return (
      <View style={{ flex: 1 }}>
        {isLoading
          ? <View style={[styles.loadingIndicator]}><ActivityIndicator size='large' color='#43d5e9' /></View>
          : [camView, poseView, counterView]
        }
      </View>
    );
  }

}

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  loadingIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  cameraContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  camera: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 1,
  },
  modelResults: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 20
  },
});

