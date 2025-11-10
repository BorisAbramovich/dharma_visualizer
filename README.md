# 🧘 Dharma Visualizer

An interactive dashboard for visualizing Bayesian belief formation through **95% confidence interval-based squeezing**, demonstrating how beliefs, suffering, and liberation emerge from the mathematics of predictive processing.

## 🌟 Core Concept

**Squeezing = The suffering of distorting reality to fit rigid beliefs**

- **Experiences as Distributions**: Each experience has a mean (μ) and sigma (σ)
  - Low σ = High emotional charge (traumatic, certain)
  - High σ = Low emotional charge (casual, uncertain)
- **95% CI Rule**: Experiences outside the 95% confidence interval of your belief get "squeezed" to the boundary
- **Squeezing Cost**: Distance² × Tau = The work of denying reality
- **Equanimity**: Widens all distributions → wider CI → less squeezing needed
- **Tradeoff**: Pay to widen distributions now vs. pay to squeeze experiences later

## 🎯 Key Innovation

**NEW (95% CI Model):**
- Squeezing is **statistical** (outside 95% CI) not cost-based
- Emotional charge (σ) is **controllable** via slider
- Equanimity **widens distributions** (visible cost)
- Loss landscape shows **squeezing cost terrain**

**OLD (Cost-Based Model):** See `MECHANICS.md` for previous implementation

## 🚀 Quick Start

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
python3 main.py
```

Backend runs on `http://localhost:8000`

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📊 Dashboard Components

### 1. Posterior Distribution
- **Blue curve**: Your current belief (posterior)
- **Shaded region**: 95% confidence interval
- **Experience curves**: 
  - Solid = stored (squeezed) value
  - Dashed = objective (true) value
  - Arrow = amount of squeezing
- **Color coding**: Red = squeezed, Green = accepted as-is

### 2. Experience Controls
**Value Slider** (-10 to +10): The mean of the new experience
**Emotional Charge Slider** (σ: 0.1 to 3.0):
- 0.1 = Traumatic, highly certain (tau = 100)
- 1.0 = Normal experience (tau = 1)
- 3.0 = Barely registered (tau = 0.11)

**Add Experience**: Automatically checks 95% CI and squeezes if needed

### 3. Equanimity Slider
- 0-100% control of meditative awareness
- Normalizes all τ values while active
- Updates made during equanimity become permanent
- Shows three key effects: reduces τ, broadens σ, easier updates

### 4. Suffering Metrics
- **Individual Squeezing Costs**: Bar chart of cost per experience
- **Cumulative Suffering**: Line chart showing accumulated suffering over time
- **Model Update Cost**: Bar showing cost of full normalization (releasing all karmic charges)

### 5. 3D Loss Landscape
- Surface plot showing loss as function of belief and equanimity
- Current position marked with diamond marker
- Demonstrates how equanimity flattens the landscape
- Visual representation of local vs global minima

## 🧠 The Mathematics

### Precision-Weighted Posterior

```
μ_posterior = (Σ τᵢ × xᵢ + τ_prior × μ_prior) / (Σ τᵢ + τ_prior)
τ_posterior = Σ τᵢ + τ_prior
```

where `τᵢ = 1/σᵢ²` is the precision (emotional charge)

### Squeezing Cost

```
C_squeeze = |X_objective - X_stored|² × √τ_posterior
```

### Model Update Cost

```
C_update = Σ τᵢ × |reinterpretation_i|
```

### Equanimity Effect

```
τ_effective(equanimity) = τ × (1 - equanimity) + 1 × equanimity
```

At equanimity=1, all τ values become 1 (normalized)

## 🎯 Usage Example

1. **Start with empty state**
2. **Add first experience** (e.g., value = 5)
   - Creates initial belief around 5
   - Low suffering (nothing to squeeze against)
3. **Add conflicting experience** (e.g., value = -3)
   - System decides: squeeze or update?
   - If squeezed: shows arrow from objective to stored value
   - Suffering increases
4. **Increase equanimity** to 50%+
   - Watch distributions broaden
   - Loss landscape flattens
5. **Add new experience** with high equanimity
   - Integrates more smoothly
   - Less suffering
6. **Decrease equanimity** back to 0%
   - Old experiences return to rigid τ
   - New experiences remain normalized (permanent effect!)

## 🔬 Key Insights

- **Without equanimity**: New conflicting experiences cause suffering through squeezing
- **With equanimity**: Beliefs become flexible, easier to update
- **Meditation effect**: Temporary normalization with permanent integration
- **Local minimum trap**: Without equanimity, stuck in rigid beliefs
- **Liberation**: Equanimity enables escape to global minimum (less rigid, more accurate beliefs)

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, NumPy, SciPy
- **Frontend**: React, Vite, Plotly.js
- **Visualization**: 2D curves, 3D surfaces, interactive controls

## 📝 API Endpoints

- `POST /experience` - Add new experience
- `POST /equanimity` - Set equanimity level
- `GET /state` - Get complete model state
- `POST /reset` - Reset model

## 🎨 Color Scheme

- **Purple gradient**: Main posterior distribution
- **Green**: Model updates (not squeezed)
- **Red**: Squeezed experiences
- **Yellow/Orange**: Objective values (dashed), Equanimity elements
- **Dark theme**: Optimal for extended viewing

## 🔮 Future Extensions

- Multi-dimensional beliefs
- Different prior distributions
- Time-decay of emotional charge
- Comparison of different meditation practices
- Real data integration

---

Built with ❤️ to make the dharma mathematically precise and experientially vivid.
