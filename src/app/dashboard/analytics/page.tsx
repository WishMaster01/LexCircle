import { PerformanceChart } from "@/components/analytics/performance-chart";
import { SectionHeading } from "@/components/layout/section-heading";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Analytics"
        title="Views, engagement, and recent performance"
        description="The first version focuses on privacy-conscious aggregate metrics for authors."
      />
      <PerformanceChart />
    </div>
  );
}
