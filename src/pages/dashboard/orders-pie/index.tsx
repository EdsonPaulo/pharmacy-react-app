import { Pie } from '@nivo/pie';

export const OrdersPie = ({ data /* see data tab */ }: any) => (
  <Pie
    data={data}
    enableArcLabels={true}
    enableArcLinkLabels={false}
    margin={{ top: -150, right: 8, bottom: 8, left: 8 }}
    innerRadius={0.5}
    padAngle={2}
    cornerRadius={3}
    activeOuterRadiusOffset={0}
    activeInnerRadiusOffset={8}
    colors={{ scheme: 'category10', datum: 'data.color' }}
    borderWidth={1}
    borderColor={{
      from: 'color',
      modifiers: [['darker', 0.2]],
    }}
    arcLinkLabelsSkipAngle={8}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: 'color' }}
    arcLabelsSkipAngle={5}
    arcLabelsTextColor={{ from: 'color', modifiers: [['brighter', 10]] }}
    arcLabel={(e) => `${e.value}%`}
    defs={[]}
    legends={[
      {
        anchor: 'bottom-left',
        direction: 'column',
        translateX: 0,
        translateY: -60,
        itemsSpacing: 10,
        itemWidth: 200,
        itemHeight: 18,
        itemTextColor: '#8C8C8C',
        symbolSize: 10,
        symbolShape: 'circle',
      },
    ]}
    height={400}
    width={200}
  />
);
