import tkinter as tk
from tkinter import messagebox


class NumberCounterApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Number Counter App")

        self.number = 1

        self.label = tk.Label(root, text="Current Number: {}".format(
            self.number), font=("Helvetica", 16))
        self.label.pack(pady=10)

        self.entry = tk.Entry(root, font=("Helvetica", 14))
        self.entry.pack(pady=10)

        self.update_button = tk.Button(
            root, text="Update Number", command=self.update_number)
        self.update_button.pack(pady=10)

    def update_number(self):
        try:
            new_number = int(self.entry.get())
            if 1 <= new_number <= 10:
                self.number = new_number
                self.label.config(
                    text="Current Number: {}".format(self.number))
            else:
                tk.messagebox.showwarning(
                    "Invalid Input", "Please enter a number between 1 and 10.")
        except ValueError:
            tk.messagebox.showwarning(
                "Invalid Input", "Please enter a valid number.")


if __name__ == "__main__":
    root = tk.Tk()
    app = NumberCounterApp(root)
    root.mainloop()
