const { lotteryService } = require('../src/services/lotteryService');
const { WebhookClient } = require('discord.js');

// Replace with your Discord webhook URL
const DISCORD_WEBHOOK_URL = 'YOUR_DISCORD_WEBHOOK_URL';
const webhookClient = new WebhookClient({ url: DISCORD_WEBHOOK_URL });

async function runLotteryDraw() {
  try {
    console.log('Starting lottery draw...');
    
    // Perform the draw
    const winner = await lotteryService.performDraw();
    
    if (!winner) {
      console.log('No eligible entries for this draw');
      return;
    }

    // Announce winner in Discord
    await webhookClient.send({
      content: `🎉 **$MINE Weekly Lottery Winner!** 🎉\n\n` +
        `Congratulations to:\n` +
        `Discord: ${winner.discordUsername}\n` +
        `X: ${winner.xUsername}\n` +
        `Number of Tickets: ${winner.numberOfTickets}\n\n` +
        `Transaction: ${winner.solscanLink}\n\n` +
        `The next draw will be held next Friday at 8 PM EST!`
    });

    console.log('Winner announced successfully!');
  } catch (error) {
    console.error('Error running lottery draw:', error);
  }
}

// Run the draw
runLotteryDraw();
