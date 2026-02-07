import { createContext, useContext, useEffect, useState } from 'react';

type BasketItem = {
  id: string;
  slug: string; 
  name: string;
  price: number;
  quantity: number;
};

type BasketContextType = {
  basket: BasketItem[];
  count: number;
  popSignal: number;
  triggerPop: () => void;
  refreshBasket: () => Promise<void>;
  addToBasket: (product: {
    id: number;
    slug: string;
    name: string;
    price: number;
    image?: string;
    brand?: string;
  }) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeFromBasket: (id: string) => Promise<void>;
};

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider = ({ children }: { children: React.ReactNode }) => {
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [popSignal, setPopSignal] = useState(0);

  const triggerPop = () => {
    setPopSignal(prev => prev + 1);
  };

  const refreshBasket = async () => {
    const res = await fetch('http://localhost:5000/api/basket', {
      credentials: 'include',
    });

    if (!res.ok) {
      setBasket([]);
      return;
    }

    const data = await res.json();
    setBasket(data.basket);
  };

  useEffect(() => {
    refreshBasket();
  }, []);

  const addToBasket = async (product: {
    id: number;
    name: string;
    price: number;
    image?: string;
    brand?: string;
  }) => {
    await fetch('http://localhost:5000/api/basket/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(product),
    });

    await refreshBasket();
    triggerPop();
  };

  const updateQuantity = async (id: string, quantity: number) => {
    await fetch('http://localhost:5000/api/basket/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        productId: [id],
        quantity: [quantity],
      }),
    });

    await refreshBasket();
  };

  const removeFromBasket = async (id: string) => {
    await fetch(`http://localhost:5000/api/basket/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    await refreshBasket();
  };

  const count = basket.length;

  return (
    <BasketContext.Provider
      value={{
        basket,
        count,
        popSignal,
        triggerPop,
        refreshBasket,
        addToBasket,
        updateQuantity,
        removeFromBasket,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const ctx = useContext(BasketContext);
  if (!ctx) {
    throw new Error('useBasket must be used inside BasketProvider');
  }
  return ctx;
};
