import {
  Resolver,
  Query,
  FieldResolver,
  Arg,
  Root,
  Mutation,
  // Float,
  Int,
  ResolverInterface,
} from 'type-graphql'
import { plainToClass } from 'class-transformer'

import { Recipe } from './recipe-type'
import { RecipeInput } from './recipe-input'
import { createRecipeSamples } from './recipe-samples'
import { Service } from './recipe-service'


@Resolver(of => Recipe)
export class RecipeResolver implements ResolverInterface<Recipe> {
  private readonly service: Service
  private readonly items: Recipe[] = createRecipeSamples()
  constructor() {
    this.service = new Service()
  }

  @Query(returns => Recipe, { nullable: true })
  async recipe(@Arg('title') title: string): Promise<Recipe> {
    const item = this.items.find(recipe => recipe.title === title)
    return new Promise<Recipe>(resolve => {return resolve(item)}) 
  }

  @Query(returns => [Recipe], { description: 'Get all the recipes from around the world ', nullable: true })
  async recipes(): Promise<Recipe[]> {
    const items = this.items
    return new Promise<Recipe[]>(resolve => {return resolve(items)}) 
  }

  @Mutation(returns => Recipe)
  async addRecipe(@Arg('recipe') recipeInput: RecipeInput): Promise<Recipe> {
    const recipe = plainToClass(Recipe, {
      description: recipeInput.description,
      title: recipeInput.title,
      ratings: [],
      creationDate: new Date(),
    })
    // await this.items.push(recipe)
    return this.service.create(recipe)
  }

  @FieldResolver()
  ratingsCount(
    @Root() recipe: Recipe,
    @Arg('minRate', type => Int, { defaultValue: 0.0 }) minRate: number
  ): number {
    return recipe.ratings.filter(rating => rating >= minRate).length
  }
}
