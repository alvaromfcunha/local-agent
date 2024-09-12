import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Agent } from "../domain/entity/agent";
import { InitialTables1726102147683 } from "./migration/1726102147683-InitialTables";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
    logging: false,
    entities: [Agent],
    migrations: [InitialTables1726102147683],
});
