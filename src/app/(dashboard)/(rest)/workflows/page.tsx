import { Logout } from "@/app/logout";
import { requiredAuth } from "@/lib/auth.utils";

const Page = async() => {
    await requiredAuth();
    return(
        <div>
            Workflows page!
            <Logout/>
        </div>
    )
}

export default Page;