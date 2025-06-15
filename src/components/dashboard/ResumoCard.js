import { Card, CardContent } from "@/components/ui/card";

export default function ResumoCard({ title, icon: Icon, value, color }) {
  return (
    <Card className={`text-white ${color} shadow-lg rounded-xl`}>
      <CardContent className="flex flex-col items-center p-4">
        <Icon size={32} />
        <h2 className="text-lg font-bold mt-2">{title}</h2>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
