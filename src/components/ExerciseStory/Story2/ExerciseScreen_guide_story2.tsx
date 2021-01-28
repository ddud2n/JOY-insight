import React from 'react';
import { ActivityIndicator, StyleSheet, View, Platform } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack'
//카메라
//julia
import { Camera } from 'expo-camera';
import { ExpoWebGLRenderingContext } from 'expo-gl';
//딥러닝
import * as tf from '@tensorflow/tfjs';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as coco from '@tensorflow-models/coco-ssd';
import * as posenet from '@tensorflow-models/posenet';
import Svg, { Circle, Rect, Line } from 'react-native-svg';
//TTS
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ScreenProps {
  navigation: any,
  route: any,
}

interface ScreenState {
  hasCameraPermission?: boolean;
  // tslint:disable-next-line: no-any
  cameraType: any;
  isLoading: boolean;
  object?: coco.ObjectDetection;
  posenet?: posenet.PoseNet;
  pose?: posenet.Pose;
  predictions?: coco.DetectedObject[];
  complete: boolean;
  count: number;
  dark: string;
}

//for tensor-camera
const inputTensorWidth = 152;
const inputTensorHeight = 200;

// TODO File issue to be able get this from expo.
// Caller will still need to account for orientation/phone rotation changes
let textureDims: { width: number; height: number; };
if (Platform.OS === 'ios') {
  textureDims = {
    height: 1920,
    width: 1080,
  };
} else {
  textureDims = {
    height: 1200,
    width: 1600
  };
}

const AUTORENDER = true;

//for camera guide (init())
const minScore = 0.2;

//for compare
var NotKeypointsArr = [];
var DetectedArr = [];
var right = ['leftShoulder', 'leftElbow', 'leftWrist', 'leftHip', 'leftKnee'];
var left = ['rightShoulder', 'rightElbow', 'rightWrist', 'rightHip', 'rightKnee'];
var back = ['nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar', 'rightAnkle', 'leftAnkle'];

// tslint:disable-next-line: variable-name
const TensorCamera = cameraWithTensors(Camera);


export default class Exercise_guide_story2 extends React.Component<ScreenProps, ScreenState> {
  rafID?: number;

