import {
  Arg,
  Mutation,
  Publisher,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { Message } from "../Types/messageType";
import { User } from "../Types/userType";

const Users: User[] = [
  { id: 1, email: "ilyass@gmial.com", password: "123456", username: "1243" },
  { id: 2, email: "ilyass1@gmial.com", password: "123456", username: "1243" },
];
@Resolver()
export class userResolver {
  @Query(() => String!)
  hello() {
    return "Hello world";
  }
  @Query(() => [User])
  Users() {
    return Users;
  }
  @Mutation(() => User)
  async addUser(
    @Arg("email") email: string,
    @Arg("username") username: string,
    @Arg("password") password: string,
    @PubSub("USERS") publisher: Publisher<User>
  ) {
    const newUser = {
      id: Users[Users.length - 1].id + 1,
      password,
      email,
      username,
    };
    Users.push(newUser);
    await publisher(newUser);
    return newUser;
  }
  @Subscription(() => User, { topics: "USERS" })
  subUsers(@Root() user: any) {
    return user;
  }

  @Mutation(() => String)
  sendMessage(
    @Arg("message") message: string,
    @Arg("room") room: string,
    @PubSub() publish: PubSubEngine
  ) {
    publish.publish(room, message);
    return message;
  }

  @Subscription(() => Message, {
    topics: ({ args }) => args.room,
  })
  subMessages(@Root() message: string, @Arg("room") _: string) {
    return { date: new Date().toLocaleString(), message };
  }
}
