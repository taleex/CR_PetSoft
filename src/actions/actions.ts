"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// -- user actions--

export async function logIn(formData: FormData) {

    await signIn('credentials', formData );
}

export async function signUp(formData:FormData) {

    const hashedPassword = await bcrypt.hash(formData.get("password") as string, 10);

    await prisma.user.create({
        data: {
            email: formData.get("email") as string,
            hashedPassword: hashedPassword,
        }
    });

    await signIn('credentials', formData);


}

export async function logOut() {
    await signOut({ redirectTo: "/" });
  }

// -- pet actions--
export async function addPet(pet: unknown) {
    await sleep(2000);

    const validatedPet = petFormSchema.safeParse(pet);

    if (!validatedPet.success) {
        return { message: "Invalid pet data" };
    }

    try {
    await prisma.pet.create({
        data: validatedPet.data,
    });

} catch (error) {
    return { message: "Error adding pet:" };
}
revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, newPetData: unknown) {

    sleep(2000);

    const validPetId = petIdSchema.safeParse(petId);

    if (!validPetId.success) {
        return { message: "Invalid pet ID" };
    }

    const validatedNewPetData = petFormSchema.safeParse(newPetData);

    if (!validatedNewPetData.success) {
        return { message: "Invalid pet data" };
    }

    try{
    await prisma.pet.update({
        where: {
            id: validPetId.data },
            data: validatedNewPetData.data,
    });
    
    } catch (error) {
        return { message: "Error editing pet" };
    }

    revalidatePath("/app", "layout");

}

export async function deletePet(petId: unknown) {
    await sleep(2000);

    const validPetId = petIdSchema.safeParse(petId);

    if (!validPetId.success) {
        return { message: "Invalid pet ID" };
    }
    
    try {
    await prisma.pet.delete({
        where: {
            id: validPetId.data 
        }
    });

} catch (error){
    return{ message: "Error deleting pet" };
}

revalidatePath("/app", "layout");
}