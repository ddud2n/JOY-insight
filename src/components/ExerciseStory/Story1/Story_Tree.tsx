import React from 'react';
import { ActivityIndicator, Animated, StyleSheet, View, Platform, Text, Dimensions, ImageBackground, Image } from 'react-native';
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
import { LayerVariable } from '@tensorflow/tfjs';
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
  soundObject?: Audio.Sound;
  dark: string;
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

const { width, height } = Dimensions.get('window');

const Timer = () => (
  <CountdownCircleTimer
    isPlaying
    duration={20}
    colors={[
      ['#004777', 0.4],
      ['#F7B801', 0.4],
      ['#A30000', 0.2],
    ]}
  >
    {({ remainingTime }) => (
      <Animated.Text style={{ color: 'black' }}>
        {remainingTime}
      </Animated.Text>
    )}
  </CountdownCircleTimer>
)


const AUTORENDER = true;

// tslint:disable-next-line: variable-name
const TensorCamera = cameraWithTensors(Camera);

// tree_miss_count
var tree_status = "null";
var tree_miss_count = 0;
var seconds_30 = 0;
var total_count = 0;
var tree_miss = 0;

/////////////////////////////////////업적//////////////////////////////////////////////////////////
AsyncStorage.getItem('Tree', (err, result) => {

  if (result == null) { }
  else { total_count = Number(result) }
});
//////////////////////////////////히스토리//////////////////////////////////////////////////////////
var moment = require('moment');
let start_date = moment().format("YYYY-MM-DD");
let today_date = moment()//.add(4, 'd');
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


export default class tree extends React.Component<ScreenProps, ScreenState> {
  rafID?: number;

