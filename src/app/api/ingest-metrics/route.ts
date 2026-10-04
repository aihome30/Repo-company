import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In-memory cache for the latest pushed metrics (or store in a lightweight way)
// For serverless, we can store it in global or a simple structure.
let cachedData = {
  datacenterStatus: 'OPTIMAL',
  timestamp: new Date().toISOString(),
  datasource: 'Datacenter Local Push Agent',
  totalServers: 0,
  servers: []
};

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== 'Bearer secure-datacenter-push-token-rizki') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    cachedData = {
      ...body,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({ success: true, receivedServers: cachedData.servers?.length || 0 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(cachedData);
}
