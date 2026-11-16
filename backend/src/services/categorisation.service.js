// A smart rule-based categorization service
const categoryRules = {
    Food: ['swiggy', 'zomato', 'mcdonalds', 'dominos', 'starbucks', 'cafe', 'restaurant', 'bakery', 'blinkit', 'instamart', 'zepto'],
    Transport: ['uber', 'ola', 'rapido', 'metro', 'ircctc', 'indian railways', 'petrol', 'hpcl', 'bpcl', 'shell', 'toll', 'auto'],
    Shopping: ['amazon', 'flipkart', 'myntra', 'zara', 'h&m', 'decathlon', 'meesho', 'ajio'],
    Utilities: ['electricity', 'water bill', 'jairtel', 'jio', 'vi prepaid', 'broadband', 'gas', 'bescom', 'pnb', 'upi-electricity'],
    Entertainment: ['netflix', 'spotify', 'hotstar', 'prime video', 'bookmyshow', 'pvr', 'steam', 'playstation'],
    Income: ['salary', 'neft-credit', 'upi-credit', 'dividend', 'interest', 'freelance', 'client payout'],
    Investment: ['zerodha', 'groww', 'upstox', 'mutual fund', 'sip', 'ppf', 'fd creation']
};

export const autoCategorizeTransaction = (description = '', merchant = '') => {
    const textToScan = `${description} ${merchant}`.toLowerCase();

    for (const [category, keywords] of Object.entries(categoryRules)) {
        for (const keyword of keywords) {
            if (textToScan.includes(keyword)) {
                return category; // Found a match!
            }
        }
    }

    // Default fallback category if no pattern matches
    return 'General';
};