# ALL IN BATTLE Landing

Лендинг для ивента по хип-хоп импровизации в Краснодаре на `Next.js` с:
- адаптивной структурой под desktop/tablet/mobile;
- блоками с основной информацией и составом гостей;
- формой регистрации;
- сохранением заявок в локальную БД (PGlite);
- подготовкой к подключению оплаты через Т-Банк.

## Локальный запуск

```powershell
# если в PowerShell блокируется npm.ps1, используй npm.cmd
& 'C:\Program Files\nodejs\npm.cmd' install
& 'C:\Program Files\nodejs\npm.cmd' run dev
```

Приложение будет доступно на [http://localhost:3000](http://localhost:3000).

## Где хранятся заявки

- Таблица `registrations` создаётся автоматически при первом POST-запросе в `/api/registrations`.
- Файлы БД сохраняются в папку `.data/` в корне проекта.

## Деплой на Vercel

1. Импортируй репозиторий в [Vercel](https://vercel.com/new).
2. Framework: `Next.js` (определится автоматически).
3. Нажми Deploy.

## Что нужно от тебя для полноценного Т-Банк подключения

1. Договор эквайринга и доступ в кабинет Т-Банк.
2. `TerminalKey`.
3. `Password` для подписи запросов.
4. URL успешной оплаты (например `/payment/success`).
5. URL неуспешной оплаты (например `/payment/fail`).
6. Публичный webhook URL на Vercel для уведомлений банка (мы дадим endpoint в проекте).
7. Режим теста или боевой (лучше начинать с тестового).

После получения этих данных мы добавим:
- создание заказа через API Т-Банк;
- редирект пользователя на оплату;
- обработчик webhook для изменения `payment_status` в БД.

## Подключение Т-Банк по шагам

1. Скопируй `.env.example` в `.env`.
2. Заполни:
   - `TINKOFF_TERMINAL_KEY`
   - `TINKOFF_PASSWORD`
   - `EVENT_PRICE_RUB` (например, `1500`)
   - `TINKOFF_SUCCESS_URL`
   - `TINKOFF_FAIL_URL`
   - `TINKOFF_NOTIFICATION_URL`
3. Убедись, что в кабинете Т-Банк для уведомлений указан URL:
   - `https://<your-domain>/api/payments/tbank/webhook`
4. Проверь локально:
   - создай заявку через форму;
   - после submit должен открыться `PaymentURL` Т-Банка.
5. После деплоя на Vercel добавь те же env переменные в `Project Settings -> Environment Variables`.
