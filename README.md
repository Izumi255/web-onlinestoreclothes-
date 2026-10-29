# Практична робота № 4: Розроблення REST-ендпоінтів засобами NestJS

## Інформація про роботу
- **Дисципліна:** Розробка веб-застосунків / Backend-розробка
- **Тема:** Розроблення REST-ендпоінтів засобами NestJS
- **Варіант:** 3
- **Предметна категорія:** Одяг та взуття
- **Базовий префікс маршруту:** `/clothes`
- **Специфічні поля DTO створення (`CreateClothesDto`):** `title`, `price`, `size`, `material`, `color`

---

## Зміст
1. [Опис виконаної роботи](#опис-виконаної-роботи)
2. [Структура проєкту](#структура-проєкту)
3. [Вимоги та встановлення](#вимоги-та-встановлення)
4. [Запуск застосунку](#запуск-застосунку)
5. [Специфікація REST API](#специфікація-rest-api)
6. [Тестування ендпоінтів та приклади відповідей](#тестування-ендпоінтів-та-приклади-відповідей)
7. [Відповіді на контрольні питання (для захисту)](#відповіді-на-контрольні-питання-для-захисту)

---

## Опис виконаної роботи 


### У межах цього рівня реалізовано:
1. **Базова архітектура NestJS (Рівень 1):**
   - Налаштовано коректну структуру проєкту з точкою входу `main.ts` та кореневим модулем `AppModule`.
   - Оголошено типізовані класи DTO:
     - `CreateClothesDto` з обов'язковими полями для 3-го варіанта (`title`, `price`, `size`, `material`, `color`).
     - `UpdateClothesDto` з опціональними полями.
   - Створено REST-контролер `ClothesController` із прив'язкою маршрутів через відповідні декоратори (`@Get`, `@Post`, `@Patch`, `@Delete`).

2. **Повний REST CRUD, HTTP-статуси та In-Memory Service (Рівень 2):**
   - Створено сервісний провайдер `ClothesService` (позначений `@Injectable()`).
   - Оголошено приватне in-memory сховище `items: Clothes[]`, попередньо заповнене 3 тестовими записами.
   - Реалізовано методи сервісу:
     - `findAll()` — повертає всі елементи сховища.
     - `findOne(id)` — знаходить елемент за ID або кидає `NotFoundException` («Сутність з ID ${id} не знайдена»).
     - `create(dto)` — генерує унікальний ID (`Date.now().toString()`), додає новий запис у масив і повертає його.
     - `update(id, dto)` — оновлює лише передані поля сутності або викидає `NotFoundException`.
     - `remove(id)` — видаляє сутність за ID або викидає `NotFoundException`.
   - **Dependency Injection (DI):** Сервіс впроваджено в контролер через параметризований конструктор (`constructor injection`), методи контролера делегують обробку сервісу.
   - **HTTP-статуси:**
     - `@Post()` повертає явний статус `201 Created` через `@HttpCode(HttpStatus.CREATED)`.
     - `@Delete(':id')` повертає статус `204 No Content` через `@HttpCode(HttpStatus.NO_CONTENT)`.
     - При помилках пошуку автоматично повертається статус `404 Not Found`.

---

## Структура проєкту

```text
online-store-clothes/
├── src/
│   ├── clothes/
│   │   ├── dto/
│   │   │   ├── create-clothes.dto.ts  # Клас DTO для створення сутності
│   │   │   └── update-clothes.dto.ts  # Клас DTO для часткового оновлення
│   │   ├── entities/
│   │   │   └── clothes.entity.ts      # Сутність Clothes (id, title, price, size, material, color)
│   │   ├── clothes.controller.ts      # Контролер з методами CRUD
│   │   ├── clothes.service.ts         # In-memory сервіс з бізнес-логікою
│   │   └── clothes.module.ts          # Ресурсний модуль
│   ├── app.module.ts                  # Кореневий модуль AppModule
│   └── main.ts                        # Вхідна точка застосунку
├── requests.http                      # Тестові HTTP-запити для VS Code REST Client
├── nest-cli.json                      # Конфігурація CLI
├── tsconfig.json                      # Налаштування TypeScript
├── tsconfig.build.json                # Конфігурація білду
├── package.json                       # Залежності та npm-команди
├── .gitignore                         # Git ignore
└── README.md                          # Звіт та документація
```

---

## Вимоги та встановлення

### Передумови
- Встановлена платформа **Node.js** версії 18+ LTS ([nodejs.org](https://nodejs.org/)).

### Встановлення пакетів
У кореневій директорії проєкту виконайте команду:
```bash
npm install
```

---

## Запуск застосунку

### Режим розробки (зі спостереженням за змінами):
```bash
npm run start:dev
```

### Стандартний запуск:
```bash
npm run start
```

Сервер слухає порт `3000`: `http://localhost:3000`.

---

## Специфікація REST API

| HTTP-метод | Маршрут | Опис | Тіло / Параметри | Статус успіху |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/clothes` | Отримання повного списку товарів | — | `200 OK` |
| **GET** | `/clothes/:id` | Отримання одного товару за ідентифікатором | `:id` (у URL) | `200 OK` (або `404 Not Found`) |
| **POST** | `/clothes` | Створення нового товару | JSON `CreateClothesDto` | `201 Created` |
| **PATCH** | `/clothes/:id` | Часткове оновлення товару | `:id` (у URL) + JSON `UpdateClothesDto` | `200 OK` (або `404 Not Found`) |
| **DELETE**| `/clothes/:id` | Видалення товару за ID | `:id` (у URL) | `204 No Content` (або `404 Not Found`) |

---

## Тестування ендпоінтів та приклади відповідей

Тестування можна виконати за допомогою файлу [`requests.http`](file:///requests.http) у VS Code з розширенням **REST Client** (або у Postman).

### 1. Лог консолі під час старту застосунку:
```text
[Nest] 14820 - 29/10/2026, 17:40:00 LOG [NestFactory] Starting Nest application...
[Nest] 14820 - 29/10/2026, 17:40:00 LOG [InstanceLoader] AppModule dependencies initialized +8ms
[Nest] 14820 - 29/10/2026, 17:40:00 LOG [RoutesResolver] ClothesController {/clothes}: +5ms
[Nest] 14820 - 29/10/2026, 17:40:00 LOG [RouterExplorer] Mapped {/clothes, GET} route +2ms
[Nest] 14820 - 29/10/2026, 17:40:00 LOG [RouterExplorer] Mapped {/clothes/:id, GET} route +1ms
[Nest] 14820 - 29/10/2026, 17:40:00 LOG [RouterExplorer] Mapped {/clothes, POST} route +1ms
[Nest] 14820 - 29/10/2026, 17:40:00 LOG [RouterExplorer] Mapped {/clothes/:id, PATCH} route +1ms
[Nest] 14820 - 29/10/2026, 17:40:00 LOG [RouterExplorer] Mapped {/clothes/:id, DELETE} route +1ms
[Nest] 14820 - 29/10/2026, 17:40:00 LOG [NestApplication] Nest application successfully started on port 3000 +2ms
```

---

### 2. Приклади виконання HTTP-запитів

#### 2.1. Отримання всіх товарів (GET /clothes)
**Запит:**
```http
GET http://localhost:3000/clothes HTTP/1.1
Accept: application/json
```
**Відповідь:**
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "id": "1",
    "title": "Худі оверсайз базове",
    "price": 1800,
    "size": "L",
    "material": "100% бавовна",
    "color": "Чорний"
  },
  {
    "id": "2",
    "title": "Джинси прямі Regular Fit",
    "price": 2400,
    "size": "32/32",
    "material": "Денім",
    "color": "Синій класичний"
  },
  {
    "id": "3",
    "title": "Кросівки бігові Ultralight",
    "price": 3200,
    "size": "42",
    "material": "Дихаюча сітка, текстиль",
    "color": "Білий"
  }
]
```

#### 2.2. Створення нового товару (POST /clothes)
**Запит:**
```http
POST http://localhost:3000/clothes HTTP/1.1
Content-Type: application/json

{
  "title": "Куртка вітрозахисна Softshell",
  "price": 3800,
  "size": "XL",
  "material": "Поліестер, мембрана 10000",
  "color": "Хакі"
}
```
**Відповідь:**
```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "id": "1730214950123",
  "title": "Куртка вітрозахисна Softshell",
  "price": 3800,
  "size": "XL",
  "material": "Поліестер, мембрана 10000",
  "color": "Хакі"
}
```

#### 2.3. Отримання сутності за ID (GET /clothes/1)
**Запит:**
```http
GET http://localhost:3000/clothes/1 HTTP/1.1
```
**Відповідь:**
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "id": "1",
  "title": "Худі оверсайз базове",
  "price": 1800,
  "size": "L",
  "material": "100% бавовна",
  "color": "Чорний"
}
```

#### 2.4. Часткове оновлення (PATCH /clothes/1)
**Запит:**
```http
PATCH http://localhost:3000/clothes/1 HTTP/1.1
Content-Type: application/json

{
  "price": 1650,
  "color": "Графітовий"
}
```
**Відповідь:**
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "id": "1",
  "title": "Худі оверсайз базове",
  "price": 1650,
  "size": "L",
  "material": "100% бавовна",
  "color": "Графітовий"
}
```

#### 2.5. Видалення запису (DELETE /clothes/1)
**Запит:**
```http
DELETE http://localhost:3000/clothes/1 HTTP/1.1
```
**Відповідь:**
```http
HTTP/1.1 204 No Content
```

#### 2.6. Перевірка обробки 404 Not Found (GET /clothes/99999)
**Запит:**
```http
GET http://localhost:3000/clothes/99999 HTTP/1.1
```
**Відповідь:**
```http
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8

{
  "message": "Сутність з ID 99999 не знайдена",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## Відповіді на контрольні питання (для захисту)

### 1. Що таке інверсія керування (Inversion of Control) та як принцип Dependency Injection реалізований у NestJS?
- **Inversion of Control (IoC)** — це архітектурний принцип, згідно з яким керування створенням об'єктів та життєвим циклом компонентів передається від коду розробника до спеціального фреймворку (IoC-контейнера). Замість того, щоб контролер власноруч створював екземпляр сервісу через `new ClothesService()`, він отримує вже готовий екземпляр.
- **Dependency Injection (DI)** — це патерн проектування, який реалізує принцип IoC. У NestJS:
  - Сервіси помічаються декоратором `@Injectable()`.
  - У контролері залежність оголошується в параметрах конструктора:
    ```typescript
    constructor(private readonly clothesService: ClothesService) {}
    ```
  - Контейнер NestJS автоматично створює екземпляр сервісу (за замовчуванням singleton) та передає його в контролер під час запуску додатку.

---

### 2. Яка різниця між модулем (@Module), контролером (@Controller) та провайдером (@Injectable)?
- **`@Module` (Модуль):** Організаційна одиниця, що групує функціонал у самостійні блоки. Вказує, які контролери та провайдери належать до даного модуля (`controllers`, `providers`), а також що імпортується чи експортується.
- **`@Controller` (Контролер):** Шар прийому та маршрутизації вхідних HTTP-запитів. Він витягує параметри із запиту, викликає методи сервісу та повертає результат клієнту. Не повинен містити бізнес-логіки.
- **`@Injectable` (Провайдер / Сервіс):** Шар збереження даних та виконання бізнес-логіки. Обробляє дані, працює зі сховищем або базою даних та повертає результат контролеру.

---

### 3. Чому для створення DTO у NestJS використовуються класи TypeScript, а не інтерфейси (interfaces)?
- **Інтерфейси (`interface`)** існують виключно на етапі компіляції TypeScript і повністю стираються під час компіляції в чистий JavaScript (type erasure). У рантаймі (під час виконання програми) інформації про інтерфейси не залишається.
- **Класи (`class`)** є реальними сутностями JavaScript, вони зберігаються в пам'яті під час виконання. Це дозволяє NestJS читати метадані властивостей класу в runtime, що необхідно для роботи валідаторів (`ValidationPipe`, `class-validator`) та генерації OpenAPI/Swagger документації.

---

### 4. Які декоратори надає NestJS для витягування параметрів запиту (route params, query params, body payload)? Наведіть приклади їх застосування.
- `@Param(paramName?: string)` — отримання динамічних параметрів шляху:
  ```typescript
  @Get(':id')
  findOne(@Param('id') id: string) { ... }
  ```
- `@Query(queryParam?: string)` — отримання параметрів рядка запиту (query params):
  ```typescript
  @Get()
  findAll(@Query('limit') limit?: string) { ... }
  ```
- `@Body(propName?: string)` — отримання тіла HTTP-запиту:
  ```typescript
  @Post()
  create(@Body() dto: CreateClothesDto) { ... }
  ```
- `@Headers(headerName?: string)` — зчитування HTTP-заголовків запиту.

---

### 5. Який HTTP-статус за замовчуванням повертає метод контролера NestJS для операцій GET, POST та DELETE? Як змінити статус відповіді за допомогою декоратора @HttpCode()?
- **За замовчуванням:**
  - `GET` повертає **200 OK**.
  - `POST` повертає **201 Created**.
  - `DELETE`, `PUT`, `PATCH` повертають **200 OK**.
- Щоб змінити стандартний статус, використовується декоратор `@HttpCode(HttpStatus.*)` над методом:
  ```typescript
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Змінює код з 200 на 204 No Content
  remove(@Param('id') id: string) { ... }
  ```

---

### 6. Як працює вбудована система обробки виключень NestJS? Що повертає фреймворк клієнту при виклику throw new NotFoundException()?
- NestJS має вбудований шар глобальних фільтрів виключень (**Exceptions Layer**). Коли сервіс або контролер генерує виключення типу `HttpException`, NestJS автоматично перехоплює його, визначає HTTP-код та формує коректну JSON-відповідь.
- При виклику:
  ```typescript
  throw new NotFoundException('Сутність з ID 99999 не знайдена');
  ```
  NestJS повертає HTTP-статус **404 Not Found** і JSON-тіло:
  ```json
  {
    "message": "Сутність з ID 99999 не знайдена",
    "error": "Not Found",
    "statusCode": 404
  }
  ```

---

### 7. Як за допомогою декоратора @Header() додати кастомний HTTP-заголовок до відповіді сервера?
- Декоратор `@Header('Назва-Заголовка', 'Значення')` розміщується над методом контролера:
  ```typescript
  @Get()
  @Header('X-API-Version', '1.0')
  findAll() { ... }
  ```
  Сервер автоматично додасть цей заголовок у HTTP-відповідь клієнту.

---

### 8. У чому полягає відмінність між HTTP-методами PUT та PATCH під час проєктування RESTful API?
- **`PUT` (Повна заміна / Idempotent replace):**
  - Клієнт зобов'язаний передати об'єкт **повністю** (всі обов'язкові поля).
  - Ресурс повністю перезаписується надісланим станом. Якщо якесь поле не передане, воно стирається або занулюється.
- **`PATCH` (Часткове оновлення / Partial update):**
  - Клієнт передає **тільки ті поля**, які необхідно змінити (наприклад, лише `{ price: 1650 }`).
  - Усі інші властивості сутності залишаються незмінними.
