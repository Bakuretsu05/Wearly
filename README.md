# Clothing Analysis System

AI-powered clothing detection and style evaluation system with React frontend and Python ML backend.

## Quick Start

### Prerequisites

-   Python 3.8 or higher
-   Node.js 18 or higher
-   [uv](https://github.com/astral-sh/uv) package manager

**Install uv:**

-   Windows: `pip install uv` or `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`
-   Mac/Linux: `curl -LsSf https://astral.sh/uv/install.sh | sh`

### Installation

1. **Extract the ZIP file** containing this codebase

2. **Download Model Checkpoints** (Required):

    The model checkpoint files are too large for GitHub. Download them from Google Drive:

    - Download link: **https://drive.google.com/drive/folders/17D_nCpPwFNh7XzgY8KO5XCq08vwFSgVV?usp=sharing**
    - Download both files:
        - `best.pth` (272 MB) - Attribute classification model
        - `parsing_resnet50.pth` (161 MB) - Parsing/segmentation model
    - Place both files in the `checkpoints/` directory:
        ```
        checkpoints/
        ├── best.pth
        └── parsing_resnet50.pth
        ```

    > **Note:** Without these checkpoints, the system will not work properly. The attribute model will use randomly initialized weights (poor accuracy), and the parsing model will use ImageNet pretrained weights (reduced accuracy).

3. **Create `.env` file** (Required):

    ```bash
    # Create .env file in the root directory
    echo "OPENAI_API_KEY=your_openai_key_here" > .env
    ```

    **Or manually create `.env` file** with:

    ```
    OPENAI_API_KEY=your_openai_key_here
    ```

    > **Note:** Replace `your_openai_key_here` with your actual OpenAI API key. This is required for the style evaluation feature.

4. **Install Python dependencies:**

    ```bash
    uv sync
    ```

5. **Install Frontend dependencies:**

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

-   **Clothing Detection**: Automatic detection of shirts, pants, shoes, and accessories
-   **Color Extraction**: Extracts dominant colors from clothing regions
-   **Attribute Classification**: Classifies fabric, patterns, shapes, and styles
-   **Style Evaluation**: ChatGPT-powered style analysis and recommendations
-   **Shopping Links**: Generates Shein shopping links for similar items
-   **Mobile-Friendly**: Responsive design with camera capture support

## Project Structure

```
├── ml/                          # Machine Learning backend
│   ├── output.py               # Main processing pipeline
│   ├── test.py                 # Attribute classification model
│   ├── pretrained_parser.py    # Clothing region parsing
│   └── Parsing_train.py        # Parsing model training
├── frontend/                    # React + TypeScript frontend
├── checkpoints/                 # Model checkpoints (.pth files) - REQUIRED
│   ├── best.pth                # Attribute classification model (272 MB)
│   └── parsing_resnet50.pth    # Parsing/segmentation model (161 MB)
├── backend_api.py              # Flask API server
├── pyproject.toml              # Python dependencies (for uv)
├── .env                        # Environment variables (create this)
└── README.md                   # This file
```

## License

This project is for educational purposes.
