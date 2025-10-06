# 🔄 xSphere Gaming Suite - Migration Guide

## Major Updates Summary

Această actualizare include schimbări importante pentru stabilitate, performanță și compatibilitate pe termen lung.

### 📦 Dependency Updates

| Package | Versiune Anterioară | Versiune Nouă | Beneficii |
|---------|-------------------|---------------|----------|
| `@multiversx/sdk-core` | v13.0.0 | v15.0.0 | Performance îmbunătățită, gas estimation |
| `@multiversx/sdk-dapp` | v5.0.0 | v5.4.0 | Arhitectură modulară, framework-agnostic |
| `next` | v14.0.0 | v15.0.0 | React 19 support, async APIs |
| `react` & `react-dom` | v18.0.0 | v19.0.0 | useActionState, îmbunătățiri performanță |
| `react-query` | v3.39.0 | **@tanstack/react-query v5** | API simplificat, TypeScript îmbunătățit |
| `moment` | v2.29.0 | **dayjs v1.11** | 97% mai mic (2kB vs 67kB), performanță |

---

## 🚨 Breaking Changes & Migration Steps

### 1. TanStack Query v5 Migration

#### Import Updates
```javascript
// ❌ ÎNAINTE (react-query v3)
import { useQuery, useMutation, QueryClient } from 'react-query';

// ✅ DUPĂ (@tanstack/react-query v5)
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
```

#### API Changes - Object Parameters
```javascript
// ❌ ÎNAINTE
const { data, isLoading } = useQuery(
  ['users', userId], 
  () => fetchUser(userId),
  { enabled: !!userId }
);

// ✅ DUPĂ
const { data, isLoading } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId),
  enabled: !!userId
});
```

#### keepPreviousData → placeholderData
```javascript
// ❌ ÎNAINTE
import { useQuery } from 'react-query';

const { data, isPreviousData } = useQuery(
  ['posts', page],
  () => fetchPosts(page),
  { keepPreviousData: true }
);

// ✅ DUPĂ
import { useQuery, keepPreviousData } from '@tanstack/react-query';

const { data, isPlaceholderData } = useQuery({
  queryKey: ['posts', page],
  queryFn: () => fetchPosts(page),
  placeholderData: keepPreviousData
});
```

### 2. Moment.js → Day.js Migration

#### Import și Usage Basic
```javascript
// ❌ ÎNAINTE (moment.js)
import moment from 'moment';

const now = moment();
const formatted = moment().format('YYYY-MM-DD');
const nextWeek = moment().add(1, 'week');

// ✅ DUPĂ (dayjs)
import dayjs from 'dayjs';

const now = dayjs();
const formatted = dayjs().format('YYYY-MM-DD');
const nextWeek = dayjs().add(1, 'week');
```

#### Advanced Features (necesită plugins)
```javascript
// Pentru funcții avansate, importă plugins
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// Acum poți folosi funcțiile avansate
const timeFromNow = dayjs().fromNow(); // "2 hours ago"
const utcTime = dayjs.utc();
```

### 3. Next.js 15 & React 19 Changes

#### Dynamic APIs sunt acum Async
```javascript
// ❌ ÎNAINTE (Next.js 14)
import { cookies, headers } from 'next/headers';

export default function Page({ params, searchParams }) {
  const cookieStore = cookies();
  const headersList = headers();
  // ...
}

// ✅ DUPĂ (Next.js 15)
import { cookies, headers } from 'next/headers';

export default async function Page({ params, searchParams }) {
  const cookieStore = await cookies();
  const headersList = await headers();
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  // ...
}
```

#### React 19: useFormState → useActionState
```javascript
// ❌ ÎNAINTE (React 18)
import { useFormState } from 'react-dom';

const [state, formAction] = useFormState(action, initialState);

// ✅ DUPĂ (React 19)
import { useActionState } from 'react';

const [state, formAction, isPending] = useActionState(action, initialState);
```

### 4. MultiversX SDK Updates

#### Enhanced Transaction Building
```javascript
// Noile capabilități în v15
import { 
  TransactionComputer, 
  GasLimitEstimator,
  TransactionWatcher
} from '@multiversx/sdk-core';

// Gas estimation îmbunătățit
const estimator = new GasLimitEstimator();
const gasLimit = await estimator.forTransaction(transaction);
```

---

## 🔧 Post-Migration Steps

### 1. Update Import Statements
Run this command to find și replace imports:
```bash
# Caută toate fișierele care folosesc react-query
grep -r "from 'react-query'" frontend/src/

# Caută toate fișierele care folosesc moment
grep -r "from 'moment'" frontend/src/
```

### 2. Test Critical Paths
- [ ] Wallet connection (MultiversX SDK)
- [ ] Game state management (TanStack Query)
- [ ] Time-related features (dayjs)
- [ ] Form submissions (React 19)

### 3. Performance Verification
```bash
# Verifică bundle size îmbunătățit
npm run build
npx bundle-analyzer

# Bundle size așteptat:
# moment.js (67kB) → dayjs (2kB) = -65kB
# react-query v3 → TanStack Query v5 = TypeScript îmbunătățit
```

---

## 🚀 New Features Available

### TanStack Query v5
- ✅ Simplified API cu object parameters
- ✅ Better TypeScript inference
- ✅ Improved devtools
- ✅ Better error boundaries support

### MultiversX SDK v15
- ✅ GasLimitEstimator pentru gas optimization
- ✅ Enhanced transaction watching
- ✅ Performance improvements

### React 19
- ✅ `useActionState` cu pending state built-in
- ✅ `useFormStatus` îmbunătățit
- ✅ Better concurrent features

### Next.js 15
- ✅ Async params și searchParams
- ✅ React 19 support
- ✅ Improved caching strategies

---

## 📚 Helpful Resources

- [TanStack Query v5 Migration Guide](https://tanstack.com/query/v5/docs/react/guides/migrating-to-v5)
- [Day.js Documentation](https://day.js.org/docs/en/installation/installation)
- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-15)
- [React 19 Release Notes](https://react.dev/blog/2024/04/25/react-19)
- [MultiversX SDK Documentation](https://docs.multiversx.com/sdk-and-tools/)

---

## 🆘 Common Issues & Solutions

### Issue: TypeScript errors după TanStack Query update
**Solution**: Ensure you have `@types/react` v19+ installed

### Issue: dayjs missing functionality
**Solution**: Install specific plugins:
```bash
npm install dayjs
# Then import required plugins în your code
```

### Issue: Next.js 15 async/await errors
**Solution**: Add `await` keywords pentru dynamic APIs (cookies, headers, params)

### Issue: MultiversX connection issues
**Solution**: Check wallet provider compatibility cu SDK v15

Pentru probleme specifice, creează un Issue pe GitHub cu detalii despre eroare.