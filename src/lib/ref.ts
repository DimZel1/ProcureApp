import { prisma } from './prisma';

/** Generate RPT-YY-0001-RQ with yearly reset and atomic increment */
export async function generateRef() {
  const now = new Date();
  const yy = now.getFullYear() % 100; // 2025 -> 25

  const updated = await prisma.$transaction(async (tx) => {
    // Ensure a row exists for this year
    await tx.sequence.upsert({
      where: { year: yy },
      update: {},
      create: { year: yy, lastValue: 0 }
    });
    // Atomically increment and return the updated row
    const row = await tx.sequence.update({
      where: { year: yy },
      data: { lastValue: { increment: 1 } }
    });
    return row;
  });

  const num = String(updated.lastValue).padStart(4, '0');
  return `RPT-${String(yy).padStart(2, '0')}-${num}-RQ`;
}
