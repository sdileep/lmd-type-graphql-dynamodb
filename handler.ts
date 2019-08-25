import 'reflect-metadata'
// import { GraphQLSchema } from 'graphql';
// import lambdaPlayground from 'graphql-playground-middleware-lambda'
import { ApolloServer } from 'apollo-server-lambda'
import {
  Context,
  // APIGatewayProxyEvent,
  // APIGatewayProxyResult,
  // Callback,
  APIGatewayEvent,
} from 'aws-lambda'
import * as TypeGraphQL from 'type-graphql'
import { RecipeResolver } from './src/recipe/recipe-resolver'

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

// import 'reflect-metadata'

// import lambdaPlayground from 'graphql-playground-middleware-lambda'
// import { ApolloServer } from 'apollo-server-lambda'
// import {
//   Context,
//   APIGatewayProxyEvent,
//   APIGatewayProxyResult,
//   Callback,
//   APIGatewayEvent,
// } from 'aws-lambda'
// import * as TypeGraphQL from 'type-graphql'
// import { RecipeResolver } from './recipe-resolver'

// async function getSchema() {
//   console.log('Inside get Schema')
//   try {
//     return await TypeGraphQL.buildSchema({
//       resolvers: [RecipeResolver],
//       // use document converting middleware
//       // globalMiddlewares: [TypegooseMiddleware],
//       // emitSchemaFile: path.resolve(__dirname, 'schema.graphql'), for some reason specifying path fails

//       emitSchemaFile: {},
//       // use ObjectId scalar mapping
//       // scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
//     })
//   } catch (e) {
//     console.log('Error at get Schema')
//     console.log(`Error occured while boostrapping: , ${JSON.stringify(e, null, 2)}`)
//     throw e
//   } finally {
//     console.log('Finish get Schema')
//   }
// }

// // async function getSchema(): Promise<any> {
// //   ;(global as any).schema = (global as any).schema || (await buildSchema())
// //   return new Promise(resolve => {
// //     const schema = (global as any).schema
// //     resolve(schema)
// //   })
// // }

// // export const graphql = async () => {
// //   const schema = getSchema()
// //   console.log('Schema: ', JSON.stringify(schema, null, 2))
// //   console.log('User Type: ', JSON.stringify(schema.getQueryType(), null, 2))

// //   const server = new ApolloServer({
// //     schema,
// //     context: async ({ context }: { event: APIGatewayEvent; context: Context }) => {
// //       context.callbackWaitsForEmptyEventLoop = false
// //       return { auth: { isAuthenticated: false } }
// //     },
// //   })
// //   return server.createHandler({ cors: { origin: process.env.CORS_ORIGIN } })
// // }

// // export const graphql = (async () => {
// //   const schema = await getSchema()
// //   // console.log('Schema: ', JSON.stringify(schema, null, 2))
// //   console.log('before server creation')
// //   const server = new ApolloServer({
// //     schema,
// //     context: async ({ context }: { event: APIGatewayEvent; context: Context }) => {
// //       context.callbackWaitsForEmptyEventLoop = false
// //       return { auth: { isAuthenticated: false } }
// //     },
// //   })
// //   console.log('after server creation')
// //   console.log('before handler creation')
// //   return await server.createHandler({ cors: { origin: process.env.CORS_ORIGIN } })
// // })()

// // export const graphql = (
// //   event: APIGatewayProxyEvent,
// //   context: Context,
// //   callback: Callback<APIGatewayProxyResult>
// // ) => {
// //   createHandler().then(handler => handler(event, context, callback))
// // }

// // export const playgroundHandler = lambdaPlayground({ endpoint: process.env.GRAPHQL_API_PATH })

// import { getMetadataStorage } from "type-graphql/dist/metadata/getMetadataStorage";
// if (process.env.IS_OFFLINE) {
//   getMetadataStorage().clear();
// }

