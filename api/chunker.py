import csv
import os

input_file = './data/recipe-ingredients-large.csv'
rows_per_chunk = 10000
output_template = 'data/chunk_{}.csv'

# Make sure the folder exists
os.makedirs('data', exist_ok=True)

with open(input_file, 'r', newline='', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)

    file_count = 0
    rows = []

    for i, row in enumerate(reader, 1):
        rows.append(row)
        if i % rows_per_chunk == 0:
            with open(output_template.format(file_count), 'w', newline='', encoding='utf-8') as out_f:
                writer = csv.writer(out_f)
                writer.writerow(header)
                writer.writerows(rows)
            file_count += 1
            rows = []

    # Write remaining rows
    if rows:
        with open(output_template.format(file_count), 'w', newline='', encoding='utf-8') as out_f:
            writer = csv.writer(out_f)
            writer.writerow(header)
            writer.writerows(rows)
