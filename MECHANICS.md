# 📚 Detailed Mechanics Explanation

## Answering Your Questions

### 1. How is Squeezing Decided & New τ Calculation?

#### Squeezing Decision

When a new experience with value `X_new` arrives:

**Option 1: Squeeze** (distort the experience to fit current beliefs)
- Store it as `X_stored = μ_posterior` (the current belief mean)
- Cost: `C_squeeze = |X_new - μ_posterior|² × √τ_posterior`
- The cost is higher when:
  - The experience is far from current beliefs
  - Your current beliefs are very precise/rigid (high τ_posterior)

**Option 2: Update Model** (change your beliefs to accommodate the experience)
- Store it as `X_stored = X_new` (the true value)
- Reinterpret all previous experiences
- Cost: `C_update = Σ τᵢ × (belief_shift)²`
  - Where `belief_shift` is how much μ would move to accommodate X_new
- The cost is higher when:
  - You have many rigid (high τ) past experiences
  - The belief would need to shift significantly

**The system automatically chooses whichever is cheaper!**

#### New Experience τ Calculation

When you add a new experience with value `X`:

```python
# Base intensity: experiences further from 0 are more "intense"
base_intensity = |X| / 10.0  # 0.0 to 1.0
base_tau = 1.0 + base_intensity × 5.0  # 1.0 to 6.0

# Equanimity dampens tau formation
equanimity_factor = 1.0 - (equanimity × 0.8)  # 0.2 to 1.0
new_tau = 1.0 + (base_tau - 1.0) × equanimity_factor

# Example:
# X = 8, equanimity = 0   → tau ≈ 5.0 (rigid)
# X = 8, equanimity = 0.5 → tau ≈ 3.0 (moderate)
# X = 8, equanimity = 1.0 → tau ≈ 1.8 (flexible)
```

**Key insight:** Equanimity prevents new experiences from becoming too rigid, even if they're intense!

---

### 2. What Does the Loss Landscape Represent?

The loss landscape shows **negative log posterior probability** for different belief values at different equanimity levels.

**Mathematically:**
```
Loss(belief, equanimity) = Σ τᵢ(equanimity) × (xᵢ - belief)² + τ_prior × (belief - μ_prior)²
```

**What it means:**

- **Valleys (low loss)**: Beliefs that fit well with your experiences
- **Peaks (high loss)**: Beliefs that contradict your experiences
- **The global minimum**: Your posterior mean μ_posterior (the "optimal" belief)
- **Local minima**: Suboptimal beliefs where you could get "stuck"

**The Equanimity Effect:**

At **low equanimity** (0%):
- τ values are high (rigid beliefs)
- Landscape has sharp, deep valleys
- You're "trapped" in local minima
- Hard to change beliefs

At **high equanimity** (100%):
- All τ values → 1.0 (flexible beliefs)  
- Landscape becomes flatter
- Easier to "roll" from local to global minimum
- Beliefs can change more easily

**This is why meditation helps!** It temporarily flattens the landscape so you can escape rigid belief patterns.

---

### 3. Liberation Cost vs Equanimity Slider

**No, they're different but related!**

#### Liberation Cost (the metric)
This is a **one-time cost** representing the emotional work to permanently reduce all τ values to 1.0:

```python
liberation_cost = Σ [(τᵢ - 1.0) × (1 + distortion_i)]
```

