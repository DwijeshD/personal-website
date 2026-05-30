import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  return NextResponse.json({ model: process.env.OPENROUTER_MODEL ?? null })
}
