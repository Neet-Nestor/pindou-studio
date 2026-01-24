# Onboarding Flow Design - Multi-Brand System

## 🎯 Design Goals

1. **Intuitive**: Users immediately understand what they're choosing
2. **Progressive**: One decision at a time, no overwhelm
3. **Visual**: Brand cards are clear and attractive
4. **Flexible**: Works for beginners and power users
5. **Reversible**: Users can change settings later

---

## 🎨 New Onboarding Flow (3 Steps)

### Step 1: Brand Selection (NEW)
**Goal:** Choose primary brand for displaying color codes

**UI Design:**
```
┌─────────────────────────────────────────┐
│ Progress: ███░░░░░░ (Step 1/3)          │
│                                         │
│ 选择你的拼豆品牌                          │
│ 选择你主要使用的拼豆品牌，稍后可以在      │
│ 设置中更改                               │
│                                         │
│ 国内品牌 🎖️ 推荐                         │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ [📦] Mard融合豆         [推荐] ◉ │    │
│ │      国内主流品牌，色彩丰富      │    │
│ │      2.6mm, 5mm                 │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ [📦] COCO                      ○ │    │
│ │      高性价比选择                │    │
│ │      2.6mm, 5mm                 │    │
│ └─────────────────────────────────┘    │
│                                         │
│ [... 其他 3 个国内品牌 ...]             │
│                                         │
│ ▼ 国际品牌 (展开/收起)                  │
│ [... 8 个国际品牌，默认收起 ...]        │
│                                         │
│ [上一步]              [下一步 →]        │
└─────────────────────────────────────────┘
```

**Key Features:**
- ✅ Visual brand cards with icon, name, description, sizes
- ✅ Radio button selection (single choice)
- ✅ MARD is default and recommended (badge)
- ✅ Chinese brands shown prominently
- ✅ International brands collapsible (to avoid overwhelming)
- ✅ Large clickable cards (easy on mobile)

**Why This Works:**
- **Visual hierarchy**: Chinese brands first (main audience)
- **Recommended badge**: Guides new users to best default
- **Collapsible international**: Available but not overwhelming
- **Large touch targets**: Mobile-friendly

---

### Step 2: Color Families (EXISTING, updated)
**Goal:** Choose which color series user owns

**UI Design:** (Kept mostly the same)
```
┌─────────────────────────────────────────┐
│ Progress: ██████░░░ (Step 2/3)          │
│                                         │
│ 选择颜色系列                             │
│ 选择你拥有的颜色系列，让我们为你初始化   │
│ 库存                                    │
│                                         │
│ 快速选择                                │
│ ┌─────────────────────────────────┐    │
│ │ ● 常用系列                      │    │
│ │   包含 A, B, C, D, E, F, G, H, M│    │
│ └─────────────────────────────────┘    │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ ○ 全部系列                      │    │
│ │   包含所有系列（ZG, A-M, P, Q...│    │
│ └─────────────────────────────────┘    │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ ○ 自定义选择                    │    │
│ │   手动选择您拥有的系列          │    │
│ └─────────────────────────────────┘    │
│                                         │
│ [← 上一步]            [下一步 →]        │
└─────────────────────────────────────────┘
```

**Changes from Original:**
- ✅ Now Step 2 instead of only step
- ✅ Can go back to change brand
- ✅ Same familiar interface

---

### Step 3: Confirmation (NEW)
**Goal:** Review choices and optionally enable multi-brand mode

**UI Design:**
```
┌─────────────────────────────────────────┐
│ Progress: █████████ (Step 3/3)          │
│                                         │
│ 完成设置                                │
│ 确认你的选择，马上就可以开始使用了       │
│                                         │
│ ┌───────────────────────────────────┐  │
│ │ 品牌                              │  │
│ │ Mard融合豆                        │  │
│ │                                   │  │
│ │ 颜色系列                          │  │
│ │ 9 个系列                          │  │
│ │ A, B, C, D, E, F, G, H, M         │  │
│ └───────────────────────────────────┘  │
│                                         │
│ 高级选项                                │
│ ┌───────────────────────────────────┐  │
│ │ ☐ 我使用多个品牌                  │  │
│ │   开启后可以同时管理不同品牌的    │  │
│ │   库存。大多数用户不需要此功能。  │  │
│ └───────────────────────────────────┘  │
│                                         │
│ [← 上一步]          [完成设置 ✓]        │
│                                         │
│ 设置完成后可以随时在设置页面修改        │
└─────────────────────────────────────────┘
```