- Represents the work of "letting go" of ALL rigid beliefs
- Includes the distortion cost (how much you've squeezed reality)
- This is PERMANENT change

#### Equanimity Slider (the process)
This is a **temporary simulation** of what happens during meditation:

```python
τ_effective(equanimity) = τ × (1 - equanimity) + 1 × equanimity
```

- At 50%: τ is halfway between its current value and 1.0
- At 100%: all τ values become 1.0 TEMPORARILY
- When you slide back to 0%, old experiences return to their original τ

**BUT:** If you add NEW experiences while equanimity is high, those get permanently low τ! This is the key insight.

**Metaphor:**
- **Liberation Cost**: The total work to permanently "let go"
- **Equanimity Slider**: A temporary "container" that makes integration easier
- **The trick**: Use high equanimity to integrate new experiences with low τ, then return to normal

---

### 4. Equanimity Effects & Fixed Scales

#### In-the-Moment Effects (Temporary)

When you move the equanimity slider:

1. **All τ values normalize**:
   ```
   τ_old = 5.0, equanimity = 0.5 → τ_effective = 3.0
   τ_old = 5.0, equanimity = 1.0 → τ_effective = 1.0
   ```

2. **All σ values increase**:
   ```
   σ = 1/√τ, so lower τ → higher σ → broader distributions
   ```

3. **Posterior becomes broader**:
   - Less certain about your beliefs
   - More open to new information

4. **Cost calculations change**:
   - Squeezing becomes relatively more expensive
   - Model updates become relatively cheaper
   - More likely to update beliefs than squeeze

#### Permanent Effects (if new experience added)

When you add a new experience with high equanimity:

```python
# At equanimity = 0:
new_tau = 5.0  # Rigid new belief

# At equanimity = 1.0:
new_tau = 1.8  # Flexible new belief

# When you slide back to equanimity = 0:
# - Old experiences: τ returns to original values
# - NEW experience: τ STAYS at 1.8! (permanent)
```

**This is the permanent integration effect!**

#### Fixed Scale Solution

**Problem:** When equanimity increases, σ increases, so PDF heights decrease, making the y-axis range change.

**Solution:** I've now fixed the y-axis range based on the maximum PDF value:
```javascript
const maxPdfValue = Math.max(...posterior.pdf, 
  ...experienceDistributions.flatMap(d => [...d.pdf_stored, ...d.pdf_objective])
);
const yAxisRange = [0, maxPdfValue * 1.2];
```

Now when you slide equanimity:
- ✅ Distributions get wider (correct - higher σ)
- ✅ Distributions get flatter (correct - probability mass spreads out)
- ✅ Y-axis stays fixed (no jumping around!)

---

## Summary: The Complete Picture

### Adding an Experience

1. **Calculate costs** for squeeze vs update (considering current equanimity)
2. **Choose cheaper option** automatically
3. **Assign new τ** based on:
   - Experience intensity (how extreme the value)
   - Current equanimity (dampens τ formation)
4. **If squeezed**: distort and pay cost
5. **If updated**: reinterpret all past experiences

### The Equanimity Effect

| Equanimity | τ_effective | Belief Rigidity | Integration Ease |
|-----------|-------------|-----------------|------------------|
| 0%        | Original τ  | High (stuck)    | Hard (squeeze)   |
| 50%       | Halfway     | Moderate        | Moderate         |
| 100%      | All → 1.0   | Low (flexible)  | Easy (update)    |

### Liberation vs Suffering

- **Suffering** = Cumulative cost PAID through squeezing experiences
- **Liberation Cost** = Cost to PERMANENTLY normalize all τ to 1.0
- **The choice**: Keep paying squeezing costs OR do the work to let go?

### Why Meditation Works

1. **Temporary normalization** (equanimity slider up)
2. **Easier integration** (new experiences get low τ)
3. **Permanent change** (those low τ values stay!)
4. **Return to baseline** (slider back down, but changes persist)

It's not magic - it's strategic timing of when to integrate new information! 🧘✨

---

## Code Changes Made

1. **Better model update cost**: Now based on belief shift, not distance to new value
2. **Smarter τ assignment**: Based on experience intensity + equanimity dampening
3. **Liberation cost metric**: Shows cost of permanent τ normalization
4. **Fixed y-axis scaling**: No more jumping when sliding equanimity
5. **Clearer UI**: Shows liberation cost vs total squeezing cost paid

The dashboard now more accurately represents the theoretical framework! 🎯
