import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import {priceDisplay} from '../../utils/ConvertPrice';

class BakesListItem extends React.Component {
  static propTypes = {
    deal: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  /** when click handlePress function will pass the
   * current key along with the state to BakeDetails component
   */
  handlePress = () => {
    this.props.onPress(this.props.deal.key);
  };

  render() {
    //getting current deal from state passed from BakesList component
    const {deal} = this.props;
    return (
      <TouchableOpacity style={styles.deal} onPress={this.handlePress}>
        <Image source={{uri: deal.media[0]}} style={styles.img} />
        <Text
          style={{
            borderColor: '#fff',
            borderWidth: 0.1,
            borderTopWidth: 0.1,
            borderStyle: 'solid',
          }}></Text>
        <View style={styles.info}>
          <Text style={styles.title}>{deal.title}</Text>
          <View style={styles.footer}>
            <Text style={styles.cause}>{deal.cause.name}</Text>
            <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  deal: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#396e61',
    padding: 6,
    borderRadius: 4,
    paddingTop: 5,
  },
  touch: {
    backgroundColor: 'none',
    color: 'transparent',
  },
  img: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
    borderRadius: 6,
  },
  info: {
    padding: 10,
    backgroundColor: '#000',
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
    color: 'yellowgreen',
  },
  footer: {
    flexDirection: 'row',
  },
  cause: {
    flex: 2,
    color: 'pink',
    fontWeight: '600',
  },
  price: {
    flex: 1,
    textAlign: 'right',
    color: 'green',
    fontWeight: '700',
  },
});

export default BakesListItem;
