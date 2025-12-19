"""
EXAM QUESTION PREDICTOR - Machine Learning Model
Subject: Basic Data Science
University: MAKAUT (Maulana Abul Kalam Azad University of Technology)
Course Code: MCAH-E404


This model predicts probable exam questions by analyzing:
1. Previous Year Questions
2. Syllabus Topics
3. Question Frequency Patterns
4. Difficulty Levels
"""

import pandas as pd
import numpy as np
import re
import json
import ast
import pickle
import sys
import os
import random
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import warnings
warnings.filterwarnings('ignore')


# ==================== SYLLABUS DEFINITION ====================
class SyllabusAnalyzer:
    """Analyzes syllabus and extracts key topics"""
    
    def __init__(self):
        self.topics = {
            'Machine Learning Basics': [
                'regression', 'classification', 'supervised', 'unsupervised', 'learning'
            ],
            'Data Preprocessing': [
                'outlier', 'missing data', 'normalization', 'standardization', 'cleaning'
            ],
            'Clustering': [
                'clustering', 'k-means', 'hierarchical', 'centroid', 'cluster'
            ],
            'Distance Metrics': [
                'euclidean', 'minkowski', 'manhattan', 'distance metric', 'proximity'
            ],
            'Decision Trees': [
                'decision tree', 'entropy', 'information gain', 'split', 'pruning'
            ],
            'k-NN Algorithm': [
                'k-NN', 'knn', 'nearest neighbor', 'lazy learner', 'instance-based'
            ],
            'Probability & Statistics': [
                'probability', 'distribution', 'gaussian', 'poisson', 'binomial',
                'mean', 'median', 'mode', 'variance', 'standard deviation'
            ],
            'Hypothesis Testing': [
                'hypothesis', 'null hypothesis', 'p-value', 'significance', 'test'
            ],
            'Sampling Methods': [
                'sampling', 'stratified', 'random sampling', 'sample', 'population'
            ],
            'Correlation Analysis': [
                'correlation', 'pearson', 'covariance', 'dependency', 'relationship'
            ],
            'Model Evaluation': [
                'precision', 'recall', 'f1-score', 'accuracy', 'sensitivity', 'specificity'
            ]
        }
    
    def get_all_topics(self):
        """Get all topics as flat list"""
        all_topics = []
        for category, keywords in self.topics.items():
            all_topics.extend(keywords)
        return all_topics
    
    def get_topic_categories(self):
        """Return topic categories"""
        return self.topics


