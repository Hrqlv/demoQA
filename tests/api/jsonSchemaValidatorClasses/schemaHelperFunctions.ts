import { createSchema } from "genson-js";
import * as fs from "fs/promises";
import * as path from "path";

export async function createJsonSchema(jsonName: string, responseBodyJson: any): Promise<void> {
    try {
        const schema = createSchema(responseBodyJson);
        const schemaString = JSON.stringify(schema, null, 2);
        const schemaName = path.join(__dirname, `../jsonSchemas/${jsonName}.json`);
        await writeJsonFile(schemaName, schemaString);
    } catch (err) {
        console.error(err);
    }
    console.log("JSON Schema created and saved.");
}

async function writeJsonFile(location: string, data: string): Promise<void> {
    try {
        await fs.writeFile(location, data);
    } catch (err) {
        console.error(err);
    }
}
