import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { successResponse, errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  if (!isDatabaseConfigured()) {
    return successResponse("Demo mode registration accepted. Connect Neon to persist users.", null, 201);
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: parsed.data.email.toLowerCase() }, { username: parsed.data.username.toLowerCase() }],
    },
  });

  if (existingUser) {
    return errorResponse("User with this email or username already exists", 409);
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      username: parsed.data.username.toLowerCase(),
      email: parsed.data.email.toLowerCase(),
      passwordHash,
      role: UserRole.USER,
    },
  });

  return successResponse("Account created successfully", { id: user.id }, 201);
}
