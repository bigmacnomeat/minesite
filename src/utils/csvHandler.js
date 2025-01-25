const fs = require('fs');

const CSV_FILE = 'lottery_entries.csv';
const WHEEL_FILE = 'wheel_entries.csv';

// Initialize CSV if it doesn't exist
if (!fs.existsSync(CSV_FILE)) {
  fs.writeFileSync(CSV_FILE, 'timestamp,discordUsername,xUsername,tickets,solscanLink\n');
}

const csvHandler = {
  // Save entry to CSV
  saveEntry(entry) {
    const line = `${new Date().toISOString()},"${entry.discordUsername}","${entry.xUsername}",${entry.numberOfTickets},"${entry.solscanLink}"\n`;
    fs.appendFileSync(CSV_FILE, line);
  },

  // Get all entries
  getEntries() {
    if (!fs.existsSync(CSV_FILE)) return [];
    const content = fs.readFileSync(CSV_FILE, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    const [headers, ...entries] = lines;
    
    return entries.map(line => {
      const [timestamp, discordUsername, xUsername, tickets, solscanLink] = line.split(',').map(field => field.replace(/"/g, ''));
      return {
        timestamp,
        discordUsername,
        xUsername,
        numberOfTickets: parseInt(tickets),
        solscanLink
      };
    });
  },

  // Export wheel entries
  exportForWheel() {
    const entries = this.getEntries();
    const wheelEntries = [];
    
    entries.forEach(entry => {
      // Add discord username multiple times based on number of tickets
      for (let i = 0; i < entry.numberOfTickets; i++) {
        wheelEntries.push(entry.discordUsername);
      }
    });

    fs.writeFileSync(WHEEL_FILE, wheelEntries.join('\n'));
    return wheelEntries;
  }
};

module.exports = csvHandler;
