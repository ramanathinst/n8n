import { LoginForm } from "@/features/auth/components/login-form";
import { requiredUnauth } from "@/lib/auth.utils";

const Page = async() => {
    
    await requiredUnauth();
    return(
        <div>
            <LoginForm />
        </div>
    )
}

export default Page;