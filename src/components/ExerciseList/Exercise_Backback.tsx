import React from 'react';
import { ActivityIndicator, Animated, StyleSheet, View, Platform, Dimensions, Text } from 'react-native';
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
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
//TTS
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface ScreenProps {
  navigation: any
}

interface ScreenState {
  hasCameraPermission?: boolean;
  // tslint:disable-next-line: no-any
  cameraType: any;
  isLoading: boolean;
  pose?: posenet.Pose;
  tm?: tmPose.CustomPoseNet;
  dark?: string;
  timer?: boolean;
  soundObject1?: Audio.Sound;
  soundObject2?: Audio.Sound;
  soundObject3?: Audio.Sound;
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

// backback_miss_count
var backback_status = "null";
var backback_miss_count = 0;
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

export default class backback extends React.Component<ScreenProps, ScreenState> {
  rafID?: number;

  constructor(props: ScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      cameraType: Camera.Constants.Type.front,
      dark: 'false',
      timer: false
    };
    this.backback_init = this.backback_init.bind(this); // tree_init 로 바꾸기 
  }

  headerStyle = () => {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => this.props.navigation.navigate("exercise_list")}
          tintColor={this.state.dark == 'false' ? 'black' : 'yellow'}
        />
      )
    })
  }

  //백익스텐션 모델 load
  async backback_loadtmModel() {
    const modelJson = 'http://34.86.103.226:8000/backback_model'; //model.json 에서 wieghts 부분 수정하기
    const metaJson = 'http://34.86.103.226:8000/backback_metadata';
    var model = await tmPose.load(modelJson, metaJson);
    return model;
  }

  async delay(how: number) {
    return new Promise(resolve => setTimeout(resolve, how));
  }


  //backback main 함수
  async backback_init(
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void, gl: ExpoWebGLRenderingContext) {

    if (today_date != null && start_date != null) {
      diff = today_date.diff(start_date, 'days')
    }

    diff2 = diff + '_Backback'
    AsyncStorage.getItem(diff2, (err, result) => {
      if (result == null) { }
      else {
        history = Number(result)
        
      }
    })

    const loop = async () => {

      if (new Date().getTime() >= backback_miss_count + 30000) {
        history = history + 30
        const soundObject = new Audio.Sound();
        await soundObject.loadAsync(require('../../resource/exercise/exercise_backback5.mp3'));
        await soundObject.playAsync();
        await this.delay(1000)
        return (this.props.navigation.navigate('exercise_list'))
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
        var NotKeypoints = pose.keypoints.filter(k => k.score < minScore)
      }
      else { }


      //피드백 알고리즘
      if (prediction[0].probability >= 0.90 && pose != undefined && keypoints.length >= 7) {
        if (backback_status == "correct" || backback_status == "wrong_arm" || backback_status == "bent") {
          await this.state.soundObject1.playAsync();
          await this.delay(2000)
        }
        backback_status = "stand"
      }
      else if (prediction[1].probability >= 0.90 && pose != undefined && keypoints.length >= 7) {
        if (backback_status == "stand" || backback_status == "wrong_arm" || backback_status == "bent") {
          await this.state.soundObject2.playAsync();
          await this.delay(1000)
        }
        backback_status = "correct"
      }
      else if (prediction[2].probability >= 0.90 && pose != undefined && keypoints.length >= 7) {
        if (backback_status == "correct" || backback_status == "wrong_arm" || backback_status == "stand") {
          await this.state.soundObject1.playAsync();
          await this.delay(2000)
        }
        backback_status = "bent"
      }
      else if (prediction[3].probability >= 0.70 && pose != undefined && keypoints.length >= 7) {
        if (backback_status == "correct" || backback_status == "bent" || backback_status == "stand") {
          await this.state.soundObject3.playAsync();
          await this.delay(2000)
        }
        backback_status = "wrong_arm"
      }


      this.setState({ pose });
      tf.dispose([imageTensor]);


      if (!AUTORENDER) {
        gl.endFrameEXP();
      }
      this.rafID = requestAnimationFrame(loop);

    };

    backback_status = "null";
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync(require('../../resource/exercise/exercise_backback1.mp3'));
    await soundObject.playAsync();
    await this.delay(17000).then(() => this.setState({ timer: true }))
    backback_miss_count = new Date().getTime();

    loop();

  }





  componentWillUnmount() {
    if (this.rafID) {
      cancelAnimationFrame(this.rafID);
    }

    AsyncStorage.setItem(diff2, history.toString(), () => { });

    this.state.soundObject1.stopAsync();
    this.state.soundObject2.stopAsync();
    this.state.soundObject3.stopAsync();

    this.state.soundObject1.unloadAsync();
    this.state.soundObject2.unloadAsync();
    this.state.soundObject3.unloadAsync();
  }

  async componentDidMount() {
    //julia2

    const [tm] = await Promise.all([this.backback_loadtmModel()]); // tree_loadtmModel 로 바꾸기 

    this.setState({
      //julia3
      isLoading: false,
      tm: tm,
    });

    //await this.delay(22000).then(() => this.setState({ timer: true }))
  }


  UNSAFE_componentWillMount() {
    AsyncStorage.getItem('dark', (err, result) => {
      if (result == null) {
        this.setState({ dark: 'false' })
      } else {
        this.setState({ dark: result })
      }
    })

    const soundObject1 = new Audio.Sound();
    this.setState({ soundObject1 })
    soundObject1.loadAsync(require('../../resource/exercise/exercise_backback2.mp3'));
    const soundObject2 = new Audio.Sound();
    this.setState({ soundObject2 })
    soundObject2.loadAsync(require('../../resource/exercise/exercise_backback4.mp3'));

    const soundObject3 = new Audio.Sound();
    this.setState({ soundObject3 })
    soundObject3.loadAsync(require('../../resource/exercise/exercise_backback3.mp3'));
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

      const boxpoints = posenet.getBoundingBox(pose.keypoints)
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
        // tree_init 로 바꾸기
        onReady={this.backback_init}
        autorender={AUTORENDER}
        ratio={"16:9"}
      />

    const timerView =
      <View style={{ marginTop: 20, marginLeft: 20, zIndex: 100, backgroundColor: 'null' }}>
        <CountdownCircleTimer
          isPlaying
          duration={30}
          size={140}
          strokeWidth={20}
          //strokeLinecap={'square'}
          colors={[
            ['#3399FF', 0.4],
            ['#dafc2d', 0.4],
            ['#ff4e33', 0.2],
          ]}
          trailColor={'#d1d1d1'}
        >
          {({ remainingTime }) => (
            <Animated.Text style={{ color: 'black', fontSize: 40 }}>
              {remainingTime}
              <Text style={{ fontSize: 15 }}>초</Text>
            </Animated.Text>
          )}
        </CountdownCircleTimer>
      </View>

    const poseView =
      <View style={styles.modelResults}>
        {this.renderPose()}
      </View>

    return (
      <View style={{ height: '100%' }}>
        {isLoading
          ? <View style={[styles.loadingIndicator]}>
            <ActivityIndicator size='large' color='#43d5e9' /></View>
          : [camView, poseView, (this.state.timer ? timerView : null)]}

      </View>
    );
  }

}

const styles = StyleSheet.create({
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
    zIndex: 20,
  }
});
