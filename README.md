# 🧘 Dharma Visualizer

An interactive dashboard demonstrating how **cognitive rigidity** and **suffering** emerge from Bayesian belief formation when experiences are censored to fit existing beliefs—and how **meditation** provides liberation by reducing certainty of the "meaning (predictive value) of past beliefs".

## 🌟 Core Concept

**The Model of Suffering:**
1. **Experiences arrive** with objective values (reality)
2. **95% CI Test**: If experience falls outside your belief's 95% confidence interval, it gets **squeezed** to the boundary
3. **Precision Accumulates**: Each experience (even squeezed ones) increases certainty (tau), narrowing the CI
4. **Trap Forms**: Narrower CI → more squeezing → even narrower CI → **self-reinforcing rigidity**
5. **Meditation Breaks Free**: Reduces precision (this is the mathematical term for the inverse of the standart deviation, so: higher precision → more narrow curve) of past experiences, widening CI to accommodate reality

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+

### Start bash script (recommended)
Just run
```bash
./start.sh
```

This will start both backend and frontend servers.
You can then open your browser to `http://localhost:5173` to access the dashboard.

### Manual
#### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
python3 main.py
```

Backend runs on `http://localhost:8000`

#### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

Open browser to `http://localhost:5173` and start adding experiences!

## 📊 Dashboard Components

### 1. Posterior Distribution (Top Plot)
- **Blue curve**: Your current belief P(μ|data)
- **Shaded region**: 95% confidence interval (the "acceptance window")
- **Experience distributions**:
  - **Solid curve**: Stored (squeezed) value used in belief
  - **Dashed curve**: Objective (true) value from reality
  - **Arrow**: Amount of squeezing (suffering)
- **Color coding**: 
  - Green = Accepted as-is (within CI)
  - Red = Squeezed (outside CI, censored)
  - Yellow = Being meditated on

### 2. Add Experience Controls
- **Value Slider** (-10 to +10): The objective mean of new experience
- **Sigma Slider** (0.1 to 3.0): Uncertainty of the observation
  - Low σ (0.1) = High precision, strong belief about this value
  - High σ (3.0) = Low precision, uncertain observation
- **Add Experience Button**: Adds experience and automatically squeezes if outside 95% CI

### 3. Meditation Controls
- **Select Experience**: Click experience in list to meditate on it
- **Meditation Level Slider**: How much to reduce precision (0-100%)
- **Meditate Button**: Apply meditation to selected experience
- **Effect**: Reduces tau → widens distributions → may unsqueeze if CI now covers objective value

### 4. Brahma Viharas (Cultivation Level)
- **Single counter** (0-100%) tracking your meditation skill
- Increases with each manual meditation session
- Higher cultivation = stronger meditation effects
- Represents long-term practice benefits

### 5. Suffering Metrics
- **Total Squeezing Cost**: Accumulated suffering from all censored experiences
- **Squeezing Cost per Experience**: Bar chart showing which experiences cause most suffering
- **Precision Over Time**: Line chart showing how tau accumulates (rigidity increasing)
- **Current CI Width**: How narrow/wide your acceptance window is

### 6. Time-Based Meditation (Automatic)
- **Passive meditation**: Recent experiences automatically get mild meditation
- **Decay**: Meditation naturally fades after ~5 seconds
- **Manual override**: Click "Meditate" button for stronger, cultivation-building meditation

## 🧠 The Mathematics

### Gaussian-Gaussian Bayesian Inference

We model beliefs and experiences as **Gaussian distributions**:

**Prior (initial belief):**
```
P(μ) = N(0, 10²)    # Very weak prior: σ₀=10, τ₀=0.01
```

**Likelihood (each experience):**
```
P(xᵢ | μ) = N(xᵢ; μ, σᵢ²)    # Experience has mean xᵢ, variance σᵢ²
```

**Posterior (updated belief) via Bayes' theorem:**
```
P(μ | x₁,...,xₙ) = N(μₙ, σₙ²)
```

### Precision-Weighted Update (Conjugate Prior)

