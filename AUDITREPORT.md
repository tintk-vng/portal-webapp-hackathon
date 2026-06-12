# 🔍 Codebase Audit Report

**Project:** utilities-portal-webapp (portal-webapp)  
**Version:** 3.7.0  
**Date:** December 29, 2025  
**Framework:** Next.js 14.2.35 with React 18.2.0

---

## 📊 Executive Summary

| Category | Status | Details |
|----------|--------|---------|
| **Security** | ⚠️ Medium | 2 `dangerouslySetInnerHTML` usages, dependency updates needed |
| **Code Quality** | ⚠️ Medium | 42 ESLint disables, 97 console statements, 216 `any` types |
| **Testing** | 🔴 Low | Only 1 test file found |
| **Documentation** | ✅ Good | README with folder structure documented |
| **Architecture** | ✅ Good | Well-organized domain-based structure |

---

## 🔐 Security Analysis

### Critical Issues

#### 1. `dangerouslySetInnerHTML` Usage (2 instances)
| File | Line | Risk |
|------|------|------|
| `app/(static)/faq/page.tsx` | 131 | Renders `question.htmlDescription` |
| `app/telco/components/payment-guide/index.tsx` | 16 | Renders `description` |

**Recommendation:** Ensure all HTML content is sanitized before rendering. Consider using DOMPurify (already in devDependencies types).

#### 2. Hardcoded Localhost URL
```javascript
// next.config.js:48
destination: 'localhost:8080/:path*' // Proxy to Backend
```
**Recommendation:** Use environment variables for all URLs.

#### 3. No `@ts-ignore` or `@ts-nocheck` Found ✅
Good practice - no TypeScript safety bypasses detected.

### Dependency Security

| Package | Current | Latest Stable | Notes |
|---------|---------|---------------|-------|
| next | 14.2.35 | 14.2.35 | ✅ Upgraded to latest 14.x |
| react | 18.2.0 | 18.3.x | Minor update available |
| @types/react | 18.3.12 | 18.3.12 | ✅ Updated for Next.js 14 compatibility |
| @types/react-dom | 18.3.1 | 18.3.1 | ✅ Updated for Next.js 14 compatibility |
| axios | 1.4.0 | 1.6.x | Security patches available |
| eslint | 8.40.0 | 8.56.x | Updates available |
| @svgr/webpack | 8.1.0 | 8.1.0 | ✅ Added for SVG component support |

**Recommendation:** Run `npm audit fix` and consider updating remaining dependencies.

---

## 🧹 Code Quality Issues

### 1. ESLint Disables (42 instances)
All 42 instances are `eslint-disable-next-line react-hooks/exhaustive-deps`

**Top Affected Files:**
- `app/telco/combo/components/packages/index.tsx` - 3 instances
- `components/common/toast/index.tsx` - 3 instances
- `app/game/components/source-of-funds/index.tsx` - 2 instances

**Recommendation:** Review useEffect dependencies and fix the root cause instead of disabling the rule.

### 2. Console Statements (97 instances across 74 files)

**Most Affected Areas:**
- `models/` - Multiple console.log in data models
- `app/bill/` - Console statements in page components
- `app/telco/` - Console statements in components

**Recommendation:** Remove console statements or use a proper logging library with environment-based filtering.

### 3. TypeScript `any` Usage (216 instances across 122 files)

**Critical Files:**
- `store/bill.ts` - 15 instances
- `models/bill/education.ts` - 9 instances
- `models/bill/consumer-finance.ts` - 6 instances
- `models/common/index.ts` - 6 instances

**Recommendation:** Replace `any` with proper types for better type safety.

### 4. TODO Comments (3 instances)
```typescript
// app/bill/internet/customer-input/page.tsx:217
{/* TODO: Why 2? */}

// app/bill/internet/customer-input/page.tsx:225
{/* TODO: Why 2? */}

// app/bill/television/components/supplier-select/index.tsx:44
// TODO: why 3?
```
**Recommendation:** Address these TODOs or document the reasoning.

---

## 🧪 Testing Coverage

### Current State
- **Test Files:** 1 (`__tests__/index.test.tsx`)
- **Test Framework:** Jest 27.5.1 with React Testing Library
- **Coverage:** Only homepage render test

```typescript
// Current test
describe('Homes', () => {
  it('renders a heading', () => {
    render(<Home />)
    const heading = screen.getByRole('main')
    expect(heading).toBeInTheDocument()
  })
})
```

### Recommendations
1. Add unit tests for utility functions (`utils/`)
2. Add component tests for shared components (`components/`)
3. Add integration tests for API clients (`api-client/`)
4. Target minimum 60% code coverage

---

## ⚙️ Configuration Analysis

### TypeScript Configuration ✅
- `strict: true` enabled
- `forceConsistentCasingInFileNames: true` enabled
- Path aliases configured (`@/*`)

