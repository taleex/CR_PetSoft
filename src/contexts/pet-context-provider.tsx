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
     const [optimisticPets, setOptimisticPets] = useOptimistic(data, (state, {action, payload}) => {
        switch(action) {
            case "add": {
                return [...state, {...payload, id: Math.random().toString()}];
            }
            case "edit": {
                return state.map((pet) => 
                    {
                        if(pet.id === payload.id) {
                            return {...pet, ...payload.newPetData};
                        }
                        return pet; 
                    });
            }
            case "delete": {
                return state.filter((pet) => pet.id !== payload);
            }
            default: {
                return state;
            }
     } });

    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    //Derived state 
    const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
    const numberOfPets = optimisticPets.length;

    // event handlers
    const handleAddPet = async (newPet: Omit<Pet, "id">) => {
        setOptimisticPets({action: "add", payload: newPet});
         const error = await addPet(newPet); 
            if (error) {
                toast.error(error.message);
                return;
            }
    }

    const handleEditPet = async (petId: string, newPetData: Omit<Pet, "id">) => {
        setOptimisticPets({action: "edit", payload: {id: petId, ...newPetData}});
         const error = await editPet(petId, newPetData); 
                    if (error) {
                        toast.error(error.message);
                        return;
                    }
    }

    const handleCheckoutPet = async (petId: string) => {
        setOptimisticPets({action: "delete", payload: petId});
        const error = await deletePet(petId);
        if (error) {
            toast.error(error.message);
            return;
        }
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
