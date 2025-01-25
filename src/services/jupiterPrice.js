// src/services/jupiterPrice.js

class JupiterPriceService {
  constructor() {
    // Use the full HTTPS URL
    this.baseUrl = 'https://quote-api.jup.ag/v4';
    this.priceCache = new Map();
    this.lastUpdate = new Map();
    this.updateInterval = 15000; // 15 seconds
  }

  async getPrice(inputMint, outputMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') { // USDC as default
    try {
      // Check cache first
      if (this.shouldUseCache(inputMint)) {
        return this.priceCache.get(inputMint);
      }

      // Construct the quote request
      const amount = '1000000'; // 1 USDC worth
      const url = `${this.baseUrl}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`;
      console.log('Fetching price from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Price data received:', data);
      
      if (!data || !data.outAmount) {
        throw new Error(`No price data for token ${inputMint}`);
      }

      // Calculate price based on the quote
      const price = parseFloat(data.outAmount) / 1000000; // Convert to USDC price
      console.log('Calculated price:', price);
      
      // Update cache
      this.priceCache.set(inputMint, price);
      this.lastUpdate.set(inputMint, Date.now());
      
      return price;
    } catch (error) {
      console.error('Error fetching Jupiter price:', error);
      // Return cached price if available, otherwise null
      return this.priceCache.get(inputMint) || null;
    }
  }

  shouldUseCache(inputMint) {
    const lastUpdate = this.lastUpdate.get(inputMint);
    return lastUpdate && (Date.now() - lastUpdate < this.updateInterval);
  }

  async getPriceInUSDC(inputMint) {
    try {
      const price = await this.getPrice(inputMint);
      console.log('USDC price fetched:', price);
      return price;
    } catch (error) {
      console.error('Error fetching USDC price:', error);
      return null;
    }
  }

  async getPrices(inputMints) {
    try {
      // Get prices one by one since we're using the quote endpoint
      const prices = {};
      for (const mint of inputMints) {
        prices[mint] = await this.getPrice(mint);
      }
      return prices;
    } catch (error) {
      console.error('Error fetching multiple Jupiter prices:', error);
      return {};
    }
  }

  subscribeToPrice(inputMint, callback, interval = 15000) {
    const updatePrice = async () => {
      const price = await this.getPriceInUSDC(inputMint);
      if (price !== null) {
        callback(price);
      }
    };

    // Initial update
    updatePrice();

    // Set up interval
    return setInterval(updatePrice, interval);
  }

  static formatPrice(price) {
    if (price === null || price === undefined) return 'N/A';
    return price < 0.01 
      ? price.toFixed(8)
      : price < 1 
        ? price.toFixed(6)
        : price < 1000 
          ? price.toFixed(4)
          : price.toFixed(2);
  }
}

// Export singleton instance
export const jupiterPrice = new JupiterPriceService();

// Export class for testing or multiple instances
export default JupiterPriceService;
