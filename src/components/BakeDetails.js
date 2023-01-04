import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Animated,
  Dimensions,
  Button,
  Linking,
} from 'react-native';
import PropTypes from 'prop-types';

import {fetchDetails} from '../../utils/ajax';
import {priceDisplay} from '../../utils/ConvertPrice';

class BakeDetails extends React.Component {
  //declaring current position of window
  imageXPos = new Animated.Value(0);

  //create api to animate screen when swipe over image
  imageResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    //when mouse moves over image, this function triggers
    onPanResponderMove: (e, gesture) => {
      this.imageXPos.setValue(gesture.dx);
    },

    //when mouse releases from image, this function triggers
    onPanResponderRelease: (e, gesture) => {
      /* 2 arguments e, gesture where gesture is used to catch when any event fires */

      /**
       * dx is the distance covered by mouse hover over image
       * calculating when swipe left multiplying direction * imageXPos i.e. -1*direction
       * calculating when swipe right multiplying direction * imageXPos i.e. +1*direction
       */

      this.width = Dimensions.get('window').width;
      if (Math.abs(gesture.dx) > this.width * 0.4) {
        const direction = Math.sign(gesture.dx);
        Animated.timing(this.imageXPos, {
          toValue: direction * this.width,
          duration: 300,
          useNativeDriver: false,
        }).start(() => this.handleSwipe(-1 * direction));
      } else {
        Animated.spring(this.imageXPos, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  /** handling swiping left & right
   * when swipe left direction value changes to -1    and +1 when right
   *
   * spring() function is used to create fluid animation starting from predefined value to the end value set using toValue property
   *
   */
  handleSwipe = imageDirection => {
    if (!this.state.deal.media[this.state.imageIndex + imageDirection]) {
      Animated.spring(this.imageXPos, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
      return;
    }
    this.setState(
      prevState => ({
        imageIndex: prevState.imageIndex + imageDirection,
      }),
      () => {
        this.imageXPos.setValue(imageDirection * this.width);
        Animated.spring(this.imageXPos, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      },
    );
  };

  static propTypes = {
    initialDealData: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
  };

  /** setting state for imageIndex to 0 in-order to control image swipe
   * this imageIndex is used to control animation to swipe left or right
   */

  state = {
    deal: this.props.initialDealData,
    imageIndex: 0,
  };

  async componentDidMount() {
    const details = await fetchDetails(this.state.deal.key);
    this.setState({deal: details});
  }

  /** when clicking on any url inside app, it will open the link on your default browser using Linking API */
  handleUrl = () => {
    Linking.openURL(this.state.deal.url);
  };

  render() {
    /** geting all the deals from the current state
     * since we dont want to change state from the previous state
     * But we want to fetch deals directly from the API
     */

    const {deal} = this.state;
    return (
      <View style={styles.deal}>
        <TouchableOpacity onPress={this.props.onBack}>
          <Text style={styles.back}>Back </Text>
        </TouchableOpacity>
        <Animated.Image
          {...this.imageResponder.panHandlers}
          source={{uri: deal.media[this.state.imageIndex]}}
          style={[{left: this.imageXPos}, styles.img]}
        />
        <View style={styles.deal}>
          <Text style={styles.title}>{deal.title}</Text>
          <View style={styles.footer}>
            <Text style={styles.cause}>{deal.cause.name}</Text>
            <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
          </View>
        </View>
        {deal.user && (
          <View>
            <Image source={{uri: deal.user.avatar}} style={styles.avatar} />
            <Text>{deal.user.name}</Text>
          </View>
        )}
        <View>
          <Text>{deal.description}</Text>
        </View>
        <Button style={styles.btn} title="View" onPress={this.handleUrl} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
  },
  info: {
    padding: 10,
    backgroundColor: '#bbb',
    alignItems: 'center',
    borderTopWidth: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
    backgroundColor: 'rgba(237,150,40,.6)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  cause: {
    flex: 2,
  },
  price: {
    flex: 1,
    textAlign: 'right',
  },
  avatar: {
    width: 60,
    height: 60,
  },
  back: {
    backgroundColor: '#000',
    color: '#fff',
    width: 80,
    height: 20,
    marginBottom: 10,
    marginLeft: 10,
    borderRadius: 999,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 2,
  },
  btn: {
    top: 1,
  },
});

export default BakeDetails;
