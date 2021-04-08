import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  username: string;
  @Field(() => String)
  email: string;
  @Field(() => String)
  password: string;
}
