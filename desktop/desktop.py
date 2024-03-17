import tkinter as tk
from PIL import Image, ImageTk
import os

app = tk.Tk()
app.title("ReVendo")
app.geometry("800x480")

revendo_logo = None
label = None
get_points_button = None
check_balance_button = None
image_button = None
image_label = None
new_button = None
tutorial_header = None
tutorial_steps = None
button = None
image_tutorial = None


def trigger_script():
    os.system('python hello.py')


def claim_points():
    os.system('python hello.py')


def destroy_elements_scan_rfid():
    revendo_logo.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    image_button.place_forget()
    new_button.place_forget()
    image_label.place_forget()
    tutorial_header.place_forget()

    menu()


def destroy_elements_tutorial():
    revendo_logo.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    button.place_forget()
    image_tutorial.place_forget()

    menu()


def destroy_elements_process():
    revendo_logo.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    image_button.place_forget()
    background_label
    your_balance_header.place_forget()
    image_label_process.place_forget()
    balance_text.place_forget()
    largebottle_text.place_forget()
    smallbottle_text.place_forget()
    totalplasticbottle_text.place_forget()
    mediumbottle_text.place_forget()
    totalpoints_text.place_forget()
    smallbottle_text.place_forget()
    cancel_button.place_forget()
    claim_button.place_forget()

    menu()


def destroy_elements_check_points():
    balance_header.place_forget()
    balance_text.place_forget()
    button.place_forget()

    menu()


def get_points_scan_rfid_page():
    global revendo_logo, get_points_button, check_balance_button, image_button, image_label, new_button, tutorial_header, tutorial_steps, button

    tutorial_header = tk.Label(
        app, text="Scan your ReVendo Card", font=("Arial", 24), bg='#8599e0', fg="white")
    tutorial_header.place(relx=0.5, rely=0.2, anchor='center')

    image_path = "desktop/rfid-reader.jpg"
    img = Image.open(image_path)
    img = img.resize((200, 150))
    photo = ImageTk.PhotoImage(img)
    image_label = tk.Label(app, image=photo)
    image_label.image = photo
    image_label.place(relx=0.5, rely=0.5, anchor='center')

    # destroy_elements_scan_rfid - BALIK KA DITO
    new_button = tk.Button(app, text="Cancel", font=(
        "Arial", 16), command=process_plastic_bottles, bg='#8599e0', padx=20, fg='white')
    new_button.place(relx=0.5, rely=0.8, anchor='center',
                     width=150, height=40)

    # Hiding specific elements
    revendo_logo.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    image_button.place_forget()


