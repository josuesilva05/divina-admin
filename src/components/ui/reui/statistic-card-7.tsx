import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export type CardType = {
  title: string;
  subtitle: string;
  value: string;
  valueColor: string;
  badge: {
    color: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    text: string;
  };
};

export default function DashboardCards({ cards }: { cards: CardType[] }) {
  return (
      <div className="@container w-full">
        <div className="grid grid-cols-1 @lg:grid-cols-3 bg-background overflow-hidden rounded-xl border border-border">
          {cards.map((card, i) => (
            <Card
              key={i}
              className="border-0 shadow-none rounded-none border-y @lg:border-x @lg:border-y-0 border-border last:border-0 first:border-0"
            >
              <CardContent className="flex flex-col h-full space-y-6 justify-between">
                {/* Title & Subtitle */}
                <div className="space-y-0.25">
                  <div className="text-lg font-semibold text-foreground">{card.title}</div>
                  <div className="text-sm text-muted-foreground">{card.subtitle}</div>
                </div>

                {/* Information */}
                <div className="flex-1 flex flex-col gap-1.5 justify-between grow">
                  {/* Value & Delta */}
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold tracking-tight">{card.value}</span>
                    <Badge
                      className={`${card.badge.color} px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-none`}
                    >
                      <card.badge.icon className={`w-3 h-3 ${card.badge.iconColor}`} />
                      {card.badge.text}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  );
}
