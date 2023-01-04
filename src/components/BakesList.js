import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, FlatList} from 'react-native';

import BakesListItem from './BakesListItem';

class BakesList extends React.Component {
  static propTypes = {
    deals: PropTypes.array.isRequired,
    onItemPress: PropTypes.func.isRequired,
  };

  render() {
    return (
      /* FlatList component is used since it 
      supports pull to refresh, scroll loading, footer support and it's totally cross-platform
       */
      <View style={styles.list}>
        <FlatList
          data={this.props.deals}
          renderItem={({item}) => (
            <BakesListItem deal={item} onPress={this.props.onItemPress} />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#ddd',
    width: '100%',
    paddingTop: 50,
  },
});

export default BakesList;
