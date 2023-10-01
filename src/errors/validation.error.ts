import type { ZodError, ZodIssue } from "zod";

export class ValidationError {
    public readonly statusCode: number;
    public readonly issues: ZodIssue[];

    constructor(error: ZodError, statusCode = 400) {
        this.issues = error.issues;
        this.statusCode = statusCode;
    }
}