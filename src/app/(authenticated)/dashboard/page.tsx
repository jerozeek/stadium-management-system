import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserByKindeId } from '@/lib/user';

export default async function Dashboard() {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();
    const dbUser = await getUserByKindeId(kindeUser!.id);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {dbUser?.username}!</p>
        </div>
    );
}
