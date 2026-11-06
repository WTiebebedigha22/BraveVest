import { useEffect, useState, useRef } from 'react';

const INITIAL_MARKETS = [
  { symbol: 'USD/NGN', price: 1547.32, change: 0.18, prefix: '₦' },
  { symbol: 'GBP/NGN', price: 1963.10, change: -0.12, prefix: '₦' },
  { symbol: 'EUR/NGN', price: 1672.85, change: 0.24, prefix: '₦' },
  { symbol: 'CAD/NGN', price: 1098.42, change: 0.08, prefix: '₦' },
  { symbol: 'ZAR/NGN', price: 84.91, change: -0.31, prefix: '₦' },
  { symbol: 'AAPL', price: 232.14, change: 0.56, prefix: '$' },
  { symbol: 'TSLA', price: 342.87, change: 2.14, prefix: '$' },
  { symbol: 'MSFT', price: 428.65, change: 0.42, prefix: '$' },
  { symbol: 'NVDA', price: 138.92, change: 1.87, prefix: '$' },
  { symbol: 'GOOGL', price: 178.34, change: 0.29, prefix: '$' },
  { symbol: 'AMZN', price: 213.56, change: 0.63, prefix: '$' },
];

export default function TickerBar() {
  const [markets, setMarkets] = useState(INITIAL_MARKETS);
  const [flashMap, setFlashMap] = useState({});
  const initialRef = useRef(INITIAL_MARKETS);

  useEffect(() => {
    const timer = setInterval(() => {
      setMarkets((prev) =>
        prev.map((m, idx) => {
          const move = (Math.random() - 0.49) * m.price * 0.0006;
          if (Math.abs(move) < 0.001) return m;

          const newPrice = Math.max(0.01, m.price + move);
          const origPrice = initialRef.current[idx].price;
          const origChange = initialRef.current[idx].change;
          const newChange = ((newPrice - origPrice) / origPrice) * 100 + origChange;
          const direction = move > 0 ? 'up' : 'down';

          setFlashMap((f) => ({ ...f, [m.symbol]: direction }));
          setTimeout(() => {
            setFlashMap((f) => ({ ...f, [m.symbol]: null }));
          }, 600);

          return { ...m, price: newPrice, change: newChange };
        })
      );
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const items = [...markets, ...markets, ...markets];

  return (
    <>
      <style>{`
        @keyframes bybitMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        .bybit-ticker-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: bybitMarquee 38s linear infinite;
        }
        .bybit-ticker-container:hover .bybit-ticker-track {
          animation-play-state: paused;
        }
      `}</style>
      
      <div 
        className="bybit-ticker-container relative w-full h-[40px] bg-[#0f141c] border-t border-b border-[#1e2633] overflow-hidden font-sans select-none"
        role="marquee" 
        aria-label="Live Market Ticker"
      >
        <div className="absolute top-0 bottom-0 left-0 w-[50px] z-10 pointer-events-none bg-gradient-to-r from-[#0f141c] to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-[50px] z-10 pointer-events-none bg-gradient-to-l from-[#0f141c] to-transparent" />
        
        <div className="bybit-ticker-track h-full">
          {items.map((m, index) => {
            const isUp = m.change >= 0;
            const flash = flashMap[m.symbol];
            const flashBg = flash === 'up' ? 'bg-[rgba(0,176,124,0.18)]' : flash === 'down' ? 'bg-[rgba(246,70,93,0.18)]' : 'bg-transparent';
            const formattedPrice = m.price.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });

            return (
              <div 
                key={`${m.symbol}-${index}`} 
                className={`flex items-center gap-[8px] px-[18px] h-full border-r border-[#171d26] text-[13px] transition-colors duration-250 ${flashBg}`}
              >
                <span className="font-semibold text-[#848e9c] tracking-[0.3px]">{m.symbol}</span>
                <span className="font-semibold text-white tracking-[-0.2px]">
                  <span className="text-[11px] text-[#848e9c] mr-[1px]">{m.prefix}</span>
                  {formattedPrice}
                </span>
                <span className={`text-[11px] font-semibold px-[6px] py-[2px] rounded-[4px] ${isUp ? 'text-[#00b07c] bg-[rgba(0,176,124,0.12)]' : 'text-[#f6465d] bg-[rgba(246,70,93,0.12)]'}`}>
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