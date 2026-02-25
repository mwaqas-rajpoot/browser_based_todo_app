from src.database.database import engine, DATABASE_URL
from sqlmodel import text

print('Connected to:', DATABASE_URL[:60] + '...')

with engine.connect() as conn:
    result = conn.execute(text('SELECT COUNT(*) as count FROM tasks'))
    print(f'Total tasks in NeonDB: {result.scalar()}')

    result = conn.execute(text('SELECT COUNT(*) as count FROM users'))
    print(f'Total users in NeonDB: {result.scalar()}')

    print('\nRecent tasks:')
    result = conn.execute(text('SELECT title, created_at FROM tasks ORDER BY created_at DESC LIMIT 5'))
    for row in result:
        print(f'  - {row[0]} (Created: {row[1]})')
