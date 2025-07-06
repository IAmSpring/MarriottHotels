import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://api.marriott.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  const apolloKey = import.meta.env.VITE_APOLLO_KEY || process.env.APOLLO_KEY;
  
  return {
    headers: {
      ...headers,
      'x-api-key': apolloKey,
    }
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default apolloClient; 