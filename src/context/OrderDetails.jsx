import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { pricePerItem } from "../constants";

// @ts-ignore
const OrderDetails = createContext();

// create custom hook to check whether we're inside a provider
export function useOrderDetails() {
  const context = useContext(OrderDetails);

  if (!context) {
    throw new Error(
      "useOrderDetails must be used within an OrderDetailsProvider"
    );
  }

  return context;
}

export function OrderDetailsProvider(props) {
  const [optionCounts, setOptionCounts] = useState({
    scoops: new Map(),
    toppings: new Map(),
  });
  const [totals, setTotals] = useState({
    scoops: 0,
    toppings: 0,
    grandTotal: 0,
  })

  function calculateSubtotal(orderType, optionCounts) {
    let optionCount = 0;
    for (const count of optionCounts[optionsType].values()) {
      optionCount += count;
    }

    return optionCount * pricePerItem[optionType];
  }

  useEffect(() => {
    const scoopsSubtotal = calculateSubtotal("scoops", optionsCounts);
    const toppingSubtotal = calculateSubtotal("topping", optionCounts);
    const grandTotal = scoopsSubtotal + toppingSubtotal;
    setTotals({
      scoops: scoopsSubtotal,
      toppings: toppingSubtotal,
      grandTotal
    })
  }, [optionCounts])

  const value = useMemo(() => {
    function updateItemCount(itemName, newItemCount, optionType) {
      const newOptionCounts = { ...optionCounts }

      // update option count fro this item with the new value
      const optionCountsMap = optionCounts[optionType];
      optionCountsMap.set(itemName, parseInt(newItemCount));

      setOptionCounts(newOptionCounts);
    }

    // getter: object containing options count for scoops and toppings, subtotal and totals
    // setter: updateOptionCount
    return [{ ...optionCounts, totals }, updateItemCount];
  }, [optionCounts, totals]);

  return <OrderDetails.Provider value={value} {...props} />
}

// export { OrderDetailsProvider, useOrderDetails }
