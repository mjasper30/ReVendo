import tkinter as tk
from PIL import Image, ImageTk
import os


# Function to trigger the script
def trigger_script():
    # Replace 'your_script_name.py' with your script file name
    os.system('python hello.py')


# Function to create a new page
def create_new_page():
    # Hide existing elements
    label.place_forget()
    button.place_forget()
    center_label.place_forget()

    # Create new elements for the new page
    new_label = tk.Label(app, text="New Page", font=("Arial", 24), bg='white')
    new_label.place(relx=0.5, rely=0.3, anchor='center')

    # Button to trigger the script
    new_button = tk.Button(app, text="Trigger Script", font=("Arial", 16),
                           command=trigger_script, bg='SystemButtonFace', padx=20)
    new_button.place(relx=0.5, rely=0.7, anchor='center', width=150, height=40)

    # Add an image with transparency
    image_path = "Revendo_logo.png"  # Replace with your image path
    img = Image.open(image_path)
    img = img.resize((100, 100))  # Adjust the size as needed
    photo = ImageTk.PhotoImage(img)
    image_label = tk.Label(app, image=photo)
    image_label.image = photo  # Keep a reference
    image_label.place(relx=0.5, rely=0.5, anchor='center')


# Create the main application window
app = tk.Tk()
app.title("ReVendo")
# Set the application window to full screen
app.attributes('-fullscreen', True)

# Get the screen width and height
screen_width = app.winfo_screenwidth()
screen_height = app.winfo_screenheight()

# Add a background image
image_path = "revendo_white.png"  # Replace with your image path
img = Image.open(image_path)
img = img.resize((screen_width, screen_height))
background_image = ImageTk.PhotoImage(img)
background_label = tk.Label(app, image=background_image)
background_label.place(x=0, y=0, relwidth=1, relheight=1)

# Add another image at the center with transparency
center_image_path = "Revendo_logo.png"  # Replace with your image path
center_img = Image.open(center_image_path)
center_img = center_img.resize((400, 400))  # Adjust the size as needed

# Add transparency to the image
center_img = center_img.convert("RGBA")
image_with_alpha = ImageTk.PhotoImage(center_img)

# Create a label and display the image
center_label = tk.Label(app, image=image_with_alpha)
center_label.image = image_with_alpha  # Keeping a reference to the image
center_label.place(x=screen_width // 2, y=screen_height // 2, anchor='center')

# Create a label
label = tk.Label(app, text="ReVendo", font=("Arial", 24), bg='white')
label.place(relx=0.5, rely=0.3, anchor='center')

# Create a standard button without border radius
button = tk.Button(app, text="Start", font=("Arial", 16),
                   command=create_new_page, bg='SystemButtonFace', padx=20)
button.place(relx=0.5, rely=0.7, anchor='center', width=120, height=40)

# Run the application
app.mainloop()
