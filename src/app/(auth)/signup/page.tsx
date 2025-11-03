import { SignupForm } from "@/features/auth/components/signup-form";
import { requiredUnauth } from "@/lib/auth.utils";

const Page = async() => {

    await requiredUnauth();
    return(
        <div>
            <SignupForm/>
        </div>
    )
}

export default Page;