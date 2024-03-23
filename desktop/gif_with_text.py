import tkinter as tk
from PIL import Image, ImageTk


class AnimatedGIFLabel(tk.Label):
    def __init__(self, master, filename):
        self.master = master
        self.filename = filename
        self.gif = Image.open(filename)
        self.frames = []
        self.load_frames()
        self.idx = 0
        self.current_frame = self.frames[self.idx]
        self.photo = ImageTk.PhotoImage(self.current_frame)
        super().__init__(master, image=self.photo)

    def load_frames(self):
        try:
            while True:
                self.frames.append(self.gif.copy())
                self.gif.seek(len(self.frames))
        except EOFError:
            pass

    def next_frame(self):
        self.idx += 1
        if self.idx >= len(self.frames):
            self.idx = 0
        self.current_frame = self.frames[self.idx]
        self.photo = ImageTk.PhotoImage(self.current_frame)
        self.config(image=self.photo)
        self.master.after(100, self.next_frame)

    def resize(self, width, height):
        for i, frame in enumerate(self.frames):
            self.frames[i] = frame.resize((width, height), Image.LANCZOS)

    def update_filename(self, filename):
        self.filename = filename
        self.gif = Image.open(filename)
        self.frames.clear()
        self.load_frames()
        self.idx = 0
        self.current_frame = self.frames[self.idx]
        self.photo = ImageTk.PhotoImage(self.current_frame)
        self.config(image=self.photo)


# List of words to cycle through
words = ["Processing...", "Accepted", "Rejected", "Heavy Object"]
# List of corresponding GIF filenames
gif_filenames = [
    "processing.gif", "check.gif", "cross.gif", "cross.gif"
]


def update_label(index):
    global animated_label  # Make animated_label accessible within the function
    # Update label text with the word at the current index
    label.config(text=words[index])
    # Update the GIF based on the current word
    animated_label.update_filename(
        "C:/Users/shiny/Desktop/4th Year - 1st Sem/ReVendo/desktop/" + gif_filenames[index])
    # Increment the index or reset to 0 if it exceeds the length of the list
    index = (index + 1) % len(words)
    # Schedule the update_label function to run again after 1000 milliseconds (1 second)
    app.after(5000, update_label, index)


# Create the main application window
app = tk.Tk()

# Initialize index
index = 0

# Create a label
label = tk.Label(app, text="")
label.pack()

# Create an AnimatedGIFLabel widget with the initial GIF filename
animated_label = AnimatedGIFLabel(
    app, "C:/Users/shiny/Desktop/4th Year - 1st Sem/ReVendo/desktop/processing.gif")
animated_label.resize(800, 480)  # Set the size to 800x480
animated_label.pack()

# Start the animation
animated_label.next_frame()

# Call update_label function initially to start updating
update_label(index)

# Run the Tkinter event loop
app.mainloop()
