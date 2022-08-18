import React, { useContext } from 'react';
import { Title, Text, SimpleGrid } from '@mantine/core';
import EtherContext from '../../context/EtherContext';
import Card from '../../components/Card/Card';
import { ReactComponent as Price } from '../../assets/dashboard-price.svg';
import { ReactComponent as MarketCap } from '../../assets/dashboard-market.svg';
// import { ReactComponent as Holders } from '../../assets/dashboard-holders.svg';
import { ReactComponent as Liquidity } from '../../assets/dashboard-liquidity.svg';
import { ReactComponent as TotalSupply } from '../../assets/dashboard-totalsupply.svg';
import { ReactComponent as CirculatingSupply } from '../../assets/dashboard-circulatingsupply.svg';
import { ReactComponent as Burn } from '../../assets/dashboard-burn.svg';

import useStyles from './Dashboard.styles';


const Dashboard = () => {
  const { dashboardData } = useContext(EtherContext);
  const { classes } = useStyles();


  const row1 = [
    { icon: Price, title: 'Token Price', value: "$" + dashboardData.price },
    { icon: MarketCap, title: 'Market Cap', value: "$" + dashboardData.marketCap },
    // { icon: Holders, title: 'Holders', value: 0.0 },
    { icon: Liquidity, title: 'ETH Liquidity Value', value: "$" + dashboardData.AVAXliq },
  ];

  const row2 = [
    { icon: TotalSupply, title: 'Max Supply', value: dashboardData.totalSupply + " TOKEN" },
    { icon: CirculatingSupply, title: 'Circulating Supply', value: dashboardData.circulatingSupply + " TOKEN"},
    // { icon: Holders, title: 'Holders', value: 0.0 },
    { icon: Burn, title: 'Total Burned %', value: dashboardData.firepitPercentage + "%"  },
  ];


  const row1List = row1.map((item) => (
    <Card key={item.title} className={classes.cardStat}>
      <item.icon className={classes.cardStatIcon} />
      <div>
        <Title className={classes.cardStatTitle} order={6}>
          {item.title}
        </Title>
        <Text size="lg">{item.value}</Text>
      </div>
    </Card>
  ));

  const row2List = row2.map((item) => (
    <Card key={item.title} className={classes.cardStat}>
      <item.icon className={classes.cardStatIcon} />
      <div>
        <Title className={classes.cardStatTitle} order={6}>
          {item.title}
        </Title>
        <Text size="lg">{item.value}</Text>
      </div>
    </Card>
  ));



  return (
    <div>
      <SimpleGrid className={classes.row} cols={3} spacing={40} breakpoints={[{ maxWidth: 1024, cols: 1 }]}>
        {row1List}
      </SimpleGrid>

      <SimpleGrid className={classes.row} cols={3} spacing={40} breakpoints={[{ maxWidth: 1024, cols: 1 }]}>
        {row2List}
      </SimpleGrid>

      <div className={classes.row}>
        <Card className={classes.chart}>
          <iframe className={classes.dex} src="https://dexscreener.com/ethereum/0x1b1999c227e84d972f8064b34d6db601ce0e9954" title="dexchart"></iframe>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;
