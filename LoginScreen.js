// import firebase from 'react-native-firebase'
import React from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity
} from "react-native";
import { Constants } from "expo";
import firebase from "firebase";
const ERRORMILSECONDS = 4000;

export default class LoginScreen extends React.Component {
  state = {
    email: "",
    password: "",
    isFormValid: false,
    error: false,
    errorMessage: ""
  };

  componentWillMount() {
    var config = {
      apiKey: "AIzaSyBbZa3eNn-RvkCrppkVL4fmwjHwEID6dQg",
      authDomain: "reactnativefinalsigninproject.firebaseapp.com",
      databaseURL: "https://reactnativefinalsigninproject.firebaseio.com",
      projectId: "reactnativefinalsigninproject",
      storageBucket: "reactnativefinalsigninproject.appspot.com",
      messagingSenderId: "609800797128"
    };
    firebase.initializeApp(config);
  }

  handleLogin = () => {
    const { email, password } = {
      email: this.state.email,
      password: this.state.password
    };
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate("Setting"))
      .catch(error =>
        this.setState({ errorMessage: error.message, error: true })
      );
    setTimeout(() => {
      this.setState({ error: false });
    }, ERRORMILSECONDS);
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.email !== prevState.email ||
      this.state.password !== prevState.password
    ) {
      this.validateForm();
    }
  }

  validateForm = () => {
    if (this.state.email && this.state.password) {
      this.setState({ isFormValid: true });
    } else {
      this.setState({ isFormValid: false });
    }
  };

  handleEmailChange = email => {
    this.setState({ email });
  };

  handlePasswordChange = password => {
    this.setState({ password });
  };

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Text style={styles.paragraph}>Log in</Text>
        <TextInput
          style={styles.input}
          value={this.state.email}
          onChangeText={this.handleEmailChange}
          placeholder="Email"
        />
        <TextInput
          style={styles.input}
          value={this.state.password}
          onChangeText={this.handlePasswordChange}
          placeholder="Password"
          secureTextEntry
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
          onPress={this.handleLogin}
        >
          <Text
            style={
              this.state.isFormValid ? styles.button : styles.buttonInValid
            }
          >
            Login
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