// import path from 'path'
const init = () => {
  const schema = TypeGraphQL.buildSchemaSync({
    resolvers: [RecipeResolver],
  })
  
  const server = new ApolloServer({
    schema,
    context: async ({ context }: { event: APIGatewayEvent; context: Context }) => {
      context.callbackWaitsForEmptyEventLoop = false
      return { auth: { isAuthenticated: false } }
    },
    playground: process.env.NODE_ENV !== 'production'
  })
  

  return server.createHandler({ cors: { origin: process.env.CORS_ORIGIN } })
}

export const graphql = init()
	// schema: new GraphQLSchema({
	// 	query: new GraphQLObjectType({
	// 		name: 'RootQueryType',
	// 		fields: schemaObject
	// 	})
	// }),
	// context: async ({ event, context }) => {
	// 	if(event.source === 'serverless-plugin-warmup') {
	// 		throw new AuthenticationError('Warmup Complete');
	// 	}


	// 	return {
	// 		headers: event.headers,
	// 		functionName: context.functionName,
	// 		event,
	// 		context
	// 	};
	// },
	// tracing: true,
	// engine: { apiKey: process.env.APOLLO_ENGINE_KEY },
	// formatError: error => {
	// 	delete error.extensions;
	// 	delete error.path;

	// 	return error;
	// },
	// playground: process.env.NODE_ENV !== 'production'


//WORKING

// // import path from 'path'
// async function getServer() {
//   console.log('Inside get Schema')
//   try {
//     const { resolvers, typeDefs } = await TypeGraphQL.buildTypeDefsAndResolvers({
//       resolvers: [RecipeResolver],
//       // emitSchemaFile: true,
//     })
//     const server = new ApolloServer({
//       typeDefs,
//       resolvers,

//       // By default, the GraphQL Playground interface and GraphQL introspection
//       // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
//       //
//       // If you'd like to have GraphQL Playground and introspection enabled in production,
//       // the `playground` and `introspection` options must be set explicitly to `true`.
//       playground: true,
//       introspection: true,
//       context: async ({ context }: { event: APIGatewayEvent; context: Context }) => {
//         context.callbackWaitsForEmptyEventLoop = false
//         return { auth: { isAuthenticated: false } }
//       },
//     })
//     return server
//   } catch (e) {
//     console.log('Error at get Schema')
//     console.log(`Error occured while boostrapping: , ${JSON.stringify(e, null, 2)}`)
//     throw e
//   } finally {
//     console.log('Finish get Schema')
//   }
// }

// const createHandler = async () => {
//   console.log('About to generate schema: ')
//   ;(global as any).server = (global as any).server || (await getServer())
//   const server = (global as any).server
//   return server.createHandler({ cors: { origin: process.env.CORS_ORIGIN } })
// }

// // export const graphql = async (
// //   event: APIGatewayProxyEvent,
// //   context: Context,
// //   callback: Callback<APIGatewayProxyResult>
// // ) => {
// //   const handler = await createHandler()
// //   return handler(event, context, callback)
// // }

// // export const graphql = (
// //   event: APIGatewayProxyEvent,
// //   context: Context,
// //   callback: Callback<APIGatewayProxyResult>
// // ) => {
// //   createHandler().then(handler => handler(event, context, callback))
// // }

// export const graphql = (
//   event: APIGatewayProxyEvent,
//   context: Context,
//   callback: Callback<APIGatewayProxyResult>
// ) => {
//   createHandler().then(handler => handler(event, context, callback))
// }

// // export const playgroundHandler = lambdaPlayground({ endpoint: process.env.GRAPHQL_API_PATH })

// // export const graphql = async (
// //   event: APIGatewayProxyEvent,
// //   context: Context,
// //   callback: Callback<APIGatewayProxyResult>
// // ) => {
// //   ;(global as any).handler = (global as any).handler || (await createHandler())
// //   const handler = (global as any).handler
// //   // createHandler().then(handler => handler(event, context, callback))
// //   handler(event, context, callback)
// // }
