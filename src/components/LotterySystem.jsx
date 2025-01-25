import React, { useState } from 'react';

const LotterySystem = () => {
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const TICKET_PRICE = 16000; // 16k $MINE per ticket
  const HOUSE_WALLET = 'GL9T6pujGvqYcZCR1g1rq2retkh1XekbGvNWMKrDhS6P';

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">$MINE Weekly Lottery</h2>
      
      {/* Ticket Calculator */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Calculate Payment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Number of Tickets (16k $MINE each)</label>
            <input
              type="number"
              value={numberOfTickets}
              onChange={(e) => setNumberOfTickets(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none"
            />
          </div>
          
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-lg font-semibold mb-2">
              Total: <span className="text-green-400">{numberOfTickets * TICKET_PRICE} $MINE</span>
            </p>
            <div className="bg-gray-900 p-3 rounded flex items-center justify-between">
              <code className="text-green-400 break-all">{HOUSE_WALLET}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(HOUSE_WALLET);
                  alert('Wallet address copied to clipboard!');
                }}
                className="ml-2 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Entry Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-200 mb-4"
        >
          Submit Entry
        </button>
      )}

      {/* Google Form Embed */}
      {showForm && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Submit Entry</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕ Close Form
            </button>
          </div>
          <div className="bg-white rounded-lg overflow-hidden">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSevNabN5GSENNp7wQebsU26QdKvtwrOkUXseYd-IkWfDiu2mw/viewform?embedded=true"
              width="100%"
              height="800"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
            >
              Loading Google Form...
            </iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default LotterySystem;
