"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button"
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import PetForm from "./pet-form";
import { useState } from "react";
import { flushSync } from "react-dom";

type PetButtonProps = {
    actionType: "add" | "edit" | "checkout";
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
}
export default function PetButton({actionType, children, className, disabled, onClick}: PetButtonProps) {

  const [isFormOpen, setIsFormOpen] = useState(false);

  if (actionType === "checkout"){
      return <Button className={cn(className)} disabled={disabled} variant="secondary" onClick={onClick}>{children}</Button>
    }

        return (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild >
              {
                actionType === "add" ? (
                  <Button className={cn(className)} size="icon" ><PlusIcon className="h-6 w-6"/></Button>
                ) : (
                  <Button className={cn(className)} variant="secondary" >{children}</Button>
                )
              }
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{actionType === "add" ? ("Add New Pet") : ("Edit Pet")}</DialogTitle>
              </DialogHeader>
              <PetForm actionType={actionType} onFormSubmission={() => {
                flushSync(() => setIsFormOpen(false)); 
              }}/>
            </DialogContent>
          </Dialog>
      );
    }

