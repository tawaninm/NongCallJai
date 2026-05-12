import { Activity, Heart, Droplets, Thermometer } from "lucide-react";

interface VitalsData {
  hr?: number;
  spo2?: number;
  bp?: string;
  temp?: number;
  hrAlert?: boolean;
  spo2Alert?: boolean;
  bpAlert?: boolean;
  tempAlert?: boolean;
}

export function VitalsMonitorCard({
  hr = 75,
  spo2 = 98,
  bp = "120/80",
  temp = 36.5,
  hrAlert,
  spo2Alert,
  bpAlert,
  tempAlert,
}: VitalsData) {
  return (
    <div className="vitals-dark-card">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-white/80">
        <Activity className="h-4 w-4" /> Real-time Vitals
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white/10 p-3">
          <div className="flex items-center gap-1 text-xs text-white/60 mb-1">
            <Heart className="h-3 w-3" /> HR (BPM)
          </div>
          <p className={`vitals-value ${hrAlert ? "vitals-value-alert" : "text-white"}`}>{hr}</p>
        </div>
        <div className="rounded-lg bg-white/10 p-3">
          <div className="flex items-center gap-1 text-xs text-white/60 mb-1">
            <Droplets className="h-3 w-3" /> SpO2 (%)
          </div>
          <p className={`vitals-value ${spo2Alert ? "vitals-value-alert" : "text-white"}`}>
            {spo2}
          </p>
        </div>
        <div className="rounded-lg bg-white/10 p-3">
          <div className="flex items-center gap-1 text-xs text-white/60 mb-1">
            <Activity className="h-3 w-3" /> BP (mmHg)
          </div>
          <p className={`vitals-value ${bpAlert ? "vitals-value-alert" : "text-white"}`}>{bp}</p>
        </div>
        <div className="rounded-lg bg-white/10 p-3">
          <div className="flex items-center gap-1 text-xs text-white/60 mb-1">
            <Thermometer className="h-3 w-3" /> TEMP (°C)
          </div>
          <p className={`vitals-value ${tempAlert ? "vitals-value-alert" : "text-white"}`}>
            {temp}
          </p>
        </div>
      </div>
    </div>
  );
}
