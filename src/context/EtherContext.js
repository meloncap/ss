import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import otoAbi from '../utils/otoAbi.json';
import wavaxAbi from '../utils/wavaxAbi.json';
import { useLocation } from 'react-router-dom';

const EtherContext = React.createContext();

const defaultDashboardData = {
  avaxPrice: 0,
  price: 0,
  marketCap: 0,
  // holders: 0,
  rewards: 0,
  totalSupply: 0,
  circulatingSupply: 0,
  AVAXliq: 0,
  firepitPercentage: 0,
};

const defaultWalletData = {
  balance: 0,
  balanceInUSD: 0,
  AVAXbalance: 0,
  AVAXbalanceInUSD: 0,
};

export const EtherContextProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(defaultDashboardData);      
  const [walletData, setWalletData] = useState(defaultWalletData);                        
  const [user, setUser] = useState(() => {
    const stickyValue = sessionStorage.getItem('user');
    return stickyValue !== null ? JSON.parse(stickyValue) : null;
  });

  const avaxProvider = useMemo(() => new ethers.providers.getDefaultProvider('https://mainnet.infura.io/v3/612bc69b6c6d4bed9563cc131c039427'), []);
  const otoContract = useMemo(() => new ethers.Contract('0x1b1999C227E84d972f8064B34D6db601CE0e9954', otoAbi, avaxProvider), [avaxProvider]);
  const wavaxContract = useMemo(() => new ethers.Contract('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', wavaxAbi, avaxProvider), [avaxProvider]);
  const lpPair = '0xb23f5f45e22a707f53f05d70e82435d4bf86e747';
  const tokenDecimal = 6;

  const location = useLocation();

  const tokenFormatEther = (value) => {
    return ethers.utils.formatUnits(value, tokenDecimal);
  };


  // Dashboard
  const getAvaxPrice = useCallback(async () => {
    const response = await fetch('https://api.coinstats.app/public/v1/coins/ethereum');
    const data = await response.json();
    const avaxPrice = data.coin.price;

    return avaxPrice.toFixed(2);
  }, []);

  const getLPBalance = useCallback(async () => {
    const avaxBalance = await wavaxContract.balanceOf(lpPair);
    const tokenBalance = await otoContract.balanceOf(lpPair);

    return {
      avax: ethers.utils.formatUnits(avaxBalance, 18),
      token: tokenFormatEther(tokenBalance),
    };
  }, [wavaxContract, otoContract]);

  const getTokenPrice = useCallback((lpAvax, lpToken, avaxPrice) => {
    if (lpAvax && lpToken && avaxPrice) {
      const avaxBalanceInUsd = lpAvax * avaxPrice;
      const tokenPrice = (avaxBalanceInUsd / lpToken).toFixed(tokenDecimal);
      return parseFloat(tokenPrice);
    }
  }, []);

 
  const getMarketCap = useCallback(
    async (otoPrice) => {
      let totalSupply = await otoContract.totalSupply();

      let marketCap = parseFloat(tokenFormatEther(totalSupply)) * otoPrice; 
      const numberFormatter = Intl.NumberFormat('en-US');
      return numberFormatter.format(marketCap.toFixed(2));
    },
    [otoContract]
  );

  const getTotalSupply = useCallback(
    async (otoPrice) => {
      const totalSupply = 1000000.00;
      const numberFormatter = Intl.NumberFormat('en-US');
      return numberFormatter.format(totalSupply.toFixed(2));
    },
    []
  );

  const getMaxSupply = useCallback(
    async (otoPrice) => {
      const maxSupply = 1000000.00;
      return maxSupply;
    },
    []
  );

  const getCircSupply = useCallback(async () => {
    let totalSupply1 = await otoContract.totalSupply();
    let circSupply = tokenFormatEther(totalSupply1);

    return parseFloat(circSupply);
  }, [otoContract]);

  const getCirculatingSupply = useCallback(async () => {
    let totalSupply = await otoContract.totalSupply();
    let circulatingSupply = parseFloat(tokenFormatEther(totalSupply)).toFixed(2);
    const numberFormatter = Intl.NumberFormat('en-US');
    return numberFormatter.format(parseFloat(circulatingSupply).toFixed(2));
  }, [otoContract]);


  // const lockTokens = async (amount, days) => {
  //   const daysInSeconds = days * 86400; //86400 seconds per day
  //   let signer = this.procMetamask();
  //   signer.signMessage('Lock Tokens');
  //   await otoContract.lockInitialTokens(amount, daysInSeconds);
  // };

  // const getRemainingTokenLockTime = async (address) => {
  //   const seconds = otoContract.getRemainingTokenLockTime(address);
  //   if (seconds > 86400) {
  //     const daysInSeconds = seconds / 86400;
  //   }
  // };

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const user = await signer.getAddress();

    sessionStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };                                             

  const getAccountBalance = useCallback(
    async (address) => {
      if (!address) {
        return;
      }
      const balance = await otoContract.balanceOf(address);
      return parseFloat(tokenFormatEther(balance)).toFixed(5);
    },
    [otoContract]
  );          
  
  const getAVAXBalance = useCallback(
    async (address) => {
      if (!address) {
        return;
      }
      const AVAXbalance = await avaxProvider.getBalance(address);
      return parseFloat(ethers.utils.formatUnits(AVAXbalance, 18)).toFixed(3);
    },
    [avaxProvider]
  );  

  const getFirepitPercentage = useCallback(async (maxSupply, circSupply) => {
    const firepitPercentage = (maxSupply - circSupply) / maxSupply * 100;

    return parseFloat(firepitPercentage).toFixed(2);
  }, []);

  // Account
  const calculateWallet = useCallback(async () => {
    const balance = await getAccountBalance(user);
    const balanceInUSD = (balance * dashboardData.price).toFixed(3);
    const AVAXbalance = await getAVAXBalance(user);
    const AVAXbalanceInUSD = (AVAXbalance * dashboardData.avaxPrice).toFixed(3);

    setWalletData((prevData) => ({
      balance, balanceInUSD, AVAXbalance, AVAXbalanceInUSD
    }));
  }, [getAccountBalance, dashboardData.price, user, getAVAXBalance, dashboardData.avaxPrice]);

  useEffect(() => {
    if (user) {
      calculateWallet(user);
    }
  }, [user, location.pathname, calculateWallet]);


  // On page load
  const fetchData = useCallback(async () => {
    const avaxPrice = await getAvaxPrice();
    const lpBalance = await getLPBalance();
    const otoPrice = getTokenPrice(lpBalance.avax, lpBalance.token, avaxPrice);
    const marketCap = await getMarketCap(otoPrice);
    const numberFormatter = Intl.NumberFormat('en-US');
    const AVAXliq = numberFormatter.format(getTokenPrice(lpBalance.avax, 1, avaxPrice).toFixed(2));
    const totalSupply = await getTotalSupply();
    const maxSupply = await getMaxSupply();
    const circulatingSupply = await getCirculatingSupply();
    const circSupply = await getCircSupply();
    const firepitPercentage = await getFirepitPercentage(maxSupply, circSupply);

    setDashboardData({ avaxPrice, price: otoPrice, marketCap, totalSupply, AVAXliq, circulatingSupply, firepitPercentage, circSupply, maxSupply});
  }, [getAvaxPrice, getLPBalance, getTokenPrice, getMarketCap, getTotalSupply, getCirculatingSupply, getFirepitPercentage, getCircSupply, getMaxSupply]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  return (
    <EtherContext.Provider value={{ dashboardData, walletData, connectWallet, user}}>
      {children}
    </EtherContext.Provider>
  );
};

export default EtherContext;