**Why Gaussian-Gaussian?** It's a conjugate prior—posterior has same form as prior, giving closed-form updates:

**Precision accumulation:**
```
τₙ = τ₀ + Σᵢ τᵢ        # where τ = 1/σ²
```

**Precision-weighted mean:**
```
μₙ = (τ₀μ₀ + Σᵢ τᵢxᵢ) / τₙ
```

**Posterior standard deviation:**
```
σₙ = 1/√τₙ            # Higher precision → lower uncertainty
```

**This IS Bayes' theorem!** For Gaussians:
```
P(μ|data) = P(data|μ) × P(μ) / P(data)
```
simplifies to these precision-weighted formulas.

### The 95% Confidence Interval Rule

**Acceptance window:**
```
CI = [μₙ - 1.96σₙ, μₙ + 1.96σₙ]
```

**Squeezing rule:**
```
if x_objective < CI_lower:
    x_stored = CI_lower
elif x_objective > CI_upper:
    x_stored = CI_upper
else:
    x_stored = x_objective    # No squeezing
```

**What this means**: We **modify the likelihood** in Bayes' theorem:
```
Normal:   P(μ | x_true) ∝ P(x_true | μ) × P(μ)
Squeezed: P(μ | x_squeezed) ∝ P(x_squeezed | μ) × P(μ)
```
We're using fake data in the likelihood, creating a self-fulfilling belief.

### Squeezing Cost (Suffering)

```
C_squeeze = (x_objective - x_stored)² × √τ_posterior
```

**Interpretation:**
- Large shift (|x_objective - x_stored|) = major reality distortion
- High precision (τ) = rigid belief → harder to update → more suffering
- Cost grows quadratically with distortion distance

### Meditation Effect (Precision Reduction)

**Without meditation:**
```
τ_effective = τ_base
```

**With meditation at level m ∈ [0,1]:**
```
τ_effective = τ_base × r(m)
```

where `r(m)` is calculated so that at m=1:
```
CI₉₅% ⊇ {all objective means}
```

**Effect on posterior:**
```
τₙ(m) = τ₀ + Σᵢ τᵢ × r(m)    # Reduced precision sum
σₙ(m) = 1/√τₙ(m)              # Wider uncertainty
```

**Result**: CI widens → previously squeezed experiences may now fit → unsqueezing!

### The Feedback Loop (Why It Traps)

1. **Initial experiences** form posterior with some tau
2. **Outlier arrives** outside CI → gets squeezed
3. **Tau increases** (standard Bayesian accumulation)
4. **CI narrows** (σ = 1/√τ decreases)
5. **Next outlier** must also squeeze
6. **Loop repeats** → accelerating rigidity

**Mathematical progression:**
```
Squeeze → τ↑ → σ↓ → CI shrinks → More squeezing → τ↑↑ → ...
```

## 🎯 Try This Journey

### 1. **Empty Mind** (Start)
- Reset model
- Observe: Wide prior (σ=10), almost no beliefs

### 2. **First Experiences** (Formation)
- Add experience at value = 0
- Add experience at value = 1
- Add experience at value = -1
- Observe: Posterior forms around mean ≈ 0, CI narrows slightly
- All experiences GREEN (accepted)

### 3. **Cognitive Dissonance** (First Squeeze)
- Add experience at value = 5
- **Watch it turn RED!** Squeezed to CI boundary (~2.0)
- Suffering metric increases
- CI gets even narrower

### 4. **The Trap Tightens**
- Try adding value = 4
- Also squeezed! (CI now excludes even moderate values)
- Try adding value = 6
- Also squeezed!
- Observe: You're stuck, can only accept values near 0

### 5. **Liberation Through Meditation**
- Click on the squeezed experience at value = 5
- Slide meditation to 100%
- Click "Meditate"
- **Watch**: 
  - Yellow glow appears
  - CI widens
  - Arrow shortens (less squeezing)
  - May turn GREEN if CI now covers objective value!
- Suffering decreases

### 6. **Building Skill**
- Observe "Brahma Viharas" counter increased
- This cultivation persists across sessions
- Higher cultivation = more effective meditation