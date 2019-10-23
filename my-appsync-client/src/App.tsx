import React from 'react'
import awsconfig from './aws-exports.js'
import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync/lib'
import {ApolloProvider, DataProps, graphql} from 'react-apollo'
import {Rehydrated} from 'aws-appsync-react/lib'
import gql from 'graphql-tag'

// Här skapar vi en klient för AWS AppSync
export const appSyncClient = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.API_KEY, // or type: awsconfig.aws_appsync_authenticationType,
    apiKey: awsconfig.aws_appsync_apiKey,
  }
})

// GraphQL-query för att läsa users
const usersQuery = gql`query GetUsers {
    users {
        id
        name
    }
}`

// Komponent för att visa users-resultat
const Users: React.FC<Partial<DataProps<any>>> = ({data}) => {
  return (
    <ul>
      {((data && data.users) || []).map((u: any) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  )
}

// Koppla ihop komponenten ovan med graphql-klienten
const UsersGraphQL = graphql(usersQuery)(Users)

// Fancy app
const App: React.FC = () => {
  return (
    <div>
      <UsersGraphQL/>
    </div>
  )
}

// Komponent som kopplar ihop med Apollo och AppSync
const WithApollo: React.FC = () => {
  return (
    <ApolloProvider client={appSyncClient}>
      <Rehydrated>
        <App/>
      </Rehydrated>
    </ApolloProvider>
  )
}

// Observera att vi nu bytt till WithApollo som default-export
export default WithApollo

