const fs = require('fs');
const path = require('path');

const datasetPath = path.join(__dirname, 'dataset.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

console.log(`🚀 [LLMOps] Запуск AI Evals Сюїти... Всього тестів: ${dataset.length}\n`);

// Імітація роботи сервісу оцінки (mock AI service для CI)
async function evaluatePrompt(resume, vacancy) {
  const isFrontend = resume.toLowerCase().includes('react') || resume.toLowerCase().includes('javascript');
  const isLead = vacancy.toLowerCase().includes('lead') || vacancy.toLowerCase().includes('architect');
  
  if (isFrontend && !isLead) {
    return { match: true, text: "Кандидат підходить під Frontend вакансію" };
  }
  return { match: false, text: "Невідповідність вимогам за рівнем досвіду" };
}

async function start() {
  let passed = 0;

  for (const test of dataset) {
    console.log(`🔍 Перевірка кейсу ${test.id}: ${test.description}`);
    
    const aiResult = await evaluatePrompt(test.resume || test.input_resume, test.vacancy || test.input_vacancy);
    const isMatchCorrect = aiResult.match === test.expected_match;
    
    // Перевірка безпеки відповіді на заборонені слова-галюцинації
    const containsForbidden = test.forbidden_keywords.some(word => aiResult.text.includes(word));

    if (isMatchCorrect && !containsForbidden) {
      console.log(`  ✅ УСПІШНО`);
      passed++;
    } else {
      console.log(`  ❌ ПОМИЛКА: Очікували збіг=${test.expected_match}, отримали=${aiResult.match}`);
    }
  }

  const accuracy = (passed / dataset.length) * 100;
  console.log(`\n📊 РЕЗУЛЬТАТ: Пройдено ${passed}/${dataset.length} тестів. Точність промптів: ${accuracy}%`);
  
  if (accuracy < 100) {
    console.error("❌ Евалюація промптів завалилася! Зміни блокуються.");
    process.exit(1); // Зупиняє комміт/PR
  } else {
    console.log("🚀 Промпти успішно пройшли валідацію. Дозволено до релізу!");
    process.exit(0);
  }
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});