  constructor(props: ScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      cameraType: Camera.Constants.Type.front,
      dark: 'false',
      timer: false,
    };
    this.tree_init = this.tree_init.bind(this); // tree_init 로 바꾸기 
  }

  headerStyle = () => {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => this.props.navigation.replace('exercise_story')}
          tintColor={this.state.dark == 'false' ? 'black' : 'yellow'}
        />
      )
    })
  }

  // 나무자세 모델 load
  async tree_loadtmModel() {
    const modelJson = 'http://34.86.103.226:8000/tree_model'; //model.json 에서 wieghts 부분 수정하기
    const metaJson = 'http://34.86.103.226:8000/tree_metadata';
    var model = await tmPose.load(modelJson, metaJson);
    return model;
  }

  async delay(how: number) {
    return new Promise(resolve => setTimeout(resolve, how));
  }


  //tree main 함수
  async tree_init(
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void, gl: ExpoWebGLRenderingContext) {
    if (today_date != null && start_date != null) {
      diff = today_date.diff(start_date, 'days')
    }

    diff2 = diff + '_Tree'
    AsyncStorage.getItem(diff2, (err, result) => {
      if (result == null) { }
      else {
        history = Number(result)
        
      }
    })
    const loop = async () => {

      if (seconds_30 == 0) {
        if (new Date().getTime() >= tree_miss_count + 20000) {
          total_count += 20
          history += 20
          
          

          const soundObject = new Audio.Sound();
          await soundObject.loadAsync(require('../../../resource/exercise/exercise_tree5.mp3'));
          await soundObject.playAsync();


          if (this.props.navigation.isFocused()) {
            const soundObject22 = new Audio.Sound();
            await soundObject22.loadAsync(require('../../../resource/story1/_wind.mp3'));
            await soundObject22.playAsync()
            const soundObject33 = new Audio.Sound();
            await soundObject33.loadAsync(require('../../../resource/story1/_bird.mp3'));
            await soundObject33.playAsync()
          }
          seconds_30 = 1;
        }
      }
      else if (new Date().getTime() >= tree_miss_count + 40000) {
        total_count += 20
        history += 20

        
        

        AsyncStorage.setItem('tree_miss', tree_miss.toString(), () => { });
        
        const soundObject = new Audio.Sound();
        await soundObject.loadAsync(require('../../../resource/exercise/exercise_tree6.mp3'));
        await soundObject.playAsync();
        await this.delay(1000)
        return (this.props.navigation.replace('exercise_story1_stage2'))
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
      if (prediction[0].probability >= 0.90 && pose != undefined && keypoints.length >= 7) {
        tree_status = "stand"
      }
      else if (prediction[1].probability >= 0.80 && pose != undefined && keypoints.length >= 7) {
        if (tree_status == "wrong_arm" || tree_status == "wrong_leg" || tree_status == "stand") {
          tree_status = "correct"
          
          await this.state.soundObject1.playAsync();
          await this.delay(1000)
        }
      }
      else if (prediction[2].probability >= 0.90 && pose != undefined && keypoints.length >= 7) {
        if (tree_status == "correct" || tree_status == "wrong_leg" || tree_status == "stand") {
          
          await this.state.soundObject2.playAsync();
          await this.delay(2000);
          tree_status = "wrong_arm";
          tree_miss++;
        }
      }
      else if (prediction[3].probability >= 0.60 && pose != undefined && keypoints.length >= 7) {
        if (tree_status == "correct" || tree_status == "wrong_arm" || tree_status == "stand") {
          
          await this.state.soundObject3.playAsync();
          await this.delay(1000)
          tree_status = "wrong_leg";
          tree_miss++;
        }
      }


      this.setState({ pose });
      tf.dispose([imageTensor]);
      

      if (!AUTORENDER) {
        gl.endFrameEXP();
      }
      this.rafID = requestAnimationFrame(loop);

    };

       const soundObject = new Audio.Sound();
    await soundObject.loadAsync(require('../../../resource/exercise/exercise_tree1.mp3'));
    await soundObject.playAsync();
    await this.delay(15000).then(() => this.setState({ timer: true }))
    seconds_30 = 0;

    tree_miss_count = new Date().getTime();
    if (this.props.navigation.isFocused()) {
      const soundObject_key1 = new Audio.Sound();
      await soundObject_key1.loadAsync(require('../../../resource/story1/_wind.mp3'));
      await soundObject_key1.playAsync()
      const soundObject_key2 = new Audio.Sound();
      await soundObject_key2.loadAsync(require('../../../resource/story1/_bird.mp3'));
      await soundObject_key2.playAsync()
    }

    loop();

  }



  async UNSAFE_componentWillMount() {
    AsyncStorage.getItem('dark', (err, result) => {
      if (result == null) {
        this.setState({ dark: 'false' })
      } else {
        this.setState({ dark: result })
      }
    })

    const soundObject = new Audio.Sound();
    this.setState({ soundObject });

    const soundObject1 = new Audio.Sound();
    this.setState({ soundObject1 })
    soundObject1.loadAsync(require('../../../resource/exercise/exercise_tree4.mp3'));

    const soundObject2 = new Audio.Sound();
    this.setState({ soundObject2 })
    soundObject2.loadAsync(require('../../../resource/exercise/exercise_tree3.mp3'));

    const soundObject3 = new Audio.Sound();
    this.setState({ soundObject3 })
    soundObject3.loadAsync(require('../../../resource/exercise/exercise_tree2.mp3'));

  }

  componentWillUnmount() {
    if (this.rafID) {
      cancelAnimationFrame(this.rafID);
    }

    AsyncStorage.setItem('Tree', total_count.toString(), () => { });
    AsyncStorage.setItem(diff2, history.toString(), () => { });

    this.state.soundObject.stopAsync();

    this.state.soundObject1.stopAsync();
    this.state.soundObject2.stopAsync();
    this.state.soundObject3.stopAsync();



    this.state.soundObject.unloadAsync();
    this.state.soundObject1.unloadAsync();
    this.state.soundObject2.unloadAsync();
    this.state.soundObject3.unloadAsync();
  }

  async componentDidMount() {
    //julia2

    const [tm] = await Promise.all([this.tree_loadtmModel()]);

    this.setState({
      //julia3
      isLoading: false,
      tm: tm,
    });

    //await this.delay(18000).then(() => this.setState({ timer: true }))
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
        onReady={this.tree_init}
        autorender={AUTORENDER}
      />

    const timerView =
      <View style={{ marginTop: 20, marginLeft: 20, zIndex: 100, backgroundColor: 'null' }}>
        <CountdownCircleTimer
          isPlaying
          duration={40}
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
      <View style={{ flex: 1 }}>
        {isLoading
          ? <View style={[styles.loadingIndicator]}><ActivityIndicator size='large' color='#43d5e9' /></View>
          : [camView, poseView, (this.state.timer ? timerView : null)]}
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
  }
});
