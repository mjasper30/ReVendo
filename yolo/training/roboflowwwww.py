from roboflow import Roboflow
import os

rf = Roboflow(api_key="iyUSOVTNeycQRjr1ru8y")
project = rf.workspace().project("revendo")
model = project.version(1).model

# infer on a local image
image_path = os.path.abspath("test.jpg")
print(model.predict(image_path, confidence=40, overlap=30).json())

# visualize your prediction
# model.predict("your_image.jpg", confidence=40, overlap=30).save("prediction.jpg")

# infer on an image hosted elsewhere
# print(model.predict("URL_OF_YOUR_IMAGE", hosted=True, confidence=40, overlap=30).json())
