import tkinter as tk

def destroy_button():
    button.destroy()

root = tk.Tk()

button = tk.Button(root, text="Click me", command=destroy_button)
button.pack()

root.mainloop()
