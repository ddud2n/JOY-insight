import React from 'react';
import { ActivityIndicator, Button, StyleSheet, View, Platform, Text, Dimensions } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack'
//카메라
//julia
import { Camera } from 'expo-camera';
import { ExpoWebGLRenderingContext } from 'expo-gl';
//딥러닝
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import Svg, { Circle, Rect, G, Line } from 'react-native-svg';
import * as tmPose from '@teachablemachine/pose';
import { Audio } from 'expo-av';
import ProgressCircle from 'react-native-progress-circle'
import AsyncStorage from '@react-native-async-storage/async-storage';


///////////////////////////////////////////////////////////////////////////
///////////////////////////러시안트위스트//////////////////////////////////
//////////////////////////////////////////////////////////////////////////




interface ScreenProps {
  navigation: any;
}

interface ScreenState {
  hasCameraPermission?: boolean;
  // tslint:disable-next-line: no-any
  cameraType: any;
  isLoading: boolean;
  pose?: posenet.Pose;
  tm?: tmPose.CustomPoseNet;
  dark?: string;
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
  soundObject11?: Audio.Sound;
  soundObject12?: Audio.Sound;
  soundObject13?: Audio.Sound;
  soundObject14?: Audio.Sound;
  soundObject15?: Audio.Sound;
  soundObject16?: Audio.Sound;
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


var status = 0
var count = 0
var start = 0
var total_count = 0
var error = 0

/////////////////////////////////////업적//////////////////////////////////////////////////////////
AsyncStorage.getItem('RussianTwist', (err, result) => {

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



export default class RussianTwist extends React.Component<ScreenProps, ScreenState> {
  rafID?: number;

  constructor(props: ScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      cameraType: Camera.Constants.Type.front,
      dark: 'false'
    };
    this.init = this.init.bind(this);
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

  //동작분류 모델 load
  async loadtmModel() {
    
    const modelJson = 'http://34.86.103.226:8000/russiantwist_model';
    const metaJson = 'http://34.86.103.226:8000/russiantwist_metadata';
    
    const model = await tmPose.load(modelJson, metaJson);
    return model;
  }


  async delay(how: number) {
    return new Promise(resolve => setTimeout(resolve, how));
  }


  //main 함수
  async init(
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void, gl: ExpoWebGLRenderingContext) {

    if (today_date != null && start_date != null) {
      diff = today_date.diff(start_date, 'days')
    }

    diff2 = diff + '_RussianTwist'
    AsyncStorage.getItem(diff2, (err, result) => {
      if (result == null) { }
      else {
        history = Number(result)
        
      }
    })

    const loop = async () => {
      //15회 달성시 종료
      if (count == 15) {
        await this.delay(1000);
        
        const soundObject = new Audio.Sound();
        await soundObject.loadAsync(require('../../resource/exercise/finish.mp3'));
        await soundObject.playAsync();
        await this.delay(1000);
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
      this.setState({ pose });
      tf.dispose([imageTensor]);

      if (pose != undefined) {
        var keypoints = pose.keypoints.filter(k => k.score > minScore)

      }



      //피드백 알고리즘
      if (prediction[0].probability > prediction[1].probability + prediction[2].probability + prediction[3].probability) {
        status = 1
        error = 0
      }
      else if (prediction[1].probability > prediction[0].probability + prediction[2].probability + prediction[3].probability) {
        if (status == 1 && pose != undefined && keypoints.length >= 7) {
          error = 0
          count++
          total_count++
          history++

          //음성api
          if (count == 1) {
            await this.state.soundObject1.playAsync();
          }
          else if (count == 2) {
            await this.state.soundObject2.playAsync();
          }
          else if (count == 3) {
            await this.state.soundObject3.playAsync();
          }
          else if (count == 4) {
            await this.state.soundObject4.playAsync();
          }
          else if (count == 5) {
            await this.state.soundObject5.playAsync();
          }
          else if (count == 6) {
            await this.state.soundObject6.playAsync();
          }
          else if (count == 7) {
            await this.state.soundObject7.playAsync();
          }
          else if (count == 8) {
            await this.state.soundObject8.playAsync();
          }
          else if (count == 9) {
            await this.state.soundObject9.playAsync();
          }
          else if (count == 10) {
            await this.state.soundObject10.playAsync();
          }
          else if (count == 11) {
            await this.state.soundObject11.playAsync();
          }
          else if (count == 12) {
            await this.state.soundObject12.playAsync();
          }
          else if (count == 13) {
            await this.state.soundObject13.playAsync();
          }
          else if (count == 14) {
            await this.state.soundObject14.playAsync();
          }
          else if (count == 15) {
            await this.state.soundObject15.playAsync();
          }
        }
        status = 2
      }
      else if (prediction[2].probability > prediction[1].probability + prediction[0].probability + prediction[3].probability) {
        error++
        if (error > 3 && pose != undefined && keypoints.length >= 7) {
          await this.state.soundObject16.playAsync();
          await this.delay(100)
          error = 0
        }
        status = 3
      }
      else if (prediction[3].probability > prediction[1].probability + prediction[2].probability + prediction[0].probability) {
        error++
        if (error > 3) {
          await this.state.soundObject16.playAsync();
          await this.delay(100)
          error = 0
        }
        status = 4
      }

      if (!AUTORENDER) {
        gl.endFrameEXP();
      }
      this.rafID = requestAnimationFrame(loop);
    };

    //처음 시작 시 동작 설명
    
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync(require('../../resource/exercise/exercise_twist1.mp3'));
    await soundObject.playAsync();
    await this.delay(18000)
    const soundObject111 = new Audio.Sound();
    await soundObject111.loadAsync(require('../../resource/exercise/start.mp3'));
    await soundObject111.playAsync();


    loop();
  }



  componentWillUnmount() {
    if (this.rafID) {
      cancelAnimationFrame(this.rafID);
    }

    AsyncStorage.setItem(diff2, history.toString(), () => { });
    AsyncStorage.setItem('RussianTwist', total_count.toString(), () => { });

    this.state.soundObject1.stopAsync();
    this.state.soundObject2.stopAsync();
    this.state.soundObject3.stopAsync();
    this.state.soundObject4.stopAsync();
    this.state.soundObject5.stopAsync();
    this.state.soundObject6.stopAsync();
    this.state.soundObject7.stopAsync();
    this.state.soundObject8.stopAsync();
    this.state.soundObject9.stopAsync();
    this.state.soundObject10.stopAsync();
    this.state.soundObject11.stopAsync();
    this.state.soundObject12.stopAsync();
    this.state.soundObject13.stopAsync();
    this.state.soundObject14.stopAsync();
    this.state.soundObject15.stopAsync();
    this.state.soundObject16.stopAsync();



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
    this.state.soundObject11.unloadAsync();
    this.state.soundObject12.unloadAsync();
    this.state.soundObject13.unloadAsync();
    this.state.soundObject14.unloadAsync();
    this.state.soundObject15.unloadAsync();
    this.state.soundObject16.unloadAsync();
  }

  async componentDidMount() {
    //julia2

    const [tm] = await Promise.all([this.loadtmModel()]);

    this.setState({
      //julia3
      isLoading: false,
      tm: tm,
    });
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
    soundObject1.loadAsync(require('../../resource/exercise/1.mp3'));

    const soundObject2 = new Audio.Sound();
    this.setState({ soundObject2 })
    soundObject2.loadAsync(require('../../resource/exercise/2.mp3'));

    const soundObject3 = new Audio.Sound();
    this.setState({ soundObject3 })
    soundObject3.loadAsync(require('../../resource/exercise/3.mp3'));

    const soundObject4 = new Audio.Sound();
    this.setState({ soundObject4 })
    soundObject4.loadAsync(require('../../resource/exercise/4.mp3'));

    const soundObject5 = new Audio.Sound();
    this.setState({ soundObject5 })
    soundObject5.loadAsync(require('../../resource/exercise/5.mp3'));

    const soundObject6 = new Audio.Sound();
    this.setState({ soundObject6 })
    soundObject6.loadAsync(require('../../resource/exercise/6.mp3'));

    const soundObject7 = new Audio.Sound();
    this.setState({ soundObject7 })
    soundObject7.loadAsync(require('../../resource/exercise/7.mp3'));

    const soundObject8 = new Audio.Sound();
    this.setState({ soundObject8 })
    soundObject8.loadAsync(require('../../resource/exercise/8.mp3'));

    const soundObject9 = new Audio.Sound();
    this.setState({ soundObject9 })
    soundObject9.loadAsync(require('../../resource/exercise/9.mp3'));

    const soundObject10 = new Audio.Sound();
    this.setState({ soundObject10 })
    soundObject10.loadAsync(require('../../resource/exercise/10.mp3'));

    const soundObject11 = new Audio.Sound();
    this.setState({ soundObject11 })
    soundObject11.loadAsync(require('../../resource/exercise/11.mp3'));

    const soundObject12 = new Audio.Sound();
    this.setState({ soundObject12 })
    soundObject12.loadAsync(require('../../resource/exercise/12.mp3'));

    const soundObject13 = new Audio.Sound();
    this.setState({ soundObject13 })
    soundObject13.loadAsync(require('../../resource/exercise/13.mp3'));

    const soundObject14 = new Audio.Sound();
    this.setState({ soundObject14 })
    soundObject14.loadAsync(require('../../resource/exercise/14.mp3'));

    const soundObject15 = new Audio.Sound();
    this.setState({ soundObject15 })
    soundObject15.loadAsync(require('../../resource/exercise/15.mp3'));

    const soundObject16 = new Audio.Sound();
    this.setState({ soundObject16 })
    soundObject16.loadAsync(require('../../resource/exercise/exercise_twist2.mp3'));
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
        // tree_init 로 바꾸기
        onReady={this.init}
        autorender={AUTORENDER}
        ratio={"16:9"}
      />

    const counterView =
      <View style={{ marginTop: 20, marginLeft: 20, zIndex: 100, backgroundColor: 'null' }}>
        <ProgressCircle
          percent={(count / 15) * 100}
          radius={70}
          borderWidth={20}
          color="#3399FF"
          shadowColor="#d1d1d1"
          bgColor="#fff"
        >
          <Text style={{ fontSize: 40 }}>{count}<Text style={{ fontSize: 15 }}>회</Text></Text>
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
          : [camView, poseView, counterView]}
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
