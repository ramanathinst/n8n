import Image from "next/image"
import Link from "next/link"

export const AuthLayout = ({children} : {children: React.ReactNode}) => {
    return(
        <div className="flex flex-col items-center justify-center min-h-svh">
            <div className="flex w-full max-w-sm flex-col gap-5">
                    <Link href={"/"} className="flex gap-x-2 font-semibold self-center">
                        <Image src={"/logos/logo.svg"} width={30} height={30} alt="Nodebase"/>
                        <p>Nodebase</p>
                    </Link>
                    {children}
            </div>
           
        </div>
    )
}