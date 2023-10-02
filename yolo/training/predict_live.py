import os
import cv2
from ultralytics import YOLO

# Set the camera device index (0 for the default camera)
camera_device_index = 0

# Initialize the camera capture
cap = cv2.VideoCapture(camera_device_index)

# Get the initial frame to determine dimensions
ret, frame = cap.read()
H, W, _ = frame.shape

# Initialize the video writer
out = cv2.VideoWriter('live_cam.mp4', cv2.VideoWriter_fourcc(*'MP4V'), 30, (W, H))

# Specify the path to your YOLO model
model_path = os.path.join('.', 'runs', 'detect', 'train', 'weights', 'last.pt')

# Load the YOLO model
model = YOLO(model_path)

threshold = 0.5
font_scale = 0.8  # Adjust the font size here

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Detect objects in the frame
    results = model(frame)[0]

    for result in results.boxes:
        x1, y1, x2, y2 = result.xyxy[0].tolist()  # Extract bounding box coordinates
        score = result.conf.tolist()  # Confidence score
        class_id = result.cls.tolist()  # Class ID

        if score > threshold:
            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 4)
            cv2.putText(frame, results.names[int(class_id)].upper(), (int(x1), int(y1 - 10)),
                        cv2.FONT_HERSHEY_SIMPLEX, font_scale, (0, 255, 0), 3, cv2.LINE_AA)

    # Write the frame to the output video
    out.write(frame)

    # Display the frame
    cv2.imshow('Camera Feed', frame)

    # Press 'q' to exit the loop and stop the video capture
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the camera and video writer, and close any OpenCV windows
cap.release()
out.release()
cv2.destroyAllWindows()