# ==================== QUESTION PREDICTOR ====================
class QuestionPredictor:
    """Main predictive model for exam questions"""
    
    def __init__(self):
        self.syllabus = SyllabusAnalyzer()
        self.model = None
        self.scaler = StandardScaler()
        self.topic_importance = {}
        self.question_patterns = {
            'definition': {'keywords': ['what is', 'define', 'explain'], 'difficulty': 'Easy'},
            'calculation': {'keywords': ['calculate', 'compute', 'find'], 'difficulty': 'Medium'},
            'algorithm': {'keywords': ['describe algorithm', 'algorithm', 'steps'], 'difficulty': 'Medium'},
            'analysis': {'keywords': ['analyze', 'compare', 'discuss', 'difference'], 'difficulty': 'Medium'},
            'proof': {'keywords': ['derive', 'prove', 'show'], 'difficulty': 'Hard'},
            'application': {'keywords': ['apply', 'implementation', 'design'], 'difficulty': 'Hard'}
        }
    
    def extract_features(self, text):
        """Extract numerical features from text"""
        features = {}
        
        # Feature 1: Topic frequency
        all_topics = self.syllabus.get_all_topics()
        topic_count = 0
        for topic in all_topics:
            count = len(re.findall(f'\\b{topic}\\b', text, re.IGNORECASE))
            topic_count += count
        features['topic_frequency'] = topic_count
        
        # Feature 2: Question type indicators
        features['is_definition'] = len(re.findall(r'what is|define', text, re.IGNORECASE))
        features['is_calculation'] = len(re.findall(r'calculate|compute', text, re.IGNORECASE))
        features['is_conceptual'] = len(re.findall(r'explain|discuss', text, re.IGNORECASE))
        features['is_algorithm'] = len(re.findall(r'algorithm|steps|procedure', text, re.IGNORECASE))
        
        # Feature 3: Text characteristics
        features['question_length'] = len(text.split())
        features['complexity_score'] = len(re.findall(r'[,;:]', text))
        
        # Feature 4: Keywords from syllabus
        features['stats_keywords'] = len(re.findall(
            r'mean|median|variance|standard deviation|distribution|probability',
            text, re.IGNORECASE
        ))
        features['ml_keywords'] = len(re.findall(
            r'regression|classification|clustering|decision tree|algorithm',
            text, re.IGNORECASE
        ))
        
        # Feature 5: Numerical content
        features['has_numbers'] = len(re.findall(r'\d+', text))
        features['has_formulas'] = len(re.findall(r'[=+\-*/()]', text))
        
        return features
    
    def estimate_topic_importance(self, questions_text):
        """Estimate importance of each topic based on frequency"""
        topics = self.syllabus.get_all_topics()
        importance = {}
        
        for topic in topics:
            count = len(re.findall(f'\\b{topic}\\b', questions_text, re.IGNORECASE))
            if count > 0:
                importance[topic] = count
        
        # Normalize
        if importance:
            max_count = max(importance.values())
            importance = {t: (c / max_count) for t, c in importance.items()}
        
        return importance
    
    def predict_questions(self, previous_questions, syllabus_text):
        """Predict probable questions for upcoming exam"""
        
        # Analyze given data
        self.topic_importance = self.estimate_topic_importance(
            previous_questions + ' ' + syllabus_text
        )
        
        # Extract features from previous questions
        feature_list = []
        for q in previous_questions.split('\n'):
            if q.strip():
                feature_list.append(self.extract_features(q))
        
        predictions = {
            'high_probability': [],
            'medium_probability': [],
            'low_probability': [],
            'topic_analysis': {},
            'question_patterns': {},
            'recommendations': []
        }
        
        # Categorize by probability
        sorted_topics = sorted(self.topic_importance.items(),
                               key=lambda x: x[1], reverse=True)
        
        # High probability: top 40%
        cutoff_high = len(sorted_topics) * 0.4
        cutoff_medium = len(sorted_topics) * 0.7
        
        for i, (topic, score) in enumerate(sorted_topics):
            # Format score as percentage
            score_percent = f"{score:.0%}"
            
            if i < cutoff_high:
                predictions['high_probability'].append({
                    'topic': topic,
                    'score': score_percent,
                    'recommended_questions': 2
                })
            elif i < cutoff_medium:
                predictions['medium_probability'].append({
                    'topic': topic,
                    'score': score_percent,
                    'recommended_questions': 1
                })
            else:
                predictions['low_probability'].append({
                    'topic': topic,
                    'score': score_percent,
                    'recommended_questions': 0
                })
        
        # Generate recommendations
        predictions['recommendations'] = self._generate_recommendations(
            predictions, syllabus_text
        )
        
        return predictions
    
    def _generate_recommendations(self, predictions, syllabus_text):
        """Generate study recommendations"""
        recommendations = []
        
        # Focus on high probability topics
        top_topics = [p['topic'] for p in predictions['high_probability'][:5]]
        recommendations.append({
            'priority': 'CRITICAL',
            'action': 'Focus Study',
            'topics': top_topics,
            'reason': 'These topics appear most frequently in previous papers'
        })
        
        # Look for emerging topics
        if predictions['medium_probability']:
            emerging = [p['topic'] for p in predictions['medium_probability'][:3]]
            recommendations.append({
                'priority': 'HIGH',
                'action': 'Prepare Additional Practice',
                'topics': emerging,
                'reason': 'Moderately important topics - may be combined questions'
            })
        
        # Practice problem-solving questions
        if 'calculate' in syllabus_text.lower() or 'compute' in syllabus_text.lower():
            recommendations.append({
                'priority': 'HIGH',
                'action': 'Practice Numerical Problems',
                'topics': ['mean', 'standard deviation', 'probability'],
                'reason': 'Calculations commonly asked in Group B & C'
            })
        
        # Theory review
        recommendations.append({
            'priority': 'MEDIUM',
            'action': 'Theory Revision',
            'topics': ['definitions', 'algorithms', 'concepts'],
            'reason': 'Definitions commonly asked in Group A'
        })
        
        return recommendations
    
    def generate_sample_questions(self, high_prob_topics, difficulty='Mixed'):
        """Generate sample questions for study"""
        sample_questions = []
        
        # Define question templates
        templates = {
            'definition': [
                "Define {topic}.",
                "What do you understand by {topic}?",
                "Explain the concept of {topic}."
            ],
            'difference': [
                "Distinguish between X and Y in context of {topic}.",
                "Compare the approaches of X and Y for {topic}."
            ],
            'calculation': [
                "Calculate the {topic} for the given dataset.",
                "Compute {topic} with appropriate formulas."
            ],
            'algorithm': [
                "Describe the {topic} algorithm with example.",
                "Explain step-by-step procedure for {topic}."
            ]
        }
        
        for i, topic_data in enumerate(high_prob_topics[:10], 1):
            topic = topic_data['topic']
            
            # Select question type based on topic
            if any(keyword in topic.lower() for keyword in ['algorithm', 'knn', 'decision']):
                q_type = 'algorithm'
            elif any(keyword in topic.lower() for keyword in ['mean', 'calculate', 'standard']):
                q_type = 'calculation'
            else:
                q_type = 'definition'
            
            # Randomize template choice
            template_list = templates.get(q_type, templates['definition'])
            template = random.choice(template_list)
            formatted_question = template.format(topic=topic)
            
            sample_questions.append({
                'question_number': i,
                'topic': topic,
                'difficulty': difficulty,
                'question': formatted_question,
                'points': 3 if difficulty == 'Short' else 5
            })
        
        return sample_questions


