import { NextResponse } from "next/server";

export function successResponse<T>(message: string, data: T, status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function errorResponse(
  message: string,
  status = 400,
  errors?: Record<string, string | string[] | undefined>,
) {
  return NextResponse.json({ success: false, message, errors }, { status });
}
