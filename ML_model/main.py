import pandas as pd
import os

from multipart import file_path
from numpy.core.defchararray import startswith

questions_folder = "Question_CSV_files"

question_files = [f for f in os.listdir(questions_folder) if f.endswith(".csv") and f.startswith("Question")]

#read and combine them
question_dataframes = []
for file in question_files:
    file_path = os.path.join(questions_folder, file)
    df = pd.read_csv(file_path)
    df["source_file"] = file
    question_dataframes.append(df)

all_questions = pd.concat(question_dataframes, ignore_index=True)

print("Load all question CSVs")
print(all_questions.head())