import sqlite3

conn = sqlite3.connect("civicconnect.db")

cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS issues(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
issue TEXT
)
""")

conn.commit()
conn.close()

print("Database Created")