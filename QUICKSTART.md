# 🚀 Quick Start Guide

## One-Command Startup (Linux/Mac)

```bash
./start.sh
```

This will automatically:
1. Create Python virtual environment
2. Install all dependencies
3. Start the backend on port 8000
4. Start the frontend on port 3000

Then open your browser to: **http://localhost:3000**

---

## Manual Setup

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend Setup (in a new terminal)

```bash
cd frontend
npm install
npm run dev
```

---

## 🎮 How to Use

### 1. Add Your First Experience

- Move the **"New Experience Value"** slider (e.g., to +5)
- Click **"Add Experience"**
- Watch the posterior distribution form around that value

### 2. Add a Conflicting Experience

- Move slider to opposite value (e.g., -3)
- Click **"Add Experience"**
- Notice:
  - System decides whether to **squeeze** or **update model**
  - Red = squeezed, Green = model updated
  - Suffering metrics update

### 3. Experiment with Equanimity

- Move the **"Equanimity Level"** slider to 50%+
- Watch how:
  - All distributions become broader (less certain)
  - Loss landscape flattens
- Add new experiences with high equanimity
  - They integrate more smoothly!
- Lower equanimity back to 0%
  - Old experiences return to rigid beliefs
  - But new experiences stay normalized! ✨

### 4. Observe the Loss Landscape

- The 3D plot shows where your belief is "stuck"
- Valleys = stable beliefs
- Your position = yellow diamond 💎
- With equanimity, landscape flattens → easier to find truth

### 5. Monitor Suffering

- **Cumulative Suffering**: Total cost paid through squeezing
- **Individual Costs**: Which experiences were hardest to squeeze
- **Model Update Cost**: How much it would cost to "let go" completely

---

## 💡 Key Insights to Explore

1. **Without Equanimity**: 
   - Strong beliefs resist change
   - New experiences get squeezed (distorted)
   - Suffering accumulates

2. **With Equanimity**:
   - Beliefs become flexible
   - Updates happen smoothly
   - Less suffering

3. **The Permanent Effect**:
   - Changes made during equanimity persist
   - This is why meditation works!
   - It's not just temporary relief

4. **Local vs Global Minimum**:
   - Low equanimity → stuck in local minimum
   - High equanimity → can reach global minimum (truth)

---

## 🧪 Suggested Experiments

### Experiment 1: Building Rigid Beliefs
1. Add 5 experiences all around value +5
2. Try adding experience at -5
3. Watch the squeezing cost!

### Experiment 2: The Power of Equanimity
1. Build rigid beliefs (as above)
2. Set equanimity to 80%
3. Add the -5 experience
4. Notice much lower suffering!

### Experiment 3: Permanent Integration
1. Start with equanimity at 0%
2. Add some experiences
3. Set equanimity to 100%
4. Add more experiences
5. Return equanimity to 0%
6. New experiences remain normalized! 🎯

### Experiment 4: Trauma Modeling
1. Add one extreme experience (e.g., +8)
2. Note its high τ (precision)
3. Add many mild experiences around 0
4. The extreme one still dominates!
5. Use equanimity to normalize it

---

## 🎯 What You're Actually Seeing

- **Each curve** = One experience's influence on your belief
- **Width of curve** = Uncertainty (σ) / Flexibility
- **Height of curve** = Emotional charge (τ) / Rigidity
- **Purple curve** = Your actual belief (weighted average)
- **Arrows** = Cognitive distortion (squeezing)
- **3D landscape** = The space of all possible beliefs

---

## 🐛 Troubleshooting

**Backend won't start:**
```bash
cd backend
source venv/bin/activate
python main.py
```

**Frontend won't start:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**CORS errors:**
- Make sure backend is running on port 8000
- Frontend should proxy to it automatically

---

## 📚 Learn More

See the main [README.md](README.md) for:
- Full mathematical formulation
- Theoretical background
- API documentation
- Architecture details

---

**Enjoy exploring the mathematics of suffering and liberation! 🧘✨**
