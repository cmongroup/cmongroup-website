import { NextResponse } from 'next/server';
import { dbHealth, exampleItemsCount } from '@/lib/db';

export async function GET() {
  const health = await dbHealth();
  const items = await exampleItemsCount();
  const body = { db: health, items };
  const status = health.ok ? 200 : 500;
  return NextResponse.json(body, { status });
}
