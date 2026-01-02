// Short codes mapping for compression
const encounterCodes = {
    'Tiny Adventures': 'N',
    'Crossroads of Fate': 'C2',
    'Cube Battle': 'M',
    'Axe Ricochet': 'LD',
    'Treasure Hunt - Card Realm': 'TG',
    'Treasure chest (jackpot)': 'TJ'
};

const codeToEncounter = Object.fromEntries(
    Object.entries(encounterCodes).map(([k, v]) => [v, k])
);

const encounterSequences = [
    // Colonne 1 (13 étapes)
    [
        "Tiny Adventures",
        "Crossroads of Fate",
        "Tiny Adventures",
        "Axe Ricochet",
        "Tiny Adventures",
        "Tiny Adventures",
        "Crossroads of Fate",
        "Treasure Hunt - Card Realm",
        "Tiny Adventures",
        "Crossroads of Fate",
        "Tiny Adventures",
        "Axe Ricochet",
        "Treasure chest (jackpot)"
    ],
    // Colonne 2 (13 étapes)
    [
        "Tiny Adventures",
        "Tiny Adventures",
        "Crossroads of Fate",
        "Treasure Hunt - Card Realm",
        "Tiny Adventures",
        "Tiny Adventures",
        "Cube Battle",
        "Tiny Adventures",
        "Crossroads of Fate",
        "Treasure chest (jackpot)",
        "Tiny Adventures",
        "Axe Ricochet",
        "Crossroads of Fate"
    ],
    // Colonne 3 (13 étapes)
    [
        "Tiny Adventures",
        "Tiny Adventures",
        "Cube Battle",
        "Tiny Adventures",
        "Crossroads of Fate",
        "Treasure Hunt - Card Realm",
        "Tiny Adventures",
        "Tiny Adventures",
        "Crossroads of Fate",
        "Treasure chest (jackpot)",
        "Crossroads of Fate",
        "Tiny Adventures",
        "Axe Ricochet"
    ],
    // Colonne 4 (13 étapes)
    [
        "Tiny Adventures",
        "Tiny Adventures",
        "Treasure Hunt - Card Realm",
        "Tiny Adventures",
        "Crossroads of Fate",
        "Tiny Adventures",
        "Cube Battle",
        "Tiny Adventures",
        "Crossroads of Fate",
        "Tiny Adventures",
        "Crossroads of Fate",
        "Cube Battle",
        "Treasure chest (jackpot)"
    ]
];

// Helpers pour éviter la répétition
function isSpecialChest(type) {
  return type === 'Treasure Hunt - Card Realm' || type === 'Treasure chest (jackpot)';
}

function getSpecialClass(type, cardOrBadge = 'card') {
  const prefix = cardOrBadge === 'badge' ? 'badge' : 'card';
  if (type === 'Treasure Hunt - Card Realm') return prefix + '-gold';
  if (type === 'Treasure chest (jackpot)') return prefix + '-jackpot';
  return null;
}

function getIconWrapperClass(type) {
  if (type === 'Treasure Hunt - Card Realm') return 'text-3xl sm:text-4xl mb-2 gold-text';
  if (type === 'Treasure chest (jackpot)') return 'text-3xl sm:text-4xl mb-2 jackpot-text';
  return 'text-3xl sm:text-4xl mb-2';
}

function createSeparator(text, isCycle = false) {
  const sep = document.createElement('div');
  sep.className = `inline-flex items-center px-2 py-1 rounded-full text-xs ${
    isCycle
      ? 'bg-gray-200 text-gray-700 font-semibold'
      : 'bg-gray-100 text-gray-600'
  }`;
  sep.textContent = text;
  return sep;
}

function setCardEnabled(card, enabled) {
  card.classList.toggle('opacity-40', !enabled);
  card.classList.toggle('grayscale', !enabled);
  card.classList.toggle('cursor-not-allowed', !enabled);
  card.classList.toggle('pointer-events-none', !enabled);
}

// Helpers pour renderPredictions
function getConfidenceClass(confidence) {
  const map = {
    high: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-orange-100 text-orange-800 border-orange-300'
  };
  return map[confidence] || '';
}

function getConfidenceLabel(confidence) {
  const map = {
    high: 'High confidence',
    medium: 'Medium confidence',
    low: 'Low confidence'
  };
  return map[confidence] || '';
}

