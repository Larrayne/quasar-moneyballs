export function useAmountColour(amount){
   if (amount > 0)return 'text-positive'
   else if (amount < 0) return 'text-negative'
   else return'text-teal-14'
  }