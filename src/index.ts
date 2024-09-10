import { MikroORM } from "@mikro-orm/postgresql";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig)

    await orm.getMigrator().up();

    // Fork a new EntityManager instance for this operation
    const em = orm.em.fork(); 

    // const post = em.create(Post, {title: 'my first post'}); // Instance of post
    // await em.persistAndFlush(post);

    const posts = await em.find(Post, {})
    console.log(posts)
}

main().catch(err => console.log(err))