import "reflect-metadata"
import { DataSource } from "typeorm"
import { Article } from "./entities/Article"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "eurest_devis",
    synchronize: true,
    logging: true,
    entities: [Article],
    subscribers: [],
    migrations: [],
})
