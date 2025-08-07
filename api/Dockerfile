FROM python:3.11-slim
WORKDIR /app

COPY entrypoint.sh /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
# Copy dependency list and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the Flask app into the container
COPY . .


# Expose port that Flask will run on
EXPOSE 8080

CMD ["gunicorn", "-b", "0.0.0.0:8080", "run:app"]