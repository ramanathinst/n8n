import { PAGINATION } from "@/config/constants";
import { CredentialsType } from "@/generated/prisma/enums";
import prisma from "@/lib/db";
import {
    createTRPCRouter,
    protectedProcedure,
} from "@/trpc/init";
import z from "zod";

export const credentialsRouter = createTRPCRouter({

    create: protectedProcedure.input(z.object({
        name: z.string().min(1, "Name is required!"),
        type: z.enum(CredentialsType),
        value: z.string().min(1, "Value is required!")
    })).mutation(({ ctx, input }) => {
        const { name, type, value } = input;
        return prisma.credential.create({
            data: {
                name,
                type,
                value,
                userId: ctx.auth.user.id
            },
        });
    }),

    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(({ ctx, input }) => {
            return prisma.credential.delete({
                where: {
                    userId: ctx.auth.user.id,
                    id: input.id,
                },
            });
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(1, "Name is required!"),
                type: z.enum(CredentialsType),
                value: z.string().min(1, "Value is required!")
            })
        )
        .mutation( ({ ctx, input }) => {
            const { id, name, type, value } = input;
            return prisma.credential.update({
                where: {
                    userId: ctx.auth.user.id,
                    id
                },
                data: {
                    name,
                    type,
                    value
                }
            })
        }),

    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(({ ctx, input }) => {
            return prisma.credential.findUniqueOrThrow({
                where: {
                    userId: ctx.auth.user.id,
                    id: input.id,
                },
            });
        }),

    getMany: protectedProcedure
        .input(
            z.object({
                page: z.number().default(PAGINATION.DEFAULT_PAGE),
                pageSize: z
                    .number()
                    .min(PAGINATION.MIN_PAGE_SIZE)
                    .max(PAGINATION.MAX_PAGE_SIZE)
                    .default(PAGINATION.DEFAULT_PAGE_SIZE),
                search: z.string().optional().default(""), // ✅ added search input
            })
        )
        .query(async ({ ctx, input }) => {
            const { page, pageSize, search } = input;
            const [items, totalCount] = await Promise.all([
                prisma.credential.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    where: {
                        userId: ctx.auth.user.id,
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    orderBy: {
                        updatedAt: "desc",
                    },
                }),
                prisma.credential.count({
                    where: {
                        userId: ctx.auth.user.id,
                        name: {
                            contains: search,
                        },
                    },
                }),
            ]);

            const totalPage = Math.ceil(totalCount / pageSize);
            const hasNextPage = page < pageSize;
            const hasPreviousPage = page > 1;

            return {
                items,
                page,
                pageSize,
                totalPage,
                hasNextPage,
                hasPreviousPage,
            };
        }),

    getByType: protectedProcedure.input(z.object({ type: z.enum(CredentialsType)})).query(({ctx, input}) => {
        const { type } = input;
        return prisma.credential.findMany({
            where: {
                type
            },
            orderBy: {
                updatedAt: "desc"
            }
        })
    })
});
