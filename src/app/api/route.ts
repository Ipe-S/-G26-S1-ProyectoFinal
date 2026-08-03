import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Sistema SDD API funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
}
