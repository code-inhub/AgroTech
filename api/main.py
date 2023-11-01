from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
from io import BytesIO

app = FastAPI()

# origins = [
#     "https://your-render-app-url",  # Replace with your Render app's URL
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLASS_NAMES = ['Early Blight', 'Late Blight', 'Healthy']
MODEL = tf.keras.models.load_model("saved_models/1")  # We'll load the model inside the route function

@app.get("/")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

# @app.on_event("startup")
# async def startup_event():
#     # Load the model when the app starts
#     global MODEL
#     MODEL = tf.keras.models.load_model("saved_models/1")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    predictions = MODEL.predict(img_batch)
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = float(np.max(predictions[0]))
    return {
        "class": predicted_class,
        "confidence": confidence
    }