function createBanner(color, icon, message) {
  return `
    <div class="p-6 bg-${color}-50 border-l-4 border-${color}-400 rounded-lg">
        <p class="text-${color}-800 flex items-center">
            <i class="fas ${icon} mr-2"></i>
            ${message}
        </p>
    </div>
  `;
}

function createPredictionCard(pred, index) {
  const data = encounterTypes[pred.type];
  const card = document.createElement('div');
  card.className = 'prediction-card p-5 bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-md border-2';
  card.style.borderColor = data.color;
  card.style.animationDelay = `${index * 0.1}s`;

  card.innerHTML = `
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center">
        <div class="text-3xl mr-4" style="color: ${data.color}">
          <i class="fas ${data.icon}"></i>
        </div>
        <div>
          <div class="font-bold text-lg text-gray-800">${pred.type}</div>
          <div class="text-sm text-gray-500">${pred.count} match(es) found</div>
        </div>
      </div>
      <div class="text-right">
        <div class="text-3xl font-bold" style="color: ${data.color}">${pred.probability.toFixed(1)}%</div>
        <div class="text-xs px-2 py-1 rounded-full border ${getConfidenceClass(pred.confidence)} mt-1">
          ${getConfidenceLabel(pred.confidence)}
        </div>
      </div>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div class="probability-bar h-full rounded-full transition-all duration-1000" 
           style="width: ${pred.probability}%; background-color: ${data.color}"></div>
    </div>
  `;
  return card;
}

function createMatchDetails(matches) {
  const detailsCard = document.createElement('div');
  detailsCard.className = 'mt-4 p-4 bg-purple-50 border-l-4 border-purple-400 rounded-lg';
  const listItems = matches.map(match => {
    const stepNum = match.currentStep + 1;
    const nextText = match.nextEncounter ? `→ Next: ${match.nextEncounter}` : '(End of sequence)';
    return `<li>• Sequence ${match.sequenceIndex} - Step ${stepNum}/13 ${nextText}</li>`;
  }).join('');
  detailsCard.innerHTML = `
    <p class="text-purple-800 font-semibold mb-2 flex items-center">
      <i class="fas fa-info-circle mr-2"></i>
      Match details:
    </p>
    <ul class="text-sm text-purple-700 space-y-1">
      ${listItems}
    </ul>
  `;
  return detailsCard;
}

// Types d'encounters avec leurs couleurs
const encounterTypes = {
    "Tiny Adventures": { color: "#10b981", icon: "fa-user" },
    "Crossroads of Fate": { color: "#8b5cf6", icon: "fa-hand-pointer" },
    "Cube Battle": { color: "#ef4444", icon: "fa-dragon" },
    "Axe Ricochet": { color: "#f59e0b", icon: "fa-fire" },
    "Treasure Hunt - Card Realm": { color: "#eab308", icon: "fa-coins" },
    "Treasure chest (jackpot)": { color: "#06b6d4", icon: "fa-gem" }
};

// État de l'application
let userHistory = [];
let usedSequences = []; // sequences (1..4) already seen in current cycle
let cycleId = 1;
let lastCompletedSequence = null; // 1..4 when a sequence completes at 13/13
let newCycleJustDetected = false; // transient UI hint
let cycleStartIndices = []; // indexes in userHistory where a new cycle starts
let pendingCycleStart = false;  // next added encounter marks a new cycle start
let sequenceStartIndices = []; // indexes in userHistory where a new sequence starts (within a cycle)
let pendingSequenceStart = false; // next added encounter marks a new sequence start

// Settings (non-persisted, defaults)
let assumeStart = false;
let enforceUnique = false;

// URL state management with compression and short codes
function encodeStateToURL() {
  // Convert history to short codes
  const compactHistory = userHistory.map(enc => encounterCodes[enc] || enc);
  
  const state = {
    h: compactHistory,
    u: usedSequences,
    c: cycleId,
    l: lastCompletedSequence,
    cs: cycleStartIndices,
    ss: sequenceStartIndices,
    pc: pendingCycleStart,
    ps: pendingSequenceStart,
    as: assumeStart,
    eu: enforceUnique
  };
  
  // Compress and encode
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state));
  
  // Use fragment (#) instead of query (?)
  // Remove query params and set fragment
  const baseUrl = window.location.origin + window.location.pathname;
  window.location.replace(baseUrl + '#s=' + compressed);
  
  // Check URL length and warn if needed (though with compression + fragment, limit is ~64K)
  const urlLength = window.location.href.length;
  if (urlLength > 60000) {
    console.warn(`⚠️ URL is getting very long: ${urlLength} chars`);
  }
}