def process_plastic_bottles():
    global your_balance_header, image_label_process, largebottle_text, balance_text, smallbottle_text, totalplasticbottle_text, mediumbottle_text, totalpoints_text, smallbottle_text, cancel_button, claim_button

    your_balance_header = tk.Label(
        app, text="Balance", font=("Arial", 24), bg='#8599e0', fg='white')
    your_balance_header.place(relx=0.2, rely=0.1, anchor='center')

    image_path = "desktop/process-plastic-bottle-image.png"
    img = Image.open(image_path)
    img = img.resize((380, 350))
    photo = ImageTk.PhotoImage(img)
    image_label_process = tk.Label(app, image=photo)
    image_label_process.image = photo
    image_label_process.place(relx=0.3, rely=0.55, anchor='center')

    balance_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#f0f0f0', justify='center')
    balance_text.insert(0, "Your balance")
    balance_text.place(relx=0.6, rely=0.1, anchor='center',
                       width=400, height=40)

    # Simulating adding a value to the balance
    # Assume the balance value is retrieved from a function or variable
    balance_value = 465464  # Example value
    balance_text.config(state='normal')
    balance_text.delete(0, 'end')  # Clear the current value
    balance_text.insert(0, str(balance_value))  # Insert the new value
    balance_text.config(state='disabled')

    largebottle_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#f0f0f0', justify='center')
    largebottle_text.insert(0, "Your balance")
    largebottle_text.place(relx=0.21, rely=0.35, anchor='center',
                           width=60, height=40)

    largebot_value = 3  # Example value
    largebottle_text.config(state='normal')
    largebottle_text.delete(0, 'end')  # Clear the current value
    largebottle_text.insert(0, str(largebot_value))  # Insert the new value
    largebottle_text.config(state='disabled')

    totalplasticbottle_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#f0f0f0', justify='center')
    totalplasticbottle_text.insert(0, "Your balance")
    totalplasticbottle_text.place(relx=0.41, rely=0.35, anchor='center',
                                  width=100, height=40)

    totalplasticbottle_value = 18  # Example value
    totalplasticbottle_text.config(state='normal')
    totalplasticbottle_text.delete(0, 'end')  # Clear the current value
    totalplasticbottle_text.insert(
        0, str(totalplasticbottle_value))  # Insert the new value
    totalplasticbottle_text.config(state='disabled')

    mediumbottle_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#f0f0f0', justify='center')
    mediumbottle_text.insert(0, "Your balance")
    mediumbottle_text.place(relx=0.21, rely=0.6, anchor='center',
                            width=60, height=40)

    mediumbottle_value = 3  # Example value
    mediumbottle_text.config(state='normal')
    mediumbottle_text.delete(0, 'end')  # Clear the current value
    mediumbottle_text.insert(0, str(mediumbottle_value)
                             )  # Insert the new value
    mediumbottle_text.config(state='disabled')

    totalpoints_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#f0f0f0', justify='center')
    totalpoints_text.insert(0, "Your balance")
    totalpoints_text.place(relx=0.41, rely=0.6, anchor='center',
                           width=100, height=40)

    totalpoints_value = 123  # Example value
    totalpoints_text.config(state='normal')
    totalpoints_text.delete(0, 'end')  # Clear the current value
    totalpoints_text.insert(
        0, str(totalpoints_value))  # Insert the new value
    totalpoints_text.config(state='disabled')

    smallbottle_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#f0f0f0', justify='center')
    smallbottle_text.insert(0, "Your balance")
    smallbottle_text.place(relx=0.21, rely=0.82, anchor='center',
                           width=60, height=40)

    smallbottle_value = 12  # Example value
    smallbottle_text.config(state='normal')
    smallbottle_text.delete(0, 'end')  # Clear the current value
    smallbottle_text.insert(0, str(smallbottle_value)
                            )  # Insert the new value
    smallbottle_text.config(state='disabled')

    cancel_button = tk.Button(app, text="Cancel", font=(
        "Arial", 16), command=destroy_elements_process, bg='#8599e0', padx=20, fg='white')
    cancel_button.place(relx=0.8, rely=0.8, anchor='center',
                        width=150, height=40)

    claim_button = tk.Button(app, text="Claim Points", font=(
        "Arial", 16), command=claim_points, bg='#8599e0', padx=20, fg='white')
    claim_button.place(relx=0.8, rely=0.7, anchor='center',
                       width=150, height=40)

    # Hiding specific elements
    tutorial_header.place_forget()
    image_label.place_forget()
    new_button.place_forget()


def check_points_scan_rfid_page():
    global revendo_logo, get_points_button, check_balance_button, image_button, image_label, new_button, tutorial_header, tutorial_steps, button

    tutorial_header = tk.Label(
        app, text="Scan your ReVendo Card", font=("Arial", 24), bg='#8599e0', fg='white')
    tutorial_header.place(relx=0.5, rely=0.2, anchor='center')

    # destroy_elements_scan_rfid - BALIKAN MO ULET TOH
    new_button = tk.Button(app, text="Cancel", font=(
        "Arial", 16), command=check_points_page, bg='#8599e0', padx=20, fg='white')
    new_button.place(relx=0.5, rely=0.8, anchor='center',
                     width=150, height=40)

    image_path = "desktop/rfid-reader.jpg"
    img = Image.open(image_path)
    img = img.resize((200, 150))
    photo = ImageTk.PhotoImage(img)
    image_label = tk.Label(app, image=photo)
    image_label.image = photo
    image_label.place(relx=0.5, rely=0.5, anchor='center')

    # Hiding specific elements
    revendo_logo.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    image_button.place_forget()


