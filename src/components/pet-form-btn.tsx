import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function PetFormBtn({actionType}: {actionType: "add" | "edit"}) {

    const {pending} = useFormStatus();

  return (
            <Button disabled={pending} type="submit" className='mt-5 self-end'>{actionType === "add" ? "Add a new Pet" : "Edit Pet"}</Button>

  )
}
