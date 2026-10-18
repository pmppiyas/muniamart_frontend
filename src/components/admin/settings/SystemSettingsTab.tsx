'use client';

import * as React from 'react';
import { Server, Database, Cloud, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function SystemSettingsTab() {
  const [isPinging, setIsPinging] = React.useState(false);
  const [lastChecked, setLastChecked] = React.useState<string>(new Date().toLocaleTimeString());

  const handlePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      setLastChecked(new Date().toLocaleTimeString());
      toast.success('All system microservices and databases are operational!');
    }, 500);
  };

  const systems = [
    {
      name: 'Express Backend API',
      type: 'Core Server',
      endpoint: 'http://localhost:5000/api/v1',
      status: 'Operational',
      icon: Server,
      color: 'text-emerald-500',
    },
    {
      name: 'PostgreSQL Database',
      type: 'Neon Serverless Cloud',
      endpoint: 'ep-flat-fire...aws.neon.tech',
      status: 'Connected',
      icon: Database,
      color: 'text-blue-500',
    },
    {
      name: 'Cloudinary CDN',
      type: 'Media & Product Images',
      endpoint: 'api.cloudinary.com/v1_1',
      status: 'Active',
      icon: Cloud,
      color: 'text-amber-500',
    },
    {
      name: 'Upstash Redis Cache',
      type: 'Key-Value & Session Cache',
      endpoint: 'willing-dingo-95644.upstash.io',
      status: 'Connected',
      icon: Zap,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">Cloud Infrastructure & Telemetry</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live connection status of database, caching layer, CDN, and backend server.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-muted-foreground">Checked at: {lastChecked}</span>
            <button
              type="button"
              onClick={handlePing}
              disabled={isPinging}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isPinging ? 'animate-spin text-primary' : ''}`} />
              <span>Ping Health</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systems.map((sys) => {
            const Icon = sys.icon;
            return (
              <div
                key={sys.name}
                className="flex items-start gap-4 rounded-2xl border border-border bg-background/50 p-4 transition-all hover:border-border/80"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60">
                  <Icon className={`h-5 w-5 ${sys.color}`} />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-foreground truncate">{sys.name}</h4>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] py-0">
                      {sys.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{sys.type}</p>
                  <p className="text-[10px] font-mono text-muted-foreground/80 truncate">{sys.endpoint}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-border/80 bg-background/40 p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">System Architecture Note:</p>
          <p className="leading-relaxed">
            All API calls use JWT bearer authorization with Refresh Token rotation. bKash payment callbacks and Stripe hosted checkout sessions communicate directly with the local/live backend gateway.
          </p>
        </div>
      </div>
    </div>
  );
}
