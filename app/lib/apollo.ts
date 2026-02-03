import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.EXPO_PUBLIC_API_URL,
  }),
  cache: new InMemoryCache(),
});

export default client;
