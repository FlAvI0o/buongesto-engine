import React from 'react';

const Proforma: React.FC = () => {
  return (
    // IL TAVOLO: Un bianco/grigio chirurgico e luminoso
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center py-20 px-4 font-sans print:bg-white print:py-0 print:px-0">
      
      {/* IL BOTTONE (Il Monolite di Ossidiana) */}
      <div className="fixed top-8 right-8 z-50 print:hidden">
        <button 
          onClick={() => window.print()}
          className="group flex items-center gap-4 bg-df-obsidian px-8 py-5 transition-transform hover:scale-[0.98] shadow-xl"
        >
          {/* Indicatore ottico */}
          <div className="w-2 h-2 border border-white/30 group-hover:bg-white transition-colors" />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/80 group-hover:text-white transition-colors">
            Generate PDF
          </span>
        </button>
      </div>

      {/* LA LASTRA (L'Alabastro Digitale) */}
      <div className="w-full max-w-[210mm] min-h-[297mm] bg-white p-[20mm] text-df-obsidian shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] print:shadow-none relative overflow-hidden border border-df-obsidian/5">
        
        {/* LA TEXTURE (Il "Marmo" matematico di Deckforge) */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02] mix-blend-multiply print:hidden"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* CONTENUTO DELLA FATTURA (Tutto portato in primo piano con z-10) */}
        <div className="relative z-10">
          {/* MIRINI ARCHITETTONICI */}
          <div className="absolute -top-4 -left-4 w-4 h-4 border-t border-l border-df-obsidian/20" />
          <div className="absolute -top-4 -right-4 w-4 h-4 border-t border-r border-df-obsidian/20" />
          <div className="absolute -bottom-4 -left-4 w-4 h-4 border-b border-l border-df-obsidian/20" />
          <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b border-r border-df-obsidian/20" />

          {/* HEADER */}
          <header className="flex justify-between items-start border-b border-df-obsidian/10 pb-8 mb-12">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-df-obsidian font-bold">
                DECKFORGE INFRASTRUCTURE
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-df-steel">
                Coherence Over Compromise.
              </span>
            </div>
            <div className="text-right flex flex-col gap-1 font-mono text-[9px] tracking-[0.2em]">
              <p>DOCUMENT: PROFORMA INVOICE</p>
              <p className="text-df-steel">DATE: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
              <p className="text-df-steel">REF: DF-NEXUS-001</p>
            </div>
          </header>

          {/* DATI CLIENTE E FORNITORE */}
          <section className="grid grid-cols-2 gap-12 border-b border-df-obsidian/10 pb-12 mb-12">
            <div className="flex flex-col gap-3 font-mono text-[10px] tracking-[0.1em]">
              <span className="text-[8px] tracking-[0.4em] text-df-steel uppercase mb-2">Vendor / Executing Entity</span>
              <p className="font-bold text-sm tracking-widest">DECKFORGE</p>
              <p className="text-df-obsidian/80">Via dell'Orologeria, 12</p>
              <p className="text-df-obsidian/80">00100 Roma, Italy</p>
              <p className="text-df-obsidian/80">VAT: IT01234567890</p>
            </div>
            
            <div className="flex flex-col gap-3 font-mono text-[10px] tracking-[0.1em]">
              <span className="text-[8px] tracking-[0.4em] text-df-steel uppercase mb-2">Client / Target Entity</span>
              <p className="font-bold text-sm tracking-widest">NEXUS AI SYSTEMS</p>
              <p className="text-df-obsidian/80">100 Innovation Drive</p>
              <p className="text-df-obsidian/80">San Francisco, CA 94105</p>
              <p className="text-df-obsidian/80">TAX ID: US-987654321</p>
            </div>
          </section>

          {/* STATEMENT OF WORK / LINE ITEMS */}
          <section className="mb-12">
            <span className="font-mono text-[8px] tracking-[0.4em] text-df-steel uppercase mb-6 block">Statement of Work (Initial Tranche)</span>
            
            <div className="border border-df-obsidian/10">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 border-b border-df-obsidian/10 p-4 font-mono text-[8px] tracking-[0.2em] text-df-steel uppercase bg-df-obsidian/[0.02]">
                <div className="col-span-8">Description of Services</div>
                <div className="col-span-4 text-right">Amount</div>
              </div>

              {/* Item 1 */}
              <div className="grid grid-cols-12 gap-4 border-b border-df-obsidian/10 p-4 font-mono text-[10px] tracking-[0.1em] items-center">
                <div className="col-span-8 flex flex-col gap-1">
                  <span className="font-bold">Phase 1: Visual Architecture Recalibration</span>
                  <span className="text-df-steel text-[9px]">Alignment of foundational aesthetic & Signal Synthesis</span>
                </div>
                <div className="col-span-4 text-right">€ 7,500.00</div>
              </div>

              {/* Item 2 */}
              <div className="grid grid-cols-12 gap-4 p-4 font-mono text-[10px] tracking-[0.1em] items-center">
                <div className="col-span-8 flex flex-col gap-1">
                  <span className="font-bold">Phase 2: Closed Subdomain Delivery</span>
                  <span className="text-df-steel text-[9px]">Deployment of exclusive identity system</span>
                </div>
                <div className="col-span-4 text-right">€ 2,500.00</div>
              </div>
            </div>
          </section>

          {/* TOTALS */}
          <section className="flex justify-end mb-20">
            <div className="w-1/2 border border-df-obsidian/10 p-4 font-mono text-[10px] tracking-[0.1em]">
              <div className="flex justify-between mb-2">
                <span className="text-df-steel">SUBTOTAL</span>
                <span>€ 10,000.00</span>
              </div>
              <div className="flex justify-between mb-4 pb-4 border-b border-df-obsidian/10">
                <span className="text-df-steel">VAT (Reverse Charge / 0%)</span>
                <span>€ 0.00</span>
              </div>
              <div className="flex justify-between font-sans text-xl tracking-widest font-light">
                <span>TOTAL DUE</span>
                <span>€ 10,000.00</span>
              </div>
            </div>
          </section>

          {/* PAYMENT INSTRUCTIONS */}
          <section className="grid grid-cols-2 gap-12 font-mono text-[9px] tracking-[0.1em] text-df-obsidian/80 border-t border-df-obsidian/10 pt-8 mt-auto">
            <div>
              <span className="text-[8px] tracking-[0.4em] text-df-steel uppercase mb-4 block">Wire Transfer Details</span>
              <div className="grid grid-cols-[80px_1fr] gap-2 mb-1">
                <span className="text-df-steel">Bank:</span>
                <span>Chase Manhattan</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 mb-1">
                <span className="text-df-steel">IBAN:</span>
                <span>ITXX XXXX XXXX XXXX XXXX</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 mb-1">
                <span className="text-df-steel">SWIFT:</span>
                <span>XXXXXXXX</span>
              </div>
            </div>

            <div className="flex flex-col items-end justify-end">
              <span className="text-[8px] tracking-[0.4em] text-df-steel uppercase mb-8 block text-right w-full">Authorization</span>
              <div className="w-48 border-b border-df-obsidian/20 mb-2"></div>
              <span className="text-df-steel text-[8px] uppercase tracking-[0.2em]">Deckforge Authorized Signature</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Proforma;