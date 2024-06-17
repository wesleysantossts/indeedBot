import puppeteer from "puppeteer";
import * as datefns from "date-fns";

import { JOB_KEYWORDS, JOB_KEYWORDS_EXCLUDE, JOB_SEARCH, PAGE_LIMIT, WEIRD_SITES } from "./constants.js";
import SearchText from "./functions/searchText.js";
import SaveJson from "./utils/saveJson.js";
import { sleep } from "./utils/sleep.js";

(async () => {
  console.time("bot");
  const headless = false;
  const browser = await puppeteer.launch({
    headless
  });
  const page = await browser.newPage();

  const jobsNormalized = [];
  const date = new Date();
  for (const search of JOB_SEARCH) {
    await page.goto(`https://br.indeed.com/jobs?q=${search}&l=&sort=date`);
    if (!headless && (search === JOB_SEARCH[0])) await page.click("#onetrust-accept-btn-handler");
  
    const jobs = [];
  
    for (let i = 1; i <= PAGE_LIMIT; i++) {
      if (i === 2 &&  (search === JOB_SEARCH[0])) {
        await page.waitForSelector('button[aria-label="fechar"]', 350);
        const buttonPopup = await page.$('button[aria-label="fechar"]');
        if (!!buttonPopup) await buttonPopup.click();
      }
  
      const resultItem = await page.$$(".resultContent");
      for (const result of resultItem) {
        let obj = {
          title: "",
          companyApplication: "",
          link: ""
        };
  
        const title = await result.$(".jcs-JobTitle");
        const content = (await title.evaluate(content => content.textContent)).toLowerCase();
        obj.title = content;
        
        let keywordContains = false;
        JOB_KEYWORDS.forEach((keyword) => {
          if (content.includes(keyword)) {
            keywordContains = true;
    
            JOB_KEYWORDS_EXCLUDE.forEach(keywordExclude => {
              if(content.includes(keywordExclude)) 
                keywordContains = false;
            });
          };
        });
  
        const site = await result.$eval('[data-testid="company-name"]', (item) => item.textContent.toLowerCase());
        let siteNotAllowed = WEIRD_SITES.filter(item => item.toLowerCase() === site);
        if (!keywordContains || siteNotAllowed.length > 0) continue;
        
        await title.click();
        await sleep(2300);
        const sidePane = await page.$(".jobsearch-RightPane");
        if (!sidePane) continue;
        
        const shouldApply = await SearchText.search(sidePane);
        if (!shouldApply) continue;
  
        const applyButton = await sidePane.$("#indeedApplyButton")
        const applyButtonWithExternalLink = await sidePane.$('button[contenthtml="Candidatar-se no site da empresa"]');
  
        if (applyButton) {
          obj.companyApplication = "indeed";
          const href = await title.evaluate(item => item.getAttribute("href"));
          obj.link = `https://br.indeed.com/${href}`
        } else {
          obj.companyApplication = site;
          const href = await applyButtonWithExternalLink.evaluate(el => el.getAttribute("href"));
          obj.link = href 
        }
        
        jobs.push(obj);
      }
      
      if (i < PAGE_LIMIT) {
        await page.waitForSelector(`nav > ul > li > a[data-testid="pagination-page-${i + 1}"]`, 350);
        await page.click(`nav > ul > li > a[data-testid="pagination-page-${i + 1}"]`);
      }
      console.log(`Busca: ${search} - Página ${i} concluída`);
      if (i === PAGE_LIMIT) await sleep(2300);
    }
  
    const hour = datefns.format(date, "HH:mm");
    const normalized = {
      busca: search, 
      vagas: jobs.length, 
      horário: hour, 
      jobs 
    };
    jobsNormalized.push(normalized);
  }
    
  const dateFormat = datefns.format(date, "yyyyMMdd");
  await SaveJson.save(jobsNormalized, dateFormat);

  console.timeEnd("bot");
  await browser.close();
})();