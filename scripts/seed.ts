import { prisma } from "@/lib/db";

async function main() {
  // Clear existing
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.pledge.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.walletConnection.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({ data: { email: "admin@example.com", name: "Admin", role: "ADMIN" } });
  const mentor = await prisma.user.create({ data: { email: "mentor@example.com", name: "Morgan Mentor", role: "MENTOR" } });
  const donor1 = await prisma.user.create({ data: { email: "donor1@example.com", name: "Dana Donor", role: "DONOR" } });
  const donor2 = await prisma.user.create({ data: { email: "donor2@example.com", name: "Drew Donor", role: "DONOR" } });
  const recipient1 = await prisma.user.create({ data: { email: "rec1@example.com", name: "Alex R.", role: "RECIPIENT" } });
  const recipient2 = await prisma.user.create({ data: { email: "rec2@example.com", name: "Jamie K.", role: "RECIPIENT" } });

  const goal = await prisma.goal.create({
    data: { recipientId: recipient1.id, title: "No cigarettes", description: "Quit smoking.", isActive: true },
  });

  const m1 = await prisma.milestone.create({
    data: { goalId: goal.id, kind: "DAILY", targetDate: new Date(), amountMinor: 10, currency: "USD", status: "VERIFIED", verifierId: mentor.id, verifiedAt: new Date() },
  });

  const pledgeDaily = await prisma.pledge.create({
    data: {
      donorId: donor1.id,
      recipientId: recipient1.id,
      goalId: goal.id,
      amountPerMilestoneMinor: 10,
      currency: "USD",
      cadence: "DAILY",
      dailyCapMinor: 100,
      weeklyCapMinor: 500,
      monthlyCapMinor: 2000,
      startDate: new Date(),
      isActive: true,
    },
  });

  console.log("Seeded:", { admin, mentor, donor1, donor2, recipient1, recipient2, goal, m1, pledgeDaily });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
}); 