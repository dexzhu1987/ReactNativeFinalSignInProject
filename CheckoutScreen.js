import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity
} from "react-native";
import { MapView, Permissions, Location } from "expo";
import { Ionicons } from "@expo/vector-icons";
import { Constants } from "expo";

const ENABLECOLOR = "#32b5a4";
const DISABLECOLOR = "#60706e";

export default class CheckoutScreen extends React.Component {
  state = {
    curTime: null,
    shouldBeEnable: false,
    buttonColor: DISABLECOLOR,
    checkoutString: "",
    location: null,
    distance: 0,
    alreadyCheckedOut: false,
    targetLat: this.props.screenProps.targetLat,
    targetLon: this.props.screenProps.targetLon
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.shouldEnableCheckOut) {
      this.setState({
        shouldBeEnable: true,
        buttonColor: ENABLECOLOR,
        checkoutString: ""
      });
    } else {
      this.setState({
        shouldBeEnable: false,
        buttonColor: DISABLECOLOR
      });
    }
    if (!nextProps.screenProps.clickByCheckout) {
      if (this.state.location) {
        let distance = this.calculateDistance(
          this.state.location.coords.latitude,
          this.state.location.coords.longitude,
          nextProps.screenProps.targetLat,
          nextProps.screenProps.targetLon
        );
        this.setState({
          targetLat: nextProps.screenProps.targetLat,
          targetLon: nextProps.screenProps.targetLon,
          distance: distance
        });
        this.updateButtonState(distance);
      }
    }
  }

  componentWillMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
    } else {
      this._getLocationAsync();
    }
    this.timeInterVal = setInterval(
      function() {
        const timeSting = new Date().toLocaleString();
        var myArr = timeSting.split(",");
        this.setState({ curTime: timeSting });
      }.bind(this),
      1000
    );
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.updateLocation(location);
  };

  componentDidMount() {
    this._getlocation();
  }

  _getlocation() {
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.updateLocation(position);
      },
      error => console.log("error: " + JSON.stringify(error)),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
        distanceFilter: 1
      }
    );
  }

  updateLocation(location) {
    if (location) {
      let distance = this.calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        this.state.targetLat,
        this.state.targetLon
      );
      this.setState({
        location: location,
        distance: distance
      });
      this.updateButtonState(distance);
    }
  }

  updateButtonState(distance) {
    if (distance > 30 && this.state.shouldBeEnable) {
      this.handleCheckout(false);
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    clearInterval(this.timeInterVal);
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371e3; // metres
    var φ1 = (lat1 * Math.PI) / 180;
    var φ2 = (lat2 * Math.PI) / 180;
    var Δφ = ((lat2 - lat1) * Math.PI) / 180;
    var Δλ = ((lon2 - lon1) * Math.PI) / 180;
    var a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    return parseInt(d);
  }

  handleCheckout(enableCheckIn) {
    this.setState({
      checkoutString: "Check Out at " + this.state.curTime,
      shouldBeEnable: false,
      buttonColor: DISABLECOLOR
    });
    this.props.screenProps.checkedOutClicked(
      "Check Out at " + this.state.curTime,
      enableCheckIn
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          disabled={!this.state.shouldBeEnable}
          onPress={() => this.handleCheckout(true)}
        >
          <Ionicons
            name={"ios-arrow-dropright-circle-outline"}
            size={200}
            color={this.state.buttonColor}
          />
          ;
        </TouchableOpacity>
        <Text style={styles.paragraph}>{this.state.checkoutString}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  },
  button: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 100
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e"
  }
});
