import { React, useState } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { CheckBox } from "@rneui/themed";

function SummaryScreen({ route }) {
  let calculateCorrect = (userSelected, correct, type) => {
    let userCorrect = false;
    if (type === "multiple-answer") {
      userCorrect =
        userSelected.sort().toString() === correct.sort().toString();
    } else {
      userCorrect = userSelected === correct;
    }
    return userCorrect;
  };

  let totalScore = 0;

  for (let i = 0; i < route.params.data.length; i++) {
    if (
      calculateCorrect(
        route.params.userChoices[i],
        route.params.data[i].correct,
        route.params.data[i].type
      )
    ) {
      totalScore++;
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={route.params.data}
        renderItem={({ item, index }) => {
          let { choices, prompt, type, correct } = item;
          let userSelected = route.params.userChoices[index];
          let userCorrect = calculateCorrect(userSelected, correct, type);

          return (
            <View key={index}>
              <Text>{prompt}</Text>
              {choices.map((value, choiceIndex) => {
                let incorrect = false;
                let userDidSelect = false;
                if (type === "multiple-answer") {
                  userDidSelect = userSelected.includes(choiceIndex);
                  incorrect = userDidSelect && !correct.includes(choiceIndex);
                } else {
                  userDidSelect = userSelected === choiceIndex;
                  incorrect = userDidSelect && userSelected !== correct;
                }
                return (
                  <CheckBox
                    containerStyle={{
                      backgroundColor: userDidSelect
                        ? incorrect == false
                          ? "lightgreen"
                          : "red"
                        : undefined,
                    }}
                    checked={
                      type === "multiple-answer"
                        ? correct.includes(choiceIndex)
                        : correct === choiceIndex
                    }
                    textStyle={{
                      textDecorationLine: incorrect
                        ? "line-through"
                        : undefined,
                    }}
                    key={value}
                    title={value}
                  />
                );
              })}
            </View>
          );
        }}
      />
      <Text testID="total" style={{ fontSize: 20 }}>
        Total Score: {totalScore}
      </Text>
    </View>
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

export default SummaryScreen;
