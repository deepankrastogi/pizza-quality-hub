

# Domino's Pizza Quality Control & ML Training Dashboard

A comprehensive web platform for training ML models, scoring pizza quality, and annotating defects with role-based access for Domino's teams.

---

## 🎨 Design & Branding

**Domino's branded theme** with the official color palette:
- Primary red (#E31837)
- Navy blue (#006491)
- Clean white backgrounds
- Bold, modern typography matching Domino's brand identity

---

## 🔐 Authentication & Access Control

### Microsoft Azure AD Single Sign-On
- Secure enterprise login via Microsoft Azure AD
- Automatic user provisioning on first login

### Role-Based Permissions
| Role | Classify | Score & Annotate | View Analytics | Manage Users |
|------|----------|------------------|----------------|--------------|
| **Chefs** | ✅ | ✅ | ❌ | ❌ |
| **Engineers** | ✅ | ✅ | ✅ | ✅ |
| **Stakeholders** | ❌ | ❌ | ✅ (view only) | ❌ |

---

## 📊 Main Dashboard

After login, users see a personalized dashboard with:
- Quick stats (images classified today, pending reviews, average scores)
- Recent activity feed
- Quick access cards to each workflow
- Role-appropriate navigation

---

## 🏷️ Flow 1: Manual Classification Training

**Purpose:** Train the model by classifying untagged images as Pizza or Side

- Image queue showing unclassified items
- Large image preview with zoom capability
- Simple two-button classification: **Pizza** or **Side**
- Skip button for unclear images
- Progress tracker showing completion stats
- Keyboard shortcuts for fast classification (P for Pizza, S for Side)

---

## 🔄 Flow 2: Re-Classification Review

**Purpose:** Correct model predictions when they're wrong

- Display images with model's prediction and confidence score
- Show model's guess prominently with "Confirm" or "Correct" options
- Filter by confidence level (review low-confidence first)
- Bulk actions for efficient review
- History of corrections for audit trail

---

## ⭐ Flow 3: Pizza Quality Scoring

**Purpose:** Score pizzas on 6 parameters to generate overall quality score

### 6 Scoring Parameters (0-100 each):
1. **Topping Spread** - Distribution evenness of toppings
2. **Cheese Spread** - Coverage and distribution of cheese
3. **Burn Score** - Level of desired browning (higher = better)
4. **Undercooked Score** - Degree of proper cooking (higher = better cooked)
5. **Bubble Count** - Number of crust bubbles
6. **Bubble Size** - Consistency of bubble sizes

### Scoring Interface:
- Large image display with zoom/pan
- Six slider controls with numeric input
- Real-time overall score calculation (weighted average)
- Visual score indicator (green/yellow/red zones)

### Defect Annotation Toolkit:
- **Bounding Box** - Draw rectangles around defect areas
- **Polygon/Freehand** - Trace irregular defect shapes
- **Point Markers** - Pin specific defect locations
- Label each annotation with defect type
- Color-coded by defect category
- Undo/redo functionality

---

## 📁 Flow 4: Browse & Manage

**Purpose:** Search, view, and update existing scored items

- Grid/list view toggle for browsing
- Advanced filters:
  - Date range
  - Score range
  - Pizza type
  - Defect types
  - Classification status
- Sort by score, date, or status
- Click to view detailed scorecard
- Edit scores and annotations
- Export functionality for reports

---

## 📈 Analytics Dashboards

### Quality Trends Dashboard
- Overall score trends over time
- Parameter-specific trend lines
- Top defect types breakdown
- Store/location comparison (if applicable)
- Score distribution histograms

### Training Metrics Dashboard
- Classification accuracy over time
- Model confidence distribution
- Human correction rate
- Images processed per day/week
- User contribution leaderboard

---

## 🔌 API Integration

### Image Ingestion API
- RESTful endpoints for external systems to push images
- Support for batch uploads
- Metadata attachment (store ID, timestamp, pizza type)
- Webhook notifications for processing completion

---

## 📱 Responsive Design

- Desktop-optimized for detailed annotation work
- Tablet-friendly for on-the-go scoring
- Mobile view for quick status checks and approvals

---

## Backend Requirements

This platform will require **Supabase** for:
- User authentication (Azure AD integration)
- Role management with secure RLS policies
- Image metadata and scores storage
- Analytics data aggregation
- API endpoints for external integration
- Real-time updates across users

Image files will be stored in Supabase Storage with CDN delivery.

