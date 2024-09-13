import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Agent } from "../domain/entity/agent";
import { Document } from "../domain/entity/document";
import { Run } from "../domain/entity/run";
import { CreateInitalTables1726177380728 } from "./migration/1726177380728-CreateInitalTables";
import { CreateRunTable1726196000145 } from "./migration/1726196000145-CreateRunTable";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
    logging: false,
    entities: [Agent, Document, Run],
    migrations: [CreateInitalTables1726177380728, CreateRunTable1726196000145],
});
