import React from 'react';
import { Text, StyleSheet, ScrollView, View, TouchableOpacity, Image, Alert,Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface Props {
  navigation: any,
  route: any,
}


const AUTORENDER = true;

export default class Opensource_info extends React.Component<Props> {
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
              '도움말', '\n현재 페이지는 [설정]-[오픈소스 라이선스] 페이지 입니다.\n 본 어플리케이션 제작에 활용된 오픈소스 라이선스들을 고지합니다.',
              [{ text: "확인" }],

            )}
          
          accessibilityLabel='도움말'
        >
          <Image
            style={{ width: 30, height: 30, marginRight: 10 }}
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
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>저작권 고지</Text>
          <View style={{flexDirection:'row', alignItems:'center'}}>
          <Image
            resizeMode='contain'
            style={{ width:Dimensions.get('window').width*0.1 }}
            source={require('../../../assets/icons/ccl.png')} />
          <Text style={{ fontSize: Dimensions.get('window').width*0.03}}>
          {"\b"}{"\b"}{"\b"}{"\b"}Beautiful Korea(뷰티플 코리아) by 윤영현, 공유마당, CC BY</Text>
            </View>
            <View style={{flexDirection:'row', alignItems:'center'}}>
          <Image
            resizeMode='contain'
            style={{ width:Dimensions.get('window').width*0.1 }}
            source={require('../../../assets/icons/ccl.png')} />
          <Text style={{ fontSize: Dimensions.get('window').width*0.03}}>
          {"\b"}{"\b"}{"\b"}{"\b"}징소리F by 김용배, 공유마당, CC BY</Text>
            </View>
            <Text style={{ fontSize: Dimensions.get('window').width*0.03, borderBottomWidth: 1 }}></Text>
          <Text style={{ fontSize: 25, fontWeight: '700' }}>Opensource License</Text>
          <Text style={{ fontSize: Dimensions.get('window').width*0.03, borderBottomWidth: 1 }}>
axios
{"\n"}MIT license
{"\n"}Copyright (c) 2014-present Matt Zabriskie
{"\n"}https://github.com/axios/axios
{"\n"}{"\n"}

babel
{"\n"}MIT license
{"\n"}Copyright (c) 2014-present Sebastian McKenzie and other contributors
{"\n"}https://github.com/babel/babel
{"\n"}{"\n"}

expo
{"\n"}MIT license
{"\n"}Copyright (c) 2015-present 650 Industries, Inc.
{"\n"}https://github.com/expo/expo
{"\n"}{"\n"}

React
{"\n"}MIT License
{"\n"}Copyright (c) Facebook, Inc. and its affiliates.
{"\n"}https://github.com/facebook/react
{"\n"}{"\n"}

react-native
{"\n"}MIT License
{"\n"}Copyright (c) Facebook, Inc. and its affiliates.
{"\n"}https://github.com/facebook/react-native
{"\n"}{"\n"}

react-navigation
{"\n"}MIT License
{"\n"}Copyright (c) 2017 React Navigation Contributors
{"\n"}https://github.com/react-navigation/react-navigation
{"\n"}{"\n"}

react-native-countdown-circle-timer
{"\n"}MIT License
{"\n"}Copyright (c) Vasil Dimitrov
{"\n"}https://github.com/vydimitrov/react-countdown-circle-timer
{"\n"}{"\n"}

react-native-progress-circle
{"\n"}MIT License
{"\n"}Copyright (c) 2017 Christoph Michel
{"\n"}https://github.com/MrToph/react-native-progress-circle
{"\n"}{"\n"}

react-native-svg
{"\n"}MIT License
{"\n"}Copyright (c) 2015-2016 Horcrux
{"\n"}https://github.com/react-native-svg/react-native-svg
{"\n"}{"\n"}

teachablemachine
{"\n"}Apache-2.0
{"\n"}Copyright 2019 Google
{"\n"}https://www.npmjs.com/package/@teachablemachine/image
{"\n"}{"\n"}

tensorflow/tfjs
{"\n"}Apache-2.0
{"\n"}Copyright 2019 The TensorFlow Authors
{"\n"}https://github.com/tensorflow/tfjs
{"\n"}{"\n"}

typescript
{"\n"}MIT License
{"\n"}Copyright (c) Microsoft Corporation
{"\n"}https://github.com/microsoft/TypeScript
{"\n"}{"\n"}

jest
{"\n"}MIT License
{"\n"}Copyright (c) Facebook, Inc. and its affiliates.
{"\n"}https://github.com/facebook/jest
{"\n"}{"\n"}
          </Text>

          <Text style={{ fontSize: 25, fontWeight: '700' }}>Apache License</Text>
          <Text style={{ fontSize: Dimensions.get('window').width*0.03, borderBottomWidth: 1 }}>
            Version 2.0, January 2004{"\n"}
                        http://www.apache.org/licenses/{"\n"}{"\n"}

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION{"\n"}{"\n"}

   1. Definitions.{"\n"}{"\n"}

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.
{"\n"}{"\n"}
      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.
{"\n"}{"\n"}
      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.
{"\n"}{"\n"}
      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.
{"\n"}{"\n"}
      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.
{"\n"}{"\n"}
      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.
{"\n"}{"\n"}
      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).
{"\n"}{"\n"}
      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.
{"\n"}{"\n"}
      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."
{"\n"}{"\n"}
      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.
{"\n"}{"\n"}
   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.
{"\n"}{"\n"}
   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.
{"\n"}{"\n"}
   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:
{"\n"}{"\n"}
      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and
{"\n"}{"\n"}
      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and
{"\n"}{"\n"}
      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and
{"\n"}{"\n"}
      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.
{"\n"}{"\n"}
      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.
{"\n"}{"\n"}
   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.
{"\n"}{"\n"}
   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.
{"\n"}{"\n"}
   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.
{"\n"}{"\n"}
   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.
{"\n"}{"\n"}
   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.
{"\n"}{"\n"}
   END OF TERMS AND CONDITIONS
{"\n"}{"\n"}
   APPENDIX: How to apply the Apache License to your work.
{"\n"}{"\n"}
      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.
{"\n"}{"\n"}
   Copyright [] []
{"\n"}{"\n"}
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
{"\n"}{"\n"}
       http://www.apache.org/licenses/LICENSE-2.0
{"\n"}{"\n"}
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   {"\n"}{"\n"}
          </Text>

          <Text style={{ fontSize: 25, fontWeight: '700' }}>MIT License</Text>
          <Text style={{ fontSize: Dimensions.get('window').width*0.03 }}>
            MIT License Copyright (c)

{"\n"}{"\n"}Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

{"\n"}{"\n"}The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

{"\n"}{"\n"}THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.{"\n"}{"\n"}
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
    flex: 1,
    paddingHorizontal: 15
  },
  TitleText: {
    fontSize: 40,
    fontWeight: 'bold'
  }

});
