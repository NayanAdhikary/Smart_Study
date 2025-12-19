# =============================
# ML Pipeline for Important Question PDFs
# =============================

# Make sure you have installed these:
# pip install gdown PyPDF2 scikit-learn pandas joblib

import os
import gdown
import pandas as pd
import PyPDF2
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib

# -----------------------------
# Step 1: Download all PDFs from Google Drive folder
# -----------------------------
folder_id = "1CDfKo2J1xCn1rpiOlAnhMvWK-Oc_JcEu"  # 🔹 Replace with your Google Drive folder ID
output_dir = "downloaded_pdfs"
os.makedirs(output_dir, exist_ok=True)

print("📥 Downloading PDFs from Google Drive folder...")
gdown.download_folder(id=folder_id, output=output_dir, quiet=False, use_cookies=False)

# -----------------------------
# Step 2: Extract text from PDFs
# -----------------------------
def pdf_to_text(pdf_file):
    """Extract text from a PDF file"""
    text = ""
    try:
        with open(pdf_file, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                if page.extract_text():
                    text += page.extract_text() + " "
    except Exception as e:
        print(f"❌ Error reading {pdf_file}: {e}")
    return text.strip()

pdf_texts = []
for pdf_file in os.listdir(output_dir):
    if pdf_file.endswith(".pdf"):
        path = os.path.join(output_dir, pdf_file)
        text = pdf_to_text(path)
        if text:
            pdf_texts.append(text)

print(f"✅ Extracted text from {len(pdf_texts)} PDFs")

# -----------------------------
# Step 3: Create dataset
# -----------------------------
if len(pdf_texts) == 0:
    raise ValueError("No text extracted from PDFs. Please check your folder link or files.")

data = pd.DataFrame({"text": pdf_texts})
# Dummy labels (replace with real labels if available)
data["label"] = [i % 2 for i in range(len(data))]
data.to_csv("questions_dataset.csv", index=False)
print("✅ Dataset created: questions_dataset.csv")

# -----------------------------
# Step 4: Train/Test Split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    data["text"], data["label"], test_size=0.2, random_state=42
)

# -----------------------------
# Step 5: Feature Extraction
# -----------------------------
vectorizer = TfidfVectorizer(stop_words="english")
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# -----------------------------
# Step 6: Train Model
# -----------------------------
model = LogisticRegression(max_iter=1000)
model.fit(X_train_tfidf, y_train)

y_pred = model.predict(X_test_tfidf)
print("✅ Model trained with accuracy:", accuracy_score(y_test, y_pred))

# -----------------------------
# Step 7: Save Model
# -----------------------------
joblib.dump((vectorizer, model), "question_model.pkl")
print("✅ Model & pipeline saved as question_model.pkl")

# -----------------------------
# Step 8: Use Model
# -----------------------------
vectorizer, model = joblib.load("question_model.pkl")
sample_text = ["Explain machine learning in simple terms"]
sample_vec = vectorizer.transform(sample_text)
print("Prediction:", model.predict(sample_vec)[0])
