import tkinter as tk
import os

# Function to trigger the script


def trigger_script():
    # Replace 'your_script_name.py' with your script file name
    os.system('python hello.py')


# Create the main application window
app = tk.Tk()
app.title("ReVendo")

# Set the application window to full screen
app.attributes('-fullscreen', True)

# Create a label
label = tk.Label(app, text="Click the button to trigger the script.")
label.pack(padx=20, pady=20)

# Create a button
button = tk.Button(app, text="Trigger Script", command=trigger_script)
button.pack(padx=20, pady=20)

# Run the application
app.mainloop()
