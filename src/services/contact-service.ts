import {
  ContactMessageStatus,
  ContactTopic,
  type Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import type { ContactFormValues } from "@/lib/validations/contact";

type DemoContactMessage = {
  id: string;
  name: string;
  email: string;
  topic: ContactTopic;
  company: string | null;
  teamSize: string | null;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
  handledAt: string | null;
  internalNotes: string | null;
  handledById: string | null;
  handledBy: {
    id: string;
    name: string;
    username: string;
    role: "ADMIN" | "MODERATOR";
  } | null;
};

type DemoHandler = {
  id: string;
  name: string;
  username: string;
  role: "ADMIN" | "MODERATOR";
};

const demoHandlers: DemoHandler[] = [
  {
    id: "admin-1",
    name: "LexCircle Admin",
    username: "admin",
    role: "ADMIN",
  },
  {
    id: "moderator-1",
    name: "Maya Raman",
    username: "mayaraman",
    role: "MODERATOR",
  },
];

const demoMessages: DemoContactMessage[] = [
  {
    id: "contact-1",
    name: "Aarav Mehta",
    email: "aarav@campuslawreview.org",
    topic: ContactTopic.DEMO,
    company: "Campus Law Review",
    teamSize: "8 editors",
    message:
      "We want a demo for running our student law journal submissions and review workflow on LexCircle.",
    status: ContactMessageStatus.IN_PROGRESS,
    createdAt: "2026-07-10T10:00:00.000Z",
    updatedAt: "2026-07-10T12:00:00.000Z",
    handledAt: null,
    internalNotes: "Needs workflow and moderation overview.",
    handledById: "admin-1",
    handledBy: demoHandlers[0],
  },
  {
    id: "contact-2",
    name: "Riya Sen",
    email: "riya@example.com",
    topic: ContactTopic.SUPPORT,
    company: null,
    teamSize: "Solo student",
    message:
      "I need help understanding why my legal article draft is not showing up in the approved dashboard list.",
    status: ContactMessageStatus.PENDING,
    createdAt: "2026-07-11T08:30:00.000Z",
    updatedAt: "2026-07-11T08:30:00.000Z",
    handledAt: null,
    internalNotes: null,
    handledById: null,
    handledBy: null,
  },
];

const topicMap: Record<ContactFormValues["topic"], ContactTopic> = {
  support: ContactTopic.SUPPORT,
  partnership: ContactTopic.PARTNERSHIP,
  security: ContactTopic.SECURITY,
  demo: ContactTopic.DEMO,
  other: ContactTopic.OTHER,
};

export async function submitContactMessage(input: ContactFormValues) {
  const data = {
    name: input.name,
    email: input.email.toLowerCase(),
    topic: topicMap[input.topic],
    company: input.company || null,
    teamSize: input.teamSize || null,
    message: input.message,
  } satisfies Prisma.ContactMessageUncheckedCreateInput;

  if (!isDatabaseConfigured()) {
    return {
      id: `demo-${Date.now()}`,
      ...data,
      status: ContactMessageStatus.PENDING,
      handledById: null,
      handledBy: null,
      handledAt: null,
      internalNotes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return prisma.contactMessage.create({ data });
}

export async function listContactMessages() {
  if (!isDatabaseConfigured()) {
    return demoMessages;
  }

  return prisma.contactMessage.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      handledBy: {
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
        },
      },
    },
  });
}

export async function listContactHandlers() {
  if (!isDatabaseConfigured()) {
    return demoHandlers;
  }

  return prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "MODERATOR"],
      },
      isActive: true,
      isSuspended: false,
    },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
    },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });
}

export async function getContactMessageSummary() {
  if (!isDatabaseConfigured()) {
    return {
      total: demoMessages.length,
      pending: demoMessages.filter(
        (item) => item.status === ContactMessageStatus.PENDING,
      ).length,
      inProgress: demoMessages.filter(
        (item) => item.status === ContactMessageStatus.IN_PROGRESS,
      ).length,
      resolved: demoMessages.filter(
        (item) => item.status === ContactMessageStatus.RESOLVED,
      ).length,
      recent: demoMessages.slice(0, 4),
    };
  }

  const [messages, grouped] = await Promise.all([
    prisma.contactMessage.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    }),
  ]);

  const counts = new Map(grouped.map((item) => [item.status, item._count.id]));

  return {
    total: [...counts.values()].reduce((sum, value) => sum + value, 0),
    pending: counts.get(ContactMessageStatus.PENDING) ?? 0,
    inProgress: counts.get(ContactMessageStatus.IN_PROGRESS) ?? 0,
    resolved: counts.get(ContactMessageStatus.RESOLVED) ?? 0,
    recent: messages,
  };
}

export async function updateContactMessageStatus(
  id: string,
  status: ContactMessageStatus,
) {
  if (!isDatabaseConfigured()) {
    const message = demoMessages.find((item) => item.id === id);
    return {
      id,
      status,
      updatedAt: new Date().toISOString(),
      handledAt:
        status === ContactMessageStatus.RESOLVED ||
        status === ContactMessageStatus.ARCHIVED
          ? new Date().toISOString()
          : (message?.handledAt ?? null),
    };
  }

  return prisma.contactMessage.update({
    where: { id },
    data: {
      status,
      handledAt:
        status === ContactMessageStatus.RESOLVED ||
        status === ContactMessageStatus.ARCHIVED
          ? new Date()
          : null,
    },
  });
}

export async function updateContactMessage(
  id: string,
  input: {
    status: ContactMessageStatus;
    internalNotes?: string | null;
    handledById?: string | null;
  },
) {
  if (!isDatabaseConfigured()) {
    const existing = demoMessages.find((item) => item.id === id);
    const handler =
      demoHandlers.find((item) => item.id === input.handledById) ?? null;
    return {
      id,
      name: existing?.name ?? "Unknown",
      email: existing?.email ?? "",
      topic: existing?.topic ?? ContactTopic.OTHER,
      company: existing?.company ?? null,
      teamSize: existing?.teamSize ?? null,
      message: existing?.message ?? "",
      status: input.status,
      internalNotes: input.internalNotes ?? null,
      handledById: input.handledById ?? null,
      handledBy: handler,
      handledAt:
        input.status === ContactMessageStatus.RESOLVED ||
        input.status === ContactMessageStatus.ARCHIVED
          ? new Date().toISOString()
          : (existing?.handledAt ?? null),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return prisma.contactMessage.update({
    where: { id },
    data: {
      status: input.status,
      internalNotes: input.internalNotes ?? null,
      handledById: input.handledById || null,
      handledAt:
        input.status === ContactMessageStatus.RESOLVED ||
        input.status === ContactMessageStatus.ARCHIVED
          ? new Date()
          : null,
    },
    include: {
      handledBy: {
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
        },
      },
    },
  });
}
