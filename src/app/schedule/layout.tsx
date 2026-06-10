import "@schedule/styles/schedule.css";
import { ClientProviders } from "@schedule/components/ClientProviders";

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientProviders>{children}</ClientProviders>;
}
