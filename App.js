import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  PushNotificationIOS
} from "react-native";
import { MapView, Permissions, Location } from "expo";
import { Ionicons } from "@expo/vector-icons";
import { Constants } from "expo";
import {
  TabNavigator,
  TabBarBottom,
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import MapScreen from "./MapScreen";
import CheckinScreen from "./CheckinScreen";
import CheckoutScreen from "./CheckoutScreen";
import SettingScreen from "./SettingScreen";
import LoginScreen from "./LoginScreen"; // Version can be specified in package.json
import firebase from "./Firebase";
// 49.255896 -123.044041
// 49.285087;-123.112974
const targetLat = 49.255896;
const targetLon = -123.044041;

class LogsScreen extends React.Component {
  state = {
    logs: this.props.screenProps.getLogs
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps != this.screenProps) {
      this.setState({
        logs: nextProps.screenProps.getLogs
      });
    }
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {this.state.logs.map((item, key) => (
          <Text key={key}> {item} </Text>
        ))}
      </View>
    );
  }
}

const SettingStack = createStackNavigator({
  Login: LoginScreen,
  Setting: SettingScreen
});

const MyTab = createBottomTabNavigator(
  {
    Home: { screen: MapScreen },
    CheckIn: { screen: CheckinScreen },
    CheckOut: { screen: CheckoutScreen },
    Logs: { screen: LogsScreen },
    Setting: { screen: SettingStack }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Home") {
          iconName = `ios-information-circle${focused ? "" : "-outline"}`;
        } else if (routeName === "Logs") {
          iconName = `ios-options${focused ? "" : "-outline"}`;
        } else if (routeName === "CheckIn") {
          iconName = `ios-arrow-dropleft${focused ? "-circle" : ""}-outline`;
        } else if (routeName === "CheckOut") {
          iconName = `ios-arrow-dropright${focused ? "-circle" : ""}-outline`;
        } else if (routeName === "Setting") {
          iconName = `ios-settings${focused ? "" : "-outline"}`;
        }
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "gray"
    },
    animationEnabled: false,
    swipeEnabled: false
  }
);

export default class App extends React.Component {
  state = {
    enableCheckIn: false,
    enableCheckOut: false,
    logs: [],
    targetLat: targetLat,
    targetLon: targetLon,
    clickByCheckout: false,
    dataSource: []
  };

  componentWillMount() {
    let rootRef = firebase.database().ref();
    this.TargetLatLonRef = rootRef.child("Target");
    this.listenForItems(this.TargetLatLonRef);
  }

  listenForItems(itemsRef) {
    itemsRef.on("value", snap => {
      // get children as an array
      var items = snap.val();
      this.setState({
        targetLat: items.latitude,
        targetLon: items.longitude
      });
    });
  }

  componentDidUpdate() {
    console.log(this.state.targetLat + " " + this.state.targetLon);
  }

  checkedInClicked = item => {
    this.setState({
      enableCheckIn: false,
      enableCheckOut: true,
      clickByCheckout: true
    });
    this.setState(prevState => ({
      logs: [...prevState.logs, item]
    }));
  };

  checkedOutClicked = (item, enableCheckIn) => {
    this.setState({
      enableCheckIn: enableCheckIn,
      enableCheckOut: false,
      clickByCheckout: true
    });
    this.setState(prevState => ({
      logs: [...prevState.logs, item]
    }));
  };

  submitTargetChanged = (item, item2) => {
    this.setState({
      targetLat: item,
      targetLon: item2,
      clickByCheckout: false
    });
  };

  render() {
    return (
      <MyTab
        screenProps={{
          shouldEnableCheckIn: this.state.enableCheckIn,
          checkedInClicked: this.checkedInClicked,
          shouldEnableCheckOut: this.state.enableCheckOut,
          checkedOutClicked: this.checkedOutClicked,
          getLogs: this.state.logs,
          targetLat: this.state.targetLat,
          targetLon: this.state.targetLon,
          onSubmit: this.submitTargetChanged,
          clickByCheckout: this.state.clickByCheckout
        }}
      />
    );
  }
}

// Version can be specified in package.json