function decodeStateFromURL() {
  // Try fragment first (new format), then query params (old format for backward compatibility)
  let encoded = null;
  
  // New format: #s=...
  if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    encoded = hashParams.get('s');
  }
  
  // Old format fallback: ?s=...
  if (!encoded) {
    const params = new URLSearchParams(window.location.search);
    encoded = params.get('s');
  }
  
  if (encoded) {
    try {
      let state;
      
      // Try decompression first (new format)
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
        state = JSON.parse(decompressed);
      } catch {
        // Fallback to old format (base64 without compression)
        state = JSON.parse(atob(encoded));
      }
      
      // Decode short codes back to full names
      const fullHistory = (state.h || []).map(code => codeToEncounter[code] || code);
      
      userHistory = fullHistory;
      usedSequences = state.u || [];
      cycleId = state.c || 1;
      lastCompletedSequence = state.l || null;
      newCycleJustDetected = false;
      cycleStartIndices = state.cs || [];
      sequenceStartIndices = state.ss || [];
      pendingCycleStart = state.pc || false;
      pendingSequenceStart = state.ps || false;
      assumeStart = state.as || false;
      enforceUnique = state.eu || false;
      return true;
    } catch (e) {
      console.warn('Invalid state in URL:', e);
      return false;
    }
  }
  return false;
}

function saveState() {
  encodeStateToURL();
}

function updateCyclePanel(activeSequence = null, progressStep = null) {
    const panel = document.getElementById('cyclePanel');
    const list = document.getElementById('cycleSequences');
    const badge = document.getElementById('cycleBadge');
    if (!panel || !list || !badge) return;
    if (usedSequences.length === 0 && userHistory.length === 0) {
        panel.classList.add('hidden');
        return;
    }
    panel.classList.remove('hidden');
    badge.textContent = `Cycle #${cycleId}`;
    list.innerHTML = '';
    for (let s = 1; s <= 4; s++) {
        const completed = usedSequences.includes(s);
        const isActive = activeSequence === s && !completed;
        const pill = document.createElement('div');
        pill.className = `relative overflow-hidden px-2 py-1 rounded-full border text-xs transition-all duration-300 ${
            completed 
                ? 'bg-green-100 text-green-800 border-green-300' 
                : isActive 
                    ? 'bg-purple-100 text-purple-800 border-purple-400 shadow-sm' 
                    : 'bg-gray-100 text-gray-600 border-gray-300'
        }`;
        
        // Add progress bar for active sequence
        if (isActive && progressStep) {
            const progress = Math.min(100, (progressStep / 13) * 100);
            const progressBar = document.createElement('div');
            progressBar.className = 'absolute inset-0 bg-gradient-to-r from-purple-200 to-purple-300 opacity-40 transition-all duration-500';
            progressBar.style.width = `${progress}%`;
            pill.appendChild(progressBar);
        }
        
        const text = document.createElement('span');
        text.className = 'relative z-10';
        text.textContent = `Sequence ${s} ${completed ? '✓' : isActive && progressStep ? `${progressStep}/13` : ''}`.trim();
        pill.appendChild(text);
        
        list.appendChild(pill);
    }
}

