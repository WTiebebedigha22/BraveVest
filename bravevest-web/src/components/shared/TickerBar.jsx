import { useEffect, useState, useRef } from 'react';

const INITIAL_MARKETS = [
  { symbol: 'USD/NGN', price: 1547.32, change: 0.18, prefix: '₦' },
  { symbol: 'GBP/NGN', price: 1963.10, change: -0.12, prefix: '₦' },
  { symbol: 'EUR/NGN', price: 1672.85, change: 0.24, prefix: '₦' },
  { symbol: 'CAD/NGN', price: 1098.42, change: 0.08, prefix: '₦' },
  { symbol: 'ZAR/NGN', price: 84.91, change: -0.31, prefix: '₦' },
  { symbol: 'BTC/USD', price: 92450.00, change: 1.45, prefix: '$' },
  { symbol: 'ETH/USD', price: 3410.20, change: -0.85, prefix: '$' },
  { symbol: 'AAPL', price: 232.14, change: 0.56, prefix: '$' },
  { symbol: 'TSLA', price: 342.87, change: 2.14, prefix: '$' },
  { symbol: 'MSFT', price: 428.65, change: 0.42, prefix: '$' },
  { symbol: 'NVDA', price: 138.92, change: 1.87, prefix: '$' },
];

export default function TickerBar() {
  const [markets, setMarkets] = useState(INITIAL_MARKETS);
  const [flashMap, setFlashMap] = useState({});
  const prevPricesRef = useRef({});

  useEffect(() => {
    let isMounted = true;
    const fetchLiveRates = async () => {
      try {
        const [fxRes, cryptoRes] = await Promise.all([
          fetch('https://open.er-api.com/v6/latest/USD'),
          fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true')
        ]);

        if (!fxRes.ok) throw new Error('FX API error');
        const fxData = await fxRes.json();
        const usdToNgn = fxData.rates?.NGN || 1547.32;
        const usdToGbp = fxData.rates?.GBP || 0.79;
        const usdToEur = fxData.rates?.EUR || 0.92;
        const usdToCad = fxData.rates?.CAD || 1.38;
        const usdToZar = fxData.rates?.ZAR || 18.20;

        let btcPrice = 92450, btcChange = 1.45;
        let ethPrice = 3410, ethChange = -0.85;

        if (cryptoRes.ok) {
          const cryptoData = await cryptoRes.json();
          if (cryptoData.bitcoin) {
            btcPrice = cryptoData.bitcoin.usd;
            btcChange = cryptoData.bitcoin.usd_24h_change || 1.45;
          }
          if (cryptoData.ethereum) {
            ethPrice = cryptoData.ethereum.usd;
            ethChange = cryptoData.ethereum.usd_24h_change || -0.85;
          }
        }

        const updatedMarkets = [
          { symbol: 'USD/NGN', price: usdToNgn, change: 0.18, prefix: '₦' },
          { symbol: 'GBP/NGN', price: usdToNgn / usdToGbp, change: -0.12, prefix: '₦' },
          { symbol: 'EUR/NGN', price: usdToNgn / usdToEur, change: 0.24, prefix: '₦' },
          { symbol: 'CAD/NGN', price: usdToNgn / usdToCad, change: 0.08, prefix: '₦' },
          { symbol: 'ZAR/NGN', price: usdToNgn / usdToZar, change: -0.31, prefix: '₦' },
          { symbol: 'BTC/USD', price: btcPrice, change: btcChange, prefix: '$' },
          { symbol: 'ETH/USD', price: ethPrice, change: ethChange, prefix: '$' },
          { symbol: 'AAPL', price: 232.14, change: 0.56, prefix: '$' },
          { symbol: 'TSLA', price: 342.87, change: 2.14, prefix: '$' },
          { symbol: 'MSFT', price: 428.65, change: 0.42, prefix: '$' },
          { symbol: 'NVDA', price: 138.92, change: 1.87, prefix: '$' },
        ];

        if (isMounted) {
          updatedMarkets.forEach((m) => {
            const oldPrice = prevPricesRef.current[m.symbol];
            if (oldPrice !== undefined && oldPrice !== m.price) {
              const dir = m.price > oldPrice ? 'up' : 'down';
              setFlashMap((f) => ({ ...f, [m.symbol]: dir }));
              setTimeout(() => setFlashMap((f) => ({ ...f, [m.symbol]: null })), 800);
            }
            prevPricesRef.current[m.symbol] = m.price;
          });
          setMarkets(updatedMarkets);
        }
      } catch (err) {
        console.warn('Market API fallback active');
      }
    };

    fetchLiveRates();
    const interval = setInterval(fetchLiveRates, 45000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const items = [...markets, ...markets, ...markets];

  return (
    <>
      <style>{`
        @keyframes singleLineMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        .ticker-track-single {
          display: flex;
          align-items: center;
          width: max-content;
          animation: singleLineMarquee 36s linear infinite;
          will-change: transform;
        }
        .ticker-wrap-single:hover .ticker-track-single {
          animation-play-state: paused;
        }
        .flash-pulse-up { background: rgba(14, 159, 91, 0.15) !important; }
        .flash-pulse-down { background: rgba(220, 38, 38, 0.15) !important; }
      `}</style>

      <div 
        className="ticker-wrap-single relative w-full h-[42px] bg-gradient-to-r from-white via-[#FCFCFD] to-white border-b border-[#E4E4E9] overflow-hidden font-sans select-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]"
        role="marquee"
        aria-label="Live Market Ticker"
      >
        {/* Glowing fade masks on both ends */}
        <div className="absolute top-0 bottom-0 left-0 w-12 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-12 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />

        <div className="ticker-track-single h-full">
          {items.map((m, index) => {
            const isUp = m.change >= 0;
            const flash = flashMap[m.symbol];
            const flashClass = flash === 'up' ? 'flash-pulse-up' : flash === 'down' ? 'flash-pulse-down' : '';

            return (
              <div 
                key={`${m.symbol}-${index}`}
                className={`flex items-center gap-3 px-5 h-full border-r border-[#EEEEF2] text-[13px] whitespace-nowrap transition-colors duration-300 ${flashClass}`}
              >
                <span className="font-bold text-[#121214] tracking-tight">{m.symbol}</span>
                <span className="font-semibold text-[#33333B]">
                  <span className="text-[11px] text-[var(--bv-text-muted)] mr-0.5 font-normal">{m.prefix}</span>
                  {m.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide ${
                  isUp ? 'text-[var(--bv-success)] bg-[var(--bv-success)]/10' : 'text-[var(--bv-danger)] bg-[var(--bv-danger)]/10'
                }`}>
                  {isUp ? '+' : ''}{m.change.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}