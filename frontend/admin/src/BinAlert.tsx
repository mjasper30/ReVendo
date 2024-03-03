// ContactForm.tsx

import React, { FormEvent } from "react";

const BinAlert: React.FC = () => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const htmlContent = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Bin Capacity Full</title>
          <style>
            body {
              font-family: "Arial", sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
      
            .container {
              max-width: 600px;
              margin: auto;
              padding: 20px;
              background-color: #fff;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
            }
      
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
      
            .image {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
            }
      
            .body {
              text-align: center;
            }
      
            .title {
              font-size: 1.5rem;
              margin-bottom: 20px;
            }
      
            .message {
              font-size: 1.2rem;
              color: #ff0000;
              font-weight: bold;
            }
      
            .note {
              margin-top: 20px;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="body">
              <h2 class="title">Bin Capacity Full</h2>
              <p class="message">Attention: The capacity of your bin is full!</p>
              <p class="note">
                Please arrange for a timely pickup or emptying to avoid any
                inconvenience.
              </p>
            </div>
          </div>
        </body>
      </html>
      
      `;

      // Make a fetch request to your server to handle the email sending logic
      const response = await fetch("http://localhost:3001/api/sendSMS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          htmlContent, // Include the HTML content here
        }),
      });

      if (response.ok) {
        console.log("Email sent successfully!");
      } else {
        console.error("Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Test</button>
    </form>
  );
};

export default BinAlert;
