import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { inngest } from '@/inngest/client';

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(() => {
    return prisma.workflow.findMany();
  }),

  createWorkflow: protectedProcedure.mutation(async() => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        name: "helloInngest@gmail.com"
      }
    })

    return {success: true, message: "Created workflow"}
  })

});
// export type definition of API
export type AppRouter = typeof appRouter;