// Initialisation
function init() {
    renderEncounterTypes();
    
    // Load state from URL if available
    const hasURLState = decodeStateFromURL();
    if (hasURLState) {
        // Show brief notification that state was loaded from URL
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg z-50 text-sm font-medium';
        notification.innerHTML = '<i class="fas fa-check-circle mr-2"></i>State loaded from URL';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
    
    // Setup checkboxes
    const assume = document.getElementById('assumeStart');
    if (assume) {
        assume.checked = assumeStart;
        assume.addEventListener('change', () => {
            assumeStart = assume.checked;
            saveState();
            predictNext();
        });
    }
    
    const unique = document.getElementById('enforceUnique');
    if (unique) {
        unique.checked = enforceUnique;
        unique.addEventListener('change', () => {
            enforceUnique = unique.checked;
            saveState();
            predictNext();
        });
    }
    
    // Update UI
    updateHistory();
    predictNext();
    
    // Attach click listeners for encounter cards
    const cards = document.querySelectorAll('.encounter-card');
    cards.forEach(card => {
        const type = card.dataset.type;
        if (type) card.addEventListener('click', () => addEncounter(type));
    });
    
    // Add copy URL button
    addCopyURLButton();
}

function addCopyURLButton() {
  const button = document.createElement('button');
  button.id = 'copyUrlBtn';
  button.className = 'fixed bottom-6 right-6 px-4 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all z-50 flex items-center gap-2 font-medium';
  button.innerHTML = '<i class="fas fa-link"></i> Copy link';
  button.addEventListener('click', () => {
    let urlToCopy = window.location.href;
    
    // If we have old format (?s=), convert to new format (#s=) before copying
    if (window.location.search && window.location.search.includes('s=')) {
      try {
        // Extract and decode old format
        const params = new URLSearchParams(window.location.search);
        const encoded = params.get('s');
        const state = JSON.parse(atob(encoded));
        
        // Convert to short codes
        const compactHistory = (state.h || []).map(enc => encounterCodes[enc] || enc);
        const newState = {
          h: compactHistory,
          u: state.u || [],
          c: state.c || 1,
          l: state.l || null,
          cs: state.cs || [],
          ss: state.ss || [],
          pc: state.pc || false,
          ps: state.ps || false,
          as: state.as || false,
          eu: state.eu || false
        };
        
        // Compress and create new URL
        const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(newState));
        const baseUrl = window.location.origin + window.location.pathname;
        urlToCopy = baseUrl + '#s=' + compressed;
        
        console.log('✅ Copied as v0.3 format (converted from v0.2)');
      } catch (e) {
        console.warn('Error converting URL, copying original:', e);
      }
    }
    
    navigator.clipboard.writeText(urlToCopy).then(() => {
      const original = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Copied!';
      button.classList.add('bg-green-600');
      setTimeout(() => {
        button.innerHTML = original;
        button.classList.remove('bg-green-600');
      }, 2000);
    });
  });
  document.body.appendChild(button);
}

// Rendu des types d'encounters
function renderEncounterTypes() {
    const container = document.getElementById('encounterTypes');
    if (!container) {
        console.error('Container #encounterTypes not found');
        return;
    }
    container.innerHTML = '';
    Object.keys(encounterTypes).forEach((type) => {
        const data = encounterTypes[type];
        if (!data) {
            console.error(`No data found for type: ${type}`);
            return;
        }
        const card = document.createElement('div');
        card.className = 'encounter-card bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md hover:shadow-xl border-2 border-gray-200 text-center transition-all';
        card.dataset.type = type;

        const specialClass = getSpecialClass(type, 'card');
        if (specialClass) card.classList.add(specialClass);

        const iconWrapperClass = getIconWrapperClass(type);
        const iconWrapperStyle = isSpecialChest(type) ? '' : `style="color: ${data.color}"`;
        card.innerHTML = `
            <div class="${iconWrapperClass}" ${iconWrapperStyle}>
                <i class="fas ${data.icon}"></i>
            </div>
            <div class="text-xs sm:text-sm font-semibold text-gray-700 mt-2">${type}</div>
        `;
        if (!isSpecialChest(type)) {
            card.style.borderColor = data.color;
        }
        container.appendChild(card);
    });
}

// Enable/disable encounter cards based on predictions
function updateEncounterTypeAvailability(result) {
    const container = document.getElementById('encounterTypes');
    if (!container) return;
    const cards = container.querySelectorAll('.encounter-card');
    const allowed = new Set(
        result && Array.isArray(result.predictions) && result.predictions.length > 0
            ? result.predictions.map(p => p.type)
            : Object.keys(encounterTypes)
    );
    cards.forEach(card => {
        const enabled = allowed.has(card.dataset.type);
        setCardEnabled(card, enabled);
    });
}

// Ajouter une encounter à l'historique
function addEncounter(type) {
    userHistory.push(type);
    if (pendingCycleStart) {
        // mark the index of the just-added event as start of cycle (takes precedence over sequence)
        cycleStartIndices.push(userHistory.length - 1);
        pendingCycleStart = false;
        pendingSequenceStart = false;
    } else if (pendingSequenceStart) {
        // mark start of new sequence within same cycle
        sequenceStartIndices.push(userHistory.length - 1);
        pendingSequenceStart = false;
    }
    updateHistory();
    predictNext();
    saveState();
}