  constructor(props: ScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      cameraType: Camera.Constants.Type.front,
      complete: false,
      count: 0,
      dark: 'false',
    };
    this.init = this.init.bind(this);
  }


  headerStyle = () => {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => this.props.navigation.replace("exercise_story")}
           tintColor={this.state.dark=='false'?'black':'yellow'}
        />
      )
    })
  }

  async delay(how: number) {
    return new Promise(resolve => setTimeout(resolve, how));
  }

  async init(
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void, gl: ExpoWebGLRenderingContext) {
    const flipHorizontal = Platform.OS === 'ios' ? false : true;

    //(audio)운동을 시작합니다. 핸드폰을 평평한 바닥에 세로로 세워주세요. 
    //주위에 사물이 없는지 유의하시고, 안내에 따라 뒤로 3~6걸음 이동해 주세요.
    await this.delay(1000)
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync(require('../../../resource/guide/guide_1.mp3'));
    await soundObject.playAsync();
    await this.delay(15000)

    const loop = async () => {
      if (!AUTORENDER) {
        updatePreview();
      }
      const imageTensor = images.next().value;
      const flipHorizontal = Platform.OS === 'ios' ? false : true;

      const pose = await this.state.posenet.estimateSinglePose(imageTensor, { flipHorizontal });
      this.setState({ pose });

      const predictions = await this.state.object.detect(imageTensor);
      this.setState({ predictions });

      tf.dispose([imageTensor]);

      if (!AUTORENDER) {
        gl.endFrameEXP();
      }
      this.rafID = requestAnimationFrame(loop);

    };
    const { params } = this.props.route;

    await loop();

    await this.isObject(this.state.predictions)

    while (this.state.count < 3 && this.props.navigation.isFocused()) {

      await this.isPose(this.state.pose);
      await this.delay(2000);
    }

    if (this.props.navigation.isFocused()) {
      
      await this.setState({ complete: true })

      //(수정)
      //(audio)띵! 카메라 조정이 완료되었습니다. 3초 후 운동이 시작됩니다.
      const soundObject_complete = new Audio.Sound();
      await soundObject_complete.loadAsync(require('../../../resource/guide/guide_complete.mp3'));
      await soundObject_complete.playAsync();
      await this.delay(5000);
      return (this.props.navigation.replace('exercise_story2_stage1'))
    }
  }


  async isObject(predictions) {
    const soundObject = new Audio.Sound();
    for (let i in predictions) {
      if (predictions[i].class != 'person') {
        DetectedArr.push(predictions[i].class);
      }
    }
    if (DetectedArr.length != 0) {
      
      
      await soundObject.loadAsync(require('../../../resource/guide/guide_object_warning.mp3'));
      await soundObject.playAsync();
      this.delay(5000);
    }
    DetectedArr = [];
  }

  intersect(a, b) {
    var tmp = {}, res = [];
    for (let i in a) tmp[a[i]] = 1;
    for (let i in b) if (tmp[b[i]]) res.push(b[i]);
    return res;
  }

  async isPose(pose) {
    const keypoints = pose.keypoints.filter(k => k.score > minScore)
    const NotKeypoints = pose.keypoints.filter(k => k.score < minScore)

    const feedback = async () => {
      const soundObject = new Audio.Sound();
      if (this.intersect(back, NotKeypointsArr).length > 3) {
        //(audio)반 보 뒤로 이동해주세요!
        const soundObject = new Audio.Sound();
        await soundObject.loadAsync(require('../../../resource/guide/guide_pose_back.mp3'));
        await soundObject.playAsync();
        await this.delay(1000);
        
      } else if (this.intersect(right, NotKeypointsArr).length >= 2 && this.intersect(left, NotKeypointsArr).length <= 2) {
        //(audio)오른쪽으로 반 보 이동해주세요!/뒤로 한 걸음 이동해주세요!
        const soundObject = new Audio.Sound();
        await soundObject.loadAsync(require('../../../resource/guide/guide_pose_right.mp3'));
        await soundObject.playAsync();
        
        await this.delay(2000);
      } else if (this.intersect(left, NotKeypointsArr).length > 2 && this.intersect(left, NotKeypointsArr).length <= 2) {
        //(audio)왼쪽으로 반 보 이동해주세요!
        const soundObject = new Audio.Sound();
        await soundObject.loadAsync(require('../../../resource/guide/guide_pose_left.mp3'));
        await soundObject.playAsync();
        
        await this.delay(2000);
      }
    }


    //전체 17개 관절 포인트 모두 detect될 때
    if (keypoints.length == 17) {
      this.setState({ count: this.state.count + 1 });
      //(수정)
      //(audio) 성공 효과음
      const soundObject_success = new Audio.Sound();
      await soundObject_success.loadAsync(require('../../../resource/guide/guide_pose_success.mp3'));
      await soundObject_success.playAsync();
      
      

    } else if (keypoints.length == 0) {
      //(audio) 어디 계신가요? 화면에 보이지 않아요!
      const soundObject_null = new Audio.Sound();
      await soundObject_null.loadAsync(require('../../../resource/guide/guide_pose_null.mp3'));
      await soundObject_null.playAsync();
      
      

    } else if (keypoints.length != 17) {
      //전체 detect에 실패할 때
      for (let i in NotKeypoints) {
        NotKeypointsArr.push(NotKeypoints[i].part);
      }

      //(audio) feedback 함수 내 오디오 재생
      await feedback();

      
      
      

      NotKeypointsArr = [];
    }
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
          <Rect
            x={boxpoints.minX}
            y={boxpoints.minY}
            width={boxpoints.maxX - boxpoints.minX}
            height={boxpoints.maxY - boxpoints.minY}
            strokeWidth='2'
            stroke='blue'
          />
        </Svg>

      );
    } else {
      return null;
    }
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

  componentWillUnmount() {
    if (this.rafID) {
      cancelAnimationFrame(this.rafID);
    }
  }

  async componentDidMount() {
    //julia2
    const Object = await coco.load();
    const Posenet = await posenet.load();
    this.setState({
      //julia3
      isLoading: false,
      object: Object,
      posenet: Posenet,
    });
  }

  render() {
    this.headerStyle()

    const { isLoading } = this.state;
    const { complete } = this.state;

    const camView =
      <View>
        <View style={styles.cameraContainer}>
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
            onReady={this.init}
            ratio="16:9"
            autorender={AUTORENDER}
          />
        </View>

        <View style={styles.modelResults}>
          {this.renderPose()}
        </View>

        {complete
          ? <Svg style={{ flex: 1 }}>
            <Rect x="0" y="0" width="100%" height="100%" stroke="green" strokeOpacity="0.7" strokeWidth="100" />
          </Svg>
          :
          <Svg style={{ flex: 1 }}>
            <Rect x="0" y="0" width="100%" height="100%" stroke="red" strokeOpacity="0.7" strokeWidth="100" />
          </Svg>}

      </View>;



    return (
      // <View style={{flex:1}}>
      isLoading
        ? <View style={[styles.loadingIndicator]}>
          <ActivityIndicator size='large' color='#43d5e9' />
        </View>
        : camView
      //  </View>
    );
  }

}

const styles = StyleSheet.create({
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  cameraContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
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
    zIndex:20
  }

});
