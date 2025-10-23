// capture-pages.js
import puppeteer from "puppeteer";
import fs from "fs";

const pages = [
  "login",
  "student/dashboard",
  "student/profile", 
  "student/course/1",
  "student/learning/1",
  "student/notice"
];

const outputDir = "./screens";
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const run = async () => {
  console.log("🚀 Starting page capture...");
  const browser = await puppeteer.launch({ 
    headless: false, // 브라우저 창을 보여줌 (디버깅용)
    defaultViewport: { width: 1440, height: 1024 } // 데스크톱 크기
  });
  const page = await browser.newPage();
  
  for (const path of pages) {
    try {
      const url = `http://localhost:5173/${path}`;
      console.log(`📸 Capturing: ${url}`);
      
      await page.goto(url, { 
        waitUntil: "networkidle0",
        timeout: 30000 // 30초 타임아웃
      });
      
      // 페이지가 완전히 로드될 때까지 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fileName = path.replace(/\//g, "_") + ".png";
      await page.screenshot({ 
        path: `${outputDir}/${fileName}`, 
        fullPage: true,
        type: 'png'
      });
      
      console.log("✅ Captured:", fileName);
    } catch (error) {
      console.error(`❌ Failed to capture ${path}:`, error.message);
    }
  }
  
  await browser.close();
  console.log("🎉 All pages captured successfully!");
};

run().catch(console.error);
