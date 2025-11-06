"use client"

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Logout } from "@/app/logout";
 
const Page = () => {

  const trpc = useTRPC();
   const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess: () => {
      toast.success("Ai executed!")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  }));
  
  return(
    <div className="flex flex-col items-center justify-center min-h-screen">
         <div className="flex flex-col gap-5">
            <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
                Test Ai subscription
            </Button>
            <Logout/>
        </div>
    
         
    </div>
  )
}
export default Page;