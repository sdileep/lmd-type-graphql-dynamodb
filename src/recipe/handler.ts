// import 'reflect-metadata'
// import { ApolloServer } from 'apollo-server-lambda'
// import { buildSchemaSync, useContainer } from 'type-graphql'
// import lambdaPlayground from 'graphql-playground-middleware-lambda'
// import { RecipeResolver } from './recipe-resolver'
// import { Container } from 'inversify'

// export const TheContainer = new Container({
//   autoBindInjectable: true,
//   defaultScope: 'Singleton',
//   skipBaseClassChecks: true,
// })

// useContainer(TheContainer)

// export const server = new ApolloServer({
//   schema: buildSchemaSync({
//     resolvers: [RecipeResolver],
//   }),
//   introspection: true,
// })

// export const graphql = server.createHandler()

// export const playground = lambdaPlayground({
//   endpoint: '/graphql',
// })

import 'reflect-metadata'

import lambdaPlayground from 'graphql-playground-middleware-lambda'
import { ApolloServer } from 'apollo-server-lambda'
import {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  APIGatewayEvent,
} from 'aws-lambda'
import * as TypeGraphQL from 'type-graphql'
import { RecipeResolver } from './recipe-resolver'

async function getSchema() {
  console.log('Inside get Schema')
  try {
    return await TypeGraphQL.buildSchema({
      resolvers: [RecipeResolver],
      // use document converting middleware
      // globalMiddlewares: [TypegooseMiddleware],
      // emitSchemaFile: path.resolve(__dirname, 'schema.graphql'), for some reason specifying path fails

      emitSchemaFile: {},
      // use ObjectId scalar mapping
      // scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    })
  } catch (e) {
    console.log('Error at get Schema')
    console.log(`Error occured while boostrapping: , ${JSON.stringify(e, null, 2)}`)
    throw e
  } finally {
    console.log('Finish get Schema')
  }
}

const createHandler = async () => {
  console.log('About to generate schema: ')
  ;(global as any).schema = (global as any).schema || (await getSchema())
  const schema = (global as any).schema

  console.log('Schema: ', JSON.stringify(schema, null, 2))
  console.log('User Type: ', JSON.stringify(schema.getQueryType(), null, 2))

  const server = new ApolloServer({
    schema,
    context: async ({ context }: { event: APIGatewayEvent; context: Context }) => {
      context.callbackWaitsForEmptyEventLoop = false
      return { auth: { isAuthenticated: false } }
    },
  })
  return server.createHandler({ cors: { origin: process.env.CORS_ORIGIN } })
}

export const graphql = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
) => {
  createHandler().then(handler => handler(event, context, callback))
}

export const playgroundHandler = lambdaPlayground({ endpoint: process.env.GRAPHQL_API_PATH })
