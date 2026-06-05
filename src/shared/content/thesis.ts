export const THESIS_MD = `# A Machine Learning Approach to Heart Rate Measurement Using Photoplethysmography

**Dwijesh Dookraz** · University of Southampton · BSc Computer Science · August 2025

---

## At a Glance

| | |
|---|---|
| **Topic** | Non-contact heart rate estimation from facial video |
| **Model** | DeepPhys — dual-stream attention CNN |
| **Problem addressed** | Skin tone bias in rPPG deep learning |
| **Datasets** | UBFC-rPPG (49 subjects) + custom-collected (15 subjects, Fitzpatrick II–VI) |
| **Best UBFC result** | MAE 8.85 BPM · Pearson *r* = 0.8677 · R² = 0.5139 |
| **Combined model** | MAE 12.42 BPM · Pearson *r* = 0.5918 (p = 0.043) |
| **Ethics** | ERGO Category A · Submission ID 100705 · Approved |
| **Hardware** | RTX 3060 (6 GB VRAM) · i7-10750H · 16 GB RAM |

---

## Abstract

Remote photoplethysmography (rPPG) extracts cardiovascular signals from subtle, imperceptible skin colour changes captured by standard RGB cameras — no contact, no specialist hardware. This dissertation develops and rigorously evaluates an optimised deep learning pipeline for rPPG-based heart rate estimation, with a primary focus on **robustness and fairness across diverse skin tones**.

The core architecture is **DeepPhys** — a dual-stream convolutional neural network that decouples spatial (appearance) and temporal (motion) information from facial video, using soft attention masks to guide the network towards physiologically rich regions. The study employs a dual-dataset strategy:

- **UBFC-rPPG** benchmark — 49 subjects, controlled indoor conditions, well-established for comparison
- **Custom-Collected Dataset** — 15 subjects spanning Fitzpatrick skin types II–VI, purpose-built to address the demographic gap in existing benchmarks

Key findings revealed that while the UBFC-trained model achieves strong benchmark performance, it fails to generalise to diverse skin tones *(r = −0.23, R² = −0.35)*. Retraining on the combined dataset significantly recovers physiological correlation *(r = +0.59)*, demonstrating that **diverse training data is essential for fair and robust rPPG systems**.

---

## 1 · The Problem

Traditional heart rate methods — ECG, contact PPG — require physical sensors. rPPG removes this constraint: a laptop webcam or smartphone camera is enough. But the technology carries a hidden bias.

> Light absorption by skin is modulated by melanin concentration. Models trained on predominantly light-skinned datasets learn features specific to that distribution — and fail silently on darker skin tones.

Three compounding challenges:

**1. Motion & environmental noise**
The rPPG signal is tiny. Head movement, facial expressions, and changing illumination can easily overwhelm it.

**2. Skin tone performance disparity**
UBFC-rPPG has 0 subjects with Fitzpatrick Types V–VI. Models trained on it exhibit systematic bias — lower accuracy for darker skin tones.

**3. Generalisation beyond benchmarks**
A model that performs well on UBFC may be exploiting dataset-specific priors rather than true physiological signals. Real-world deployment exposes this immediately.

---

## 2 · DeepPhys Architecture

DeepPhys processes each video frame-pair through two parallel streams, then fuses them via learned spatial attention.

\`\`\`mermaid
flowchart TD
    V(["Input Video · 30 FPS · 128×128 px"])

    V --> A1 & M0

    subgraph APP["Appearance Stream — where to look"]
        A1["Conv(3→32)×2 · BN · tanh · Dropout(0.35)"]
        A1 --> AM1["mask₁ · Conv(32→1) · sigmoid · L1-normalise"]
        A1 --> A2["AvgPool(2×2) · Conv(32→64)×2 · BN · tanh · Dropout(0.22)"]
        A2 --> AM2["mask₂ · Conv(64→1) · sigmoid · L1-normalise"]
    end

    subgraph MOT["Motion Stream — what to extract"]
        M0["Motion Tensor  Mt = Ft − Ft₋₁  ⊙  Ft + Ft₋₁  /  2"]
        M0 --> M1["Conv(3→32)×2 · BN · tanh"]
        M1 --> MG1["× mask₁ · tanh · Dropout(0.22) · AvgPool(2×2)"]
        MG1 --> M2["Conv(32→64)×2 · BN · tanh"]
        M2 --> MG2["× mask₂ · tanh · Dropout(0.27) · AvgPool(2×2)"]
    end

    AM1 -->|"attention"| MG1
    AM2 -->|"attention"| MG2

    MG2 --> FC["Flatten · Dropout(0.35) · Linear(X→128) · tanh · Linear(128→1)"]
    FC --> HR(["Heart Rate  BPM"])
\`\`\`

**Attention mask normalisation** ensures the attention map sums to a consistent magnitude regardless of spatial resolution:

> m\_norm = ( m · H · W ) / ( 2 · ‖m‖₁ + ε )

The appearance stream generates two attention masks at different feature depths. These modulate the motion stream via element-wise multiplication — directing it towards cheeks, forehead, and other high-signal facial regions.

---

## 3 · Preprocessing Pipeline

\`\`\`mermaid
flowchart LR
    V(["Raw Video\n.avi / .mp4"])
    FE["Frame Extraction\ncv2.VideoCapture\n→ .jpg per frame\n+ GT heart rate"]
    FD["Face Detection\nSSD + ResNet-10\nOpenCV DNN module\nhighest-confidence bbox"]
    RC["ROI Crop & Resize\n128 × 128 px\n3-channel RGB\nblack fill on miss"]
    MT["Motion Tensor\nMt = Ft−Ft₋₁ ⊙ Ft+Ft₋₁ / 2\nCaptures pulse-wave dynamics"]
    SP(["Session Package\n.pt file\nframes + motion\nheart_rate + frame_hr\n[N, 3, 128, 128]"])

    V --> FE --> FD --> RC --> MT --> SP
\`\`\`

Session files are then fed into the dual-stream training pipeline. The deterministic, subject-keyed structure enables strict fold separation and reproducible evaluation.

---

## 4 · Datasets

### UBFC-rPPG Benchmark

| Property | Value |
|---|---|
| Subjects | 49 |
| Resolution | 640 × 480 px |
| Frame rate | 30 FPS |
| Session length | ~1 minute |
| Ground truth | CMS50E pulse oximeter @ 60 Hz |
| Lighting | Controlled indoor |

**Fitzpatrick skin type distribution — the demographic gap:**

\`\`\`mermaid
xychart-beta
    title "UBFC-rPPG: Subjects per Fitzpatrick Skin Type"
    x-axis "Fitzpatrick Type" [I, II, III, IV, V, VI]
    y-axis "Number of Subjects" 0 --> 35
    bar [4, 32, 11, 2, 0, 0]
\`\`\`

> Types V and VI are completely absent — the root cause of cross-domain bias.

---

### Custom-Collected Dataset

> **I designed, funded, and collected this dataset entirely myself.** No institutional data access, no pre-existing corpus — every subject was recruited, compensated out of my own pocket, and recorded personally. The scale (N = 15) was directly constrained by what I could afford.

The motivation was simple: every publicly available rPPG benchmark either lacked darker skin tones entirely or made access prohibitively difficult. Rather than accept that limitation, I built a replacement dataset from scratch — obtaining ethical approval, designing the collection protocol, setting up equipment, and running every session myself.

| Property | Value |
|---|---|
| Subjects | 15 |
| Resolution | 1080p |
| Frame rate | 30 FPS |
| Device | **Personal iPhone 12**, fixed tripod, ~1 m distance |
| Ground truth | CMS50E finger pulse oximeter |
| Skin types | Fitzpatrick II–VI |
| Funding | **Self-funded** — participant compensation paid personally |
| Ethics | ERGO Category A · ID 100705 · Approved |

**Subject distribution by skin type and gender:**

| Gender | Type II | Type III | Type IV | Type V | Type VI | Total |
|---|---|---|---|---|---|---|
| Male | 1 | 5 | 3 | 3 | 1 | **13** |
| Female | 1 | 0 | 0 | 0 | 1 | **2** |
| **Total** | **2** | **5** | **3** | **3** | **2** | **15** |

---

## 5 · Training Configuration

Hyperparameters selected via **Optuna TPE** search with subject-held-out validation:

| Parameter | Value |
|---|---|
| Optimiser | Adam |
| Learning rate (initial) | 9 × 10⁻³ |
| LR scheduler | ReduceLROnPlateau (on val MAE) |
| Weight decay (L₂) | 1 × 10⁻⁴ |
| Loss function | Huber (δ = 1.0) |
| Effective batch size | 8 (gradient accumulation × 8) |
| Max epochs | 20 |
| Early stopping patience | 5 epochs |
| Input clip length | 180 frames (≈ 6 s at 30 FPS) |
| HR normalisation range | 40 – 200 BPM |
| Dropout — appearance stage 1 | 0.35 |
| Dropout — appearance stage 2 | 0.22 |
| Dropout — motion stage 1 | 0.22 |
| Dropout — motion stage 2 | 0.27 |
| Dropout — fully connected | 0.35 |

**Data splits:** 5-fold subject-exclusive cross-validation + 7-subject holdout. Subject data never leaks across folds.

---

## 6 · Results

### Training Dynamics

\`\`\`mermaid
xychart-beta
    title "Training MAE over 25 Epochs (UBFC-rPPG)"
    x-axis "Epoch" [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]
    y-axis "MAE (BPM)" 0 --> 22
    line [18.73, 15.4, 11.2, 8.8, 7.1, 6.2, 5.7, 5.2, 4.8, 4.4, 4.1, 3.9, 3.65]
\`\`\`

Training MAE decreases consistently (18.73 → 3.65 BPM). Validation MAE was volatile (6.75–21 BPM) due to inter-subject variability. LR reduced at epoch 9 — validation stabilises after this point. Best checkpoint: epoch 10, val MAE 6.76 BPM.

---

### UBFC-rPPG — Summary Metrics

| Metric | Clip-Level | Video-Level |
|---|---|---|
| MAE (BPM) | 10.05 | **8.85** |
| RMSE (BPM) | 12.04 | 10.98 |
| Median AE (BPM) | 8.97 | 10.02 |
| R² Score | 0.4719 | **0.5139** |
| Pearson *r* | 0.8276 | **0.8677** |
| Samples | 74 clips | 7 videos |

---

### UBFC-rPPG — 5-Fold Cross-Validation

| Fold | MAE (BPM) | RMSE (BPM) | R² | Pearson *r* |
|---|---|---|---|---|
| Fold 1 | 11.11 | 12.21 | 0.3998 | 0.7083 |
| Fold 2 | 9.76 | 11.53 | 0.4721 | 0.7904 |
| **Fold 3** | **8.85** | **10.98** | **0.5139** | **0.8677** |
| Fold 4 | 13.38 | 14.32 | 0.2126 | 0.5312 |
| Fold 5 | 10.25 | 12.13 | 0.4457 | 0.7523 |
| **Mean** | **10.67** | **12.24** | **0.4088** | **0.7300** |
| Std Dev | 1.55 | 1.15 | 0.1024 | 0.1175 |

---

### Custom Dataset — Per-Subject MAE (UBFC-only model)

\`\`\`mermaid
xychart-beta
    title "Per-Subject MAE on Custom Dataset (UBFC-Only Model)"
    x-axis "Subject" [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15]
    y-axis "MAE (BPM)" 0 --> 35
    bar [17.31, 14.51, 19.47, 28.01, 17.35, 32.08, 19.64, 1.43, 14.64, 25.63, 4.81, 16.72, 12.05, 14.91, 14.45]
\`\`\`

> Video-level R² = −0.35 · Pearson *r* = −0.23 (p = 0.424) — bounded errors but no physiological tracking.

| Subject | Fitzpatrick | Gender | MAE (BPM) |
|---|---|---|---|
| subject1 | III | M | 17.31 |
| subject2 | III | M | 14.51 |
| subject3 | IV | M | 19.47 |
| subject4 | V | M | 28.01 |
| subject5 | VI | M | 17.35 |
| subject6 | II | M | 32.08 |
| subject7 | III | M | 19.64 |
| subject8 | III | M | **1.43** |
| subject9 | VI | F | 14.64 |
| subject10 | IV | M | 25.63 |
| subject11 | II | F | **4.81** |
| subject12 | III | M | 16.72 |
| subject13 | V | M | 12.05 |
| subject14 | IV | M | 14.91 |
| subject15 | V | M | 14.45 |
| **Overall** | | | **17.17 ± 7.46** |

---

### Combined Dataset Model — Holdout (12 subjects: 4 custom + 8 UBFC)

| Metric | Video-Level | Clip-Level |
|---|---|---|
| MAE (BPM) | **12.42** | 13.06 |
| RMSE (BPM) | 14.42 | 15.67 |
| Median AE (BPM) | 10.85 | 12.62 |
| R² Score | 0.258 | 0.219 |
| Pearson *r* | **0.5918** (p = 0.043) | 0.5482 (p < 0.001) |

---

### Effect of Combined Training — Before vs After

\`\`\`mermaid
xychart-beta
    title "MAE Before vs After Combined-Dataset Training"
    x-axis "Subject" ["s4 FP-V", "s6 FP-II", "s8 FP-III", "s13 FP-V"]
    y-axis "MAE (BPM)" 0 --> 35
    bar "UBFC-Only" [28.01, 32.08, 1.43, 12.05]
    bar "Combined" [28.55, 8.85, 4.84, 3.81]
\`\`\`

| Subject | Fitzpatrick | UBFC-Only | Combined | Change |
|---|---|---|---|---|
| subject4 | V | 28.01 | 28.55 | +1.9% |
| subject6 | II | 32.08 | **8.85** | **−72.4%** |
| subject8 | III | 1.43 | 4.84 | +238% |
| subject13 | V | 12.05 | **3.81** | **−68.4%** |

> Combined training reduces error by >68% for two subjects. subject4 shows no improvement — persistent per-subject difficulty independent of training strategy.

---

## 7 · Discussion

### What worked

- Dual-stream attention isolates rPPG signal effectively under controlled conditions — UBFC performance competitive with published benchmarks
- Subject-level cross-validation prevents data leakage and produces honest generalisation estimates
- Optuna TPE in a single fold was efficient and found a stable hyperparameter configuration
- Combined-dataset training significantly recovers cross-domain physiological correlation (r: −0.23 → +0.59)

### What didn't generalise

The UBFC-only model achieved R² = −0.35 on the custom dataset. Despite bounded MAE, predictions were not tracking actual HR variation — the model was relying on UBFC-specific priors (lighting conditions, skin optics, webcam colour response) rather than genuine cardiovascular dynamics.

### Residual pattern

The model systematically overestimates low HR and underestimates high HR — regression to the mean. Likely cause: UBFC subjects are concentrated in the 85–100 BPM range, so the model lacks high-HR training exemplars.

---

## 8 · Limitations

| Constraint | Impact |
|---|---|
| Custom dataset N = 15 | Insufficient statistical power across Fitzpatrick subgroups |
| Gender imbalance (13M : 2F) | Cannot assess gender × skin tone interactions |
| Finite Optuna budget | Search may not be globally optimal |
| 6 GB VRAM | Gradient accumulation required; differs from true large-batch training |
| **Self-funded data collection** | Participant compensation paid out-of-pocket — directly capped N at 15. Scale is a resource constraint, not a design choice. |

---

## 9 · Conclusion & Contributions

**1. Empirical demonstration of dataset bias**
Quantified the failure mode: a model trained on demographically restricted data achieves bounded MAE but captures no physiological signal when domain-shifted to diverse skin tones.

**2. Self-funded custom diverse dataset**
Personally recruited, funded, and collected a 15-subject dataset spanning Fitzpatrick II–VI — ethical approval obtained, participants compensated out of pocket, every session run individually. Directly addresses the demographic gap in all existing public rPPG benchmarks.

**3. Combined-dataset training evidence**
Demonstrated that merging diverse data into training improves generalisation and reduces skin tone bias, even at small supplementary scale — with statistically significant correlation on the mixed holdout set.

---

## Tech Stack

\`\`\`
Python · PyTorch · OpenCV DNN · Optuna · NumPy · scikit-learn
NVIDIA RTX 3060 (6 GB VRAM) · Intel i7-10750H · 16 GB RAM
UBFC-rPPG benchmark · Custom dataset: iPhone 12 + CMS50E oximeter
\`\`\`

---

*University of Southampton · Electronics and Computer Science · COMP3200*
*Ethics: ERGO Category A · Approved*`
