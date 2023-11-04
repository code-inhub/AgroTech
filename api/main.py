from fastapi import FastAPI, File, UploadFile
import uvicorn
import tensorflow as tf
import numpy as np
from PIL import Image
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware

# PATH=

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLASS_NAMES = ['Early Blight', 'Late Blight', 'Healthy']
MODEL = tf.keras.models.load_model("Model.h5")

@app.get("/")
async def index():
    return "Hello, I am alive"

def read_file_as_image(data)->np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    predictions = MODEL.predict(img_batch)
    predicted_class =CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    return {
            "class": predicted_class,
            "confidence": float(confidence) 
        }

if __name__=="__main__":
    uvicorn.run(app,host='localhost', port=8000)

# uvicorn main:app --reload 