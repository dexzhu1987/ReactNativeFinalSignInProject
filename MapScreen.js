import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
  TouchableOpacity
} from "react-native";
import { MapView, Permissions, Location } from "expo";
import { Ionicons } from "@expo/vector-icons";
import { Constants } from "expo";

export default class MapScreen extends React.Component {
  state = {
    location: null,
    curTime: new Date().toLocaleString(),
    distance: 0,
    targetLat: this.props.screenProps.targetLat,
    targetLon: this.props.screenProps.targetLon,
    latitude: null,
    longitude: null,
    forceRefresh: 0
  };

  componentWillMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
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
        timeout: 1,
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
        distance: distance,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    clearInterval(this.timeInterVal);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.screenProps.targetLat !== this.state.targetLat ||
      nextProps.screenProps.targetLon !== this.state.targetLon
    ) {
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
      }
    }
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

  refresh = () => {
    this.setState({
      forceRefresh: Math.floor(Math.random() * 100)
    });
  };

  render() {
    if (!this.state.location) {
      return <View>Something went wrong</View>;
    }
    return (
      <View
        style={{
          flex: 1,
          position: "relative",
          paddingTop: Constants.statusBarHeight
        }}
        contentContainerStyle={StyleSheet.absoluteFillObject}
      >
        <MapView
          key={this.state.forceRefresh}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: parseFloat(this.state.location.coords.latitude),
              longitude: parseFloat(this.state.location.coords.longitude)
            }}
            title={"You"}
          >
            <Image
              resizeMode={Image.resizeMode.cover}
              style={{
                width: 40,
                height: 40
              }}
              source={{
                uri:
                  "http://www.ennovativecapital.com/wp-content/uploads/2016/01/Location-512.png"
              }}
            />
          </MapView.Marker>
          <MapView.Marker
            coordinate={{
              latitude: parseFloat(this.state.targetLat),
              longitude: parseFloat(this.state.targetLon)
            }}
            title={"Target"}
            description={"Targeted location for check in"}
          >
            <Image
              resizeMode={Image.resizeMode.stretch}
              style={{
                width: 16,
                height: 28
              }}
              source={{
                uri:
                  "http://www.beautiful-elegance.com/wp-content/uploads/2018/03/green-marker-google-maps.jpg"
              }}
            />
          </MapView.Marker>
        </MapView>
        <View style={styles.container}>
          <Text style={styles.paragraph}>
            Distance: {this.state.distance} m
          </Text>
          <Text style={styles.paragraph}>Date: {this.state.curTime}</Text>
          <Text style={styles.paragraph2}>Latitude: {this.state.latitude}</Text>
          <Text style={styles.paragraph2}>
            Longitude:
            {this.state.longitude}
          </Text>
        </View>
        <View style={styles.topButtonView}>
          <TouchableOpacity style={styles.button} onPress={this.refresh}>
            <Ionicons name={"md-locate"} size={20} />;
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.4,
    alignItems: "center",
    // justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  },
  paragraph: {
    margin: 15,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e"
  },
  paragraph2: {
    margin: 1,
    fontSize: 12,
    textAlign: "center",
    color: "#34495e"
  },
  topButtonView: {
    flexDirection: "row",
    position: "absolute",
    top: 15,
    right: 15,
    paddingTop: Constants.statusBarHeight
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 100
  }
});

if (Number.prototype.toRadians === undefined) {
  Number.prototype.toRadians = function() {
    return (this * Math.PI) / 180;
  };
}
