import pandas as pd

# Load the uploaded CSV file
file_path = "crop_disease_updated_images.csv"
df = pd.read_csv(file_path)

# Display the first few rows to understand the structure
df.head()
