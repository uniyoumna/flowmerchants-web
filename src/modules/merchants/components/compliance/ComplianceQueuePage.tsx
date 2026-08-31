import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Hourglass,
  Search,
} from "lucide-react";
import { BaseSelect } from "@/components/base/BaseSelect";
import { MetricCard } from "@/components/base/MetricCard";

const COMPLIANCE_STATS = [
  {
    title: "Under Review",
    value: "10",
    icon: <CheckCircle2 className="size-5 text-emerald-600" />,
    iconBg: "bg-emerald-100",
  },
  {
    title: "SLA Overdue",
    value: "2",
    icon: <Clock className="size-5 text-emerald-600" />,
    iconBg: "bg-emerald-100",
  },
  {
    title: "Pending Review",
    value: "1",
    icon: <Hourglass className="size-5 text-amber-600" />,
    iconBg: "bg-amber-100",
  },
  {
    title: "Expiry Risk",
    value: "1",
    icon: <AlertCircle className="size-5 text-blue-600" />,
    iconBg: "bg-blue-100",
  },
];

const COMPLIANCE_ITEMS = [
  {
    merchant: "Sphinx Furniture & Decor",
    merchantId: "MCH-10058 · Furniture",
    type: "Initial Submission",
    sla: 71,
    slaColor: "bg-emerald-500",
    submittedBy: "Sara Hassan",
    date: "2025-01-04 10:22",
    status: "Pending Review",
    statusColor: "bg-amber-50 text-amber-700",
  },
  {
    merchant: "Eastern Pharma Distribution",
    merchantId: "MCH-10063 · Healthcare & Pharma",
    type: "Renewal",
    sla: 86,
    slaColor: "bg-amber-500",
    submittedBy: "Laila Nasser",
    date: "2025-01-03 14:05",
    status: "Under Review",
    statusColor: "bg-purple-50 text-purple-700",
  },
  {
    merchant: "Cairo Electronics Co.",
    merchantId: "MCH-10042 · Electronics",
    type: "Initial Submission",
    sla: 45,
    slaColor: "bg-emerald-500",
    submittedBy: "Ahmed Khalil",
    date: "2025-01-05 09:15",
    status: "Pending Review",
    statusColor: "bg-amber-50 text-amber-700",
  },
];

const ComplianceQueuePage = () => {
  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Compliance Queue</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review and process merchant applications
        </p>
      </div>

      {/* ─── Metric Cards ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COMPLIANCE_STATS.map((card) => (
          <MetricCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            iconBg={card.iconBg}
          />
        ))}
      </div>

      {/* ─── Search & Filters ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2">
          <Search className="size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search workflows..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-3">
          <BaseSelect
            defaultValue="all"
            options={[
              { label: "All Statuses", value: "all" },
              { label: "Pending Review", value: "pending" },
              { label: "Under Review", value: "under_review" },
            ]}
          />

          <BaseSelect
            defaultValue="sla"
            options={[
              { label: "Sort by", value: "sla" },
              { label: "SLA", value: "sla" },
              { label: "Date", value: "date" },
            ]}
          />
        </div>
      </div>

      {/* ─── Table ─── */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Compliance Queue
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs text-slate-500">
              <tr>
                <th className="px-6 py-3.5 font-medium">Merchant</th>
                <th className="px-6 py-3.5 font-medium">Type</th>
                <th className="px-6 py-3.5 font-medium">SLA</th>
                <th className="px-6 py-3.5 font-medium">Submitted By</th>
                <th className="px-6 py-3.5 font-medium">Submit Date</th>
                <th className="px-6 py-3.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y border-slate-100">
              {COMPLIANCE_ITEMS.map((item) => (
                <tr
                  key={item.merchant}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {item.merchant}
                    </div>
                    <div className="text-xs text-slate-400">
                      {item.merchantId}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.type}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full ${item.slaColor}`}
                          style={{ width: `${item.sla}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {item.sla}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {item.submittedBy}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                    {item.date}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${item.statusColor}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComplianceQueuePage;
export { ComplianceQueuePage };
