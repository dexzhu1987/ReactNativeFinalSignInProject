import React from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  Keyboard
} from "react-native";
import { Constants } from "expo";
import firebase from "./Firebase";

const ERRORMILSECONDS = 3000;

export default class SettingScreen extends React.Component {
  state = {
    latitude: this.props.screenProps.targetLat,
    longitude: this.props.screenProps.targetLon,
    isFormValid: false,
    error: false,
    errorMessage: ""
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.latitude !== prevState.latitude ||
      this.state.longitude !== prevState.longitude
    ) {
      this.validateForm();
    }
  }

  componentWillMount() {
    let rootRef = firebase.database().ref();
    this.TargetLatLonRef = rootRef.child("Target");
  }

  validateForm = () => {
    if ((this.state.latitude != 0) & (this.state.longitude != 0)) {
      this.setState({ isFormValid: true });
    } else {
      this.setState({ isFormValid: false });
    }
  };

  handleLatitudeChange = latitude => {
    this.setState({ latitude });
  };

  handleLongitudeChange = longitude => {
    this.setState({ longitude });
  };

  handleSubmit = () => {
    this.props.screenProps.onSubmit(this.state.latitude, this.state.longitude);
    this.props.navigation.navigate("Home");
    Keyboard.dismiss();
    this.TargetLatLonRef.update({
      latitude: this.state.latitude,
      longitude: this.state.longitude
    });
  };

  formatLat = () => {
    var num = parseFloat(this.state.latitude);
    var cleanNum = num.toFixed(6);
    if (isNaN(cleanNum)) {
      this.setState({
        latitude: 0,
        error: true,
        errorMessage: "Please enter a number"
      });
      setTimeout(() => {
        this.setState({ error: false });
      }, ERRORMILSECONDS);
    } else if (cleanNum < -90.0 || cleanNum > 90.0) {
      this.setState({
        latitude: 0,
        error: true,
        errorMessage: "Latitude should be in range -90 to 90"
      });
      setTimeout(() => {
        this.setState({ error: false });
      }, ERRORMILSECONDS);
    } else {
      this.setState({ latitude: cleanNum });
    }
  };

  formatLon = () => {
    var num = parseFloat(this.state.longitude);
    var cleanNum = num.toFixed(6);
    if (isNaN(cleanNum)) {
      this.setState({
        longitude: 0,
        error: true,
        errorMessage: "Please enter a number"
      });
      setTimeout(() => {
        this.setState({ error: false });
      }, ERRORMILSECONDS);
    } else if (cleanNum < -180.0 || cleanNum > 180.0) {
      this.setState({
        longitude: 0,
        error: true,
        errorMessage: "Longtitude should be in range -180 to 180"
      });
      setTimeout(() => {
        this.setState({ error: false });
      }, ERRORMILSECONDS);
    } else {
      this.setState({ longitude: cleanNum });
    }
  };

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Text style={styles.paragraph}>Target Latitude and Longitude</Text>
        <TextInput
          style={styles.input}
          value={`${this.state.latitude}`}
          onChangeText={this.handleLatitudeChange}
          placeholder="Latitude"
          onBlur={this.formatLat}
        />
        <TextInput
          style={styles.input}
          value={`${this.state.longitude}`}
          onChangeText={this.handleLongitudeChange}
          placeholder="Longitude"
          onBlur={this.formatLon}
        />
        {this.state.error && (
          <Text
            style={{
              textAlignVertical: "center",
              textAlign: "center",
              color: "#800"
            }}
          >
            {this.state.errorMessage}
          </Text>
        )}
        <TouchableOpacity
          disabled={!this.state.isFormValid}
          onPress={this.handleSubmit}
        >
          <Text
            style={
              this.state.isFormValid ? styles.button : styles.buttonInValid
            }
          >
            Submit Change
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Constants.statusBarHeight,
    justifyContent: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    minWidth: 100,
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e"
  },
  button: {
    margin: 24,
    padding: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
    backgroundColor: "#88ba1b"
  },
  buttonInValid: {
    margin: 24,
    padding: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
    backgroundColor: "#8f997b"
  }
});
