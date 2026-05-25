"use server";

import { Prisma } from "@prisma/client";
import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { checkAuth, getPetById } from "@/lib/server-utils";
import { sleep } from "@/lib/utils";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// -- user actions--

export async function logIn(formData: unknown) {

    await sleep(1000);

    if(!(formData instanceof FormData)) {
        return { message: "Invalid form data" };
    }

    await signIn('credentials', formData );

    redirect("/app/dashboard");
}

export async function signUp(formData:unknown) {

    await sleep(1000);

    //Check if formData is an instance of FormData
    if (!(formData instanceof FormData)) {
        return { message: "Invalid form data" };
    }

    //convert FormData to an object
    const formDataEntries = Object.fromEntries(formData.entries());

    // Validation check
    const validatedFormData = authSchema.safeParse(formDataEntries);
    if (!validatedFormData.success) {
        return { message: "Invalid form data" };
    }

    const {email, password} = validatedFormData.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    try{
    await prisma.user.create({
        data: {
            email: email,
            hashedPassword: hashedPassword,
        }
    });
} catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError) {
        if(error.code === "P2002"){
            return { message: "Email already in use" };
        }
    }
}

    await signIn('credentials', formData);


}

export async function logOut() {
    await signOut({ redirectTo: "/" });
  }

// -- pet actions--
export async function addPet(pet: unknown) {
    await sleep(2000);

    // Authentication check
    
    const session = await checkAuth();

    // Validation check

    const validatedPet = petFormSchema.safeParse(pet);

    if (!validatedPet.success) {
        return { message: "Invalid pet data" };
    }


    // Database operation
    try {
    await prisma.pet.create({
        data: {
            ...validatedPet.data, user: { connect: { id: session.user.id } }
        },
    });

} catch (error) {
    return { message: "Error adding pet:" };
}
revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, newPetData: unknown) {

    await sleep(2000);

    // Authentication check
    const session = await checkAuth();

    // Validation check
    const validPetId = petIdSchema.safeParse(petId);
    const validatedNewPetData = petFormSchema.safeParse(newPetData);

    if (!validatedNewPetData.success || !validPetId.success) {
        return { message: "Invalid pet data" };
    }

    // Authorization check
    const pet = await getPetById(validPetId.data);

    if (!pet) {
        return { message: "Pet not found" };
    }

    if (pet.userId !== session.user.id) {
        return { message: "Unauthorized to edit this pet" };
    }

    // Database operation

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


    // Authentication check
    const session = await checkAuth();

    // Validation check
    const validPetId = petIdSchema.safeParse(petId);

    if (!validPetId.success) {
        return { message: "Invalid pet ID" };
    }

    //authorization check
    const pet = await getPetById(validPetId.data);

    if (!pet) {
        return { message: "Pet not found" };
    }

    if (pet.userId !== session.user.id) {
        return { message: "Unauthorized to delete this pet" };
    }
    
    // database operation
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