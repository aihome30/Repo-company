import json
from youtube_transcript_api import YouTubeTranscriptApi

def get_free_youtube_transcript(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['id', 'en'])
        full_text = " ".join([item['text'] for item in transcript_list])
        return {"success": True, "transcript": full_text[:1000] + "..."}
    except Exception as e:
        return {"success": data_error := str(e)}

if __name__ == "__main__":
    print("youtube-transcript-api ready.")
