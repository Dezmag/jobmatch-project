const fs = require('fs');
const path = require('path');

// 1. Вхідні інструментальні дані з Кроку 7
const USERS = 5000;
const INTERACTIONS_PER_USER = 20;
const INPUT_TOKENS_PER_REQ = 3000;
const OUTPUT_TOKENS_PER_REQ = 800;

// Сумарні об'єми токенів (в мільйонах)
const TOTAL_INPUT_M = (USERS * INTERACTIONS_PER_USER * INPUT_TOKENS_PER_REQ) / 1000000; // 300M
const TOTAL_OUTPUT_M = (USERS * INTERACTIONS_PER_USER * OUTPUT_TOKENS_PER_REQ) / 1000000; // 80M

// 2. Довідник тарифів моделей з Кроку 6 (Ціна за 1M токенів: input / output)
const models = {
  "Claude Sonnet 4.6": { inputPrice: 3.00, outputPrice: 15.00, type: "Premium" },
  "GPT-5.4":           { inputPrice: 2.50, outputPrice: 15.00, type: "Premium" },
  "Gemini 3.1 Pro":    { inputPrice: 2.00, outputPrice: 12.00, type: "Standard" },
  "Claude Haiku 4.5":  { inputPrice: 1.00, outputPrice: 5.00,  type: "Standard" },
  "Gemini 3 Flash":    { inputPrice: 0.50, outputPrice: 3.00,  type: "Economy" },
  "Gemini 3 Flash-Lite": { inputPrice: 0.175, outputPrice: 0.25, type: "Economy" }
};

console.log("🧮 [FinOps Engine] Запуск інтегрованого аналізу Провайдерів (Крок 6) та Юніт-Економіки (Крок 7)...");

let reportMarkdown = `# 📈 Архітектурний та FinOps звіт (Генерація інструментом finops-calc.js)

Для забезпечення відмовостійкості, економії бюджету та уникнення Vendor Lock-in, інфраструктура проєкту побудована за принципом **Multi-Provider Routing**. ` + "`AgentGateway`" + ` дозволяє динамічно перемикати моделі без зміни коду бекенду.

## 💰 Крок 6. Порівняльний аналіз сітки тарифів ШІ-провайдерів (за 1M токенів)
Ця таблиця згенерована автоматично на основі актуальних даних провайдерів:

| Модель | Клас моделі | Ціна Input / 1M | Ціна Output / 1M |
| :--- | :--- | :--- | :--- |\n`;

// Автоматично заповнюємо аналіз Кроку 6
Object.keys(models).forEach(name => {
  const m = models[name];
  reportMarkdown += `| **${name}** | ${m.type} | \$${m.inputPrice.toFixed(3)} | \$${m.outputPrice.toFixed(3)} |\n`;
});

reportMarkdown += `
## 📊 Крок 7. Робочий розрахунок навантаження та метрики CPAU
- **Прогноз навантаження**: ${USERS.toLocaleString()} активних користувачів/міс (~20 взаємодій кожен).
- **Об'єм трафіку**: ~3K input та ~800 output токенів за сесію.
- **Сумарний місячний об'єм**: **${TOTAL_INPUT_M}M input** та **${TOTAL_OUTPUT_M}M output** токенів.

| Модель провайдера | Вартість Input | Вартість Output | Загальна вартість / міс | CPAU (Cost per Active User) |
| :--- | :--- | :--- | :--- | :--- |\n`;

// Розраховуємо економіку Кроку 7 та шукаємо найдорожчу/найдешевшу для порівняння
let maxCost = 0;
let minCost = Infinity;

Object.keys(models).forEach(modelName => {
  const t = models[modelName];
  const inputCost = TOTAL_INPUT_M * t.inputPrice;
  const outputCost = TOTAL_OUTPUT_M * t.outputPrice;
  const totalCost = inputCost + outputCost;
  const cpau = totalCost / USERS;

  if (totalCost > maxCost) maxCost = totalCost;
  if (totalCost < minCost) minCost = totalCost;

  reportMarkdown += `| **${modelName}** | \$${inputCost.toFixed(2)} | \$${outputCost.toFixed(2)} | **\$${totalCost.toFixed(2)}** | **\$${cpau.toFixed(4)}** |\n`;
});

const savingDelta = maxCost - minCost;
const economyFactor = (maxCost / minCost).toFixed(1);

reportMarkdown += `
## 🎯 3. Стратегія маршрутизації (Tiered Routing) за результатами аналізу
Розрахунок інструменту показує, що максимальна вартість утримання складає **\$${maxCost.toFixed(2)}/міс**, а мінімальна — **\$${minCost.toFixed(2)}/міс**. 
Різниця (чиста економія) складає **\$${savingDelta.toFixed(2)} на місяць** (оптимізація бюджету в **${economyFactor} рази**).

### 🏗️ Затверджена схема інфраструктурного шлюзу:
1. **Tier 1 (Економ/Швидкість)**: Первинна обробка, пошук вакансій та маскування PII виконуються на **Gemini 3 Flash-Lite / Flash**.
2. **Tier 2 (Якість/Логіка)**: Складна адаптація резюме (Tailor-CV) та фінальний драфт супровідного листа маршрутизуються на **Claude Haiku 4.5** або **GPT-5.4**.
3. **Tier 3 (Валідація/Суддя)**: Запуск нашої автоматичної системи оцінки якості (Eval-suite / LLM-as-a-Judge) виконується на **Gemini 3.1 Pro**.
`;

// Записуємо фінальний інтегрований звіт
const outputPath = path.join(__dirname, '../AI_PROVIDERS.md');
fs.writeFileSync(outputPath, reportMarkdown, 'utf8');

console.log("✅ [FinOps Engine] Інтегрований звіт для Кроків 6 та 7 успішно згенеровано у файл AI_PROVIDERS.md!");