# ==================== MAIN EXECUTION ====================
def load_and_predict(csv_file_path):
    """Main function to load data and make predictions"""
    
    sys.stderr.write("\n" + "=" * 70 + "\n")
    sys.stderr.write("EXAM QUESTION PREDICTION SYSTEM - INITIALIZING\n")
    sys.stderr.write("=" * 70 + "\n")
    
    # Load data
    try:
        df = pd.read_csv(csv_file_path)
        sys.stderr.write("\n[OK] Data loaded successfully\n")
    except Exception as e:
        sys.stderr.write(f"\n[ERROR] Error loading data: {e}\n")
        return None
    
    # Extract text from CSV
    if 'pages' in df.columns:
        pages_data = df.iloc[0]['pages']
        if isinstance(pages_data, str):
            pages = ast.literal_eval(pages_data)
        else:
            pages = pages_data
        
        all_text = []
        for page in pages:
            if 'blocks' in page:
                for block in page['blocks']:
                    if 'text' in block:
                        all_text.append(block['text'])
        
        full_text = '\n'.join(all_text)
    else:
        full_text = df.to_string()
    
    # Initialize predictor
    predictor = QuestionPredictor()
    sys.stderr.write("[OK] Question Predictor initialized\n")
    
    # Make predictions
    predictions = predictor.predict_questions(full_text, full_text)
    sys.stderr.write("[OK] Predictions completed\n")
    
    # Display results
    sys.stderr.write("\n" + "=" * 70 + "\n")
    sys.stderr.write("PREDICTION RESULTS\n")
    sys.stderr.write("=" * 70 + "\n")
    
    sys.stderr.write("\nHIGH PROBABILITY TOPICS (Must Study):\n")
    sys.stderr.write("-" * 70 + "\n")
    for i, item in enumerate(predictions['high_probability'][:10], 1):
        sys.stderr.write(f"{i:2d}. {item['topic']:30s} Score: {item['score']}\n")
    
    sys.stderr.write("\nMEDIUM PROBABILITY TOPICS (Important):\n")
    sys.stderr.write("-" * 70 + "\n")
    for i, item in enumerate(predictions['medium_probability'][:10], 1):
        sys.stderr.write(f"{i:2d}. {item['topic']:30s} Score: {item['score']}\n")
    
    sys.stderr.write("\nSTUDY RECOMMENDATIONS:\n")
    sys.stderr.write("-" * 70 + "\n")
    for i, rec in enumerate(predictions['recommendations'], 1):
        sys.stderr.write(f"\n{i}. [{rec['priority']}] {rec['action']}\n")
        sys.stderr.write(f"   Topics: {', '.join(rec['topics'][:3])}\n")
        sys.stderr.write(f"   Reason: {rec['reason']}\n")
    
    # Generate sample questions
    sample_qs = predictor.generate_sample_questions(predictions['high_probability'])
    sys.stderr.write("\nSAMPLE PRACTICE QUESTIONS:\n")
    sys.stderr.write("-" * 70 + "\n")
    for sq in sample_qs:
        sys.stderr.write(f"\nQ{sq['question_number']}. {sq['question']}\n")
        sys.stderr.write(f"   Topic: {sq['topic']} | Difficulty: {sq['difficulty']} | Points: {sq['points']}\n")
    
    return {
        'predictor': predictor,
        'predictions': predictions,
        'sample_questions': sample_qs
    }


