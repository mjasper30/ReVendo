import tkinter as tk
from PIL import Image, ImageTk
import os

app = tk.Tk()
app.title("ReVendo")
app.attributes('-fullscreen', True)

# Initialize the global variables
label = None
get_points_button = None
check_balance_button = None
revendo_logo = None
image_button = None
tutorial_steps = None


def trigger_script():
    os.system('python hello.py')


def scan_rfid():
    global revendo_logo, label, get_points_button, check_balance_button, image_button, tutorial_header, tutorial_steps

    revendo_logo.place_forget()
    label.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    image_button.place_forget()
    tutorial_header.place_forget()
    tutorial_steps.place_forget()

    tutorial_header = tk.Label(
        app, text="Scan your ReVendo Card", font=("Arial", 24), bg='white')
    tutorial_header.place(relx=0.5, rely=0.2, anchor='center')

    image_path = "rfid-reader.jpg"
    img = Image.open(image_path)
    img = img.resize((500, 300))
    photo = ImageTk.PhotoImage(img)
    image_label = tk.Label(app, image=photo)
    image_label.image = photo
    image_label.place(relx=0.5, rely=0.5, anchor='center')

    new_button = tk.Button(app, text="Cancel", font=(
        "Arial", 16), command=menu, bg='SystemButtonFace', padx=20)
    new_button.place(relx=0.5, rely=0.8, anchor='center',
                     width=150, height=40)


def check_points_page():
    global revendo_logo, label, get_points_button, check_balance_button, image_button, tutorial_header, tutorial_steps

    revendo_logo.place_forget()
    label.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    image_button.place_forget()
    tutorial_header.place_forget()
    tutorial_steps.place_forget()

    tutorial_header = tk.Label(
        app, text="Scan your ReVendo Card", font=("Arial", 24), bg='white')
    tutorial_header.place(relx=0.5, rely=0.2, anchor='center')

    new_button = tk.Button(app, text="Cancel", font=(
        "Arial", 16), command=menu, bg='SystemButtonFace', padx=20)
    new_button.place(relx=0.5, rely=0.8, anchor='center',
                     width=150, height=40)

    image_path = "rfid-reader.jpg"
    img = Image.open(image_path)
    img = img.resize((500, 300))
    photo = ImageTk.PhotoImage(img)
    image_label = tk.Label(app, image=photo)
    image_label.image = photo
    image_label.place(relx=0.5, rely=0.5, anchor='center')


def tutorial_page():
    global label, revendo_logo, get_points_button, check_balance_button, image_button, tutorial_header, tutorial_steps

    label.place_forget()
    revendo_logo.place_forget()
    image_button.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()

    tutorial_header = tk.Label(
        app, text="How to use ReVendo Machine", font=("Arial", 24), bg='white')
    tutorial_header.place(relx=0.5, rely=0.2, anchor='center')

    tutorial_steps = tk.Label(
        app, text="Step 1: \nTap your card on the reader \n\n Step 2: \nInsert your plastic bottles inside the machine \n\n Step 3: \nCheck your points \n\n Step 4: \nOnce done, get your card and proceed to charging station", font=("Arial", 18), bg='white')
    tutorial_steps.place(relx=0.5, rely=0.5, anchor='center')

    button = tk.Button(app, text="Okay", font=("Arial", 16),
                       command=menu, bg='SystemButtonFace', padx=20)
    button.place(relx=0.5, rely=0.8, anchor='center', width=150, height=40)


def menu():
    global revendo_logo, label, get_points_button, check_balance_button, image_button

    revendo_logo.place_forget()
    label.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    image_button.place_forget()

    revendo_logo_path = "Revendo_logo.png"
    center_revendo_logo = Image.open(revendo_logo_path)
    center_revendo_logo = center_revendo_logo.resize((500, 500))

    center_revendo_logo = center_revendo_logo.convert("RGBA")
    image_with_alpha = ImageTk.PhotoImage(center_revendo_logo)

    revendo_logo = tk.Label(app, image=image_with_alpha)
    revendo_logo.image = image_with_alpha
    revendo_logo.place(x=screen_width // 2,
                       y=screen_height // 2, anchor='center')

    label = tk.Label(app, text="ReVendo", font=("Arial", 24), bg='lightgray')
    label.place(relx=0.5, rely=0.25, anchor='center')

    get_points_button = tk.Button(app, text="Get Points", font=("Arial", 16),
                                  command=scan_rfid, bg='SystemButtonFace', padx=20)
    get_points_button.place(
        relx=0.4, rely=0.7, anchor='center', width=130, height=40)

    check_balance_button = tk.Button(app, text="Check Balance", font=("Arial", 16),
                                     command=check_points_page, bg='SystemButtonFace', padx=20)
    check_balance_button.place(
        relx=0.6, rely=0.7, anchor='center', width=160, height=40)

    tutorial_button_path = "question.png"
    tutorial_button = Image.open(tutorial_button_path)
    tutorial_button = tutorial_button.resize((50, 50))
    photo_button = ImageTk.PhotoImage(tutorial_button)

    image_button = tk.Button(app, image=photo_button,
                             command=tutorial_page, border=0)

    image_button.image = photo_button
    image_button.place(relx=0.5, rely=0.75, anchor='center')


# Get the screen width and height
screen_width = app.winfo_screenwidth()
screen_height = app.winfo_screenheight()

image_path = "revendo_white.png"
img = Image.open(image_path)
img = img.resize((screen_width, screen_height))
background_image = ImageTk.PhotoImage(img)
background_label = tk.Label(app, image=background_image)
background_label.place(x=0, y=0, relwidth=1, relheight=1)

revendo_logo_path = "Revendo_logo.png"
center_revendo_logo = Image.open(revendo_logo_path)
center_revendo_logo = center_revendo_logo.resize((500, 500))

center_revendo_logo = center_revendo_logo.convert("RGBA")
image_with_alpha = ImageTk.PhotoImage(center_revendo_logo)

revendo_logo = tk.Label(app, image=image_with_alpha)
revendo_logo.image = image_with_alpha
revendo_logo.place(x=screen_width // 2, y=screen_height // 2, anchor='center')

label = tk.Label(app, text="ReVendo", font=("Arial", 24), bg='lightgray')
label.place(relx=0.5, rely=0.25, anchor='center')

get_points_button = tk.Button(app, text="Get Points", font=("Arial", 16),
                              command=scan_rfid, bg='SystemButtonFace', padx=20)
get_points_button.place(
    relx=0.4, rely=0.7, anchor='center', width=130, height=40)

check_balance_button = tk.Button(app, text="Check Balance", font=("Arial", 16),
                                 command=check_points_page, bg='SystemButtonFace', padx=20)
check_balance_button.place(
    relx=0.6, rely=0.7, anchor='center', width=160, height=40)


tutorial_button_path = "question.png"
tutorial_button = Image.open(tutorial_button_path)
tutorial_button = tutorial_button.resize((50, 50))
photo_button = ImageTk.PhotoImage(tutorial_button)

image_button = tk.Button(app, image=photo_button,
                         command=tutorial_page, border=0)
image_button.image = photo_button
image_button.place(relx=0.5, rely=0.75, anchor='center')

# Run the application
app.mainloop()
