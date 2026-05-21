import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  "data-ocid"?: string;
}

export function EmptyState({
  icon = "✦",
  title,
  description,
  action,
  "data-ocid": ocid,
}: EmptyStateProps) {
  return (
    <div
      data-ocid={ocid}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="text-5xl mb-4 opacity-60">{icon}</div>
      <h3 className="text-lg font-display font-semibold text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground text-sm max-w-xs mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}