# ==================== EXPORT FUNCTIONS ====================
def save_model(predictor, filename='question_predictor_model.pkl'):
    """Save trained model to file"""
    with open(filename, 'wb') as f:
        pickle.dump(predictor, f)
    sys.stderr.write(f"[OK] Model saved to {filename}\n")


def load_model(filename='question_predictor_model.pkl'):
    """Load trained model from file"""
    with open(filename, 'rb') as f:
        predictor = pickle.load(f)
    sys.stderr.write(f"[OK] Model loaded from {filename}\n")
    return predictor


def export_predictions_to_json(predictions, filename='exam_predictions.json'):
    """Export predictions to JSON format"""
    # Convert numpy types to native Python types
    def convert_to_serializable(obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, dict):
            return {k: convert_to_serializable(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_to_serializable(item) for item in obj]
        return obj
    
    predictions_serializable = convert_to_serializable(predictions)
    
    with open(filename, 'w') as f:
        json.dump(predictions_serializable, f, indent=2)
    sys.stderr.write(f"[OK] Predictions exported to {filename}\n")


# ==================== USAGE EXAMPLE ====================
if __name__ == "__main__":
    # Get query from command line (passed by Node.js)
    query = sys.argv[1] if len(sys.argv) > 1 else ""
    
    # Default file logic (simplified for now to match the user's specific case)
    # In a real app, you'd map query to a filename or search a DB.
    # We will assume "Basic Data Science" maps to the provided CSV.
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    target_file = 'Bsic Data Science (1) (1).csv' # Default
    
    # Basic rudimentary matching
    if "basic" in query.lower() and "science" in query.lower():
        target_file = 'Bsic Data Science (1) (1).csv'
    
    csv_path = os.path.join(script_dir, target_file)

    # Run prediction
    result = load_and_predict(csv_path)
    
    if result:
        # Save model (optional, maybe skip in production API to save time/space)
        # save_model(result['predictor'])
        
        # Export predictions to file (optional)
        # export_predictions_to_json(result['predictions'])
        
        sys.stderr.write("\n" + "=" * 70 + "\n")
        sys.stderr.write("[OK] ANALYSIS COMPLETE\n")
        sys.stderr.write("=" * 70 + "\n")

        # Combine predictions and sample questions for the frontend
        final_output = result['predictions']
        final_output['sample_questions'] = result['sample_questions']
        
        # Add subject/query info if needed
        final_output['subject'] = query if query else "General"

        # CRITICAL: Print ONLY the JSON to stdout for the Node.js controller
        json.dump(final_output, sys.stdout)
    else:
        # Print empty array or error JSON if failed
        print("[]")
