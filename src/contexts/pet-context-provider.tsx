"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { Pet } from "@/lib/types";
import { createContext, useOptimistic, useState } from "react"
import { toast } from "sonner";

type PetContextProviderProps = {
    children: React.ReactNode,
    data: Pet [];
}

type TPetContext = {
    pets: Pet[];
    selectedPetId: string | null;
    handleAddPet: (newPet: Omit<Pet, "id">) => Promise<void>;
    handleChangeSelectedPetId: (id: string) => void;
    handleCheckoutPet: (id: string) => Promise<void>;
    handleEditPet: (petId: string, newPetData: Omit<Pet, "id">) => Promise<void>;
    selectedPet: Pet | undefined;
    numberOfPets: number;
}

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({children, data}: PetContextProviderProps) {

    //State
     const [optimisticPets, setOptimisticPets] = useOptimistic(data, (state, newPet) => {
        return [...state, {
            ...newPet,
            id: Math.random().toString(),
        } ];
     } );
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    //Derived state 
    const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
    const numberOfPets = optimisticPets.length;

    // event handlers
    const handleAddPet = async (newPet: Omit<Pet, "id">) => {
        setOptimisticPets(newPet);
         const error = await addPet(newPet); 
            if (error) {
                toast.error(error.message);
                return;
            }
    }

    const handleEditPet = async (petId: string, newPetData: Omit<Pet, "id">) => {
         const error = await editPet(petId, newPetData); 
                    if (error) {
                        toast.error(error.message);
                        return;
                    }
    }

    const handleCheckoutPet = async (petId: string) => {
        await deletePet(petId);
        setSelectedPetId(null);
    };

    const handleChangeSelectedPetId = (id: string) => {
        setSelectedPetId(id);
    };


  return (
    <PetContext.Provider value={{
        pets: optimisticPets, selectedPetId, handleAddPet, handleChangeSelectedPetId, handleCheckoutPet, handleEditPet, selectedPet, numberOfPets
    }}>
        {children}
    </PetContext.Provider>
  )
}
