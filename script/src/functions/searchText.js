import { JOB_KEYWORDS, JOB_KEYWORDS_EXCLUDE } from "../constants.js";

class SearchText {
  static async search(seletor) {
    let positiveCounter = 0;
    let negativeCounter = 0;

    const jobDescription = await seletor.$("#jobDescriptionText");
    if (!jobDescription) return;
    const arrText = (await jobDescription.evaluate(item => item.textContent)).split("\r\n");

    for(const text of arrText) {
      const content = text.trim();
      if (content === "\n") continue;
      for (let word of JOB_KEYWORDS) {
        word = word.toLowerCase();
  
        if (text.includes(word)) {
          positiveCounter++;
        }
      }
  
      for (let word of JOB_KEYWORDS_EXCLUDE) {
        word = word.toLowerCase();
  
        if (text.includes(word)) {
          negativeCounter++;
        }
      }
    }; 
    
    let shouldApply = false;
    if (negativeCounter === 0 && positiveCounter > 0) shouldApply = true;
    if ((positiveCounter / negativeCounter) >= 2) shouldApply = true;  

    return shouldApply;
  }
}

export default SearchText;