def check_points_page():
    global revendo_logo, get_points_button, check_balance_button, image_button, image_label, new_button, balance_header, tutorial_steps, button, balance_text, largebottle_text, smallbottle_text, totalplasticbottle_text, mediumbottle_text, totalpoints_text, cancel_button, claim_button

    balance_header = tk.Label(
        app, text="Your Balance", font=("Arial", 24), bg='#8599e0', fg='white')
    balance_header.place(relx=0.5, rely=0.4, anchor='center')

    balance_text = tk.Entry(app, state='disabled', font=(
        "Arial", 16), bg='#8599e0', justify='center')
    balance_text.insert(0, "Your balance")
    balance_text.place(relx=0.5, rely=0.5, anchor='center',
                       width=400, height=40)

    # Simulating adding a value to the balance
    # Assume the balance value is retrieved from a function or variable
    balance_value = 465464  # Example value
    balance_text.config(state='normal')
    balance_text.delete(0, 'end')  # Clear the current value
    balance_text.insert(0, str(balance_value))  # Insert the new value
    balance_text.config(state='disabled')

    button = tk.Button(app, text="Okay", font=("Arial", 16),
                       command=destroy_elements_check_points, bg='#8599e0', padx=20)
    button.place(relx=0.5, rely=0.6, anchor='center', width=150, height=40)

    tutorial_header.place_forget()
    new_button.place_forget()
    image_label.place_forget()


def tutorial_page():
    global revendo_logo, label, get_points_button, check_balance_button, image_button, image_label, new_button, tutorial_header, tutorial_steps, button, image_tutorial, image_tutorial_path

    image_tutorial_path = "desktop/tutorial.png"
    img = Image.open(image_tutorial_path)
    photo = ImageTk.PhotoImage(img)
    image_tutorial = tk.Label(app, image=photo)
    image_tutorial.image = photo
    image_tutorial.place(relx=0.5, rely=0.45, anchor='center')

    button = tk.Button(app, text="Okay", font=("Arial", 16),
                       command=destroy_elements_tutorial, bg='#8599e0', padx=20)
    button.place(relx=0.5, rely=0.9, anchor='center', width=150, height=40)

   # Hiding specific elements
    revendo_logo.place_forget()
    get_points_button.place_forget()
    check_balance_button.place_forget()
    image_button.place_forget()


def menu():
    global revendo_logo, get_points_button, check_balance_button, image_button, image_label, new_button, tutorial_header, tutorial_steps, button, image_tutorial, image_tutorial_path

    revendo_logo_path = "desktop/Revendo-logo.png"
    center_revendo_logo = Image.open(revendo_logo_path)
    center_revendo_logo = center_revendo_logo.resize((200, 200))

    center_revendo_logo = center_revendo_logo.convert("RGBA")
    image_with_alpha = ImageTk.PhotoImage(center_revendo_logo)

    revendo_logo = tk.Label(app, image=image_with_alpha)
    revendo_logo.image = image_with_alpha
    revendo_logo.place(relx=0.5, rely=0.3, anchor='center')

    get_points_button = tk.Button(app, text="Get Points", font=("Arial", 16),
                                  command=get_points_scan_rfid_page, bg='#8599e0', padx=20, fg='white')

    get_points_button.place(
        relx=0.3, rely=0.7, anchor='center', width=130, height=40)

    check_balance_button = tk.Button(app, text="Check Balance", font=("Arial", 16),
                                     command=check_points_scan_rfid_page, bg='#8599e0', padx=20, fg='white')
    check_balance_button.place(
        relx=0.7, rely=0.7, anchor='center', width=160, height=40)

    tutorial_button_path = "desktop/question.png"
    tutorial_button = Image.open(tutorial_button_path)
    tutorial_button = tutorial_button.resize((30, 30))
    photo_button = ImageTk.PhotoImage(tutorial_button)

    image_button = tk.Button(app, image=photo_button,
                             command=tutorial_page, border=0)

    image_button.image = photo_button
    image_button.place(relx=0.5, rely=0.75, anchor='center')


# Get the screen width and height
screen_width = app.winfo_screenwidth()
screen_height = app.winfo_screenheight()

image_path = "desktop/ReVendo-background.jpg"
img = Image.open(image_path)
img = img.resize((800, 480))  # Set the size to 800x480
background_image = ImageTk.PhotoImage(img)
background_label = tk.Label(app, image=background_image)
background_label.place(x=0, y=0, relwidth=1, relheight=1)

# Set the application to run in full screen - uncomment this if you are in raspberry pi
app.attributes('-fullscreen', True)

# Run the application
menu()
app.mainloop()
