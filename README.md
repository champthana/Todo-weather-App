# Todo-weather-App

This is an Expo project created with `create-expo-app`.

## Get started

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npx expo start
```

### คำสั่งที่จำเป็น

```bash
npx expo start
npm test
npm test -- --runInBand --verbose
```

## 2. โครงสร้างของโปรเจกต์

```text
app/
	index.tsx         # หน้า To Do List และ weather card
	weather.tsx       # หน้าแสดง hourly และ daily weather

hooks/
	useTodos.ts       # จัดการ state และ business logic ของ Todo
	useWeather.ts     # จัดการ loading, cache, error และ reload ของ weather

services/
	weatherApi.ts     # เรียก Open-Meteo API

database/
	todos.ts          # เข้าถึง SQLite สำหรับ Todo และ weather cache

styles/
	styles.ts         # style ของหน้า To Do List
	weatherStyles.ts  # style ของหน้า Weather

utils/
	todoFilters.ts    # filter สำหรับ Todo

tests/
	todo.test.tsx     # Unit Test ของ useTodos
	weather.test.tsx  # Test ของ WeatherScreen
```

## 3. เหตุผลในการเลือกใช้เทคโนโลยี

- **Expo + React Native**: พัฒนาแอปมือถือจาก codebase เดียว และทดสอบบน Expo Go ได้รวดเร็ว
- **React hooks (`useState`, `useEffect`)**: เหมาะกับ state ของแอป to do list ที่ไม่มีความซับซ้อนมาก
- **SQLite (`expo-sqlite`)**: เก็บ Todo และ weather cache แบบ local ทำให้ข้อมูลยังอยู่หลังปิดแอป
- **Jest + jest-expo**: ทดสอบ logic และ component ใน environment ที่สอดคล้องกับ Expo

## 4. ขอบเขตงานที่ยังไม่แล้วเสร็จ

- -
