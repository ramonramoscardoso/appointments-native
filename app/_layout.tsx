import { ApolloProvider } from "@apollo/client/react";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import BackButton from "./_components/back-button";
import client from "./lib/apollo";

export default function Layout() {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <BackButton />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: styles.content,
          }}
        />
      </View>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
