import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

import BakesList from './BakesList';
import {fetchData, searchDeals} from '../../utils/ajax';
import BakeDetails from './BakeDetails';
import SearchBar from './SearchBar';

class App extends React.Component {
  //declaring dimension of window to 0
  titleXPos = new Animated.Value(0);

  state = {
    //array to store all deals
    deals: [],
    //array to store new array when user searches for deal
    search: [],
    //setting current id to null
    currentDealId: null,
  };

  //function to start animation at the beginning
  animateLogo = (direction = 1) => {
    //getting current window width of device
    const width = Dimensions.get('window').width - 150;

    Animated.timing(this.titleXPos, {
      toValue: direction * (width / 2),
      duration: 1000,
      easing: Easing.sin,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        this.animateLogo(-1 * direction);
      }
    });
  };

  async componentDidMount() {
    this.animateLogo();

    // Animated.spring(this.titleXPos, {
    //   toValue: 143,
    //   useNativeDriver: false,
    // }).start(() => {
    //   Animated.spring(this.titleXPos, {
    //     toValue: -143,
    //     useNativeDriver: false,
    //   }).start(() => {
    //     Animated.timing(this.titleXPos, {
    //       toValue: 145,
    //       useNativeDriver: false,
    //       duration: 1000,
    //       easing: Easing.bounce,
    //     });
    //   });
    // });

    //fetching deals data, setting state
    const deals = await fetchData();
    this.setState({deals});
  }

  //search deals based on search query, and again setting search array to new data after filtering
  searchDeal = async value => {
    let search = [];
    if (value) {
      search = await searchDeals(value);
    }
    this.setState({search});
  };

  //setting current deal based on id passed
  setCurrentDeal = dealId => {
    this.setState({currentDealId: dealId});
  };

  //removing deal by setting dealId to null
  removeCurrentDeal = () => {
    this.setState({currentDealId: null});
  };

  //getting current deal by comparing id
  currentDeal = () => {
    return this.state.deals.find(deal => deal.key === this.state.currentDealId);
  };

  render() {
    if (this.state.currentDealId) {
      return (
        <View style={styles.main}>
          <BakeDetails
            initialDealData={this.currentDeal()}
            onBack={this.removeCurrentDeal}
          />
        </View>
      );
    }

    //if current state is greater than 0, display search array else display deals array
    const dealsToDisplay =
      this.state.search.length > 0 ? this.state.search : this.state.deals;

    //if array length is greater than 0, render SearchBar & BakeList components
    if (dealsToDisplay.length > 0) {
      return (
        <View style={styles.main}>
          <SearchBar searchDeal={this.searchDeal} />
          <BakesList deals={dealsToDisplay} onItemPress={this.setCurrentDeal} />
        </View>
      );
    }
    //To enable animation replace View with Animated.View
    return (
      <Animated.View style={[{left: this.titleXPos}, styles.container]}>
        <Text style={styles.header}>Bakes</Text>
      </Animated.View>
    );
  }
}

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 40,
    alignItems: 'center',
    fontWeight: '300',
    backgroundColor: '#000',
    color: 'orange',
    borderRadius: 4,
  },
  main: {
    marginTop: 50,
  },
});

export default App;
