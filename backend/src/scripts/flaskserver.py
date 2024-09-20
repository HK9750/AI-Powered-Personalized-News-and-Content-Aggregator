from flask import Flask, request, jsonify
from recommendations import recommend

app = Flask(__name__)

@app.route('/recommend', methods=['POST'])
def get_recommendation():
    data = request.json
    youtube_data = data['youtubeData']
    news_data = data['newsData']
    podcast_data = data['podcastData']
    preferences_data = data['preferencesData']
    
    recommendations = recommend(youtube_data, news_data, podcast_data, preferences_data)
    
    return jsonify({
        'recommendations': recommendations.to_dict(orient='records')
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
