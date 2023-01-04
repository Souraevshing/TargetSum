import React, {Component} from 'react';
import {TextInput, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

class SearchBar extends Component {
  //setting value of state property
  state = {value: ''};

  static propTypes = {
    searchDeal: PropTypes.func.isRequired,
  };

  /** debouncing is done because when debouncing
   *  function is called it will return some
   *  value if and only if runs immediately
   *  otherwise it returns last function return
   *  value or undefined
   * */
  debouncedSearchDeals = debounce(this.props.searchDeal, 300);
  handleChange = value => {
    this.setState({value}, () => {
      this.debouncedSearchDeals(this.state.value);
    });
  };

  render() {
    return (
      <TextInput
        style={styles.input_box}
        placeholder="Search"
        cursorColor="red"
        onChangeText={this.handleChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  input_box: {
    height: 40,
  },
});

export default SearchBar;