### Next.js Configuration
- **Version:** 14.2.35 ✅ (upgraded from 13.5.6)
- `reactStrictMode: false` ⚠️ Consider enabling for development
- Image optimization configured using `remotePatterns` (Next.js 14 format) ✅
- SVG imports configured with `@svgr/webpack` for React component support ✅
- TypeScript `moduleResolution: "bundler"` configured for Next.js 14 ✅
- Extensive URL rewrites for Vietnamese-friendly URLs

### ESLint Configuration
- Extends `next/core-web-vitals` ✅
- Consider adding stricter rules

---

## 🏗️ Architecture Review

### Strengths ✅
1. **Domain-Driven Structure:** Clear separation between bill, telco, game domains
2. **Shared Components:** Reusable UI components in `components/`
3. **Custom Hooks:** Well-organized hooks for common functionality
4. **API Client Layer:** Centralized API handling with Axios interceptors
5. **State Management:** Using Zustand for global state
6. **Form Handling:** React Hook Form integration
7. **Data Fetching:** SWR for caching and revalidation

### Areas for Improvement ⚠️

#### 1. Inconsistent Private Folder Convention
The `bill/` domain still uses `components/` while `telco/` and `game/` have migrated to `_components/`.

**Recommendation:** Rename `app/bill/components/` to `app/bill/_components/` for consistency.

#### 2. Client Components Overuse
128 files with `'use client'` directive. Consider:
- Moving data fetching to Server Components
- Using React Server Components for static content

#### 3. Error Handling
Basic error handling in API client:
```typescript
// Only logs timeout errors
if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
  console.log('Request timed out')
}
```
**Recommendation:** Implement comprehensive error handling with user-friendly messages.

#### 4. Duplicate Patterns
Similar component structures across domains (e.g., `supplier-select`, `captcha-input`). Consider creating more generic components.

---

## 📈 Performance Considerations

### Bundle Size
- Bundle analyzer available (`npm run analyze`)
- Swiper library included (consider lazy loading)

### Image Optimization
- Using Next.js Image component with external domains configured
- AVIF and WebP formats enabled

### Caching
- SWR configured for API caching
- Consider implementing more aggressive caching strategies

---

## 🎯 Recommended Actions

### High Priority
1. [ ] Sanitize HTML content before using `dangerouslySetInnerHTML`
2. [ ] Update dependencies with security patches (`npm audit fix`)
3. [ ] Remove or properly handle console.log statements
4. [ ] Enable `reactStrictMode` in development

### Medium Priority
5. [ ] Replace `any` types with proper TypeScript types
6. [ ] Fix useEffect dependencies instead of disabling ESLint rules
7. [ ] Add comprehensive test coverage (target 60%+)
8. [ ] Implement proper error handling and logging

### Low Priority
9. [ ] Address TODO comments in code
10. [ ] Consider migrating more components to Server Components
11. [x] Update Next.js to version 14 for improved performance ✅ **Completed**
12. [ ] Document API endpoints and data models
13. [ ] Rename `app/bill/components/` to `app/bill/_components/` for consistency

---

## 📝 Notes

- Lint command fails due to Node.js version compatibility issues
- Coverage reports exist in `/coverage` directory
- Docker configuration available for deployment
- Multiple environment configurations (dev, stg, prod, mc, qc)

---

## 🔄 Recent Updates

### December 29, 2025 - Folder Structure Refactoring
- ✅ Migrated `app/game/components/` to `app/game/_components/` (private folder)
- ✅ Migrated `app/game/hooks/` to `app/game/_hooks/` (private folder)
- ✅ Migrated `app/telco/components/` to `app/telco/_components/` (private folder)
- ✅ Added `_components/` and `_hooks/` folders to telco sub-domains (topup, phone-card, etc.)
- ✅ Implemented `(main)/` route groups for main UI wrappers
- ✅ Updated documentation (README.md, AUDITREPORT.md)

**Convention Notes:**
- `_folder/` → Private folders excluded from routing (for components, hooks, utils)
- `(folder)/` → Route groups for organizing without affecting URL
- `[folder]/` → Dynamic segments for URL params

### December 2025 - Next.js 14 Upgrade
- ✅ Upgraded Next.js from 13.5.6 to 14.2.35
- ✅ Updated `eslint-config-next` to 14.2.35
- ✅ Updated React types (`@types/react` to 18.3.12, `@types/react-dom` to 18.3.1)
- ✅ Migrated `next.config.js` image configuration from deprecated `domains` to `remotePatterns`
- ✅ Updated TypeScript `moduleResolution` to `"bundler"` for Next.js 14 compatibility
- ✅ Added `@svgr/webpack` for SVG file imports as React components
- ✅ Fixed SVG import paths in Tailwind CSS classes (removed `~public` prefix)

**Migration Notes:**
- SVG files can now be imported as React components: `import Icon from '@/public/images/icons/icon.svg'`
- SVG files in `public` folder should be referenced in CSS/Tailwind as `/images/...` (not `~public/images/...`)
- Image configuration now uses `remotePatterns` format as required by Next.js 14

---

*Report generated by automated code analysis*

