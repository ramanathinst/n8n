import { ExecutionStatus } from "@/generated/prisma/enums"
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react"

export const useGetStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className="size-5 text-green-600" />

        case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-red-600" />

        case ExecutionStatus.RUNNING:
            return (
                <Loader2Icon className="size-5 text-blue-600 animate-spin" />
            )

        default:
            return (
                <ClockIcon className="size-5 text-muted-foreground" />
            )
    }
}