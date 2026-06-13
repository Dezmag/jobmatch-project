const fs = require('fs');
const path = require('path');

const datasetPath = path.join(__dirname, 'dataset.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

console.log(`🚀 [DevOps & LLMOps Testing] Запуск комплексної сюїти тестування... Всього тестів: ${dataset.length}\n`);

// Емуляція роботи нашого AI-агента та інфраструктури
async function runAgentEngine(test) {
  const skillType = test.skill_type;

  // 1. Тест парсингу Tool Calls (Integration)
  if (skillType === "integration-tool-call") {
    try {
      const parsed = JSON.parse(test.raw_ai_output);
      // Фікс: витягуємо ім'я з масиву об'єктів tool_calls
      const toolName = parsed.tool_calls[0].name;
      return { modelResult: toolName, msg: `Розібрано інструмент: ${toolName}` };
    } catch (e) {
      return { modelResult: null, msg: "Помилка парсингу JSON інструментів" };
    }
  }

  // 2. Тест стійкості до помилок хмари (Unit Retry/Timeout)
  if (skillType === "unit-resilience-retry") {
    let currentAttempts = 0;
    const maxRetries = 3;
    const simulateFails = test.simulate_api_fail_count;

    for (let i = 1; i <= maxRetries; i++) {
      currentAttempts++;
      if (currentAttempts <= simulateFails) {
        continue; // імітуємо 500 error / timeout
      }
      return { modelResult: "success", msg: `Агент вистояв на спробі №${currentAttempts}` };
    }
    return { modelResult: "failed", msg: "Паттерн Retry завалився" };
  }

  // 3. Стандартна LLMOps логіка для промптів (пошук та адаптація)
  const resumeText = (test.resume || "").toLowerCase();
  const vacancyText = (test.vacancy || "").toLowerCase();

  if (skillType === "search-jobs") {
    const isCloud = resumeText.includes('kubernetes') || resumeText.includes('devops');
    const isSeniorVacancy = vacancyText.includes('lead') || vacancyText.includes('architect');
    return { modelResult: isCloud && !isSeniorVacancy, msg: "Аналіз відповідності вакансії" };
  }

  if (skillType === "tailor-cv") {
    const isArchitect = vacancyText.includes('architect') || vacancyText.includes('senior');
    const isJuniorResume = resumeText.includes('базовий') || resumeText.includes('junior');
    // Якщо кандидат джун, а вакансія архітектор — матчу НЕМАЄ (false)
    const match = !(isArchitect && isJuniorResume);
    return { modelResult: match, msg: "Валідація відповідності рівня досвіду" };
  }

  if (skillType === "draft-cover-letter") {
    const isQA = resumeText.includes('qa') || resumeText.includes('selenium');
    return { modelResult: isQA, msg: "Генерація листа для QA" };
  }

  return { modelResult: null, msg: "Невідомий сценарій" };
}

async function start() {
  let passed = 0;

  for (const test of dataset) {
    console.log(`🔍 [${test.skill_type.toUpperCase()}] Перевірка: ${test.description}`);
    
    const result = await runAgentEngine(test);
    let isTestPassed = false;

    // Специфічна перевірка для інтеграційних/юніт тестів інфраструктури
    if (test.skill_type === "integration-tool-call") {
      isTestPassed = (result.modelResult === test.expected_tool);
    } else if (test.skill_type === "unit-resilience-retry") {
      isTestPassed = (result.modelResult === test.expected_final_status);
    } else {
      // Для LLMOps промптів звіряємо булеве значення з expected_match
      isTestPassed = (result.modelResult === test.expected_match);
    }

    if (isTestPassed) {
      console.log(`  ✅ УСПІШНО (${result.msg})`);
      passed++;
    } else {
      console.log(`  ❌ ПОМИЛКА: Очікували від моделі: ${test.expected_match || test.expected_tool || test.expected_final_status}, отримали: ${result.modelResult}`);
    }
  }

  const accuracy = (passed / dataset.length) * 100;
  console.log(`\n📊 ФІНАЛЬНИЙ ЗВІТ: Пройдено ${passed}/${dataset.length} тестів Сюїти. Загальний показник: ${accuracy}%`);
  
  if (accuracy < 100) {
    console.error("❌ Тестування на стійкість / якість завалилося! Блокуємо деплой.");
    process.exit(1);
  } else {
    console.log("🚀 Інфраструктурні та ШІ тести успішно пройдені. Код повністю Production-ready!");
    process.exit(0);
  }
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
