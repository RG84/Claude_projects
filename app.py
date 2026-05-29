import os
from flask import Flask, render_template, request, jsonify
import anthropic

app = Flask(__name__)

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable is not set")
        _client = anthropic.Anthropic(api_key=api_key)
    return _client


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/translate", methods=["POST"])
def translate():
    data = request.get_json(silent=True)
    if not data or not data.get("text", "").strip():
        return jsonify({"error": "No text provided"}), 400

    text = data["text"].strip()

    try:
        client = get_client()
    except ValueError as e:
        return jsonify({"error": str(e)}), 500

    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": (
                        "Translate the following English text to Swahili. "
                        "Respond with only the Swahili translation, no explanations or extra text.\n\n"
                        f"{text}"
                    ),
                }
            ],
        )
        translation = message.content[0].text.strip()
        return jsonify({"translation": translation})
    except anthropic.APIError as e:
        return jsonify({"error": f"Translation service error: {str(e)}"}), 502
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5000)
