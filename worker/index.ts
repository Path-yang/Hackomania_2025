import { Worker, Queue, JobsOptions } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@/lib/db";

export const queueName = "milestones";

export type ProcessMilestoneJob = { milestoneId: string };

let connection: IORedis | null = null;
function getRedisConnection(): IORedis {
  if (!connection) {
    connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", { maxRetriesPerRequest: null });
  }
  return connection;
}

let milestoneQueueInstance: Queue<ProcessMilestoneJob> | null = null;
function getMilestoneQueue(): Queue<ProcessMilestoneJob> {
  if (!milestoneQueueInstance) {
    milestoneQueueInstance = new Queue<ProcessMilestoneJob>(queueName, { connection: getRedisConnection() });
  }
  return milestoneQueueInstance;
}

async function processMilestone(job: { data: ProcessMilestoneJob }) {
  const { milestoneId } = job.data;
  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: { goal: { include: { recipient: true } } },
  });
  if (!milestone) throw new Error("Milestone not found");
  if (milestone.status !== "VERIFIED") {
    return { skipped: true };
  }
  await prisma.milestone.update({ where: { id: milestoneId }, data: { status: "PAID" } });
  return { ok: true };
}

export function startMilestoneWorker() {
  return new Worker<ProcessMilestoneJob>(queueName, processMilestone as any, { connection: getRedisConnection() });
}

export async function enqueueProcessMilestone(milestoneId: string, opts?: JobsOptions) {
  await getMilestoneQueue().add("processMilestone", { milestoneId }, opts);
} 