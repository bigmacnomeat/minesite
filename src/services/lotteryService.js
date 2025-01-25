import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import { Connection, PublicKey } from '@solana/web3.js';

const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(SOLANA_RPC_URL);

export const lotteryService = {
  // Add new lottery entry
  async addEntry(entryData) {
    try {
      // No longer verifying Solana transaction
      const entry = {
        ...entryData,
        timestamp: Timestamp.now(),
        status: 'pending',
        drawDate: this.getNextDrawDate(),
        verified: false
      };

      const docRef = await addDoc(collection(db, 'lottery_entries'), entry);
      return { id: docRef.id, ...entry };
    } catch (error) {
      throw new Error(`Failed to add entry: ${error.message}`);
    }
  },

  // Get entries for next draw
  async getEntriesForNextDraw() {
    const nextDraw = this.getNextDrawDate();
    const q = query(
      collection(db, 'lottery_entries'),
      where('drawDate', '==', nextDraw),
      where('verified', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Perform the lottery draw
  async performDraw() {
    try {
      const entries = await this.getEntriesForNextDraw();
      if (entries.length === 0) return null;

      // Create weighted tickets array based on number of tickets purchased
      let tickets = [];
      entries.forEach(entry => {
        for (let i = 0; i < entry.numberOfTickets; i++) {
          tickets.push(entry);
        }
      });

      // Select winner randomly
      const winnerIndex = Math.floor(Math.random() * tickets.length);
      const winner = tickets[winnerIndex];

      // Update winner status in database
      await updateDoc(doc(db, 'lottery_entries', winner.id), {
        status: 'winner'
      });

      return winner;
    } catch (error) {
      throw new Error(`Failed to perform draw: ${error.message}`);
    }
  },

  // Get next draw date (every Friday at 8 PM)
  getNextDrawDate() {
    const now = new Date();
    const nextFriday = new Date();
    nextFriday.setDate(now.getDate() + ((7 - now.getDay() + 5) % 7 || 7));
    nextFriday.setHours(20, 0, 0, 0);
    return Timestamp.fromDate(nextFriday);
  }
};
