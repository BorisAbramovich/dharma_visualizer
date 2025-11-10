# Paradigm Shift: 95% CI-Based Squeezing

## Overview
Refactored the dashboard from **cost-based squeezing** to **95% confidence interval-based squeezing**. This is a fundamental reconceptualization that makes the model more intuitive and mathematically principled.

## Key Changes

### 1. Experience Model (Backend)
**Old:**
- `objective_value` (scalar)
- `stored_value` (scalar)
- `tau` (calculated from intensity)
- Squeezing decision based on cost comparison

**New:**
- `objective_mean` (mean of experience distribution)
- `objective_sigma` (controllable - represents emotional charge)
- `stored_mean` (may be squeezed)
- `stored_sigma` (same as objective for now)
- `tau` property: computed as `1/sigma²`
- Squeezing decision: **outside 95% CI → squeeze to boundary**

### 2. Squeezing Logic
**Old Logic:**
```python
squeeze_cost = distance² × sqrt(posterior_tau)
update_cost = Σ(tau_i × shift²)
if squeeze_cost < update_cost: squeeze
```

**New Logic:**
```python
ci_lower = posterior_mu - 1.96 * posterior_sigma
ci_upper = posterior_mu + 1.96 * posterior_sigma

if objective_mean in [ci_lower, ci_upper]:
    # Accept as-is
    stored_mean = objective_mean
else:
    # Squeeze to nearest boundary
    stored_mean = nearest_boundary
    cost = (distance_to_boundary² ) × tau
```

### 3. Emotional Charge Control (Frontend)
**New Feature:**
- Added **sigma slider** (0.1 to 3.0)
- Low σ (0.1) = **high emotional charge** (traumatic, intense)
- High σ (3.0) = **low emotional charge** (casual, uncertain)
- Users can now control how "charged" each experience is

### 4. Loss Landscape Redefinition
**Old:** Showed negative log posterior across belief/equanimity space
**New:** Shows **squeezing cost** for potential new experiences
- X-axis: hypothetical new experience mean
- Y-axis: equanimity level
- Z-axis: squeezing cost required
- **Shows**: How equanimity flattens the landscape by widening distributions

### 5. Equanimity as Widening
**Old:** Equanimity normalized tau values towards 1.0
**New:** Equanimity **widens all distributions**
```python
effective_sigma = stored_sigma × (1 + equanimity × 2)
# At equanimity=0: sigma unchanged
# At equanimity=1: sigma increases by 3x
```

**Cost of Widening:**
```python
widening_cost = Σ(tau_i × widening_amount²)
```
- High tau (rigid) experiences are **costly to let go**
- Shows tradeoff: pay to widen now vs pay to squeeze later

## Files Modified

### Backend
1. **`bayesian_model.py`**
   - Refactored `Experience` dataclass
   - New `calculate_squeezing_cost()` based on 95% CI
   - New `should_squeeze()` returns `(bool, stored_mean, stored_sigma)`
   - Updated `increase_equanimity()` to return widening cost
   - Redefined `get_loss_landscape()` to show squeezing cost
   - Fixed all type hints (`float | None` instead of `float = None`)

2. **`main.py`**
   - Added `sigma` parameter to `AddExperienceRequest`
   - Updated `/experience` endpoint to accept sigma

### Frontend
1. **`ExperienceControls.jsx`**
   - Added sigma slider with range 0.1-3.0
   - Labels: "High (0.1)" to "Low (3.0)"
   - Help text: "Low σ = high emotional charge"
   - Updated info box text for 95% CI squeezing

2. **`ExperienceControls.css`**
   - Added `.slider-help` style for helper text

3. **`App.jsx`**
   - Updated `handleAddExperience(value, sigma)` to pass sigma to API

4. **`PosteriorVisualization.jsx`**
   - Updated field names: `stored_value` → `stored_mean`
   - Updated field names: `objective_value` → `objective_mean`

## Mathematical Intuition

### Why 95% CI?
The 95% confidence interval represents the **acceptable range** of beliefs given current evidence. 
- Experiences **within** this range are **compatible** with your worldview → accept as-is
- Experiences **outside** this range **contradict** your beliefs → must be squeezed (distorted)

### Squeezing Cost
```
cost = (distance_to_boundary)² × tau
```
- Distance: how far we need to move it
- Tau (1/σ²): how "certain" the experience is
- High certainty (low σ) → high cost to distort
- This is the **suffering** of denying reality

### Equanimity Benefit
By widening distributions:
- 95% CI becomes **wider**
- More experiences fall within it naturally
- **Less squeezing needed** in the future
- Trade upfront widening cost for reduced future suffering

## What's Left (Todo #5)
- Update `SufferingMetrics.jsx` to show:
  - Current cumulative squeezing cost (already tracked)
  - **Widening cost** for different equanimity levels
  - Comparison: "Pay X to widen vs Y future squeezing cost"
- Track widening cost when equanimity slider moves

## Testing
To test the refactored system:
1. Start backend: `python3 /home/linus/Desktop/dharma_visualizer/backend/main.py`
2. Start frontend: `cd frontend && npm run dev`
3. Try adding experiences with different sigmas
4. Observe squeezing behavior at 95% CI boundaries
5. Adjust equanimity and watch distributions widen
6. View loss landscape showing squeezing cost surface

## Philosophy
This refactor makes the model **more principled**:
- Squeezing is now **statistical** (95% CI), not cost-based heuristic
- Emotional charge (tau/sigma) is **explicit** and **controllable**
- Equanimity cost is **visible** and **quantifiable**
- Loss landscape shows the **terrain** of experience accommodation

The dashboard now better captures the **phenomenology of suffering**: the work of distorting reality to fit rigid beliefs, and the liberation of widening one's perspective.
