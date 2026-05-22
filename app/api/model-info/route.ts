import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const model = process.env.OPENROUTER_MODEL ?? null
  return NextResponse.json({ model })
}
