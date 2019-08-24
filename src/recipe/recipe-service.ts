import { Recipe } from './recipe-type'
import { DataMapper } from '@aws/dynamodb-data-mapper'
// import { between } from '@aws/dynamodb-expressions'
import DynamoDB from 'aws-sdk/clients/dynamodb'
import uuidv4 from 'uuid/v4'

// const client = new DynamoDB({ region: 'us-west-2' })
// const mapper = new DataMapper({ client })

// const post = new Post()
// post.createdAt = new Date()
// post.authorUsername = 'User1'
// post.title = 'Hello, DataMapper'
// post.metadata = Object.assign(new PostMetadata(), {
//   draft: true,
//   tags: new Set(['greeting', 'introduction', 'en-US']),
// })

// mapper.put({ item: post }).then(() => {
//   // The post has been created!
//   console.log(post.id)
// })

// for await (const post of mapper.scan({valueConstructor: Post})) {
//   // Each post is an instance of the Post class
// }

export class Service {
  private readonly model: DataMapper

  constructor() {
    // const client = new DynamoDB({
    //   region: 'localhost',
    //   endpoint: 'http://localhost:8000',
    //   accessKeyId: 'DEFAULT_ACCESS_KEY', // needed if you don't have aws credentials at all in env
    //   secretAccessKey: 'DEFAULT_SECRET', // needed if you don't have aws credentials at all in env
    // })
    const client = new DynamoDB({apiVersion: "2012-08-10", region: 'ap-southeast-2' })
    this.model = new DataMapper({ client })
  }

  // async find(selector?: Partial<Post>) {
  //   const iterator = this.model.query({
  //     valueConstructor: Post,
  //     keyCondition: {
  //         hashKey: selector.,
  //         rangeKey: between(10, 99)
  //     }
  // });

  // for await (const item of iterator) {
  //     // Each post is an instance of MyDomainClass
  // }
  //   return this.model.find(selector)
  // }

  async create(recipe: Recipe): Promise<Recipe> {
    const toSave: Recipe = new Recipe()
    toSave.pk = `recipe:${uuidv4()}`
    toSave.sk = new Date().toISOString()
    toSave.id = uuidv4()
    toSave.creationDate = new Date()
    toSave.ratings = [1, 3, 5, 6, 3, 9]
    toSave.ratingsCount = 6,

    toSave.description = recipe.description
    toSave.title = recipe.title

    console.log('Saved recipe id: ', recipe.id)
    
    return new Promise<Recipe>(async resolve => {
      await this.model.put({ item: toSave })
      return resolve(toSave)
    }) 
    

    // var expires = new Date();
    // expires.setTime(expires.getTime() + (60*60*1000)); // Add 1 hour.

    // {
    //   Item:
    //   {
    //     id: 'session',
    //     credentials:
    //     {
    //       access_token: '',
    //       refresh_token: '',
    //       token_type: 'Bearer',
    //       expires_in: 3599,
    //       expires_at: expires.toISOString()
    //     }
    //   },
    //   TableName: 'table'
    // }
  }
  async get(_id: string): Promise<any> {
    const toFetch = new Recipe()
    toFetch.pk = _id
    return this.model.get({ item: toFetch })
  }

  async delete(_id: string): Promise<any> {
    const recipe = await this.get(_id)
    return this.model.delete({ item: recipe })
  }
}