**Key Features:**
- ✅ Summary of all choices
- ✅ Clear review before committing
- ✅ Optional multi-brand checkbox (for power users)
- ✅ Reassurance that settings can be changed later

**Why This Works:**
- **Transparency**: User sees exactly what they chose
- **Confidence**: Can review before finalizing
- **Progressive disclosure**: Multi-brand is optional, most users skip it
- **Safety net**: "Can change later" reduces anxiety

---

## 🎯 User Personas & Flows

### Persona 1: 新手小白 (Beginner)
**Background:** First time using perler beads, bought MARD starter kit

**Flow:**
1. Step 1: Sees MARD with "推荐" badge → Clicks it (default selected)
2. Step 2: Clicks "常用系列" (default option) → Next
3. Step 3: Sees summary → Skips multi-brand checkbox → Complete

**Time:** ~30 seconds
**Clicks:** 3
**Experience:** "That was easy! I didn't even need to think."

---

### Persona 2: 进阶玩家 (Intermediate)
**Background:** Has been crafting for a while, uses COCO brand

**Flow:**
1. Step 1: Changes from MARD to COCO → Next
2. Step 2: Clicks "全部系列" (wants all colors) → Next
3. Step 3: Reviews → Skips multi-brand → Complete

**Time:** ~45 seconds
**Clicks:** 4
**Experience:** "I easily found my brand and got all the colors I need."

---

### Persona 3: 发烧友 (Power User)
**Background:** Owns both MARD and Hama, wants to track separately

**Flow:**
1. Step 1: Selects MARD (primary) → Expands international → Sees Hama available → Next
2. Step 2: Clicks "全部系列" → Next
3. Step 3: Reviews → **Checks "我使用多个品牌"** → Complete

**Time:** ~60 seconds
**Clicks:** 6
**Experience:** "Perfect! I can manage my mixed collection."

---

### Persona 4: 国际用户 (International User)
**Background:** Lives abroad, uses Perler beads

**Flow:**
1. Step 1: Expands "国际品牌" → Selects Perler → Next
2. Step 2: Clicks "常用系列" → Next
3. Step 3: Reviews → Complete

**Time:** ~40 seconds
**Clicks:** 5
**Experience:** "Great, the app supports my local brand!"

---

## 🎨 Design Details

### Visual Design Elements

**Brand Cards:**
```tsx
┌─────────────────────────────────────────┐
│ [📦 Icon]  Brand Name         [Badge]  │
│            Description               ◉ │
│            Sizes                       │
└─────────────────────────────────────────┘
```

**States:**
- **Default**: Border: muted, Background: card
- **Hover**: Background: accent
- **Selected**: Border: primary (2px), Background: primary/5%
- **Icon**: Brand-specific color (primary for selected, muted for others)

**Progress Bar:**
```
Step 1: ███░░░░░░ (33%)
Step 2: ██████░░░ (66%)
Step 3: █████████ (100%)
```

**Navigation:**
```
[← 上一步]  (outline, left)
            [下一步 →]  (primary, right)
            [完成设置 ✓] (primary, right, final step)
```

### Mobile Optimizations

1. **Single Column**: All brand cards stack vertically
2. **Large Touch Targets**: Minimum 48px height
3. **Swipe Gestures**: Can swipe left/right to navigate steps (future)
4. **Sticky Progress**: Progress bar stays at top
5. **Bottom Nav**: Navigation buttons fixed at bottom

### Accessibility

- ✅ **Keyboard Navigation**: Tab through options, Enter to select
- ✅ **Screen Readers**: Proper ARIA labels
- ✅ **Focus States**: Clear focus indicators
- ✅ **Color Contrast**: WCAG AA compliant
- ✅ **Error States**: Clear validation messages

---

## 🧪 Validation Rules

### Step 1: Brand Selection
- ✅ Required: Must select a brand
- ✅ Default: MARD pre-selected

### Step 2: Family Selection
- ✅ Required: At least 1 family must be selected
- ✅ Default: Common families (9 series) pre-selected
- ✅ Error: "请至少选择一个系列" if none selected

### Step 3: Confirmation
- ✅ Optional: Multi-brand checkbox is optional
- ✅ Default: Unchecked (single-brand mode)

---

## 💾 Data Saved

After completing onboarding:

```typescript
// 1. User Settings
POST /api/user/settings
{
  "primaryBrand": "MARD",
  "multiBrandEnabled": false
}

// 2. Inventory Initialization
POST /api/inventory/initialize
{
  "families": ["A", "B", "C", "D", "E", "F", "G", "H", "M"]
}

// Result:
// - user_settings row created
// - User is redirected to /dashboard/inventory
// - Inventory shows colors in selected brand
```

