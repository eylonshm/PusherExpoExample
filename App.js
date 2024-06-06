import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { useEffect } from "react";

import { Pusher } from "@pusher/pusher-websocket-react-native";

Pusher.logToConsole = true;

const channelName = "testChannel";

const pusherInitialization = async () => {
  try {
    const pusher = Pusher.getInstance();

    await pusher.init({
      apiKey: process.env.EXPO_PUBLIC_PUSHER_API_KEY,
      cluster: "eu",
      authEndpoint: "/pusher/auth",
      onConnectionStateChange: (state) => {
        console.log("Connection state changed", state);
      },
      onError: (err) => {
        console.log("An error occurred", err);
      },
      onEvent: (event) => {
        console.log("An event was received", event);
      },
      onSubscriptionSucceeded: (channel) => {
        console.log("Subscribed to channel", channel);
      },
      onSubscriptionError: (channel, error) => {
        console.log("Subscription error", error);
      },
      onDecryptionFailure: (event) => {
        console.log("Decryption failed for event", event);
      },
      onMemberAdded: (member) => {
        console.log("Member added", member);
      },
      onMemberRemoved: (member) => {
        console.log("Member removed", member);
      },
      onSubscriptionCount: (count) => {
        console.log("Subscription count", count);
      },
    });

    await pusher.subscribe({
      channelName: channelName,
      onEvent: (...rest) => {
        console.log("Event received on testChannel", rest);
      },
      onSubscriptionSucceeded: (...rest) => {
        console.log("Subscribed to testChannel", rest);
      },
      onSubscriptionError: (...rest) => {
        console.log("Subscription error on testChannel", rest);
      },
    });

    await pusher.connect();
    console.log("pusher =>", pusher);
  } catch (err) {
    console.log("pusherInitError", err);
    throw err;
  }
};

export default function App() {
  useEffect(() => {
    pusherInitialization();
  }, []);

  const handleButtonClick = () => {
    fetch(`${process.env.EXPO_PUBLIC_LOCAL_SERVER_URL}/trigger-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: channelName,
        event: "doSomething",
        message: "Hello from React Native!",
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Before you're doing anything here, make sure you run the server and
        updated the .env file in this project with EXPO_PUBLIC_PUSHER_API_KEY
        and EXPO_PUBLIC_LOCAL_SERVER_URL
      </Text>
      <Text style={styles.text}>
        Click on the button to send event to the server, which would trigger
        pusher event
      </Text>
      <Text style={styles.text}>
        You should be able to get back the event and see a log{" "}
      </Text>
      <Button
        style={styles.btn}
        title="Trigger Server Event"
        onPress={handleButtonClick}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 20,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "blue",
    color: "white",
    padding: 10,
    borderRadius: 5,
  },
});