// Mettre à jour l'affichage de l'historique
function updateHistory() {
    const container = document.getElementById('encounterHistory');
    
    if (userHistory.length === 0) {
        container.innerHTML = '<p class="text-gray-400 italic">No encounter selected...</p>';
        document.getElementById('predictionsSection').classList.add('hidden');
        updateCyclePanel();
        return;
    }
    
    container.innerHTML = '';
    userHistory.forEach((type, index) => {
        const data = encounterTypes[type];
        // Insert separators if needed
        if (cycleStartIndices.includes(index)) {
            container.appendChild(createSeparator('Cycle start', true));
        } else if (sequenceStartIndices.includes(index)) {
            container.appendChild(createSeparator('Sequence start', false));
        }
        const badge = document.createElement('div');
        badge.className = 'inline-flex items-center justify-center w-9 h-9 rounded-full text-white shadow-md';
        const specialClass = getSpecialClass(type, 'badge');
        if (specialClass) {
            badge.classList.add(specialClass);
        } else {
            badge.style.backgroundColor = data.color;
        }
        badge.title = type;
        badge.innerHTML = `
            <i class="fas ${data.icon}"></i>
        `;
        container.appendChild(badge);
    });
    updateCyclePanel();
}

// Annuler la dernière encounter
function undoLast() {
    if (userHistory.length > 0) {
        userHistory.pop();
        updateHistory();
        if (userHistory.length > 0) {
            predictNext();
        }
        saveState();
    }
}

// Réinitialiser l'historique
function resetHistory() {
    const ok = confirm('Reset will clear your history and cycle tracking. This action cannot be undone. Continue?');
    if (!ok) return;
    userHistory = [];
    usedSequences = [];
    cycleId = 1;
    lastCompletedSequence = null;
    newCycleJustDetected = false;
    cycleStartIndices = [];
    sequenceStartIndices = [];
    pendingCycleStart = false;
    pendingSequenceStart = false;
    saveState();
    updateHistory();
    
    // Reset predictions and re-enable all cards
    const section = document.getElementById('predictionsSection');
    if (section) section.classList.add('hidden');
    updateEncounterTypeAvailability(null);
}

// Prédire la prochaine encounter
function predictNext() {
    if (userHistory.length === 0) {
        const section = document.getElementById('predictionsSection');
        if (section) section.classList.add('hidden');
        return;
    }
    const predictions = calculatePredictions();
    renderPredictions(predictions);
}

