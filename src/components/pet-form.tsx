"use client";

import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { usePetContext } from '@/lib/hooks';
import PetFormBtn from './pet-form-btn';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { da } from 'zod/locales';
import { DEFAULT_PET_IMAGE_URL } from '@/lib/constants';

type PetFormProps = {
    actionType: "add" | "edit";
    onFormSubmission: () => void;
}

const petFormSchema = z.object({
    name: z.string().trim().min(1, "Name must be at least 1 characters").max(100),
    ownerName: z.string().trim().min(1, "Owner Name must be at least 1 characters"),
    imageUrl: z.union([z.literal(""), z.string().trim().url({ message: "Image URL must be a valid URL" })]),
    age: z.coerce.number().int().positive({ message: "Age must be a positive integer" }).max(99999),
    notes:  z.union([z.literal(""), z.string().trim().max(1000, "Notes must be at most 1000 characters") ]),
}).transform((data) => ({...data, imageUrl: data.imageUrl || DEFAULT_PET_IMAGE_URL, }));

type TPetformData = z.infer<typeof petFormSchema>;

export default function PetForm({actionType, onFormSubmission}: PetFormProps) {

    const { handleAddPet , handleEditPet, selectedPet} = usePetContext();

    const { register, trigger, getValues, formState: { errors }, } = useForm<TPetformData>({
        resolver: zodResolver(petFormSchema),
    });

  return (
    <form 
        action={ async (formData) => { 
        const result = await trigger()
        if (!result) return;
        
        onFormSubmission();

        const petData = getValues();
        petData.imageUrl = petData.imageUrl || DEFAULT_PET_IMAGE_URL;
        
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
                <Input id="name" {...register('name')} />
            {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
            </div>

            <div className='space-y-1'>
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input id="ownerName" {...register('ownerName')} />
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
