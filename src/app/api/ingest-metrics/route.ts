import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
  const response = NextResponse.json(cachedData);
  // Add Cache-Control header to enable edge caching for 5 seconds (stale-while-revalidate)
  response.headers.set('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=10');
  return response;
}
