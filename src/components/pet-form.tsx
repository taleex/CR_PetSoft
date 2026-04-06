"use client";

import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { usePetContext } from '@/lib/hooks';
import PetFormBtn from './pet-form-btn';
import { useForm } from 'react-hook-form';

type PetFormProps = {
    actionType: "add" | "edit";
    onFormSubmission: () => void;
}

type TPetFormData = {
    name: string;
    ownerName: string;
    imageUrl: string;
    age: number;
    notes: string;
}

export default function PetForm({actionType, onFormSubmission}: PetFormProps) {

    const { handleAddPet , handleEditPet, selectedPet} = usePetContext();

    const { register, trigger, formState: { errors } } = useForm<TPetFormData>();

  return (
    <form 
        action={ async (formData) => { 
        const result = await trigger()
        if (!result) return;

        onFormSubmission();

        const petData = {
            name: formData.get("name") as string,
            ownerName: formData.get("ownerName") as string,
            imageUrl: formData.get("imageUrl") as string || "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
            age: Number(formData.get("age")),
            notes: formData.get("notes") as string,
        };
        
        if(actionType === "add") {
            await handleAddPet(petData);
        }
        else if (actionType === "edit" && selectedPet) {
            await handleEditPet(selectedPet?.id, petData);
    }

    }} 
        
        className='flex flex-col'>

        <div className='space-y-3'> 
            <div className='space-y-1'>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name', {
                    required: "Name is required",
                    minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters"
                    }
                })} />
            {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
            </div>

            <div className='space-y-1'>
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input id="ownerName" {...register('ownerName', {
                    required: "Owner Name is required",
                    maxLength: {
                        value: 20,
                        message: "Owner Name must be less than 20 characters"
                    }
                })} />
            {errors.ownerName && <p className='text-red-500'>{errors.ownerName.message}</p>}
            </div>

            <div className='space-y-1'>
                <Label htmlFor="imageUrl">Image Url</Label>
                <Input id="imageUrl" {...register('imageUrl')} />
            {errors.imageUrl && <p className='text-red-500'>{errors.imageUrl.message}</p>}
            </div>

            <div className='space-y-1'>
                <Label htmlFor="age">Age</Label>
                <Input id="age" {...register('age')}/>
            {errors.age && <p className='text-red-500'>{errors.age.message}</p>}
            </div>

            <div className='space-y-1'>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" {...register('notes')} />
            {errors.notes && <p className='text-red-500'>{errors.notes.message}</p>}
            </div>
        </div>

        <PetFormBtn actionType={actionType}/>
    </form>
  )
}
