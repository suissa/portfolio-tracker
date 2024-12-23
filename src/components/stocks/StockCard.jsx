import { Card, Text, Metric, Flex, BadgeDelta } from '@tremor/react';

export default function StockCard({ stock }) {
  const isPositive = stock.change.startsWith('+');
  
  return (
    <Card className="max-w-xs">
      <Flex justifyContent="between" alignItems="center">
        <Text>{stock.symbol}</Text>
        <BadgeDelta
          deltaType={isPositive ? "increase" : "decrease"}
        >
          {stock.change}
        </BadgeDelta>
      </Flex>
      <Metric className="mt-2">${stock.price}</Metric>
      <Text className="mt-2">{stock.name}</Text>
    </Card>
  );
} 