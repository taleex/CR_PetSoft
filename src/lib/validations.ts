import z from "zod";
import { DEFAULT_PET_IMAGE_URL } from "./constants";

export const petIdSchema = z.string().cuid();

export const petFormSchema = z.object({
    name: z.string().trim().min(1, "Name must be at least 1 characters").max(100),
    ownerName: z.string().trim().min(1, "Owner Name must be at least 1 characters"),
    imageUrl: z.union([z.literal(""), z.string().trim().url({ message: "Image URL must be a valid URL" })]),
    age: z.coerce.number().int().positive({ message: "Age must be a positive integer" }).max(99999),
    notes:  z.union([z.literal(""), z.string().trim().max(1000, "Notes must be at most 1000 characters") ]),
}).transform((data) => ({...data, imageUrl: data.imageUrl || DEFAULT_PET_IMAGE_URL, }));

export type TPetformData = z.infer<typeof petFormSchema>;