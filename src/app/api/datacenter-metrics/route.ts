import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function fetchPrometheusVector(query: string) {
  try {
    const res = await fetch(`http://10.10.3.231:9090/api/v1/query?query=${encodeURIComponent(query)}`, {
      signal: AbortSignal.timeout(4000)
    });
    const data = await res.json();
    return data?.data?.result || [];
  } catch (err) {
    return [];
  }
}

export async function GET() {
  // Query all CPU usage ratios and memory usage for all nodes/VMs/LXCs
  const cpuResults = await fetchPrometheusVector('pve_cpu_usage_ratio');
  const memUsedResults = await fetchPrometheusVector('pve_memory_usage_bytes');
  const memSizeResults = await fetchPrometheusVector('pve_memory_size_bytes');

  // Build a map of servers/containers
  const serversMap: Record<string, any> = {};

  cpuResults.forEach((item: any) => {
    const id = item.metric.id || 'unknown';
    const cpuRatio = parseFloat(item.value[1]) || 0;
    if (!serversMap[id]) {
      serversMap[id] = { id, type: id.split('/')[0] || 'node', name: id, cpu: (cpuRatio * 100).toFixed(1) + '%', memory: 'N/A' };
    } else {
      serversMap[id].cpu = (cpuRatio * 100).toFixed(1) + '%';
    }
  });

  memUsedResults.forEach((item: any) => {
    const id = item.metric.id;
    if (id && serversMap[id]) {
      const used = parseFloat(item.value[1]) || 0;
      // find corresponding size
      const sizeItem = memSizeResults.find((s: any) => s.metric.id === id);
      const size = sizeItem ? parseFloat(sizeItem.value[1]) || 0 : 0;
      if (size > 0) {
        serversMap[id].memory = ((used / size) * 100).toFixed(1) + '%';
      } else {
        serversMap[id].memory = (used / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
      }
    }
  });

  const serversList = Object.values(serversMap);

  return NextResponse.json({
    datacenterStatus: 'OPTIMAL',
    timestamp: new Date().toISOString(),
    datasource: 'Prometheus + Proxmox Exporter (10.10.3.254)',
    totalServers: serversList.length,
    servers: serversList
  });
}