---

## 🔄 Changing Settings Later

Users can always change their settings:

**Path:** Settings → 拼豆品牌设置

**What can be changed:**
1. ✅ Primary brand (dropdown)
2. ✅ Multi-brand mode (toggle)
3. ✅ Color families (via inventory page - hide/show)

**What happens when changed:**
- Change primary brand → All color codes re-display in new brand
- Enable multi-brand → Brand filter appears in inventory
- Disable multi-brand → Brand filter disappears, codes show in primary brand

---

## 🎯 Success Metrics

### Onboarding Completion Rate
- **Target:** >90% of users complete onboarding
- **Measure:** Users who start vs complete all 3 steps

### Time to Complete
- **Target:** <60 seconds average
- **Measure:** Time from step 1 start to final click

### Brand Distribution
- **Expected:** 70% MARD, 15% COCO, 10% others, 5% international
- **Measure:** Count of primaryBrand in user_settings

### Multi-Brand Adoption
- **Expected:** <10% of users enable multi-brand
- **Measure:** % of users with multiBrandEnabled = true

### Drop-off Points
- **Monitor:** Which step has highest abandonment
- **Target:** <5% drop-off at any step

---

## 🔮 Future Enhancements

### V2: Enhanced Onboarding
- [ ] Brand logos/images (instead of icon placeholders)
- [ ] Sample color swatches for each brand
- [ ] Video tutorial (optional)
- [ ] Skip onboarding option (for advanced users)

### V3: Smart Recommendations
- [ ] Detect user's location → Recommend local brands
- [ ] "Popular in your region" badge
- [ ] Community statistics: "80% of users choose MARD"

### V4: Gamification
- [ ] Welcome bonus (virtual stickers?)
- [ ] Setup completion badge
- [ ] Onboarding tutorial quest

---

## 📱 Responsive Breakpoints

### Mobile (<640px)
- Single column layout
- Brand cards full width
- Bottom navigation sticky
- 48px minimum touch targets

### Tablet (640px - 1024px)
- Single column layout (wider)
- Brand cards max 600px width
- Normal navigation position

### Desktop (>1024px)
- Centered card max 768px width
- Hover states more prominent
- Keyboard shortcuts visible

---

## 🎨 Component Structure

```tsx
OnboardingFormNew
├─ Step 1: Brand Selection
│  ├─ Progress Bar
│  ├─ Header (Title + Description)
│  ├─ Chinese Brands Section
│  │  └─ RadioGroup
│  │     └─ Brand Card (x5)
│  ├─ International Brands Section (Collapsible)
│  │  └─ RadioGroup
│  │     └─ Brand Card (x8)
│  └─ Navigation (Next →)
│
├─ Step 2: Family Selection
│  ├─ Progress Bar
│  ├─ Header
│  ├─ Quick Selection (3 buttons)
│  ├─ Custom Selection (Conditional)
│  │  └─ Checkbox Grid
│  └─ Navigation (← Prev | Next →)
│
└─ Step 3: Confirmation
   ├─ Progress Bar
   ├─ Header
   ├─ Summary Card
   │  ├─ Brand
   │  └─ Families
   ├─ Multi-brand Checkbox (Optional)
   └─ Navigation (← Prev | Complete ✓)
```

---

## 🎯 Key Takeaways

### What Makes This Intuitive:

1. **Visual Clarity**: Brand cards are self-explanatory
2. **Progressive Disclosure**: One decision per step
3. **Smart Defaults**: Beginners can click through easily
4. **Flexibility**: Advanced users have all the options
5. **Reversibility**: "Can change later" reduces anxiety
6. **Feedback**: Progress bar shows where you are
7. **Guidance**: Recommended badges help decision-making
8. **Mobile-First**: Works great on any device

### Design Principles Applied:

- ✅ **Don't Make Me Think** - Obvious choices
- ✅ **Progressive Enhancement** - Basic flow is simple, advanced options available
- ✅ **Fitts's Law** - Large clickable targets
- ✅ **Recognition Over Recall** - Visual brand cards vs text-only
- ✅ **Consistency** - Matches rest of app's design system
- ✅ **Feedback** - Progress bar, selected states, disabled buttons
- ✅ **Error Prevention** - Defaults and validation
- ✅ **Flexibility** - Works for all user types

---

**Status:** Ready for implementation ✅
**Next Step:** Replace old onboarding form with new multi-step version
