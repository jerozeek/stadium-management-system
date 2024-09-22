import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { getUserByKindeId } from '@/lib/user';

export default async function AuthenticatedLayout({children}: { children: React.ReactNode }) {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
        redirect("/api/auth/login");
    }

    const dbUser = await getUserByKindeId(kindeUser.id);

    if (!dbUser) {
        // Handle case where user is authenticated with Kinde but not in your database
        // You might want to redirect to a profile completion page or handle this case differently
        redirect("/complete-profile");
    }

    return <>{children}</>;
}
