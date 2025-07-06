Smart Grocery Housekeeping

A smart web application for managing your pantry, reducing waste, and discovering recipe ideas — powered by a React frontend and Flask backend.

🚀 Quickstart

1. Install Frontend Dependencies

cd frontend
npm install

2. Create Python Virtual Environment

cd ../api
python -m venv venv

Activate the Environment

macOS/Linux:

source venv/bin/activate

Windows (CMD):

venv\Scripts\activate

3. Install Backend Dependencies

pip install -r requirements.txt

4. Create a .flaskenv File

In the api/ directory, create a .flaskenv file with the following contents:

FLASK_APP=run.py
FLASK_ENV=development

🛠️ Development Workflow

Run Frontend Dev Server

cd frontend
npm run dev

Run API Server

cd frontend
npm run api

Note: Make sure your Python virtual environment is activated before running the API server.

✅ Running Tests

Frontend Tests

cd frontend
npm run test

Backend Tests

cd api
pytest

📁 Project Structure

frontend/   # React frontend
api/        # Flask backend

📄 License

Licensed under the Apache 2.0 License.

🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss your ideas.

✅ You can now copy and paste this directly into your README.md file, and it will render cleanly on GitHub. Let me know if you'd like it downloadable as a file!
