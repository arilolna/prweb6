# Практична робота № 6
## Валідація вхідних даних та обробка запитів у NestJS

**Виконала:** Гільманова Орина
**Варіант:** 5 — Онлайн-аптека
**Сутність:** `Medicine` (ресурс `/medicines`)

## Опис проєкту

REST API онлайн-аптеки на NestJS (дані зберігаються в пам'яті). До модуля `medicines` інтегровано повний Request Pipeline:

| Компонент | Файл | Призначення |
|---|---|---|
| `HttpLoggingMiddleware` | `src/common/middleware/http-logger.middleware.ts` | лог `[HTTP] METHOD URL STATUS +Nms` для кожного запиту |
| `TrimPipe` | `src/common/pipes/trim.pipe.ts` | рекурсивне обрізання пробілів у рядках |
| `ValidationPipe` | `src/main.ts` | `whitelist`, `forbidNonWhitelisted`, `transform` |
| `GlobalExceptionFilter` | `src/common/filters/http-exception.filter.ts` | уніфікований JSON помилок |
| `TimingInterceptor` | `src/common/interceptors/timing.interceptor.ts` | заголовок `X-Response-Time` + лог часу |

## Правила валідації (варіант 5)

| Поле | Декоратори |
|---|---|
| `title` | `@IsString() @IsNotEmpty() @MinLength(2) @MaxLength(100)` |
| `price` | `@IsNumber({ maxDecimalPlaces: 2 }) @IsPositive()` |
| `dosageMg` | `@IsNumber() @IsPositive()` |
| `isPrescriptionRequired` | `@IsBoolean()` |
| `expirationDate` | `@IsDateString()` |

`UpdateMedicineDto` створено через `PartialType(CreateMedicineDto)` — усі поля отримують `@IsOptional()`, правила типів зберігаються.
`QueryMedicinesDto` (`?limit=`) використовує `@Type(() => Number)` для перетворення рядка на число.

## Запуск

```bash
npm install
npm run start:dev
```

Сервер: `http://localhost:3000`. Тестові запити — у файлі `requests.http` (VS Code, розширення REST Client).

## Сценарії тестування (`requests.http`)

1. **Валідний запит** — `"title": "   Парацетамол   "` зберігається як `"Парацетамол"`; відповідь `201 Created` із заголовком `X-Response-Time`.
2. **Заборонене поле** `hackerField` → `400`, `property hackerField should not exist`.
3. **Некоректні типи** (`price: "дорого"`, `dosageMg: -250`, `isPrescriptionRequired: "yes"`, `expirationDate: "не дата"`) → `400` в уніфікованому форматі:
```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "...",
  "path": "/medicines",
  "method": "POST",
  "error": "Bad Request",
  "message": [
    "price must be a number (max 2 decimals)",
    "price must be a positive number",
    "dosageMg must be a positive number",
    "isPrescriptionRequired must be a boolean value",
    "expirationDate must be a valid ISO 8601 date string"
  ]
}
```
4. **Query-трансформація** — `GET /medicines?limit=5` → `limit` стає числом `5`; `?limit=abc` → `400`.


## Відповіді на контрольні питання

1. **Порядок конвеєра:** Middleware → Guards → Interceptors (до) → Pipes → Route Handler → Interceptors (після) → Exception Filters (при помилці на будь-якому етапі) → відповідь.
2. **`whitelist` / `forbidNonWhitelisted`:** `whitelist` видаляє з тіла поля, яких немає в DTO; `forbidNonWhitelisted` замість мовчазного видалення повертає `400`. Захищає від mass assignment (підміна службових полів на кшталт `isAdmin`) та ін'єкції зайвих даних.
3. **`transform: true`:** перетворює plain-об'єкт на екземпляр DTO-класу та приводить типи (за `@Type`/типом параметра). Без нього `@Query()` і `@Param()` залишаються рядками, бо HTTP передає їх як текст.
4. **Middleware vs Interceptor:** middleware працює до роутингу, не знає про контролер/хендлер (`ExecutionContext`), підходить для логування, CORS, парсингу. Interceptor працює навколо хендлера, має доступ до контексту та потоку відповіді (RxJS) — для кешування, трансформації відповіді, таймінгів.
5. **`PipeTransform`:** інтерфейс із методом `transform(value, metadata)`; `value` — вхідне значення, `metadata` (`ArgumentMetadata`) — `type` (`body`/`query`/`param`/`custom`), `metatype` (клас) і `data` (ім'я параметра). Повертає змінене значення або кидає виключення.
6. **`@Catch(HttpException)`:** фільтр перехоплює лише `HttpException` та нащадків. `host.switchToHttp()` дає `getRequest()` і `getResponse()` — об'єкти Express.
7. **Вкладені об'єкти:** у DTO для поля додають `@ValidateNested()` та `@Type(() => NestedDto)` з `class-transformer`; `ValidationPipe` із `transform: true` перетворює вкладене значення на клас і валідує його.
8. **`tap()`:** виконує побічну дію (логування, встановлення заголовка) над потоком відповіді, не змінюючи самі дані на відміну від `map()`.
