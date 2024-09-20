import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors


def recommend(youtube_data, news_data, podcast_data, preferences_data):
    youtube_df = pd.DataFrame(youtube_data)
    news_df = pd.DataFrame(news_data)
    podcast_df = pd.DataFrame(podcast_data)
    
    preferred_topics = preferences_data['topics']
    if preferred_topics:
        youtube_df = youtube_df[youtube_df['snippet']['title'].str.contains('|'.join(preferred_topics), case=False, na=False)]
        news_df = news_df[news_df['title'].str.contains('|'.join(preferred_topics), case=False, na=False)]
        podcast_df = podcast_df[podcast_df['title'].str.contains('|'.join(preferred_topics), case=False, na=False)]
    
    combined_features = pd.concat([youtube_df[['snippet.title', 'snippet.description']], news_df[['title', 'description']], podcast_df[['title', 'description']]], axis=1)
    
    X = np.random.rand(combined_features.shape[0], 10)
    model = NearestNeighbors(n_neighbors=5, algorithm='auto').fit(X)
    
    user_preferences_vector = np.random.rand(1,5)
    
    distances, indices = model.kneighbors(user_preferences_vector)
    
    recommendations = combined_features.iloc[indices[0]]
    
    return recommendations