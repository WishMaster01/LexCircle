import { UploadPurpose } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireUserRouteSession } from "@/lib/auth-guards";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";

export async function POST(request: Request) {
  const auth = await requireUserRouteSession();
  if ("response" in auth) {
    return auth.response;
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const requestedPurpose = formData.get("purpose");

  if (!(file instanceof File)) {
    return errorResponse("Image file is required.", 400);
  }

  if (!file.type.startsWith("image/")) {
    return errorResponse("Only image uploads are supported.", 400);
  }

  if (file.size > 5 * 1024 * 1024) {
    return errorResponse("Image must be 5MB or smaller.", 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
  const purpose =
    requestedPurpose === UploadPurpose.PROFILE_IMAGE
      ? UploadPurpose.PROFILE_IMAGE
      : UploadPurpose.ARTICLE_COVER;
  const publicId =
    purpose === UploadPurpose.PROFILE_IMAGE
      ? `profile-image-${Date.now()}`
      : `article-cover-${Date.now()}`;

  if (isDatabaseConfigured()) {
    await prisma.upload.create({
      data: {
        userId: auth.session.user.id,
        purpose,
        url: dataUrl,
        publicId,
      },
    });
  }

  return successResponse("Image uploaded successfully", {
    url: dataUrl,
    publicId,
  });
}

export async function DELETE(request: Request) {
  const auth = await requireUserRouteSession();
  if ("response" in auth) {
    return auth.response;
  }

  const body = (await request.json().catch(() => null)) as { publicId?: string } | null;
  if (isDatabaseConfigured() && body?.publicId) {
    await prisma.upload.deleteMany({
      where: {
        userId: auth.session.user.id,
        publicId: body.publicId,
      },
    });
  }

  return successResponse("Image deleted successfully", { deleted: true });
}
