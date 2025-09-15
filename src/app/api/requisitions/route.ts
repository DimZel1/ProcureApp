import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { generateRef } from '@/lib/ref';

const ReqBody = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  client: z.string().optional(),
  priority: z.enum(['Low','Normal','High']).default('Normal'),
  dueDate: z.string().optional(),
});

export async function GET() {
  const data = await prisma.requisition.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json({ data });
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = ReqBody.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 });
  }
  const { title, description, client, priority, dueDate } = parsed.data;

  const reference = await generateRef();

  const created = await prisma.requisition.create({
    data: {
      reference, title, description, client, priority,
      dueDate: dueDate ? new Date(dueDate) : undefined
    }
  });
  return Response.json({ data: created });
}
