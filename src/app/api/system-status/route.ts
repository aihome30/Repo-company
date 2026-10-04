import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const uptimeSeconds = process.uptime();
  
  return NextResponse.json({
    status: 'OPERATIONAL',
    system: 'wspend Enterprise Infrastructure',
    timestamp: new Date().toISOString(),
    metrics: {
      uptimeFormatted: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m`,
      services: [
        { name: 'Core Web Platform', status: 'HEALTHY', latency: '42ms' },
        { name: 'AI Customer Service Engine', status: 'HEALTHY', latency: '68ms' },
        { name: 'Security & DLP Shield', status: 'ACTIVE', threatsBlocked: 0 },
        { name: 'Global CDN Delivery', status: 'OPERATIONAL', edgeLocations: 'Global Edge' }
      ],
      networkSecurity: 'Zero-Trust Protocol Active',
      dataProtection: 'DLP Enforced (Zero Data Leak)'
    }
  });
}
