import { StyleSheet, View } from "react-native";
import { Button, ButtonGroup, Text } from "@rneui/themed";
import * as Font from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SummaryScreen from "./SummaryScreen";
import { React, useState } from "react";

async function cacheFonts(fonts) {
  return fonts.map(async (font) => await Font.loadAsync(font));
}

const Stack = createNativeStackNavigator();
const sampleData = [
  {
    prompt: "Which of the following is a track in the UCF Digital Media BA?",
    type: "multiple-choice",
    choices: [
      "Web Design",
      "Game Design",
      "Both Web Design and Game Design",
      "None of the above",
    ],
    correct: 2,
  },
  {
    prompt:
      "Which of the following are UCF's school colors? Select all that apply.",
    type: "multiple-answer",
    choices: ["Green", "Black", "Gold", "Blue"],
    correct: [1, 2],
  },
  {
    prompt: "True or false: The sky is blue.",
    type: "true-false",
    choices: ["True", "False"],
    correct: 0,
  },
];

function Question({ navigation, route }) {
  console.log(route.params);
  const { questionNumber, userChoices, data } = route.params;
  let { choices, prompt, type } = data[questionNumber];
  let initialSelection = 0;
  let [selectedIndex, setSelectedIndex] = useState(0);
  let [selectedIndexes, setSelectedIndexes] = useState([]);
  let nextQuestion = () => {
    let nextQuestion = questionNumber + 1;
    console.log(selectedIndex);
    if (type !== "multiple-answer") {
      userChoices.push(selectedIndex);
    } else {
      userChoices.push(selectedIndexes);
    }
    if (nextQuestion < sampleData.length) {
      console.log("Navigating to next question...");
      console.log({ questionNumber: nextQuestion, sampleData, userChoices });
      navigation.navigate("Question", {
        questionNumber: nextQuestion,
        sampleData,
        userChoices,
      });
    } else {
      navigation.navigate("SummaryScreen", {
        questionNumber: nextQuestion,
        sampleData,
        userChoices,
      });
    }
  };
  return (
    <View style={styles.container}>
      <Text>{prompt}</Text>
      {type !== "multiple-answer" ? (
        <ButtonGroup
          testID="choices"
          buttons={choices}
          vertical
          selectedIndex={selectedIndex}
          onPress={(value) => {
            console.log(value);
            console.log(selectedIndex);
            setSelectedIndex(value);
          }}
          containerStyle={{ marginBottom: 20, width: "70%" }}
        />
      ) : (
        <ButtonGroup
          testID="choices"
          buttons={choices}
          vertical
          selectMultiple
          selectedIndexes={selectedIndexes}
          onPress={(value) => {
            setSelectedIndexes(value);
          }}
          containerStyle={{ marginBottom: 20, width: "70%" }}
        />
      )}
      <Button
        testID="next-question"
        onPress={nextQuestion}
        title="Submit"
      ></Button>
    </View>
  );
}

export default function App() {
  cacheFonts([FontAwesome.font]);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Question">
        <Stack.Screen
          initialParams={{
            questionNumber: 0,
            data: sampleData,
            userChoices: [],
          }}
          name="Question"
          options={{ headerShown: false }}
        >
          {(props) => <Question {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="SummaryScreen"
          initialParams={{
            questionNumber: sampleData.length - 1,
            data: sampleData,
            userChoices: [1, [0, 2], 1],
          }}
          options={{ headerShown: false }}
          component={SummaryScreen}
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
