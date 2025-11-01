import prisma from "@/lib/db";

const Page = async() => {
  const users = await prisma.user.findMany();
  return(
    <div className="flex flex-col items-center justify-center min-h-screen">
        { JSON.stringify(users)}
    </div>
  )
}
export default Page;