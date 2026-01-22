export const formatCurrency = (amountInUSD) => {
    // Fixed conversion rate
    const conversionRate = 83;
    
    // Convert and round to nearest whole number
    const amountInINR = Math.round(amountInUSD * conversionRate);
    
    // Format with Indian Rupee symbol
    return `₹${amountInINR.toLocaleString('en-IN')}`;
};
