import os
import cv2
from ultralytics import YOLO

# Define the paths
# Replace 'images' with the folder containing your images
IMAGE_DIR = os.path.join('.', 'images')
output_dir = os.path.join('.', 'output_images')

# Create the output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# Path to the YOLO model weights
model_path = os.path.join('.', 'runs', 'detect', 'train', 'weights', 'last.pt')

# Load the YOLO model
model = YOLO(model_path)

# Threshold for object detection
threshold = 0.5

# Conversion factor from pixels to centimeters
pixels_to_cm = 0.0264583333  # Change this to your actual conversion factor

# List all image files in the directory
image_files = [f for f in os.listdir(
    IMAGE_DIR) if f.endswith(('.jpg', '.png', '.jpeg'))]

for image_file in image_files:
    image_path = os.path.join(IMAGE_DIR, image_file)

    # Read the image
    frame = cv2.imread(image_path)

    # Perform object detection
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
                        cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 4, cv2.LINE_AA)

            # Make the class label text bigger
            class_label = results.names[int(class_id)].upper()
            cv2.putText(frame, class_label, (int(x1), int(y1) - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 4, cv2.LINE_AA)

    # Save the annotated image to the output directory
    output_image_path = os.path.join(output_dir, image_file)
    cv2.imwrite(output_image_path, frame)

print("Object detection on images completed.")