// Calculer les prédictions basées sur l'historique (cycles de 13 étapes, matching circulaire)
function calculatePredictions() {
    // Use only the active segment since the last cycle start (if any)
    const lastCycleStart = cycleStartIndices.length > 0 ? cycleStartIndices[cycleStartIndices.length - 1] : -1;
    const lastSeqStart = sequenceStartIndices.length > 0 ? sequenceStartIndices[sequenceStartIndices.length - 1] : -1;
    const lastStartIndex = Math.max(lastCycleStart, lastSeqStart);
    const usingFullHistory = lastStartIndex < 0;
    const anchoredToSequenceStart =
        (lastSeqStart >= 0 && lastSeqStart === lastStartIndex) ||
        (usingFullHistory && cycleStartIndices.length === 0 && sequenceStartIndices.length === 0);
    const activeHistory = lastStartIndex >= 0 ? userHistory.slice(lastStartIndex) : userHistory.slice(0);
    const historyLength = activeHistory.length;
    if (historyLength === 0) {
        return { predictions: [], matches: [], totalMatches: 0, ambiguous: false, needMoreData: true, sequenceComplete: false };
    }
    const matches = [];
    const L = 13; // longueur max
    const assumeStartActive = assumeStart;
    const enforceUniqueActive = enforceUnique;
    const mustAnchorAtStart = assumeStartActive || anchoredToSequenceStart;

    // Chercher TOUS les alignements valides dans chaque séquence (matching circulaire)
    encounterSequences.forEach((sequence, seqIndex) => {
        for (let startIdx = 0; startIdx < L; startIdx++) {
            if (mustAnchorAtStart && startIdx !== 0) continue; // ne considérer que le début de séquence
            let ok = true;
            for (let i = 0; i < historyLength; i++) {
                const seqVal = sequence[(startIdx + i) % L];
                if (seqVal !== activeHistory[i]) { ok = false; break; }
            }
            if (!ok) continue;

            // Étape actuelle = indice du dernier élément observé
            const lastObservedIdx = (startIdx + historyLength - 1) % L; // 0..12
            const nextIdx = (lastObservedIdx + 1) % L; // prochain
            const isEnd = lastObservedIdx === L - 1; // on vient d'atteindre 13/13

            matches.push({
                sequenceIndex: seqIndex + 1, // 1..4
                startPosition: startIdx + 1,  // 1..13
                currentStep: lastObservedIdx, // 0..12
                nextEncounter: sequence[nextIdx],
                isEndOfSequence: isEnd,
                sequence
            });
        }
    });

    if (matches.length === 0) {
        return {
            predictions: [],
            matches: [],
            totalMatches: 0,
            ambiguous: false,
            needMoreData: true,
            sequenceComplete: false
        };
    }

    // Optionally exclude sequences already used in current cycle
    let effectiveMatches = matches.slice();
    if (enforceUniqueActive && usedSequences.length > 0 && usedSequences.length < 4) {
        const filtered = effectiveMatches.filter(m => !usedSequences.includes(m.sequenceIndex));
        if (filtered.length > 0) effectiveMatches = filtered;
    }

    // Aggregate next encounters
    const nextEncounters = {};
    effectiveMatches.forEach(m => {
        nextEncounters[m.nextEncounter] = (nextEncounters[m.nextEncounter] || 0) + 1;
    });

    const totalPredictions = Object.values(nextEncounters).reduce((a,b)=>a+b,0);
    const predictions = Object.keys(nextEncounters)
        .map(type => ({
            type,
            count: nextEncounters[type],
            probability: (nextEncounters[type] / totalPredictions) * 100,
            confidence: calculateConfidence(nextEncounters[type], historyLength)
        }))
        .sort((a,b)=>b.probability - a.probability);

    // Use EFFECTIVE matches (after constraints) to determine end-of-sequence and progress
    const allAtEnd = effectiveMatches.length > 0 && effectiveMatches.every(m => m.isEndOfSequence);
    const someAtEnd = effectiveMatches.some(m => m.isEndOfSequence);

    // Progress step estimate (most frequent current step among effective matches)
    let progressStep = null; // 1..13
    if (effectiveMatches.length > 0) {
        const counts = {};
        effectiveMatches.forEach(m => {
            const s = m.currentStep + 1; // 1..13
            counts[s] = (counts[s] || 0) + 1;
        });
        const top = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
        progressStep = top ? Number(top[0]) : null;
    }

    // Deduce and lock sequence ONLY when the sequence is actually completed (step 13)
    const seqSet = new Set(effectiveMatches.map(m => m.sequenceIndex));
    if (allAtEnd && seqSet.size === 1) {
        const seq = [...seqSet][0];

        // Add this sequence to the set of completed sequences in the CURRENT cycle
        if (!usedSequences.includes(seq)) {
            usedSequences.push(seq);
        }

        let rolled = false;

        // Always start a new sequence segment after completion
        pendingSequenceStart = true;

        // Case A: same sequence completes twice in a row => a new cycle existed between them
        if (lastCompletedSequence === seq) {
            cycleId += 1;
            newCycleJustDetected = true;
            pendingCycleStart = true; // next event marks the visual and analytical start
            usedSequences = [];       // new cycle: none completed yet
            rolled = true;
        }

        // Case B: we have now seen 4 distinct sequences in this cycle
        if (!rolled && usedSequences.length >= 4) {
            cycleId += 1;
            newCycleJustDetected = true;
            pendingCycleStart = true;
            usedSequences = [];
            rolled = true;
        }

        // Remember the last completed sequence (used for Case A)
        lastCompletedSequence = seq;
        saveState();
        updateCyclePanel();
    }

    // Determine active sequence for UI
    let activeSeq = null;
    if (effectiveMatches.length > 0 && !allAtEnd) {
        const seqCounts = {};
        effectiveMatches.forEach(m => {
            seqCounts[m.sequenceIndex] = (seqCounts[m.sequenceIndex] || 0) + 1;
        });
        const topSeq = Object.entries(seqCounts).sort((a,b) => b[1] - a[1])[0];
        activeSeq = topSeq ? Number(topSeq[0]) : null;
    }

    return {
        predictions,
        matches: effectiveMatches,
        totalMatches: matches.length,
        ambiguous: matches.length > 3,
        needMoreData: matches.length > 5,
        sequenceComplete: allAtEnd,
        partiallyComplete: someAtEnd && !allAtEnd,
        progressStep,
        activeSequence: activeSeq
    };
}

