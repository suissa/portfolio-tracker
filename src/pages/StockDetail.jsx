import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Title, Text, AreaChart, TabGroup, TabList, Tab, TabPanels, TabPanel, Metric, Flex, Badge } from '@tremor/react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

const chartdata = [
  { date: "1D", price: 150.20 },
  { date: "2D", price: 151.40 },
  { date: "3D", price: 152.80 },
  { date: "4D", price: 149.90 },
  { date: "5D", price: 153.20 },
];

const stockStats = {
  marketCap: "2.5T",
  peRatio: "25.6",
  dividend: "0.88%",
  volume: "52.4M",
  avgVolume: "48.2M",
  high52: "$182.94",
  low52: "$124.17",
};

export default function StockDetail() {
  const { symbol } = useParams();
  const [selectedView, setSelectedView] = useState(0);

  return (
    <div className="space-y-6">
      <Card>
        <Flex justifyContent="between" alignItems="center">
          <div>
            <Title>Apple Inc. (AAPL)</Title>
            <Text>NASDAQ</Text>
          </div>
          <div className="text-right">
            <Metric>$150.20</Metric>
            <Flex justifyContent="end" className="space-x-2">
              <Badge color="green" icon={ArrowTrendingUpIcon}>
                +2.5%
              </Badge>
              <Text>Today</Text>
            </Flex>
          </div>
        </Flex>

        <TabGroup className="mt-6" onIndexChange={setSelectedView}>
          <TabList>
            <Tab>1D</Tab>
            <Tab>1W</Tab>
            <Tab>1M</Tab>
            <Tab>3M</Tab>
            <Tab>1Y</Tab>
            <Tab>ALL</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <AreaChart
                className="h-72 mt-4"
                data={chartdata}
                index="date"
                categories={["price"]}
                colors={["blue"]}
                showLegend={false}
                valueFormatter={(number) => `$${number.toFixed(2)}`}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <Title>Key Statistics</Title>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {Object.entries(stockStats).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <Text className="text-gray-500">{key}</Text>
                <Text className="font-medium">{value}</Text>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Title>About</Title>
          <Text className="mt-4">
            Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and Wearables, Home and Accessories.
          </Text>
        </Card>
      </div>
    </div>
  );
} 