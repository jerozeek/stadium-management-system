import {PrismaClient, User} from '@prisma/client';
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

const prisma = new PrismaClient();

export async function createUser(kindeUser: KindeUser<User>) {
    return prisma.user.create({
        data: {
            kindeId: kindeUser.id,
            email: kindeUser.email ?? '',
            firstName: kindeUser.given_name ?? null,
            lastName: kindeUser.family_name ?? null,
            profileImage: kindeUser.picture ?? null,
            username: kindeUser.email ?? '', // Using email as username, you might want to change this
            password: '', // You might want to handle this differently
            role: 'user', // Default role
            contactInformation: '', // You might want to collect this separately
        },
    });
}

export async function getUserByKindeId(kindeId: string) {
    return prisma.user.findUnique({
        where: { kindeId }
    });
}

export async function updateUser(kindeId: string, data: Partial<KindeUser<User>>) {
    return prisma.user.update({
        where: { kindeId },
        data: {
            email: data.email as string,
            firstName: data.given_name,
            lastName: data.family_name,
            profileImage: data.picture,
        },
    });
}
