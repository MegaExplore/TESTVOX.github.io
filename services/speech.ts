export function speakText(text: string, lang = 'en-US') {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

// Define global types for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    _speechRec: any;
  }
}

export function startListening(lang = 'en-US'): Promise<string> {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return reject('Not supported');
    
    const rec = new SpeechRecognition();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    console.log(`Starting speech recognition for lang: ${lang}`);
    window._speechRec = rec;

    let resolved = false;
    let soundDetected = false;
    let safetyTimer: any = null;

    rec.onsoundstart = () => {
      soundDetected = true;
      console.log('Sound detected');
    };

    rec.onresult = (e: any) => {
      console.log('Speech result event:', e);
      const results = e.results;

      for (let i = e.resultIndex; i < results.length; ++i) {
        if (results[i].isFinal) {
          console.log('Final result:', results[i][0].transcript);
          resolved = true;
          resolve(results[i][0].transcript);
          rec.stop();
          if (safetyTimer) clearTimeout(safetyTimer);
          return;
        } else {
          console.log('Interim result:', results[i][0].transcript);
        }
      }
    };

    rec.onerror = (e: any) => {
      console.error('Speech error:', e.error);
      resolved = true;
      reject(e.error);
    };

    rec.onnomatch = () => {
      console.log('Speech no match');
      resolved = true;
      reject('No match');
    };

    rec.onend = () => {
      console.log('Speech ended');
      if (safetyTimer) clearTimeout(safetyTimer);
      if (!resolved) {
        if (soundDetected) reject('No sensitivity/match: Sound detected but no text recognized.');
        else reject('No sound detected');
      }
    };

    try {
      rec.start();
      console.log('Speech processing started');
      safetyTimer = setTimeout(() => {
        console.log('Safety timeout triggered');
        rec.stop();
      }, 5000);
    } catch (e) {
      reject(e);
    }
  });
}