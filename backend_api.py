"""
Flask API server for the Clothing Analysis System.
This connects the frontend to the ML backend.

Usage:
    python backend_api.py

The API will be available at http://localhost:5000
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import sys
from pathlib import Path

# Add ml directory to path
sys.path.insert(0, str(Path(__file__).parent / 'ml'))

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    """Analyze uploaded image for clothing detection"""
    try:
        # Check if image file is in request
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'success': False, 'error': 'Invalid file type. Allowed: PNG, JPG, JPEG, WebP'}), 400
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_length = file.tell()
        file.seek(0)
        
        if file_length > MAX_FILE_SIZE:
            return jsonify({'success': False, 'error': f'File too large. Max size: {MAX_FILE_SIZE / 1024 / 1024}MB'}), 400
        
        # Save uploaded file temporarily
        filename = file.filename
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Apply EXIF orientation correction to uploaded image
        # This fixes iPhone portrait photos being rotated
        try:
            from PIL import Image
            img = Image.open(filepath)
            # Check for EXIF orientation
            if hasattr(img, '_getexif') and img._getexif() is not None:
                exif = img._getexif()
                orientation = exif.get(274)
            elif hasattr(img, 'getexif'):
                exif = img.getexif()
                orientation = exif.get(274)
            else:
                orientation = None
            
            if orientation and orientation != 1:  # 1 is normal, no rotation needed
                # Apply rotation based on EXIF orientation (handles all cases)
                if orientation == 2:
                    img = img.transpose(Image.FLIP_LEFT_RIGHT)
                elif orientation == 3:
                    img = img.rotate(180, expand=True)
                elif orientation == 4:
                    img = img.transpose(Image.FLIP_TOP_BOTTOM)
                elif orientation == 5:
                    img = img.transpose(Image.FLIP_LEFT_RIGHT).rotate(90, expand=True)
                elif orientation == 6:
                    # Most common for iPhone portrait photos
                    img = img.rotate(-90, expand=True)
                elif orientation == 7:
                    img = img.transpose(Image.FLIP_LEFT_RIGHT).rotate(-90, expand=True)
                elif orientation == 8:
                    img = img.rotate(90, expand=True)
                # Save the corrected image (overwrite original)
                img.save(filepath, quality=95)
            img.close()
        except Exception as e:
            # If EXIF correction fails, continue with original image
            print(f"[Warning] Could not apply EXIF orientation: {e}")
            pass
        
        # Get style evaluation flag
        evaluate_style = request.args.get('style_eval', 'false').lower() == 'true'
        
        # Import ML processing function
        from ml.output import process_image
        import os as os_module
        
        # Process image
        result = process_image(
            image_path=filepath,
            save_dir='checkpoints',
            backbone='resnet50',
            evaluate_style=evaluate_style,
            openai_key=os_module.getenv('OPENAI_API_KEY'),
            visualize=True,
            output_dir='.'
        )
        
        # Clean up uploaded file
        try:
            os.remove(filepath)
        except:
            pass
        
        # Convert visualization paths to relative URLs
        if result.get('visualizations'):
            vis = result['visualizations']
            if vis.get('parsed_regions'):
                # Convert to relative URL
                vis['parsed_regions'] = vis['parsed_regions'].replace('\\', '/')
        
        return jsonify(result)
    
    except Exception as e:
        # Clean up uploaded file on error
        if 'filepath' in locals():
            try:
                os.remove(filepath)
            except:
                pass
        
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/<path:filename>')
def serve_image(filename):
    """Serve visualization images"""
    try:
        # Security: prevent directory traversal
        safe_path = os.path.normpath(filename).lstrip('/')
        if '..' in safe_path or safe_path.startswith('/'):
            return jsonify({'error': 'Invalid path'}), 400
        
        filepath = os.path.join('.', safe_path)
        if os.path.exists(filepath) and os.path.isfile(filepath):
            return send_file(filepath)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'API is running'})

if __name__ == '__main__':
    import socket
    host = '0.0.0.0'
    port = 5000
    
    # Get local IP address for display
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        local_ip = s.getsockname()[0]
        s.close()
    except:
        local_ip = 'localhost'
    
    print("=" * 50)
    print("Starting Clothing Analysis API Server...")
    print(f"API will be available at:")
    print(f"  - Local: http://localhost:{port}")
    print(f"  - Network: http://{local_ip}:{port}")
    print("=" * 50)
    app.run(host=host, port=port, debug=False)

