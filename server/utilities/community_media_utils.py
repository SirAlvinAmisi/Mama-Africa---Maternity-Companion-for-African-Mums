# server/utilities/community_media_utils.py

import os
from werkzeug.utils import secure_filename
from datetime import datetime

COMMUNITY_MEDIA_FOLDER = os.path.join('static', 'community_media')

def save_community_media(file):
    filename = secure_filename(file.filename)
    timestamp = datetime.now().timestamp()
    new_filename = f"{timestamp}_{filename}"
    full_path = os.path.join(COMMUNITY_MEDIA_FOLDER, new_filename)

    # ✅ Ensure directory exists
    if not os.path.exists(COMMUNITY_MEDIA_FOLDER):
        os.makedirs(COMMUNITY_MEDIA_FOLDER)

    # ✅ Save file to correct location
    file.save(full_path)

    # ✅ Return public-facing URL + media type
    return f"/media/{new_filename}", file.mimetype.split("/")[0]
