import os
from ultralytics import YOLO
import cv2

VIDEOS_DIR = os.path.join('.', 'yolo', 'training', 'videos')

video_path = os.path.join(VIDEOS_DIR, 'test2.mp4')
video_path_out = '{}_out.mp4'.format(video_path)

cap = cv2.VideoCapture(video_path)
ret, frame = cap.read()
H, W, _ = frame.shape
out = cv2.VideoWriter(video_path_out, cv2.VideoWriter_fourcc(
    *'MP4V'), int(cap.get(cv2.CAP_PROP_FPS)), (W, H))

model_path = os.path.join('.', 'yolo', 'training',
                          'runs', 'detect', 'train', 'weights', 'best3.pt')

# Load a model
model = YOLO(model_path)  # load a custom model

threshold = 0.5

# Conversion factor from pixels to centimeters
pixels_to_cm = 0.0264583333  # Change this to your actual conversion factor

while ret:

    results = model(frame)[0]

    for result in results.boxes.data.tolist():
        x1, y1, x2, y2, score, class_id = result

        if score > threshold:
            # Calculate the height of the bounding box in centimeters
            height_cm = int((y2 - y1) * pixels_to_cm)

            # Draw the bounding box
            cv2.rectangle(frame, (int(x1), int(y1)),
                          (int(x2), int(y2)), (0, 255, 0), 4)

            # Annotate the height in centimeters
            text = f'Height: {height_cm} cm'
            cv2.putText(frame, text, (int(x2) + 10, int(y1) + 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1, cv2.LINE_AA)

            # Make the class label text bigger
            class_label = results.names[int(class_id)].upper()
            cv2.putText(frame, class_label, (int(x1), int(y1) - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1, cv2.LINE_AA)

    out.write(frame)
    ret, frame = cap.read()

cap.release()
out.release()
cv2.destroyAllWindows()
