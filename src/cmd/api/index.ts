import "dotenv/config";
import express from "express";
import { createAgentRoute } from "./route/createAgent";
import { DataSource } from "typeorm";
import { Agent } from "domain/entity/agent";

const api = express();
api.use(express.json());

const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
    entities: [Agent],
});

api.post("/agents", createAgentRoute(dataSource));

(async () => {
    await dataSource.initialize();
    api.listen(process.env.API_PORT, () =>
        console.log(`Running on port ${process.env.API_PORT}.`),
    );
})();
