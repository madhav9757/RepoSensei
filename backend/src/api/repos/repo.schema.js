import { z } from "zod";

export const getRepoSchema = z.object({
    params: z.object({
        owner: z.string({
            required_error: "Owner is required",
        }),
        repo: z.string({
            required_error: "Repo name is required",
        }),
    }),
});

export const getUserReposSchema = z.object({
    query: z.object({
        // Add any query params if needed, e.g. pagination
        page: z.string().optional(),
        per_page: z.string().optional(),
    }).optional(),
});
