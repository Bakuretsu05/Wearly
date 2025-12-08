# Clothing Analysis System

AI-powered clothing detection and style evaluation system with React frontend and Python ML backend.

## Quick Start

### Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- [uv](https://github.com/astral-sh/uv) package manager

**Install uv:**
- Windows: `pip install uv` or `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`
- Mac/Linux: `curl -LsSf https://astral.sh/uv/install.sh | sh`

### Installation

1. **Extract the ZIP file** containing this codebase

2. **Install Python dependencies:**
   ```bash
   uv sync
   ```

3. **Install Frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running the Application

Open **two terminal windows**:

**Terminal 1 - Start Backend:**
```bash
python backend_api.py
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev -- --host
```

### Accessing from Mobile Phone

1. **Make sure your phone is on the same WiFi network** as the computer

2. **Find your computer's IP address:**
   - Windows: Run `ipconfig` and look for "IPv4 Address"
   - Mac/Linux: Run `ifconfig` or `hostname -I`

3. **Open your phone's browser** and go to:
   ```
   http://YOUR_COMPUTER_IP:5173
   ```
   Replace `YOUR_COMPUTER_IP` with the IP address from step 2.

   Example: `http://192.168.1.100:5173`

4. **Start using the app!** You can:
   - Take photos with your phone's camera
   - Upload images from gallery
   - View clothing analysis results

## Features

- **Clothing Detection**: Automatic detection of shirts, pants, shoes, and accessories
- **Color Extraction**: Extracts dominant colors from clothing regions
- **Attribute Classification**: Classifies fabric, patterns, shapes, and styles
- **Style Evaluation**: ChatGPT-powered style analysis and recommendations
- **Shopping Links**: Generates Shein shopping links for similar items
- **Mobile-Friendly**: Responsive design with camera capture support

## Project Structure

```
├── ml/                          # Machine Learning backend
│   ├── output.py               # Main processing pipeline
│   ├── test.py                 # Attribute classification model
│   ├── pretrained_parser.py    # Clothing region parsing
│   └── Parsing_train.py        # Parsing model training
├── frontend/                    # React + TypeScript frontend
├── checkpoints/                 # Model checkpoints (.pth files)
├── backend_api.py              # Flask API server
├── pyproject.toml              # Python dependencies (for uv)
└── README.md                   # This file
```

## Environment Variables (Optional)

For style evaluation feature, set:
```bash
export OPENAI_API_KEY=your_openai_key_here
```

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use:
- Backend: Edit `backend_api.py` and change the port number
- Frontend: Edit `frontend/vite.config.ts` and change the port

### Can't Access from Phone
1. Make sure both devices are on the same WiFi network
2. Check firewall settings - allow ports 5000 and 5173
3. Verify the IP address is correct
4. Try accessing from computer first: `http://localhost:5173`

### Camera Not Working on Phone
- Grant camera permissions when browser asks
- Make sure you're using `http://` not `https://`
- Some browsers may require HTTPS for camera access

## License

This project is for educational purposes.
