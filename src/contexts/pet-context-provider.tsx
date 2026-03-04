"use client";

import { addPet } from "@/actions/actions";
import { Pet } from "@/lib/types";
import { createContext, useState } from "react"




type PetContextProviderProps = {
    children: React.ReactNode,
    data: Pet [];
}

type TPetContext = {
    pets: Pet[];
    selectedPetId: string | null;
    handleAddPet: (newPet: Omit<Pet, "id">) => void;
    handleChangeSelectedPetId: (id: string) => void;
    handleCheckoutPet: (id: string) => void;
    handleEditPet: (petId: string, newPetData: Omit<Pet, "id">) => void;
    selectedPet: Pet | undefined;
    numberOfPets: number;
}

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({children, data}: PetContextProviderProps) {

    //State

    const [pets, setPets] = useState(data);
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    //Derived state 
    const selectedPet = pets.find((pet) => pet.id === selectedPetId);
    const numberOfPets = pets.length;

    // event handlers
    const handleAddPet = async (newPet: Omit<Pet, "id">) => {
        //setPets(prev => [...prev, {...newPet, id: Date.now().toString()}]);

        await addPet(newPet);
    }

    const handleEditPet = (petId: string, newPetData: Omit<Pet, "id">) => {
        setPets(prev => prev.map(pet => pet.id === petId ? {id: petId, ...newPetData} : pet));
    }

    const handleCheckoutPet = (id: string) => {
        setPets(prev => prev.filter(pet => pet.id !== id));
        setSelectedPetId(null);
    };

    const handleChangeSelectedPetId = (id: string) => {
        setSelectedPetId(id);
    };


  return (
    <PetContext.Provider value={{
        pets, selectedPetId, handleAddPet, handleChangeSelectedPetId, handleCheckoutPet, handleEditPet, selectedPet, numberOfPets
    }}>
        {children}
    </PetContext.Provider>
  )
}
