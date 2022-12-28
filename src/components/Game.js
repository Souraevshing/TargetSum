import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Button } from 'react-native';
import shuffle from 'lodash.shuffle';

import RandomNumber from './RandomNumber';

class Game extends React.Component {
  state = {
    selectedNumbers: [],
    remainingSeconds: this.props.initialSeconds,
  };

  static propTypes = {
    randomCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
  };

  gameResult = 'PLAYING';

  //when component mounts, the timer starts
  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(
        (prevState) => {
          return { remainingSeconds: prevState.remainingSeconds - 1 };
        },
        () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.intervalId);
          }
        }
      );
    }, 1000);
  }

  //when component is updated, check for numbers selected once & also stops timer when won or lost
  // eslint-disable-next-line react/no-deprecated
  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (
      nextState.selectedNumbers !== this.state.selectedNumbers ||
      nextState.remainingSeconds === 0
    ) {
      this.gameResult = this.caclGameStatus(nextState);
      if (this.gameResult !== 'PLAYING') {
        clearInterval(this.intervalId);
      }
    }
    return null;
  }

  randomNumbers = Array.from({ length: this.props.randomCount }).map(
    () => 1 + Math.floor(10 * Math.random())
  );

  target = this.randomNumbers
    .slice(0, this.props.randomCount - 2)
    .reduce((acc, curr) => acc + curr, 0);

  shuffledRandomNumbers = shuffle(this.randomNumbers);

  isNumberSelected = (id) => {
    return this.state.selectedNumbers.indexOf(id) >= 0;
  };

  selectNumber = (id) => {
    this.setState((prevState) => ({
      selectedNumbers: [...prevState.selectedNumbers, id],
    }));
  };

  caclGameStatus = (nextState) => {
    const sumOfSelectedNumbers = nextState.selectedNumbers.reduce(
      (acc, curr) => {
        return acc + this.shuffledRandomNumbers[curr];
      },
      0
    );
    if (nextState.remainingSeconds === 0) {
      return 'lost'.toUpperCase();
    }
    if (sumOfSelectedNumbers < this.target) {
      return 'playing'.toUpperCase();
    }
    if (sumOfSelectedNumbers === this.target) {
      return 'won'.toUpperCase();
    }
    if (sumOfSelectedNumbers > this.target) {
      return 'lost'.toUpperCase();
    }
  };

  render() {
    const gameResult = this.gameResult;
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameResult}`]]}>
          {this.target}
        </Text>
        <View style={styles.randomContainer}>
          {this.shuffledRandomNumbers.map((random, id) => (
            <RandomNumber
              key={id}
              id={id}
              number={random}
              isDisabled={this.isNumberSelected(id) || gameResult !== 'PLAYING'}
              onPress={this.selectNumber}
            />
          ))}
        </View>
        {this.gameResult !== 'PLAYING' && (
          <Button
            style={styles.btn}
            title="Try Again!"
            touchSoundDisabled={false}
            color="#a733e6"
            onPress={this.props.onPlayAgain}
          />
        )}
        <Text style={styles.remainingTime}>
          Time Remaining : {this.state.remainingSeconds}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 30,
  },

  target: {
    fontSize: 40,
    backgroundColor: '#000',
    color: 'white',
    marginHorizontal: 50,
    textAlign: 'center',
    borderRadius: 4,
  },

  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  remainingTime: {
    fontWeight: '400',
    fontSize: 25,
    letterSpacing: 2,
    color: '#fff',
    backgroundColor: 'orange',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
  },

  btn: {
    fontWeight: '300',
    fontSize: 30,
    letterSpacing: 4,
    fontFamily: 'Nunito Sans',
  },

  STATUS_PLAYING: {
    backgroundColor: '#000',
  },

  STATUS_WON: {
    backgroundColor: 'green',
  },

  STATUS_LOST: {
    backgroundColor: 'red',
  },
});

export default Game;
