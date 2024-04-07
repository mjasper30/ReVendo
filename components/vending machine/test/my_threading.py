import tkinter as tk
import threading
import time

# Global flag to control the loop in the long-running task
stop_long_task = False


def hello_world():
    print("Hello World")


def long_running_task():
    global stop_long_task
    # Simulating a long-running task
    for i in range(10):
        if stop_long_task:
            print("Long task stopped.")
            stop_long_task = False
            return
        print("Task running:", i)
        time.sleep(1)


def run_long_task_thread():
    global stop_long_task
    stop_long_task = False
    thread = threading.Thread(target=long_running_task)
    thread.start()


def stop_long_task_thread():
    global stop_long_task
    stop_long_task = True


# Creating the Tkinter window
root = tk.Tk()

# Creating the button
button = tk.Button(root, text="Press Me", command=hello_world)
button.pack()

# Creating a button to start the long-running task
start_button = tk.Button(root, text="Start Long Task",
                         command=run_long_task_thread)
start_button.pack()

# Creating a button to stop the long-running task
stop_button = tk.Button(root, text="Stop Long Task",
                        command=stop_long_task_thread)
stop_button.pack()

root.mainloop()
