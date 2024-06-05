import { createJsonSchema } from "./schemaHelperFunctions";
import { expect } from "@playwright/test";
import Ajv, { ErrorObject, ValidateFunction } from "ajv";
import * as fs from "fs";
import * as path from "path";

export async function validateJsonSchema(schemaName: string, responseBody: any, createSchema: boolean = false): Promise<void> {
    if (createSchema) {
        await createJsonSchema(schemaName, responseBody);
    }

    const schemaPath = path.join(__dirname, `../jsonSchemas/${schemaName}.json`);
    const existingSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    const ajv = new Ajv({ allErrors: false });
    const validate = ajv.compile(existingSchema) as ValidateFunction;
    const validRes = validate(responseBody);
    let error: ErrorObject | undefined;

    if (!validRes) {
        error = validate.errors![0];
        if (error.keyword === 'required') {
            throw new Error(`JSON schema validation error:\n schemaName: ${schemaName}\n keyword: ${error.keyword}\n message: ${error.message}\n received: Property not found in responseBody`);
        } else if (error.keyword === 'type') {
            const instancePath = error.instancePath!;
            const receivedValue = instancePath.split('/').filter(key => key !== '').reduce((value, key) => value[key], responseBody);
            throw new Error(`JSON schema validation error:\n schemaName: ${schemaName}\n instancePath: ${instancePath}\n keyword: ${error.keyword}\n message: ${error.message}\n received: ${typeof receivedValue} ("${receivedValue}")\n`);
        }
    }
    expect(validRes).toBe(true);
}
