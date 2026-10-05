import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
const require = createRequire(process.cwd() + '/frontend/package.json');
const { chromium } = require('@playwright/test');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];
for (const scenario of [
  {name:'current-1280', port:5173, width:1280, height:800},
  {name:'current-1366', port:5173, width:1366, height:768},
  {name:'current-1920', port:5173, width:1920, height:1080},
  {name:'old-renderer-1280', port:5175, width:1280, height:800},
]) {
  await page.setViewportSize({width:scenario.width,height:scenario.height});
  await page.goto(`http://localhost:${scenario.port}/applications`);
  await page.locator('tbody tr').filter({hasText:'1000'}).first().waitFor();
  await page.waitForTimeout(600);
  const measurement = await page.evaluate(() => {
    const table=document.querySelector('table'), container=table.parentElement, row=table.querySelector('tbody tr');
    const badge=[...row.querySelectorAll('span')].find(e=>e.textContent.includes('pkt.'));
    const lineCount=new Set([...badge.getClientRects()].map(r=>r.top)).size;
    return {viewport:{width:innerWidth,height:innerHeight},tableWidth:table.getBoundingClientRect().width,
      containerWidth:container.clientWidth,horizontalOverflow:container.scrollWidth-container.clientWidth,
      badge:{textContent:badge.textContent,hasNewline:/[\r\n]/.test(badge.textContent),lineCount,whiteSpace:getComputedStyle(badge).whiteSpace},
      renderedRows:table.querySelectorAll('tbody tr').length,rowHeight:row.getBoundingClientRect().height,
      actionsFullyVisible:row.cells[10].getBoundingClientRect().right<=container.getBoundingClientRect().right,
      tableBottom:table.getBoundingClientRect().bottom+scrollY};
  });
  results.push({scenario:scenario.name,...measurement});
  await page.screenshot({path:`/tmp/research-cruise-layout-evidence/${scenario.name}.png`});
  console.log(JSON.stringify(results.at(-1)));
  if(scenario.name==='current-1280') {
    await page.locator('table').evaluate(t=>t.parentElement.scrollLeft=t.parentElement.scrollWidth);
    await page.screenshot({path:'/tmp/research-cruise-layout-evidence/current-1280-scrolled-right.png'});
  }
}
await writeFile('/tmp/research-cruise-layout-evidence/measurements.json',JSON.stringify(results,null,2)+'\n');
await browser.close();
if(results[0].badge.lineCount>1) {
  console.error('FAIL: expected the points badge to fit on one line; actual line count = '+results[0].badge.lineCount);
  process.exitCode=1;
}