// Calculer le niveau de confiance
function calculateConfidence(matchCount, historyLength) {
    if (matchCount === 1) return 'high';
    if (matchCount <= 2 && historyLength >= 2) return 'high';
    if (matchCount <= 3) return 'medium';
    return 'low';
}

// Afficher les prédictions
function renderPredictions(result) {
    const container = document.getElementById('predictions');
    const section = document.getElementById('predictionsSection');
    const warning = document.getElementById('ambiguityWarning');
    const warningText = document.getElementById('ambiguityText');
    
    section.classList.remove('hidden');
    container.innerHTML = '';
    
    // Update cycle panel with active sequence and progress
    updateCyclePanel(result.activeSequence, result.progressStep);

    // One-time banner if a new cycle was just detected
    if (newCycleJustDetected) {
        const cycleInfo = document.createElement('div');
        cycleInfo.className = 'mb-3 p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-lg';
        cycleInfo.innerHTML = `
            <p class="text-indigo-800 flex items-center">
                <i class="fas fa-rotate mr-2"></i>
                New cycle detected. Now tracking Cycle #${cycleId}.
            </p>
        `;
        container.appendChild(cycleInfo);
        newCycleJustDetected = false;
    }

    // Sequence progress bar (if we can estimate current step)
    if (!result.sequenceComplete && result.progressStep) {
        const pct = Math.max(0, Math.min(100, (result.progressStep / 13) * 100));
        const progress = document.createElement('div');
        progress.className = 'mb-4 p-4 bg-white rounded-xl shadow border';
        progress.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="text-sm font-semibold text-gray-700">Sequence progress</div>
                <div class="text-xs text-gray-500">Step ${result.progressStep}/13</div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700" style="width: ${pct}%; background: linear-gradient(90deg, #8b5cf6, #06b6d4);"></div>
            </div>
        `;
        container.appendChild(progress);
    }

    // Check if we are at the end of a sequence
    if (result.sequenceComplete) {
        updateEncounterTypeAvailability(null);
        container.innerHTML = createBanner('blue', 'fa-flag-checkered', 'Sequence complete! (Step 13/13)<br><small>You reached the end of a sequence. The next encounter will start a new sequence automatically. Use "Reset" only if you want to clear tracking and start without cycle memory.</small>');
        warning.classList.add('hidden');
        return;
    }
    
    if (result.predictions.length === 0) {
        updateEncounterTypeAvailability(null);
        container.innerHTML = createBanner('red', 'fa-times-circle', 'No prediction possible with this sequence.');
        warning.classList.add('hidden');
        return;
    }
    
    // Show warning if necessary
    if (result.needMoreData) {
        warning.classList.remove('hidden');
        warningText.textContent = `${result.totalMatches} match(es) found. Add more encounters to refine the prediction.`;
    } else if (result.ambiguous) {
        warning.classList.remove('hidden');
        warningText.textContent = `${result.totalMatches} possible match(es). Prediction may vary.`;
    } else {
        warning.classList.add('hidden');
    }
    
    // Afficher les prédictions
    result.predictions.forEach((pred, index) => {
        container.appendChild(createPredictionCard(pred, index));
    });
    
    // Show match details if few
    if (result.totalMatches <= 3 && result.matches.length > 0) {
        container.appendChild(createMatchDetails(result.matches));
    }
    
    // Certain prediction message
    if (result.totalMatches === 1) {
        const match = result.matches[0];
        const stepNum = match.currentStep + 1;
        const certaintyBanner = document.createElement('div');
        certaintyBanner.className = 'mt-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg';
        certaintyBanner.innerHTML = `
            <p class="text-green-800 flex items-center font-semibold">
                <i class="fas fa-check-circle mr-2"></i>
                Certain prediction! Sequence ${match.sequenceIndex}, Step ${stepNum}/13
            </p>
        `;
        container.appendChild(certaintyBanner);
    }
    
    // Warning if near end
    if (result.partiallyComplete) {
        container.innerHTML += createBanner('yellow', 'fa-exclamation-triangle', 'Some matches are at the end of the sequence (13/13). Prepare to reset.');
    }

    // Finally, apply greying of impossible encounters
    updateEncounterTypeAvailability(result);
}

// Lancer l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  init();
  const undoBtn = document.getElementById('undoBtn');
  const resetBtn = document.getElementById('resetBtn');
  if (undoBtn) undoBtn.addEventListener('click', () => undoLast());
  if (resetBtn) resetBtn.addEventListener('click', () => resetHistory());
});
