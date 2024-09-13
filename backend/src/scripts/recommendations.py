# /scripts/recommender.py
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Example content data (available content from the APIs)
available_content = [
    "Latest AI news and developments",
    "Trends in podcasting for technology 2024",
    "YouTube video on artificial intelligence applications",
    "New tech tools for 2024"
]

def recommend(user_content):
    vectorizer = TfidfVectorizer()
    user_content_vec = vectorizer.fit_transform(user_content)
    available_content_vec = vectorizer.transform(available_content)

    # Compute Cosine Similarity
    cosine_similarities = cosine_similarity(user_content_vec, available_content_vec)
    top_n = 2
    recommendations = np.argsort(cosine_similarities.flatten())[::-1][:top_n]

    return [available_content[idx] for idx in recommendations]
