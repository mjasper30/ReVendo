import mysql.connector

# Replace these with your actual database credentials
db_config = {
    "host": "localhost",
    "user": "id21468907_revendo",
    "password": "ReVendo2023!",
    "database": "id21468907_revendo"
}

# Establish a connection to the MySQL server
connection = mysql.connector.connect(**db_config)

# Create a cursor object to execute SQL queries
cursor = connection.cursor()

# Define the data you want to insert
data_to_insert = "John"

# Form the query
insert_query = "INSERT INTO `rfid`(`rfid_number`) VALUES (%s)"

# Execute the query
cursor.execute(insert_query, data_to_insert)

# Commit the transaction
connection.commit()

# Close the cursor and connection
cursor.close()
connection.close()
