"use client"

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Logout } from "./logout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
 
const Page = () => {

  const trpc = useTRPC();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());
  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      toast.success("workflow created!")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  }));
  
  return(
    <div className="flex flex-col items-center justify-center min-h-screen">
        {JSON.stringify(data)}
        <div className="flex flex-col gap-5">
            <Button onClick={() => create.mutate()}>
                create Workflow
            </Button>
            <Logout/>
        </div>
    
         
    </div>
  )
}
export default Page;